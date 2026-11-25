import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreditsModule } from '../credits/credits.module';
import { ChecksController } from './checks.controller';
import { ChecksService } from './checks.service';

@Module({
  imports: [AuthModule, CreditsModule],
  controllers: [ChecksController],
  providers: [ChecksService],
})
export class ChecksModule {}
