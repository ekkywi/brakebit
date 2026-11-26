"use client";

import { useState } from "react";
import type { ApiError } from "@/shared/api/client";
import { SpecStrip } from "@/shared/ui/SpecStrip";
import { useTokenCheck } from "../hooks/use-token-check";
import { FieldMessages, MintField, SearchField } from "./CheckFields";
import { GuestLimitDialog } from "./GuestLimitDialog";
import { RecentChecks } from "./RecentChecks";
import { ReportPanel } from "./ReportPanel";

/**
 * Check workspace for visitors without an account: one free live check per day.
 * It is laid out as the landing is, one spec sheet split by hairlines, so a
 * visitor sees the same product they were sold. The member workspace
 * (`MemberCheck`) is deliberately a different screen: an app work area.
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
        <div className="cell anim-rise grid gap-6 pb-8 pt-10 md:grid-cols-12 md:items-end md:pb-10 md:pt-14">
          <div className="md:col-span-8">
            <p className="font-mono-ui text-xs text-[var(--muted)]">
              Solana · read-only · never asks for keys
            </p>
            <h1
              aria-label="Review a mint."
              className="mt-5 text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--fg)]"
            >
              <span aria-hidden>
                Review a mint
                <span className="stop" />
              </span>
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)] md:col-span-4">
            Search by name or paste a mint. Reviewed tokens are listed below,
            and the report opens beside them on desktop.
          </p>
        </div>

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
              <button
                type="button"
                onClick={check.loadSample}
                className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--fg)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
              >
                Try the BONK example
              </button>
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

        {/* The list keeps its place when the report opens beside it, so it is not reloaded. */}
        <div
          className={
            check.showPanel
              ? "grid border-t border-[var(--border)] lg:grid-cols-12"
              : "border-t border-[var(--border)]"
          }
        >
          <div
            className={
              check.showPanel
                ? "min-w-0 lg:col-span-7 lg:border-r lg:border-[var(--border)]"
                : "min-w-0"
            }
          >
            <RecentChecks
              variant="sheet"
              onSelect={check.pickRecent}
              refreshToken={check.recentRefresh}
              selectedAddress={check.address}
            />
          </div>
          {check.showPanel ? (
            <ReportPanel
              check={check}
              className="cell min-w-0 border-t border-[var(--border)] py-6 lg:sticky lg:top-20 lg:col-span-5 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-auto lg:border-t-0"
            />
          ) : null}
        </div>
      </div>

      {limitMint ? (
        <GuestLimitDialog mint={limitMint} onClose={() => setLimitMint(null)} />
      ) : null}
    </>
  );
}
