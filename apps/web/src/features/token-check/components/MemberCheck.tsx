"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { useTokenCheck } from "../hooks/use-token-check";
import { takePendingCheck } from "../lib/pending-check";
import {
  FieldMessages,
  MintField,
  SampleButton,
  SearchField,
} from "./CheckFields";
import { CheckResults } from "./CheckResults";
import { CreditLine } from "./CreditLine";
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
 * Check workspace for signed-in users, inside the dashboard shell. It is a work
 * area, so it holds only what the job needs: the balance, the form, then the
 * reviewed list with the report beside it. No title block and no explainer
 * tiles; the header already names the page. Live checks spend credits.
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
        <h1 className="sr-only">Token check</h1>

        <CreditLine
          balance={balance}
          status={status}
          onRetry={() => void reload()}
        />

        <form onSubmit={check.submit} className="cell py-5 md:py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <SearchField check={check} showLabel />
            <MintField check={check} showLabel />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            <button
              type="submit"
              disabled={check.loading || !check.ready}
              className="btn btn-primary"
            >
              {check.loading ? "Checking…" : "Run check"}
            </button>
            <SampleButton check={check} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            A live check uses 1 credit unless the result is already cached.
          </p>
          <div className="mt-3">
            <FieldMessages check={check} />
          </div>
        </form>

        {check.error ? (
          <div className="cell space-y-2 border-t border-[var(--border)] py-4">
            <p role="alert" className="alert-error">
              {check.error}
            </p>
            {creditsAction(check.errorCode)}
          </div>
        ) : null}

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
