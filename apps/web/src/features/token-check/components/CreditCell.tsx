"use client";

import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import type { CreditBalanceStatus } from "@/features/credits/use-credit-balance";

type Props = {
  balance: CreditBalance | null;
  status: CreditBalanceStatus;
  onRetry: () => void;
  /** List the promo and top-up split under the number. Off where the page already lists it. */
  showBreakdown?: boolean;
  /** Column placement from the parent grid, for example `md:col-span-4`. */
  className?: string;
};

const CELL =
  "cell flex flex-col justify-between gap-6 border-t border-[var(--border)] py-6 md:border-l md:border-t-0 md:py-8";

/**
 * The numeral cell for what can be spent. It sits where the public workspace
 * shows its "1 free check", so the two screens answer the same question in the
 * same place. The number comes from `/credits/me` and is read again after each
 * check. The server still decides whether a check may run.
 */
export function CreditCell({
  balance,
  status,
  onRetry,
  showBreakdown = true,
  className = "",
}: Props) {
  if (!balance && status === "error") {
    return (
      <div className={`${CELL} ${className}`}>
        <div role="alert" className="alert-error space-y-3">
          <p>Credits could not be loaded. Your balance is unchanged.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm min-h-11"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={`${CELL} ${className}`} aria-busy="true">
        <p role="status" className="sr-only">
          Loading credits…
        </p>
        <div
          className="h-[4.5rem] w-24 animate-pulse bg-[var(--border)]"
          aria-hidden
        />
        <div
          className="h-4 w-40 animate-pulse bg-[var(--border)]"
          aria-hidden
        />
      </div>
    );
  }

  const { promo, topup } = balance;
  const total = promo.balance + topup.balance;
  const promoExpiry =
    promo.balance > 0 && promo.soonestExpiresAt !== null
      ? promo.soonestExpiresAt
      : null;

  return (
    <div className={`${CELL} ${className}`}>
      <p className="font-mono-ui text-[2.5rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-[var(--accent)]">
        <span aria-hidden>{total}</span>
        <span className="sr-only">
          {total} {total === 1 ? "credit" : "credits"} available
        </span>
      </p>

      <div className="space-y-4">
        <p className="text-[15px] leading-relaxed text-[var(--muted)]">
          <span className="text-[var(--fg)]">
            {total === 1 ? "credit" : "credits"} available.
          </span>{" "}
          {total > 0
            ? "One credit per live check. Cached results are free."
            : "Live checks are paused. Cached results stay free."}
        </p>

        {showBreakdown ? (
          <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)] text-sm">
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-[var(--muted)]">
                Promo
                {promoExpiry ? ` until ${formatExpiry(promoExpiry)}` : ""}
              </dt>
              <dd className="tabular-nums text-[var(--fg)]">{promo.balance}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-[var(--muted)]">Top-up</dt>
              <dd className="tabular-nums text-[var(--fg)]">{topup.balance}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  );
}
