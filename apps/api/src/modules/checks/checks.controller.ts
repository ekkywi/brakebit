import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { SESSION_COOKIE } from '../auth/auth.constants';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UserFacingCheckError } from './check-errors';

@Controller('checks')
export class ChecksController {
  constructor(
    private readonly checksService: ChecksService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(200)
  async create(@Req() req: Request, @Body() body: unknown) {
    let dto: CreateCheckDto;
    try {
      dto = CreateCheckDto.parse(body);
    } catch (error) {
      throw new BadRequestException({
        code: 'INVALID_CHECK_REQUEST',
        message: error instanceof Error ? error.message : 'Invalid request',
      });
    }

    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    const user = token ? await this.authService.me(token) : null;

    try {
      return await this.checksService.createCheck(dto, {
        userId: user?.id ?? null,
        ip: req.ip ?? 'unknown',
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof UserFacingCheckError) {
        throw new BadRequestException({
          code: 'INVALID_CHECK_REQUEST',
          message: error.message,
        });
      }
      throw new ServiceUnavailableException({
        code: 'CHECK_UNAVAILABLE',
        message: 'We could not read this mint right now. Try again in a moment.',
      });
    }
  }

  @Get('recent')
  async recent(@Query('limit') limitRaw?: string) {
    const parsed = Number(limitRaw ?? 20);
    const limit = Number.isFinite(parsed) ? parsed : 20;
    return {
      results: await this.checksService.listRecent(limit),
    };
  }
}