export class NonceDto {
  address!: string;

  static parse(body: unknown): NonceDto {
    if (!body || typeof body !== 'object') {
      throw new Error('Request body must be an object');
    }

    const address = String(
      (body as { address?: unknown }).address ?? '',
    ).trim();

    if (address.length < 32 || address.length > 64) {
      throw new Error('Invalid Solana wallet address');
    }

    const dto = new NonceDto();
    dto.address = address;
    return dto;
  }
}
