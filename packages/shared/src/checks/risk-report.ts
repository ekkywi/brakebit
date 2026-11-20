import type { Chain } from "../chains";

export type RiskLevel = "low" | "medium" | "high" | "critical" | "unknown";

export interface RiskReason {
  code: string;
  severity: RiskLevel;
  title: string;
  detail: string;
}

export interface RiskSignal {
  key: string;
  label: string;
  value: string | number | boolean | null;
  status: "ok" | "warn" | "bad" | "unknown";
}

/** On-chain / indexer display fields so the user can confirm the mint. */
export interface TokenIdentity {
  name: string | null;
  symbol: string | null;
  imageUrl: string | null;
}

export interface RiskReport {
  address: string;
  chain: Chain;
  score: number;
  level: RiskLevel;
  summary: string;
  reasons: RiskReason[];
  signals: RiskSignal[];
  sources: string[];
  checkedAt: string;
  freshnessNote: string;
  disclaimer: string;
  /** Present when metadata was found; null fields mean unknown, not invented. */
  token?: TokenIdentity;
}
