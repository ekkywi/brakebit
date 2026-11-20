const MINT_MIN = 32;
const MINT_MAX = 64;

export function isAddressReady(address: string): boolean {
  const value = address.trim();
  return value.length >= MINT_MIN && value.length <= MINT_MAX;
}

export function addressFieldCopy(): {
  label: string;
  placeholder: string;
  hint: string;
} {
  return {
    label: "Mint address",
    placeholder: "Paste a Solana mint address",
    hint: "Paste a mint, or search by name/symbol below and pick a result.",
  };
}

export function addressValidationMessage(address: string): string | null {
  const value = address.trim();
  if (!value) return null;
  if (value.length < MINT_MIN || value.length > MINT_MAX) {
    return "Mint address looks too short or too long for Solana.";
  }
  return null;
}
