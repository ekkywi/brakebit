import type { CookieOptions, Response } from 'express';
import { SESSION_COOKIE } from './auth.constants';

/**
 * Options shared by set and clear. `clearCookie` only removes a cookie when
 * `domain` and `path` match the values it was set with, so both go through here.
 *
 * `SESSION_COOKIE_DOMAIN` is empty locally. In production set it to the parent
 * domain (for example `.brakebit.com`) so the web app can read the cookie in middleware.
 */
function baseOptions(): CookieOptions {
  const domain = process.env.SESSION_COOKIE_DOMAIN?.trim();

  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(domain ? { domain } : {}),
  };
}

export function setSessionCookie(
  res: Response,
  token: string,
  maxAgeMs: number,
): void {
  res.cookie(SESSION_COOKIE, token, { ...baseOptions(), maxAge: maxAgeMs });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, baseOptions());
}
