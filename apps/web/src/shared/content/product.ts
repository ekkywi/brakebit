import { CHAIN_META } from "@brakebit/shared";

/** Product copy for landing and check. Facts only, no fake proof. */

export const NETWORKS = CHAIN_META.map((chain) => ({
  id: chain.id,
  label: chain.label,
  short: chain.short,
}));

export const FEATURES = [
  {
    title: "Findings you can read",
    detail:
      "Each reason names what was found, why it matters, and how severe it looks, so you know what to dig into next.",
  },
  {
    title: "One score from four signals",
    detail:
      "Supply control, transfer restrictions, liquidity posture, and holder concentration feed a single assessment.",
  },
  {
    title: "Same report on every chain",
    detail:
      "Ethereum, Solana, Base, Arbitrum, BNB Chain, and Polygon share one workspace shape so comparisons stay fair.",
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
    title: "Choose the network",
    detail:
      "Select where the token lives. Address checks adapt for EVM contracts and Solana mints.",
  },
  {
    n: "02",
    title: "Paste the token address",
    detail:
      "Use the contract or mint address, not a wallet. Reviews stay read-only.",
  },
  {
    n: "03",
    title: "Read the assessment",
    detail:
      "Score, numbered findings, and signal details land in one report you can verify against primary sources.",
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
      "Whether accounts can be frozen, blacklisted, paused, or otherwise blocked from moving tokens.",
  },
  {
    title: "Liquidity posture",
    detail:
      "Cues around lock status, pool depth, and how hard an exit could become.",
  },
  {
    title: "Holder concentration",
    detail:
      "How much supply sits with the largest wallets, and what that means for dump risk.",
  },
] as const;

export const USE_CASES = [
  {
    title: "Before you buy",
    detail:
      "Run the contract through Brakebit first. Read the findings, then decide with your own diligence.",
  },
  {
    title: "When someone sends an address",
    detail:
      "Pick the network, paste it, and check supply, restrictions, liquidity, and holders before you interact.",
  },
  {
    title: "When liquidity looks thin",
    detail:
      "Use the report for lock cues and concentration signals that a price chart alone will not show.",
  },
] as const;

export const CHECK_COVERAGE = [
  [
    "Supply control",
    "Mint or ownership powers that can still change supply",
  ],
  [
    "Transfer restrictions",
    "Freeze, blacklist, or pause-style controls",
  ],
  ["Liquidity posture", "Lock and thin-liquidity cues"],
  ["Holder concentration", "Share held by top wallets"],
] as const;

export const CHECK_TIPS = [
  "Use the token contract or mint, not a personal wallet.",
  "Match the network to where the token actually lives.",
  "Treat the score as a starting point, then verify on-chain.",
] as const;
