const SYSTEM_PROGRAM_ID = '11111111111111111111111111111111';

/** Locked share (USD-weighted) at or above which the LP counts as locked or burned. */
export const LP_LOCKED_MIN_PCT = 95;

export type RugcheckLp = {
  lpMint?: string | null;
  lpLockedPct?: number | null;
  quoteUSD?: number | null;
};

export type RugcheckMarket = {
  lp?: RugcheckLp | null;
};

export type LpLockLookup = {
  /** true: USD-weighted locked share is at least LP_LOCKED_MIN_PCT. false: below it. null: unknown. */
  locked: boolean | null;
  source?: string;
  note?: string;
  /** Fixed, user-facing reason when locked is null. */
  reason?: string;
};

const NO_LP_POOL_REASON = 'No pool with an LP token was found on Rugcheck.';
const PARTIAL_SHARE_REASON =
  'A pool shows a partial locked share that is not verified yet.';
const NO_USD_REASON = 'Rugcheck has no USD value or locked share for the LP pools.';
const SOURCE_REASON = 'Rugcheck did not return LP data for this mint.';

function lpTokenPools(markets: RugcheckMarket[]): RugcheckLp[] {
  return markets
    .map((m) => m.lp)
    .filter(
      (lp): lp is RugcheckLp =>
        Boolean(lp?.lpMint) && lp?.lpMint !== SYSTEM_PROGRAM_ID,
    );
}

function isPartialShare(pct: number | null | undefined): boolean {
  return typeof pct === 'number' && pct > 0 && pct < 100;
}

/** Fixed reason for an Unknown LP lock. Checks the cases in the order a reader would ask. */
export function lpLockUnknownReason(markets: RugcheckMarket[]): string {
  const pools = lpTokenPools(markets);
  if (pools.length === 0) return NO_LP_POOL_REASON;
  if (pools.some((p) => isPartialShare(p.lpLockedPct))) return PARTIAL_SHARE_REASON;
  return NO_USD_REASON;
}

/**
 * USD-weighted locked share (0 to 100) across pools that issue an LP token.
 * Pools without an LP token (for example Orca Whirlpool or Meteora DLMM) are left
 * out: their lpLockedPct is 0 by default and does not mean "unlocked".
 * Returns null when there is no such pool, when a pool has no USD value or no
 * locked share, when the total USD weight is 0, or when any pool has a partial
 * share (above 0 and below 100). Rugcheck's partial values do not match on-chain
 * LP balances yet, so they stay Unknown until they are verified.
 */
export function lpLockedSharePct(markets: RugcheckMarket[]): number | null {
  const pools = lpTokenPools(markets);
  if (pools.length === 0) return null;

  let weight = 0;
  let locked = 0;
  for (const pool of pools) {
    const usd = pool.quoteUSD;
    const pct = pool.lpLockedPct;
    if (typeof usd !== 'number' || !Number.isFinite(usd) || usd < 0) return null;
    if (typeof pct !== 'number' || !Number.isFinite(pct)) return null;
    if (isPartialShare(pct)) return null;
    weight += usd;
    locked += usd * pct;
  }
  if (weight <= 0) return null;
  return locked / weight;
}

/** true when the USD-weighted locked share reaches LP_LOCKED_MIN_PCT. */
export function lpLockState(markets: RugcheckMarket[]): boolean | null {
  const share = lpLockedSharePct(markets);
  if (share === null) return null;
  return share >= LP_LOCKED_MIN_PCT;
}

export async function fetchLpLockFromRugcheck(mint: string): Promise<LpLockLookup> {
  try {
    const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      return {
        locked: null,
        note: `LP lock source (rugcheck) HTTP ${res.status}.`,
        reason: SOURCE_REASON,
      };
    }

    const data = (await res.json()) as { markets?: RugcheckMarket[] | null };
    const markets = data.markets ?? [];
    const locked = lpLockState(markets);
    if (locked === null) {
      return {
        locked: null,
        note: 'LP lock unknown: no pool with an LP token and a verified USD-weighted locked share from Rugcheck.',
        reason: lpLockUnknownReason(markets),
      };
    }
    return { locked, source: 'rugcheck.xyz:markets.lp' };
  } catch (error) {
    return {
      locked: null,
      note: `LP lock source (rugcheck) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      reason: SOURCE_REASON,
    };
  }
}
