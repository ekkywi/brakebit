import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() body: unknown) {
    try {
      const dto = CreateCheckDto.parse(body);
      return await this.checksService.createCheck(dto);
    } catch (error) {
      throw new BadRequestException({
        code: 'INVALID_CHECK_REQUEST',
        message: error instanceof Error ? error.message : 'Invalid request',
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


