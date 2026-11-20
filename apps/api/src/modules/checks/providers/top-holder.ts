/** Top account raw amount as % of mint supply (0–100). */
export function topHolderPercent(
  topAmount: string | number | bigint,
  supply: bigint,
): number | null {
  if (supply <= 0n) return null;
  const amount = BigInt(topAmount);
  if (amount < 0n) return null;
  return Number((amount * 10000n) / supply) / 100;
}
