import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@brakebit/db';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Soft-connect: local MVP can run without Neon until DATABASE_URL is set.
    if (!process.env.DATABASE_URL) {
      return;
    }

    try {
      await this.$connect();
    } catch (error) {
      console.warn(
        '[PrismaService] Database connection skipped/failed. API will run without persistence.',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async onModuleDestroy() {
    if (!process.env.DATABASE_URL) {
      return;
    }

    await this.$disconnect();
  }
}
