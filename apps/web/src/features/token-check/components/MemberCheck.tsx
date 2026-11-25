"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { takePendingCheck } from "../lib/pending-check";
import { ResumeCheckDialog } from "./ResumeCheckDialog";
import {
  TokenCheckForm,
  type TokenCheckFormHandle,
} from "./TokenCheckForm";

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

/** Check workspace for signed-in users. Live checks spend credits. */
export function MemberCheck() {
  const formRef = useRef<TokenCheckFormHandle | null>(null);
  const consumedRef = useRef(false);
  const [resumeMint, setResumeMint] = useState<string | null>(null);

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
    if (mint) formRef.current?.run(mint);
  }

  return (
    <>
      <TokenCheckForm
        ref={formRef}
        notice="Each live check uses 1 credit. Cached results are free."
        errorAction={creditsAction}
      />
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
