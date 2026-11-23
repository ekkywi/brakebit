import { ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

export function assertAllowedOrigin(req: Request): void {
  const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const origin = req.headers.origin;

  if (!origin) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException({
        code: 'ORIGIN_REQUIRED',
        message: 'Missing Origin header',
      });
    }
    return;
  }

  if (!allowed.includes(origin)) {
    throw new ForbiddenException({
      code: 'ORIGIN_FORBIDDEN',
      message: 'Origin is not allowed',
    });
  }
}
