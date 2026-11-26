"use client";

import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import type { CreditBalanceStatus } from "@/features/credits/use-credit-balance";

type Props = {
  balance: CreditBalance | null;
  status: CreditBalanceStatus;
  onRetry: () => void;
};

/**
 * What can be spent, shown above the member check form. The number comes from
 * `/credits/me` and is refreshed after each check, so it moves when a live
 * check spends a credit. The server still decides whether a check may run.
 */
export function CreditRail({ balance, status, onRetry }: Props) {
  if (!balance && status === "error") {
    return (
      <div
        role="alert"
        className="alert-error flex flex-wrap items-center gap-3"
      >
        <span>Credits could not be loaded. Your balance is unchanged.</span>
        <button
          type="button"
          className="btn btn-secondary btn-sm min-h-11"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!balance) {
    return (
      <section
        className="card flex min-h-[5.25rem] items-center gap-6 px-5 py-4"
        aria-busy="true"
        aria-label="Credits"
      >
        <p role="status" className="sr-only">
          Loading credits…
        </p>
        <div
          className="h-9 w-20 animate-pulse rounded bg-[var(--border)]"
          aria-hidden
        />
      </section>
    );
  }

  const { promo, topup } = balance;
  const total = promo.balance + topup.balance;
  const promoExpiry =
    promo.balance > 0 && promo.soonestExpiresAt !== null
      ? promo.soonestExpiresAt
      : null;

  return (
    <section
      className="card flex flex-wrap items-center gap-x-10 gap-y-4 px-5 py-4"
      aria-labelledby="credit-rail-title"
    >
      <div>
        <h2 id="credit-rail-title" className="text-xs text-[var(--muted)]">
          Available credits
        </h2>
        <p className="mt-1 text-3xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--fg)]">
          {total}
        </p>
      </div>

      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-[var(--muted)]">Promo</dt>
          <dd className="tabular-nums text-[var(--fg)]">
            {promo.balance}
            {promoExpiry ? (
              <span className="ml-1.5 text-xs text-[var(--muted)]">
                until {formatExpiry(promoExpiry)}
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--muted)]">Top-up</dt>
          <dd className="tabular-nums text-[var(--fg)]">{topup.balance}</dd>
        </div>
      </dl>

      <p className="max-w-xs text-sm leading-relaxed text-[var(--muted)] md:ml-auto">
        {total > 0
          ? "One credit per live check. Cached results are free."
          : "No credits left, so live checks are paused. Cached results stay free."}
      </p>
    </section>
  );
}
