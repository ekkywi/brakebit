import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { assertAllowedOrigin } from './assert-origin';
import { SESSION_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { clearSessionCookie, setSessionCookie } from './session-cookie';
import { NonceDto } from './dto/nonce.dto';
import { VerifyDto } from './dto/verify.dto';
import { CreditsService } from '../credits/credits.service';

@Controller('auth')
@Throttle({ default: { limit: 20, ttl: 60_000 } })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly credits: CreditsService,
  ) {}

  private async claimWelcome(userId: string): Promise<void> {
    try {
      await this.credits.claimCampaign(userId, 'welcome');
    } catch (error) {
      console.warn(
        '[auth] welcome claim failed',
        error instanceof Error ? error.message : error,
      )
    }
  }

  @Post('solana/nonce')
  async nonce(@Req() req: Request, @Body() body: unknown) {
    assertAllowedOrigin(req);
    try {
      const dto = NonceDto.parse(body);
      return await this.authService.createNonce(dto.address);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException({
        code: 'INVALID_NONCE_REQUEST',
        message: error instanceof Error ? error.message : 'Invalid request',
      });
    }
  }

  @Post('solana/verify')
  async verify(
    @Req() req: Request,
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    assertAllowedOrigin(req);
    try {
      const dto = VerifyDto.parse(body);
      const result = await this.authService.verifySignIn(dto);
      await this.claimWelcome(result.user.id);

      setSessionCookie(res, result.sessionToken, result.sessionMaxAgeMs);

      return { user: result.user };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new UnauthorizedException({
        code: 'VERIFY_FAILED',
        message: error instanceof Error ? error.message : 'Verify failed',
      });
    }
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    assertAllowedOrigin(req);
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    await this.authService.logout(token);
    clearSessionCookie(res);
    return { ok: true };
  }

  @Get('me')
  async me(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    const user = await this.authService.me(token);
    if (!user) {
      // A stale cookie (expired or revoked) is removed here, so middleware stops treating the visitor as signed in.
      if (token) clearSessionCookie(res);
      throw new UnauthorizedException({
        code: 'NOT_AUTHENTICATED',
        message: 'Not signed in',
      });
    }
    return { user };
  }
}
