import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ChecksModule } from './modules/checks/checks.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule, ChecksModule],
})
export class AppModule {}
