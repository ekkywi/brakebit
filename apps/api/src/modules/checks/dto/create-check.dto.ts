import {
  getChainMeta,
  isSupportedChain,
  type Chain,
} from '@brakebit/shared';

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
        : 'ethereum';

    CreateCheckDto.assertAddress(address, chain);

    const dto = new CreateCheckDto();
    dto.address = address;
    dto.chain = chain;
    return dto;
  }

  private static assertAddress(address: string, chain: Chain): void {
    const meta = getChainMeta(chain);

    if (meta.family === 'evm') {
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error(
          'address looks invalid for an EVM contract (expected 0x… 42 characters)',
        );
      }
      return;
    }

    if (address.length < 32 || address.length > 64) {
      throw new Error('address looks invalid for a Solana mint');
    }
  }
}
