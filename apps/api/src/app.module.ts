import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ChecksThrottlerGuard } from './common/guards/checks-throttler.guard';
import { HealthModule } from './modules/health/health.module';
import { ChecksModule } from './modules/checks/checks.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

function checksRateLimit(): number {
  const value = Number(process.env.CHECKS_RATE_LIMIT ?? 10);
  return Number.isFinite(value) && value > 0 ? value : 10;
}

function checksRateTtlMs(): number {
  const value = Number(process.env.CHECKS_RATE_TTL_MS ?? 60_000);
  return Number.isFinite(value) && value > 0 ? value : 60_000;
}

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    ChecksModule,
    TokensModule,
    AuthModule,
    // Unnamed throttler = "default" so @Throttle/@SkipThrottle({ default }) match.
    ThrottlerModule.forRoot([
      {
        ttl: checksRateTtlMs(),
        limit: checksRateLimit(),
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ChecksThrottlerGuard,
    },
  ],
})
export class AppModule {}
