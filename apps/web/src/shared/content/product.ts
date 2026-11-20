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

export const SIGNALS = [
  {
    title: "Supply control",
    detail:
      "Whether new tokens can still be minted or supply can be changed after launch.",
  },
  {
    title: "Transfer restrictions",
    detail:
      "Whether accounts can be frozen or otherwise blocked from moving tokens.",
  },
  {
    title: "Liquidity posture",
    detail:
      "Reserved for lock and pool-depth cues when a trustworthy Solana source exists. Unknown for now.",
  },
  {
    title: "Holder concentration",
    detail:
      "How much supply sits with the largest accounts, and what that means for dump risk.",
  },
] as const;

/** Merged empty-state panel: coverage + diligence tips. */
export const CHECK_GUIDANCE = [
  {
    title: "Supply control",
    detail: "Mint powers that can still change supply.",
  },
  {
    title: "Transfer restrictions",
    detail: "Freeze authority still active or cleared.",
  },
  {
    title: "Liquidity posture",
    detail: "Not measured yet. Shows as unknown.",
  },
  {
    title: "Holder concentration",
    detail: "Top account share of supply when RPC can index it.",
  },
  {
    title: "Before you trust the score",
    detail:
      "Use the mint (not a wallet), then verify findings on Solscan.",
  },
] as const;
