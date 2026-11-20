import type { Chain } from "@brakebit/shared";

export function explorerTokenUrl(_chain: Chain, address: string): string {
  return `https://solscan.io/token/${address}`;
}

export function explorerName(_chain: Chain): string {
  return "Solscan";
}
