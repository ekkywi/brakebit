"use client";

import { useRef } from "react";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { Dialog } from "@/shared/ui/Dialog";

type Props = {
  mint: string;
  onConfirm: () => void;
  onClose: () => void;
};

/** Asks before spending a credit on the check a guest started before signing in. */
export function ResumeCheckDialog({ mint, onConfirm, onClose }: Props) {
  const { balance, status } = useCreditBalance(true);
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  const totalCredits = balance
    ? balance.topup.balance + balance.promo.balance
    : null;

  return (
    <Dialog
      title="Continue your check?"
      description="You were checking this token as a guest. A live check uses 1 credit, and it is free if a recent result is cached."
      onClose={onClose}
      initialFocusRef={confirmRef}
    >
      <p className="font-mono-ui mt-4 break-all rounded-lg bg-[var(--subtle)] p-3 text-xs text-[var(--fg)]">
        {mint}
      </p>

      {totalCredits !== null ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          You have {totalCredits} {totalCredits === 1 ? "credit" : "credits"}.
        </p>
      ) : status === "loading" ? (
        <p className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
          Loading balance…
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          ref={confirmRef}
          type="button"
          className="btn btn-primary btn-sm min-h-11"
          onClick={onConfirm}
        >
          Run check
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm min-h-11"
          onClick={onClose}
        >
          Not now
        </button>
      </div>
    </Dialog>
  );
}
