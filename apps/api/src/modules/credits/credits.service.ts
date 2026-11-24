import { Injectable } from '@nestjs/common';
import { Prisma } from '@brakebit/db';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { InsufficientCreditsException } from './credits.error';

export type CreditBalance = {
    topup: { balance: number };
    promo: { balance: number; soonestExpiresAt: string | null };
};

export type SpendInput = {
    amount: number;
    refId: string;
    reason: string;
};

@Injectable()
export class CreditsService {
    constructor(private readonly prisma: PrismaService) {}

    private activeLotWhere(userId: string, now: Date): Prisma.CreditLotWhereInput {
        return {
            userId,
            remaining: { gt: 0 },
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        };
    }

    async getBalance(userId: string): Promise<CreditBalance> {
        const lots = await this.prisma.creditLot.findMany({
            where: this.activeLotWhere(userId, new Date()),
            select: { source: true, remaining: true, expiresAt: true },
        });

        let topup = 0;
        let promo = 0;
        let soonest: Date | null = null;

        for (const lot of lots) {
            if (lot.source === 'purchase') {
                topup += lot.remaining;
            } else {
                promo += lot.remaining;
                if (lot.expiresAt && (!soonest || lot.expiresAt < soonest)) {
                    soonest = lot.expiresAt;
                }
            }
        }

        return {
            topup: { balance: topup },
            promo: {
                balance: promo,
                soonestExpiresAt: soonest?.toISOString() ?? null,
            },
        };
    }

    async claimCampaign(
        userId: string,
        key: string,
    ): Promise<{ granted: boolean; reason?: string; credits?: number }> {
        const now = new Date();

        type ClaimedCampaign = {
            id: string;
            key: string;
            credits: number;
            expiresInDays: number | null;
            fixedExpiresAt: Date | null;
        };

        try {
            const credits = await this.prisma.$transaction(async (tx) => {
                // Single atomic lock + eligibility check + quota increment + fresh field read.
                const rows = await tx.$queryRaw<ClaimedCampaign[]>`
                    UPDATE "Campaign"
                    SET "claimCount" = "claimCount" + 1
                    WHERE "key" = ${key}
                        AND "isActive" = true
                        AND ("startsAt" IS NULL OR "startsAt" <= ${now})
                        AND ("endsAt" IS NULL OR "endsAt" > ${now})
                        AND ("maxClaims" IS NULL OR "claimCount" < "maxClaims")
                    RETURNING "id", "key", "credits", "expiresInDays", "fixedExpiresAt"
                `;

                const campaign = rows[0];
                if (!campaign) {
                    const current = await tx.campaign.findUnique({
                        where: { key },
                        select: {
                            isActive: true,
                            startsAt: true,
                            endsAt: true,
                            maxClaims: true,
                            claimCount: true,
                        },
                    });
                    if (!current || !current.isActive) {
                        throw new Error('CLAIM_UNAVAILABLE');
                    }
                    if (current.startsAt && current.startsAt > now) {
                        throw new Error('CLAIM_NOT_STARTED');
                    }
                    if (current.endsAt && current.endsAt <= now) {
                        throw new Error('CLAIM_ENDED');
                    }
                    if (current.maxClaims != null && current.claimCount >= current.maxClaims) {
                        throw new Error('CLAIM_QUOTA_FULL');
                    }
                    throw new Error('CLAIM_UNAVAILABLE');
                }

                let expiresAt: Date | null = null;
                if (campaign.expiresInDays != null) {
                    expiresAt = new Date(now.getTime() + campaign.expiresInDays * 86_400_000);
                } else if (campaign.fixedExpiresAt) {
                    expiresAt = campaign.fixedExpiresAt;
                }

                if (!expiresAt || expiresAt <= now) {
                    throw new Error('CLAIM_EXPIRED_AT_GRANT');
                }

                const lot = await tx.creditLot.create({
                    data: {
                        userId,
                        source: 'promo',
                        campaignId: campaign.id,
                        amount: campaign.credits,
                        remaining: campaign.credits,
                        expiresAt,
                    },
                });

                await tx.creditLedger.create({
                    data: {
                        userId,
                        type: 'promo_grant',
                        delta: campaign.credits,
                        lotId: lot.id,
                        refId: campaign.id,
                        reason: `campaign:${campaign.key}`,
                    },
                });

                return campaign.credits;
            });

            return { granted: true, credits };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return { granted: false, reason: 'already_claimed' };
            }
            if (error instanceof Error) {
                switch (error.message) {
                    case 'CLAIM_UNAVAILABLE':
                        return { granted: false, reason: 'campaign_unavailable' };
                    case 'CLAIM_NOT_STARTED':
                        return { granted: false, reason: 'campaign_not_started' };
                    case 'CLAIM_ENDED':
                        return { granted: false, reason: 'campaign_ended' };
                    case 'CLAIM_QUOTA_FULL':
                        return { granted: false, reason: 'quota_full' };
                    case 'CLAIM_EXPIRED_AT_GRANT':
                        return { granted: false, reason: 'campaign_expired' };
                }
            }
            throw error;
        }
    }

    async spend(
        userId: string,
        input: SpendInput,
    ): Promise<{ lots: { lotId: string; taken: number }[] }> {
        const { amount, refId, reason } = input;
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error('amount must be a positive integer');
        }

        const existing = await this.prisma.creditLedger.findMany({
            where: { userId, refId, type: 'spend' },
            select: { lotId: true, delta: true },
        });
        if (existing.length > 0) {
            return {
                lots: existing.map((e) => ({ lotId: e.lotId!, taken: -e.delta })),
            };
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const lots = await tx.creditLot.findMany({
                        where: this.activeLotWhere(userId, new Date()),
                        orderBy: [
                            { expiresAt: { sort: 'asc', nulls: 'last' }},
                            { createdAt: 'asc' },
                        ],
                        select: { id: true, remaining: true },
                    });

                    let need = amount;
                    const taken: { lotId: string; taken: number }[] = [];

                    for (const lot of lots) {
                        if (need === 0) break;
                        const take = Math.min(lot.remaining, need);

                        const res = await tx.creditLot.updateMany({
                            where: { id: lot.id, remaining: { gte: take } },
                            data: { remaining: { decrement: take } },
                        });
                        if (res.count === 0) {
                            throw new Error('LOT_CHANGED');
                        }

                        await tx.creditLedger.create({
                            data: {
                                userId,
                                type: 'spend',
                                delta: -take,
                                lotId: lot.id,
                                refId,
                                reason,
                            },
                        });

                        taken.push({ lotId: lot.id, taken: take });
                        need -= take;
                    }

                    if (need > 0) {
                        throw new InsufficientCreditsException();
                    }
                    return { lots: taken };
                });
            } catch (error) {
                if (error instanceof Error && error.message === 'LOT_CHANGED') {
                    continue;
                }
                throw error;
            }
        }

        throw new InsufficientCreditsException();
    }

    async refund(userId: string, refId: string): Promise<boolean> {
        return this.prisma.$transaction(async (tx) => {
            const spends = await tx.creditLedger.findMany({
                where: { userId, refId, type: 'spend'},
                select: { lotId: true, delta: true },
            });
            if (spends.length === 0) return false;

            const already = await tx.creditLedger.findFirst({
                where: { userId, refId, type: 'refund' },
                select: { id: true },
            });
            if (already) return false;

            for (const s of spends) {
                if (!s.lotId) continue;
                await tx.creditLot.update({
                    where: { id: s.lotId },
                    data: { remaining: { increment: -s.delta } },
                });
                await tx.creditLedger.create({
                    data: {
                        userId,
                        type: 'refund',
                        delta: -s.delta,
                        lotId: s.lotId,
                        refId,
                        reason: 'operation_failed',
                    },
                });
            }
            return true;
        });
    }
}
