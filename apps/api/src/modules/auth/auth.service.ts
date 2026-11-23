import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { randomToken, sha256Hex } from './crypto-util';
import {
  buildSignInMessage,
  parseSignInMessage,
} from './solana-sign-in-message';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private requireDatabase(): void {
    if (!process.env.DATABASE_URL) {
      throw new BadRequestException({
        code: 'DATABASE_REQUIRED',
        message: 'Auth requires DATABASE_URL',
      });
    }
  }

  private authDomain(): string {
    return process.env.AUTH_DOMAIN?.trim() || 'localhost:3000';
  }

  private nonceTtlMs(): number {
    const value = Number(process.env.AUTH_NONCE_TTL_MS ?? 600_000);
    return Number.isFinite(value) && value > 0 ? value : 600_000;
  }

  private sessionTtlMs(): number {
    const value = Number(process.env.SESSION_TTL_MS ?? 604_800_000);
    return Number.isFinite(value) && value > 0 ? value : 604_800_000;
  }

  async createNonce(
    address: string,
  ): Promise<{ message: string; nonce: string }> {
    this.requireDatabase();

    const nonce = randomToken(16);
    const now = Date.now();
    const issuedAt = new Date(now).toISOString();
    const expiresAt = new Date(now + this.nonceTtlMs());

    const message = buildSignInMessage({
      domain: this.authDomain(),
      address,
      nonce,
      issuedAt,
      expiresAt: expiresAt.toISOString(),
    });

    await this.prisma.authNonce.create({
      data: {
        address,
        nonceHash: sha256Hex(nonce),
        expiresAt,
      },
    });

    return { message, nonce };
  }

  async verifySignIn(input: {
    address: string;
    message: string;
    signature: string;
  }): Promise<{
    user: { id: string; walletAddress: string };
    sessionToken: string;
    sessionMaxAgeMs: number;
  }> {
    this.requireDatabase();

    const fields = parseSignInMessage(input.message);
    if (!fields) {
      throw new UnauthorizedException({
        code: 'INVALID_MESSAGE',
        message: 'Sign-in message format is invalid',
      });
    }

    if (fields.domain !== this.authDomain()) {
      throw new UnauthorizedException({
        code: 'INVALID_DOMAIN',
        message: 'Sign-in domain mismatch',
      });
    }

    if (fields.address !== input.address) {
      throw new UnauthorizedException({
        code: 'ADDRESS_MISMATCH',
        message: 'Address does not match message',
      });
    }

    if (Date.parse(fields.expiresAt) <= Date.now()) {
      throw new UnauthorizedException({
        code: 'MESSAGE_EXPIRED',
        message: 'Sign-in message expired',
      });
    }

    const nonceRow = await this.prisma.authNonce.findFirst({
      where: {
        address: input.address,
        nonceHash: sha256Hex(fields.nonce),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!nonceRow) {
      throw new UnauthorizedException({
        code: 'INVALID_NONCE',
        message: 'Nonce is invalid, used, or expired',
      });
    }

    let signatureOk = false;
    try {
      const publicKey = new PublicKey(input.address);
      signatureOk = nacl.sign.detached.verify(
        new TextEncoder().encode(input.message),
        bs58.decode(input.signature),
        publicKey.toBytes(),
      );
    } catch {
      signatureOk = false;
    }

    if (!signatureOk) {
      throw new UnauthorizedException({
        code: 'INVALID_SIGNATURE',
        message: 'Wallet signature is invalid',
      });
    }

    await this.prisma.authNonce.update({
      where: { id: nonceRow.id },
      data: { usedAt: new Date() },
    });

    const user = await this.prisma.user.upsert({
      where: { walletAddress: input.address },
      create: { walletAddress: input.address },
      update: {},
    });

    if (!user.walletAddress) {
      throw new UnauthorizedException({
        code: 'USER_INVALID',
        message: 'User wallet missing',
      });
    }

    const sessionToken = randomToken(32);
    const sessionMaxAgeMs = this.sessionTtlMs();

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: sha256Hex(sessionToken),
        expiresAt: new Date(Date.now() + sessionMaxAgeMs),
      },
    });

    return {
      user: { id: user.id, walletAddress: user.walletAddress },
      sessionToken,
      sessionMaxAgeMs,
    };
  }

  async logout(sessionToken: string | undefined): Promise<void> {
    this.requireDatabase();
    if (!sessionToken) return;

    await this.prisma.session.updateMany({
      where: {
        tokenHash: sha256Hex(sessionToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async me(
    sessionToken: string | undefined,
  ): Promise<{ id: string; walletAddress: string } | null> {
    this.requireDatabase();
    if (!sessionToken) return null;

    const session = await this.prisma.session.findFirst({
      where: {
        tokenHash: sha256Hex(sessionToken),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session?.user.walletAddress) return null;

    return {
      id: session.user.id,
      walletAddress: session.user.walletAddress,
    };
  }
}
