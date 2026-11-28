const MINT_MIN = 32;
const MINT_MAX = 64;

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;

/** True when the value can be sent as a check: right length and only base58 characters. */
export function isAddressReady(address: string): boolean {
  const value = address.trim();
  return (
    value.length >= MINT_MIN &&
    value.length <= MINT_MAX &&
    BASE58.test(value)
  );
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
    return "Mint address looks too short or too long for Solana. Check that you copied the whole address.";
  }
  if (!BASE58.test(value)) {
    return "Mint address has characters Solana does not use, such as 0, O, I, l, or a space.";
  }
  return null;
}