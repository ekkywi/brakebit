import { Injectable } from '@nestjs/common';
import type { RiskReport } from '@brakebit/shared';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { computeRiskScore } from './domain/risk-score';
import { SolanaTokenProvider } from './providers/solana.provider';
import { Prisma } from '@brakebit/db';

const DISCLAIMER =
    `Brakebit provides risk indicators for informational purposes only. This is not investment advice, and a score is not an assurance of safety or performance.`;

export type RecentCheckItem = {
    id: string;
    address: string;
    chain: string;
    score: number;
    level: string;
    summary: string;
    createdAt: string;
    token: {
        name: string | null;
        symbol: string | null;
        imageUrl: string | null;
    } | null;
};

@Injectable()
export class ChecksService {
    private readonly solanaProvider= new SolanaTokenProvider();

    constructor(private readonly prisma: PrismaService) {}

    async createCheck(dto: CreateCheckDto): Promise<RiskReport> {
        const chain = dto.chain ?? 'solana';

        const cached = await this.findFreshCachedReport(dto.address, chain);
        if (cached) return cached;

        const { input, sources, notes, token } =
            await this.solanaProvider.fetchScoreInput(dto.address);
        const scored = computeRiskScore(input);

        const baseFreshness =
            'Mint authority, freeze authority, top-holder share, mint age (when history is short enough), and display metadata are read from Solana RPC / DAS when available. Liquidity and LP lock are not measured yet.';
        const freshnessNote =
            notes.length > 0 ? `${baseFreshness} ${notes.join(' ')}` : baseFreshness;

        const report: RiskReport = {
            address: dto.address,
            chain,
            score: scored.score,
            level: scored.level,
            summary: scored.summary,
            reasons: scored.reasons,
            signals: scored.signals,
            sources,
            checkedAt: new Date().toISOString(),
            freshnessNote,
            disclaimer: DISCLAIMER,
            token: {
                name: token.name,
                symbol: token.symbol,
                imageUrl: token.imageUrl,
            },
        };

        await this.saveCheckHistory(report);
        return report;
    }
    
    async listRecent(limit = 20): Promise<RecentCheckItem[]> {
        if (!process.env.DATABASE_URL) return [];

        const take = Math.min(Math.max(limit, 1), 50);

        type RecentRow = {
            id: string;
            address: string;
            chain: string;
            score: number;
            level: string;
            summary: string;
            createdAt: Date;
            raw: unknown;
        };

        try {
            const rows = await this.prisma.$queryRaw<RecentRow[]>(Prisma.sql`
                SELECT * FROM (
                    SELECT DISTINCT ON (address)
                        id,
                        address,
                        chain::text AS chain,
                        score,
                        level,
                        summary,
                        "createdAt",
                        raw
                    FROM "CheckHistory"
                    ORDER BY address, "createdAt" DESC
                ) AS latest
                ORDER BY "createdAt" DESC
                LIMIT ${take}
            `);

            return rows.map((row) => {
                const raw = row.raw as { token?: RecentCheckItem['token'] } | null;
                return {
                    id: row.id,
                    address: row.address,
                    chain: row.chain,
                    score: row.score,
                    level: row.level,
                    summary: row.summary,
                    createdAt: new Date(row.createdAt).toISOString(),
                    token: raw?.token ?? null,
                };
            });
        } catch (error) {
            console.warn(
                '[ChecksService] Failed to list recent checks',
                error instanceof Error ? error.message : error,
            );
            return [];
        }
    }

    private async saveCheckHistory(report: RiskReport): Promise<void> {
        if (!process.env.DATABASE_URL) return;

        try {
            await this.prisma.checkHistory.create({
                data: {
                    address: report.address,
                    chain: report.chain,
                    score: report.score,
                    level: report.level,
                    summary: report.summary,
                    reasons: report.reasons as unknown as Prisma.InputJsonValue,
                    signals: report.signals as unknown as Prisma.InputJsonValue,
                    sources: report.sources as unknown as Prisma.InputJsonValue,
                    raw: report as object,
                },
            });
        } catch (error) {
            console.warn(
                '[CheckService] Failed to persist check history',
                error instanceof Error ? error.message : error,
            );
        }
    }

    private getCacheTtlMs(): number {
        const raw = Number(process.env.CHECK_CACHE_TTL_MS ?? 300_000);
        if (!Number.isFinite(raw) || raw < 0) return 300_000;
        return raw;
    }

    private async findFreshCachedReport(
        address: string,
        chain: string,
    ): Promise<RiskReport | null> {
        const ttlMs = this.getCacheTtlMs();
        if (!process.env.DATABASE_URL || ttlMs === 0) return null;

        try {
            const row = await this.prisma.checkHistory.findFirst({
                where: { address, chain: chain as 'solana' },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true, raw: true },
            });

            if (!row?.raw) return null;

            const ageMs = Date.now() - row.createdAt.getTime();
            if (ageMs > ttlMs) return null;

            const report = row.raw as unknown as RiskReport;
            if (!report?.address || typeof report.score !== 'number') return null;

            const ttlMin = Math.max(1, Math.round(ttlMs / 60_000));
            const checkedAt =
                typeof report.checkedAt === 'string'
                ? report.checkedAt
                : row.createdAt.toISOString();

            return {
                ...report,
                checkedAt,
                cached: true,
                freshnessNote:
                    `Cached result from ${new Date(checkedAt).toISOString()}. ` +
                    `Live RPC was skipped: results are reused for ${ttlMin} minute(s) after a successful check. ` +
                    (report.freshnessNote ?? ''),
            };
        } catch (error) {
            console.warn(
                `[ChecksService] Cache lookup failed`,
                error instanceof Error ? error.message : error,
            );
            return null;
        }
    }
}


