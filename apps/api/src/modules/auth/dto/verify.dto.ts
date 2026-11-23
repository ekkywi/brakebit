export class VerifyDto {
  address!: string;
  message!: string;
  signature!: string;

  static parse(body: unknown): VerifyDto {
    if (!body || typeof body !== 'object') {
      throw new Error('Request body must be an object');
    }

    const raw = body as Record<string, unknown>;
    const address = typeof raw.address === 'string' ? raw.address.trim() : '';
    const message = typeof raw.message === 'string' ? raw.message : '';
    const signature =
      typeof raw.signature === 'string' ? raw.signature.trim() : '';

    if (address.length < 32 || address.length > 64) {
      throw new Error('Invalid Solana wallet address');
    }
    if (!message.trim()) {
      throw new Error('message is required');
    }
    if (!signature) {
      throw new Error('signature is required');
    }

    const dto = new VerifyDto();
    dto.address = address;
    dto.message = message;
    dto.signature = signature;
    return dto;
  }
}
