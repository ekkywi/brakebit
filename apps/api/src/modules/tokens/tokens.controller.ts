import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { TokensService } from './tokens.service';

@SkipThrottle({ default: true })
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('search')
  async search(@Query('q') q?: string) {
    const query = typeof q === 'string' ? q : '';
    if (query.trim().length < 2) {
      return { results: [] as const };
    }

    try {
      const results = await this.tokensService.search(query);
      return { results };
    } catch (error) {
      throw new BadRequestException({
        code: 'TOKEN_SEARCH_FAILED',
        message:
          error instanceof Error ? error.message : 'Token search failed',
      });
    }
  }
}
