/** Product copy for landing and check. Facts only, no fake proof. */

export const SAMPLE_CHECK = {
  address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  note: "Example: BONK mint on Solana (illustrative only)",
} as const;

export const SAMPLE_CHECK_HREF = `/check?chain=solana&address=${encodeURIComponent(SAMPLE_CHECK.address)}&example=1`;

/** What a check reads today. Only the four signals the API can return a value for. */
export const READS = [
  {
    title: "Mint authority",
    detail: "Whether supply can still change after launch.",
  },
  {
    title: "Freeze authority",
    detail: "Whether token accounts can be frozen.",
  },
  {
    title: "Top-holder share",
    detail: "How much supply the largest account holds, when RPC can index it.",
  },
  {
    title: "Token age",
    detail: "Estimated from the oldest signature in one RPC page.",
  },
] as const;

/** What Brakebit never does. Matches the product scope in ROADMAP.md. */
export const NEVER = [
  {
    title: "Ask for a private key or seed phrase",
    detail: "Signing in, when you choose to, is a signed message and nothing more.",
  },
  {
    title: "Hold your tokens or funds",
    detail: "Brakebit is not a wallet and never takes custody of assets.",
  },
  {
    title: "Place trades or swaps",
    detail: "No order routing, no execution. Review here, decide elsewhere.",
  },
  {
    title: "Tell you to buy or sell",
    detail: "Findings are indicators for your own diligence, not investment advice.",
  },
] as const;

/**
 * The six signals every report carries, in the order the API returns them
 * (`risk-score.ts`). `key` is the API signal key, `field` the row label in the
 * report. The position in this list is the signal number (01 to 06).
 * `readToday` is false for the two signals with no data source yet; they
 * always show Unknown (DESIGN.md, Credibility rules).
 */
export const SIGNALS = [
  {
    key: "mint_authority",
    title: "Supply control",
    field: "Mint authority",
    readToday: true,
    brief: "Mint powers that can still change supply.",
    detail:
      "Whether new tokens can still be minted or supply can be changed after launch.",
  },
  {
    key: "freeze_authority",
    title: "Transfer restrictions",
    field: "Freeze authority",
    readToday: true,
    brief: "Freeze authority still active or cleared.",
    detail:
      "Whether accounts can be frozen or otherwise blocked from moving tokens.",
  },
  {
    key: "lp_lock",
    title: "Liquidity posture",
    field: "LP lock/burn",
    readToday: false,
    brief: "Not measured yet. Shows as unknown.",
    detail:
      "Reserved for lock and pool-depth cues when a trustworthy Solana source exists. Unknown for now.",
  },
  {
    key: "top_holder_pct",
    title: "Holder concentration",
    field: "Top holder %",
    readToday: true,
    brief: "Top account share of supply when RPC can index it.",
    detail:
      "How much supply sits with the largest accounts, and what that means for dump risk.",
  },
  {
    key: "liquidity_usd",
    title: "Market liquidity",
    field: "Liquidity (USD)",
    readToday: false,
    brief: "Not read yet. No market data source is connected.",
    detail:
      "Pool liquidity in USD. Brakebit does not connect a market data source yet, so this shows Unknown. Thin books amplify slippage and manipulation risk.",
  },
  {
    key: "age_hours",
    title: "Token age",
    field: "Age (hours)",
    readToday: true,
    brief: "Shown when the mint's history fits in one RPC page.",
    detail:
      "Estimated from the oldest signature in one RPC page. Mints with a long history show Unknown. Newer tokens have less observable history.",
  },
] as const;

export const SIGNAL_COUNT = SIGNALS.length;

/** Signal number (1 to 6) for an API signal key, or null when the key is not one of the six. */
export function signalNumber(key: string): number | null {
  const index = SIGNALS.findIndex((signal) => signal.key === key);
  return index === -1 ? null : index + 1;
}

/** Two-digit label for a signal number, for example 3 becomes "03". */
export function signalLabel(n: number): string {
  return String(n).padStart(2, "0");
}

export const CHECK_TIP =
  "Use the mint (not a wallet), then verify findings on Solscan.";
