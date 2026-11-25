import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { GuestQuotaService } from './guest-quota.service';

@Module({
    providers: [CreditsService, GuestQuotaService],
    exports: [CreditsService, GuestQuotaService],
})
export class CreditsModule {}