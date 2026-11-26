import type { RiskReport } from "@brakebit/shared";
import { SIGNAL_COUNT, signalNumber } from "@/shared/content/product";

/**
 * Fewer readable signals than this and the report shows "Limited data" in
 * place of the risk level. The score stays visible but is not colored as safe.
 */
export const MIN_READ_SIGNALS = 3;

export type ReportCoverage = {
  /** How many of the six signals came back with a real value. */
  read: number;
  total: number;
  limited: boolean;
};

/** Counts only the six known signals. A null value means Unknown, not clear. */
export function reportCoverage(signals: RiskReport["signals"]): ReportCoverage {
  let read = 0;
  for (const signal of signals) {
    if (signalNumber(signal.key) !== null && signal.value !== null) read += 1;
  }
  return { read, total: SIGNAL_COUNT, limited: read < MIN_READ_SIGNALS };
}
