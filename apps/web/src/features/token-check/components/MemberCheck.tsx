"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { SheetTitle } from "@/shared/ui/SheetTitle";
import { SpecStrip } from "@/shared/ui/SpecStrip";
import { useTokenCheck } from "../hooks/use-token-check";
import { takePendingCheck } from "../lib/pending-check";
import {
  FieldMessages,
  MintField,
  SampleButton,
  SearchField,
} from "./CheckFields";
import { CheckResults } from "./CheckResults";
import { CreditCell } from "./CreditCell";
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
 * Check workspace for signed-in users, inside the dashboard shell. It is the
 * same spec sheet as `GuestCheck`: title row, form with a numeral cell, tiles,
 * then the reviewed list with the report beside it. The numeral cell shows
 * credits here instead of the one free check. Live checks spend credits.
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
      <div className="sheet sheet--flush">
        <SheetTitle
          scale="app"
          meta="Solana · live check · uses credits"
          title="Token check"
          note="Live checks use your credits. Reviewed tokens are listed below, and the report opens beside them on wide screens."
        />

        <form
          onSubmit={check.submit}
          className="grid border-t border-[var(--border)] md:grid-cols-12"
        >
          <div className="cell py-6 md:col-span-8 md:py-8">
            <div className="grid gap-5 md:grid-cols-2">
              <SearchField check={check} showLabel />
              <MintField check={check} showLabel />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
              <button
                type="submit"
                disabled={check.loading || !check.ready}
                className="btn btn-primary"
              >
                {check.loading ? "Checking…" : "Run check"}
              </button>
              <SampleButton check={check} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
              A live check uses 1 credit unless the result is already cached.
            </p>
            <div className="mt-4">
              <FieldMessages check={check} />
            </div>
          </div>

          <CreditCell
            balance={balance}
            status={status}
            onRetry={() => void reload()}
            className="md:col-span-4"
          />
        </form>

        {check.error ? (
          <div className="cell space-y-2 border-t border-[var(--border)] py-4">
            <p role="alert" className="alert-error">
              {check.error}
            </p>
            {creditsAction(check.errorCode)}
          </div>
        ) : null}

        {check.showPanel ? null : <SpecStrip ready={check.ready} />}

        <CheckResults check={check} where="app" />
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
