import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
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
      return this.checksService.createCheck(dto);
    } catch (error) {
      throw new BadRequestException({
        code: 'INVALID_CHECK_REQUEST',
        message: error instanceof Error ? error.message : 'Invalid request',
      });
    }
  }
}
