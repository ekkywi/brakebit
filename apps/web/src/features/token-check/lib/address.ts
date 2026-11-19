import { getChainMeta, type Chain } from "@brakebit/shared";

export function isAddressReady(address: string, chain: Chain): boolean {
  const value = address.trim();
  const family = getChainMeta(chain).family;

  if (family === "evm") {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  }

  return value.length >= 32 && value.length <= 64;
}

export function addressFieldCopy(chain: Chain): {
  label: string;
  placeholder: string;
  hint: string;
} {
  const family = getChainMeta(chain).family;

  if (family === "evm") {
    return {
      label: "Contract address",
      placeholder: "0x… token contract address",
      hint: "Use the token contract address, not a wallet address. Reviews are read-only.",
    };
  }

  return {
    label: "Mint address",
    placeholder: "Token mint address",
    hint: "Use the token mint address, not a wallet address. Reviews are read-only.",
  };
}
