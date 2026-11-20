import { Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  type ThrottlerLimitDetail,
} from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';

const RATE_LIMIT_MESSAGE =
  'Too many checks from this network right now. Wait about a minute, then try again.';

@Injectable()
export class ChecksThrottlerGuard extends ThrottlerGuard {
  protected async getErrorMessage(
    _context: ExecutionContext,
    _throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<string> {
    return RATE_LIMIT_MESSAGE;
  }
}
