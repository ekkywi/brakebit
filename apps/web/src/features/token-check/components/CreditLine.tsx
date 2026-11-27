"use client";

import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import type { CreditBalanceStatus } from "@/features/credits/use-credit-balance";

type Props = {
  balance: CreditBalance | null;
  status: CreditBalanceStatus;
  onRetry: () => void;
};

const ROW = "cell border-b border-[var(--border)] py-3";

/**
 * What can be spent, as one row of data above the check form. The numbers come
 * from `/credits/me` and are read again after each check, so a spent or refunded
 * credit shows at once. The server still decides whether a check may run.
 * Loading and error are separate states, so neither shows a false 0.
 */
export function CreditLine({ balance, status, onRetry }: Props) {
  if (!balance && status === "error") {
    return (
      <div className={ROW}>
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
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={ROW} aria-busy="true">
        <p role="status" className="sr-only">
          Loading credits…
        </p>
        <div
          className="h-5 w-64 max-w-full animate-pulse bg-[var(--border)]"
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
    <div className={ROW}>
      <dl className="grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
        <Block label="Credits" value={total} />
        <Block
          label="Promo"
          value={promo.balance}
          note={promoExpiry ? `until ${formatExpiry(promoExpiry)}` : undefined}
        />
        <Block label="Top-up" value={topup.balance} />
      </dl>
      {total === 0 ? (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Live checks are paused. Cached results stay free.
        </p>
      ) : null}
    </div>
  );
}

/** One square data block. The 1px gaps in the parent grid draw the shared hairlines. */
function Block({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 bg-[var(--bg)] px-4 py-3">
      <dt className="text-xs text-[var(--muted)]">
        {label}
        {note ? <span className="ml-1.5">{note}</span> : null}
      </dt>
      <dd className="font-mono-ui text-lg font-semibold tabular-nums text-[var(--fg)]">
        {value}
      </dd>
    </div>
  );
}
