"use client";

import type { TokenCheck } from "../hooks/use-token-check";
import { RecentChecks } from "./RecentChecks";
import { ReportPanel } from "./ReportPanel";

type Props = {
  check: TokenCheck;
  /**
   * `page` splits the list and report from the lg breakpoint. `app` waits for xl,
   * because the dashboard sidebar already takes 15rem from the same window.
   */
  where: "page" | "app";
};

const SPLIT = {
  page: {
    grid: "grid border-t border-[var(--border)] lg:grid-cols-12",
    list: "min-w-0 lg:col-span-7 lg:border-r lg:border-[var(--border)]",
    panel:
      "cell min-w-0 border-t border-[var(--border)] py-6 lg:sticky lg:top-20 lg:col-span-5 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-auto lg:border-t-0",
  },
  app: {
    grid: "grid border-t border-[var(--border)] xl:grid-cols-12",
    list: "min-w-0 xl:col-span-7 xl:border-r xl:border-[var(--border)]",
    panel:
      "cell min-w-0 border-t border-[var(--border)] py-6 xl:sticky xl:top-[4.5rem] xl:col-span-5 xl:max-h-[calc(100vh-5.5rem)] xl:self-start xl:overflow-auto xl:border-t-0",
  },
} as const;

/**
 * Reviewed-token list with the report beside it. The list keeps its place when
 * the report opens, so it is not reloaded. Shared by the public and member
 * workspaces so both read as one product.
 */
export function CheckResults({ check, where }: Props) {
  const split = SPLIT[where];

  return (
    <div className={check.showPanel ? split.grid : "border-t border-[var(--border)]"}>
      <div className={check.showPanel ? split.list : "min-w-0"}>
        <RecentChecks
          onSelect={check.pickRecent}
          refreshToken={check.recentRefresh}
          selectedAddress={check.address}
        />
      </div>
      {check.showPanel ? (
        <ReportPanel check={check} className={split.panel} />
      ) : null}
    </div>
  );
}
