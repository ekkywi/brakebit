/** Supported networks. Solana-only until other live providers ship. */
export const SUPPORTED_CHAINS = ["solana"] as const;

export type Chain = (typeof SUPPORTED_CHAINS)[number];

export type ChainMeta = {
  id: Chain;
  label: string;
  short: string;
};

export const CHAIN_META: readonly ChainMeta[] = [
  { id: "solana", label: "Solana", short: "SOL" },
] as const;

export function getChainMeta(chain: Chain): ChainMeta {
  const found = CHAIN_META.find((item) => item.id === chain);
  return found ?? CHAIN_META[0];
}

export function isSupportedChain(value: string): value is Chain {
  return (SUPPORTED_CHAINS as readonly string[]).includes(value);
}
