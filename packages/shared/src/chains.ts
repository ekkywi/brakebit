export const SUPPORTED_CHAINS = [
  "ethereum",
  "solana",
  "base",
  "arbitrum",
  "bsc",
  "polygon",
] as const;

export type Chain = (typeof SUPPORTED_CHAINS)[number];

export type ChainFamily = "evm" | "solana";

export type ChainMeta = {
  id: Chain;
  label: string;
  family: ChainFamily;
  short: string;
};

export const CHAIN_META: readonly ChainMeta[] = [
  { id: "ethereum", label: "Ethereum", family: "evm", short: "ETH" },
  { id: "solana", label: "Solana", family: "solana", short: "SOL" },
  { id: "base", label: "Base", family: "evm", short: "BASE" },
  { id: "arbitrum", label: "Arbitrum", family: "evm", short: "ARB" },
  { id: "bsc", label: "BNB Chain", family: "evm", short: "BNB" },
  { id: "polygon", label: "Polygon", family: "evm", short: "POL" },
] as const;

export function getChainMeta(chain: Chain): ChainMeta {
  const found = CHAIN_META.find((item) => item.id === chain);
  if (!found) {
    return CHAIN_META[0];
  }
  return found;
}

export function isSupportedChain(value: string): value is Chain {
  return (SUPPORTED_CHAINS as readonly string[]).includes(value);
}
