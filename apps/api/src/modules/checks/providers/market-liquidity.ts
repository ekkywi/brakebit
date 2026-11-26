export type DexPair = {
  chainId?: string;
  liquidity?: { usd?: number | null } | null;
};

export type MarketLiquidityLookup = {
  liquidityUsd: number | null;
  source?: string;
  note?: string;
};

/**
 * Total USD liquidity across Solana pools. null when no pool reports a value.
 * null is never turned into 0: "no pool found" is not the same as "no liquidity".
 */
export function sumSolanaLiquidity(pairs: DexPair[]): number | null {
  const values = pairs
    .filter((p) => p.chainId === 'solana')
    .map((p) => p.liquidity?.usd)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0);
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0));
}

/** DexScreener public token endpoint (no API key). Pools are summed, see sumSolanaLiquidity. */
export async function fetchMarketLiquidityUsd(
  mint: string,
): Promise<MarketLiquidityLookup> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!res.ok) {
      return {
        liquidityUsd: null,
        note: `Liquidity source (dexscreener) HTTP ${res.status}.`,
      };
    }

    const data = (await res.json()) as { pairs?: DexPair[] | null };
    const liquidityUsd = sumSolanaLiquidity(data.pairs ?? []);
    if (liquidityUsd === null) {
      return {
        liquidityUsd: null,
        note: 'Liquidity unavailable: no Solana pool with a value for this mint.',
      };
    }
    return { liquidityUsd, source: 'dexscreener.com:pairs' };
  } catch (error) {
    return {
      liquidityUsd: null,
      note: `Liquidity source (dexscreener) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
