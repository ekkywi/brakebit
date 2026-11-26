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
  /** Short plain reason when status is unknown. Fixed text, never a raw error message. */
  reason?: string;
}

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
  token?: TokenIdentity;
  cached?: boolean;
}
