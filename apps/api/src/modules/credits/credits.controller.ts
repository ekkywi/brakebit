import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
    SessionAuthGuard,
    type AuthedRequest,
} from '../auth/guards/session-auth.guard';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
    constructor(private readonly credits: CreditsService) {}

    @Get('me')
    @UseGuards(SessionAuthGuard)
    @Throttle({ default: { limit: 60, ttl: 60_000 } })
    async me(@Req() req: AuthedRequest) {
        return this.credits.getBalance(req.user!.id);
    }
}