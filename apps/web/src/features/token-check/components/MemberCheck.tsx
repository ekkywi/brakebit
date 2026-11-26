"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import {
  CHECK_TIP,
  SIGNALS,
  signalLabel,
} from "@/shared/content/product";
import { useTokenCheck } from "../hooks/use-token-check";
import { takePendingCheck } from "../lib/pending-check";
import { FieldMessages, MintField, SearchField } from "./CheckFields";
import { CreditRail } from "./CreditRail";
import { RecentChecks } from "./RecentChecks";
import { ReportPanel } from "./ReportPanel";
import { ResumeCheckDialog } from "./ResumeCheckDialog";

function creditsAction(code: string | null) {
  if (code !== "insufficient_credits") return null;
  return (
    <Link
      href="/dashboard"
      className="nav-link inline-flex min-h-11 items-center text-sm"
    >
      See your credits
    </Link>
  );
}

/**
 * Check workspace for signed-in users: an app work area inside the dashboard
 * shell. It leads with what can be spent, then a compact toolbar and a table.
 * The public workspace (`GuestCheck`) is a spec sheet on purpose, so the two
 * screens read as different places. Live checks spend credits.
 */
export function MemberCheck() {
  const consumedRef = useRef(false);
  const [resumeMint, setResumeMint] = useState<string | null>(null);

  const { balance, status, reload } = useCreditBalance(true);
  // A live check spends a credit (and a system failure refunds it), so read the balance again.
  const check = useTokenCheck({ onSettled: () => void reload() });

  // Read the guest's pending check once. The ref keeps Strict Mode's second effect run from losing it.
  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;
    setResumeMint(takePendingCheck());
  }, []);

  const closeResume = useCallback(() => setResumeMint(null), []);

  function confirmResume() {
    const mint = resumeMint;
    setResumeMint(null);
    if (mint) check.run(mint);
  }

  return (
    <>
      <div className="space-y-4">
        <CreditRail
          balance={balance}
          status={status}
          onRetry={() => void reload()}
        />

        <form onSubmit={check.submit} className="screener-toolbar card">
          <div className="screener-toolbar-grid">
            <p className="screener-network text-xs text-[var(--muted)]">
              Network <span className="text-[var(--fg)]">Solana</span>
            </p>
            <SearchField check={check} />
            <MintField check={check} />
            <div className="screener-toolbar-actions">
              <button
                type="button"
                className="nav-link text-xs whitespace-nowrap"
                onClick={check.loadSample}
              >
                Example
              </button>
              <button
                type="submit"
                disabled={check.loading || !check.ready}
                className="btn btn-primary btn-sm whitespace-nowrap"
              >
                {check.loading ? "Checking…" : "Run check"}
              </button>
            </div>
          </div>
          <div className="mt-2.5">
            <FieldMessages check={check} />
          </div>
        </form>

        <p className="text-xs leading-relaxed text-[var(--muted)]">
          A live check uses 1 credit unless the result is already cached.
        </p>

        {check.error ? (
          <div className="space-y-2">
            <p role="alert" className="alert-error">
              {check.error}
            </p>
            {creditsAction(check.errorCode)}
          </div>
        ) : null}

        <div
          className={
            check.showPanel
              ? "screener-body screener-body--split"
              : "screener-body"
          }
        >
          <div className="screener-main space-y-4">
            <RecentChecks
              onSelect={check.pickRecent}
              refreshToken={check.recentRefresh}
              selectedAddress={check.address}
            />

            {check.showPanel ? null : (
              <div className="card p-5">
                <p className="text-sm font-medium text-[var(--fg)]">
                  What a report covers
                </p>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SIGNALS.map((signal, index) => (
                    <li key={signal.key} className="flex gap-3">
                      <span className="sq-index">{signalLabel(index + 1)}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--fg)]">
                          {signal.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                          {signal.brief}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--muted)]">
                  {CHECK_TIP}
                </p>
              </div>
            )}
          </div>

          {check.showPanel ? (
            <ReportPanel check={check} className="screener-panel" />
          ) : null}
        </div>
      </div>

      {resumeMint ? (
        <ResumeCheckDialog
          mint={resumeMint}
          onConfirm={confirmResume}
          onClose={closeResume}
        />
      ) : null}
    </>
  );
}
