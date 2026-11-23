export type SignInFields = {
  domain: string;
  address: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
};

export function buildSignInMessage(fields: SignInFields): string {
  return [
    'Brakebit wants you to sign in.',
    `Domain: ${fields.domain}`,
    `Address: ${fields.address}`,
    `Nonce: ${fields.nonce}`,
    `Issued At: ${fields.issuedAt}`,
    `Expires At: ${fields.expiresAt}`,
  ].join('\n');
}

export function parseSignInMessage(message: string): SignInFields | null {
  const lines = message.split('\n');
  if (lines[0] !== 'Brakebit wants you to sign in.') return null;

  const read = (prefix: string): string => {
    const line = lines.find((item) => item.startsWith(prefix));
    return line ? line.slice(prefix.length).trim() : '';
  };

  const domain = read('Domain: ');
  const address = read('Address: ');
  const nonce = read('Nonce: ');
  const issuedAt = read('Issued At: ');
  const expiresAt = read('Expires At: ');

  if (!domain || !address || !nonce || !issuedAt || !expiresAt) return null;

  return { domain, address, nonce, issuedAt, expiresAt };
}
