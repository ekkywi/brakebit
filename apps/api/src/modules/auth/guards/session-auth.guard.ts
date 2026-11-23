import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import { SESSION_COOKIE } from '../auth.constants';

export type AuthedRequest = Request & {
  user?: { id: string; walletAddress: string };
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    const user = await this.authService.me(token);
    if (!user) {
      throw new UnauthorizedException({
        code: 'NOT_AUTHENTICATED',
        message: 'Not signed in',
      });
    }
    req.user = user;
    return true;
  }
}
