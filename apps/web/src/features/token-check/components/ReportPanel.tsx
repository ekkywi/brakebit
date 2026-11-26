"use client";

import type { TokenCheck } from "../hooks/use-token-check";
import { ReportSkeleton } from "./ReportSkeleton";
import { RiskReportView } from "./RiskReportView";

type Props = {
  check: TokenCheck;
  className?: string;
};

/** The report slot: the skeleton while a check runs, then the report itself. */
export function ReportPanel({ check, className }: Props) {
  return (
    <aside
      ref={check.panelRef}
      className={className}
      aria-label="Risk report panel"
    >
      {check.loading ? <ReportSkeleton /> : null}
      {!check.loading && check.report ? (
        <RiskReportView
          report={check.report}
          onCheckAnother={check.checkAnother}
          compact
        />
      ) : null}
    </aside>
  );
}
