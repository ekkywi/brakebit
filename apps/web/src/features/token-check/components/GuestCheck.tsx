"use client";

import { useState } from "react";
import type { ApiError } from "@/shared/api/client";
import { SheetTitle } from "@/shared/ui/SheetTitle";
import { SpecStrip } from "@/shared/ui/SpecStrip";
import { useTokenCheck } from "../hooks/use-token-check";
import {
  FieldMessages,
  MintField,
  SampleButton,
  SearchField,
} from "./CheckFields";
import { CheckResults } from "./CheckResults";
import { GuestLimitDialog } from "./GuestLimitDialog";

/**
 * Check workspace for visitors without an account: one free live check per day.
 * It is one spec sheet split by hairlines, the same sheet `MemberCheck` uses
 * inside the dashboard, so a visitor sees the product they will be using.
 */
export function GuestCheck() {
  const [limitMint, setLimitMint] = useState<string | null>(null);

  const check = useTokenCheck({
    onApiError: (error: ApiError, context: { mint: string }) => {
      if (error.code !== "guest_limit_reached") return false;
      setLimitMint(context.mint);
      return true;
    },
  });

  return (
    <>
      <div className="sheet">
        <SheetTitle
          meta="Solana · read-only · never asks for keys"
          title="Review a mint"
          note="Search by name or paste a mint. Reviewed tokens are listed below, and the report opens beside them on desktop."
        />

        <form
          onSubmit={check.submit}
          className="grid border-t border-[var(--border)] md:grid-cols-12"
        >
          <div className="cell py-8 md:col-span-8 md:py-10">
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
                {check.loading ? "Checking…" : "Review this mint"}
              </button>
              <SampleButton check={check} />
            </div>
            <div className="mt-4">
              <FieldMessages check={check} />
            </div>
          </div>

          <div className="cell flex flex-col justify-between gap-8 border-t border-[var(--border)] py-8 md:col-span-4 md:border-l md:border-t-0 md:py-10">
            <p
              aria-label="1 free live check per day"
              className="font-mono-ui text-[clamp(4.5rem,9vw,7rem)] font-medium leading-[0.85] tracking-[-0.06em] text-[var(--accent)]"
            >
              <span aria-hidden>1</span>
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted)]">
              free live check per day, no account needed. Cached results are
              always free.
            </p>
          </div>
        </form>

        {check.error ? (
          <div className="cell border-t border-[var(--border)] py-4">
            <p role="alert" className="alert-error">
              {check.error}
            </p>
          </div>
        ) : null}

        {check.showPanel ? null : <SpecStrip ready={check.ready} />}

        <CheckResults check={check} where="page" />
      </div>

      {limitMint ? (
        <GuestLimitDialog mint={limitMint} onClose={() => setLimitMint(null)} />
      ) : null}
    </>
  );
}
