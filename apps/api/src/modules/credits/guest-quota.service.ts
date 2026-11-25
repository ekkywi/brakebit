import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class GuestQuotaService {
    constructor(private readonly prisma: PrismaService) {}

    dailyLimit(): number {
        const raw = Number(process.env.GUEST_DAILY_FREE_CHECKS ?? 1);
        return Number.isInteger(raw) && raw >= 0 ? raw : 1;
    }

    hashIp(ip: string): string {
        const salt = process.env.GUEST_IP_SALT;
        if (!salt) throw new Error('GUEST_IP_SALT is not set');
        return createHmac('sha256', salt).update(ip).digest('hex');
    }

    private today(): string {
        return new Date().toISOString().slice(0, 10);
    }

    async consume(ip: string): Promise<boolean> {
        const limit = this.dailyLimit();
        if (limit <= 0) return false;

        const rows = await this.prisma.$queryRaw<{ count: number }[]>`
            INSERT INTO "GuestUsage" ("id", "ipHash", "day", "count")
            VALUES (gen_random_uuid()::text, ${this.hashIp(ip)}, ${this.today()}, 1)
            ON CONFLICT ("ipHash", "day")
            DO UPDATE SET "count" = "GuestUsage"."count" + 1
            WHERE "GuestUsage"."count" < ${limit}
            RETURNING "count"
        `;
        return rows.length === 1;
    }

    async release(ip: string): Promise<void> {
        await this.prisma.$executeRaw`
            UPDATE "GuestUsage"
            SET "count" = "count" - 1
            WHERE "ipHash" = ${this.hashIp(ip)}
                AND "day" = ${this.today()}
                AND "count" > 0
        `;
    }
}