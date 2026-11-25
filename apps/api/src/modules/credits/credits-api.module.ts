import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreditsController } from './credits.controller';
import { CreditsModule } from './credits.module';

@Module({
    imports: [AuthModule, CreditsModule],
    controllers: [CreditsController],
})
export class CreditsApiModule {}