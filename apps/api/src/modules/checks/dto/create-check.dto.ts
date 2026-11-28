import { isSupportedChain, type Chain } from '@brakebit/shared';

/** Base58 alphabet used by Solana addresses: no 0, O, I, or l. */
const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;


export class CreateCheckDto {
  address!: string;
  chain?: Chain;

  static parse(body: unknown): CreateCheckDto {
    if (!body || typeof body !== 'object') {
      throw new Error('Request body must be an object');
    }

    const raw = body as Record<string, unknown>;
    const address = typeof raw.address === 'string' ? raw.address.trim() : '';

    if (!address) {
      throw new Error('address is required');
    }

    const chainRaw = raw.chain;
    const chain: Chain =
      typeof chainRaw === 'string' && isSupportedChain(chainRaw)
        ? chainRaw
        : 'solana';

    CreateCheckDto.assertAddress(address);

    const dto = new CreateCheckDto();
    dto.address = address;
    dto.chain = chain;
    return dto;
  }

  private static assertAddress(address: string): void {
    if (address.length < 32 || address.length > 64) {
      throw new Error('address looks invalid for a Solana mint');
    }
    if (!BASE58.test(address)) {
      throw new Error('address has characters Solana does not use');
    }
  }
}
