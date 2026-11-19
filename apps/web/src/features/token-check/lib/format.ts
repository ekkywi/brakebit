import { getChainMeta, type Chain, type RiskLevel } from "@brakebit/shared";

export function levelLabel(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "Lower risk";
    case "medium":
      return "Moderate risk";
    case "high":
      return "Higher risk";
    case "critical":
      return "Critical risk";
    default:
      return "Unrated";
  }
}

export function chainLabel(chain: Chain): string {
  return getChainMeta(chain).label;
}
