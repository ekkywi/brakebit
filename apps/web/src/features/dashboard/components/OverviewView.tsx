"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/session";
import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { SIGNALS, signalLabel } from "@/shared/content/product";

/**
 * The job of this screen: see what can be spent, then run a check.
 * The credit block leads; everything else is support.
 */
export function OverviewView() {
  const { user } = useSession();
  const { balance, status, errorMessage, reload } = useCreditBalance(
    Boolean(user),
  );

  return (
    <div className="max-w-4xl space-y-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)]">
          Your credits
        </h1>
        {user ? (
          <p className="font-mono-ui mt-1 break-all text-xs text-[var(--muted)]">
            {user.walletAddress}
          </p>
        ) : null}
      </header>

      {status === "error" ? (
        <div
          role="alert"
          className="alert-error flex flex-wrap items-center gap-3"
        >
          <span>
            {errorMessage ?? "Credits could not be loaded."} Your balance is
            unchanged. Try again in a moment.
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm min-h-11"
            onClick={() => void reload()}
          >
            Try again
          </button>
        </div>
      ) : null}

      <CreditBlock balance={balance} loading={!balance && status !== "error"} />

      <section aria-labelledby="credit-buys-title">
        <h2
          id="credit-buys-title"
          className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]"
        >
          What one credit buys
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          A live check covers these six signals. A signal the chain does not
          give enough data for shows as Unknown. Cached results cost nothing.
        </p>
        <ul className="mt-6 grid gap-x-8 gap-y-5 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((signal, index) => (
            <li key={signal.key} className="flex gap-3">
              <span className="sq-index">{signalLabel(index + 1)}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--fg)]">
                  {signal.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                  {signal.brief}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="credit-rules-title">
        <h2
          id="credit-rules-title"
          className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]"
        >
          How credits work
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <li>One live check uses one credit.</li>
          <li>Cached results and token search are free.</li>
          <li>Promo credits are used first, because they expire soonest.</li>
        </ul>
      </section>
    </div>
  );
}

function CreditBlock({
  balance,
  loading,
}: {
  balance: CreditBalance | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <section
        className="card p-6 md:p-8"
        aria-busy="true"
        aria-labelledby="credits-total-title"
      >
        <h2 id="credits-total-title" className="text-sm text-[var(--muted)]">
          Available credits
        </h2>
        <p role="status" className="sr-only">
          Loading credits…
        </p>
        <div
          className="mt-3 h-14 w-24 animate-pulse rounded bg-[var(--border)]"
          aria-hidden
        />
        <div
          className="mt-6 h-11 w-44 animate-pulse rounded-full bg-[var(--border)]"
          aria-hidden
        />
      </section>
    );
  }

  if (!balance) return null;

  const { promo, topup } = balance;
  const total = promo.balance + topup.balance;
  const promoExpiry =
    promo.balance > 0 && promo.soonestExpiresAt !== null
      ? promo.soonestExpiresAt
      : null;

  return (
    <section
      className="card grid gap-8 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:p-8"
      aria-labelledby="credits-total-title"
    >
      <div>
        <h2 id="credits-total-title" className="text-sm text-[var(--muted)]">
          Available credits
        </h2>
        <p className="mt-2 text-6xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--fg)]">
          {total}
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {total > 0
            ? "One credit runs one live check."
            : "No credits left. Top-up is not available yet, so live checks are paused. Cached results stay free."}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-6">
        <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)] text-sm">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt>
              <span className="text-[var(--fg)]">Top-up</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">
                Never expires. Top-up is not available yet.
              </span>
            </dt>
            <dd className="tabular-nums text-[var(--fg)]">{topup.balance}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt>
              <span className="text-[var(--fg)]">Promo</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">
                {promoExpiry
                  ? `Soonest expiry: ${formatExpiry(promoExpiry)}`
                  : "No active promo credits."}
              </span>
            </dt>
            <dd className="tabular-nums text-[var(--fg)]">{promo.balance}</dd>
          </div>
        </dl>

        <div>
          <Link
            href="/dashboard/check"
            className="btn btn-primary w-full sm:w-auto"
          >
            Run a token check
          </Link>
        </div>
      </div>
    </section>
  );
}
