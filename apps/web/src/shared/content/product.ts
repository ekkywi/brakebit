/** Product copy for landing and check. Facts only, no fake proof. */

export const SAMPLE_CHECK = {
  address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  note: "Example: BONK mint on Solana (illustrative only)",
} as const;

export const FEATURES = [
  {
    title: "Findings you can read",
    detail:
      "Each reason names what was found, why it matters, and how severe it looks, so you know what to dig into next.",
  },
  {
    title: "Live Solana reads",
    detail:
      "Mint authority, freeze authority, and top-holder share come from Solana RPC when the mint allows it.",
  },
  {
    title: "Unknown stays unknown",
    detail:
      "Liquidity, LP lock, and thin data show as unknown instead of invented confidence. A score is directional, not a safety seal.",
  },
  {
    title: "Read-only by design",
    detail:
      "Brakebit never asks for keys, never holds assets, and never places a trade. Review first, decide elsewhere.",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Open a review",
    detail: "Start from the check workspace. Solana is the network Brakebit reads today.",
  },
  {
    n: "02",
    title: "Paste the mint address",
    detail: "Use the token mint, not a wallet. Reviews stay read-only.",
  },
  {
    n: "03",
    title: "Read the assessment",
    detail:
      "Score, findings, and signal details land in one report you can verify on Solscan.",
  },
] as const;

/**
 * The six signals every report carries, in the order the API returns them
 * (`risk-score.ts`). `key` is the API signal key, `field` the row label in the
 * report. The position in this list is the signal number (01 to 06).
 */
export const SIGNALS = [
  {
    key: "mint_authority",
    title: "Supply control",
    field: "Mint authority",
    brief: "Mint powers that can still change supply.",
    detail:
      "Whether new tokens can still be minted or supply can be changed after launch.",
  },
  {
    key: "freeze_authority",
    title: "Transfer restrictions",
    field: "Freeze authority",
    brief: "Freeze authority still active or cleared.",
    detail:
      "Whether accounts can be frozen or otherwise blocked from moving tokens.",
  },
  {
    key: "lp_lock",
    title: "Liquidity posture",
    field: "LP lock/burn",
    brief: "Not measured yet. Shows as unknown.",
    detail:
      "Reserved for lock and pool-depth cues when a trustworthy Solana source exists. Unknown for now.",
  },
  {
    key: "top_holder_pct",
    title: "Holder concentration",
    field: "Top holder %",
    brief: "Top account share of supply when RPC can index it.",
    detail:
      "How much supply sits with the largest accounts, and what that means for dump risk.",
  },
  {
    key: "liquidity_usd",
    title: "Market liquidity",
    field: "Liquidity (USD)",
    brief: "Not read yet. No market data source is connected.",
    detail:
      "Pool liquidity in USD. Brakebit does not connect a market data source yet, so this shows Unknown. Thin books amplify slippage and manipulation risk.",
  },
  {
    key: "age_hours",
    title: "Token age",
    field: "Age (hours)",
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
