"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/session";
import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import { useCreditBalance } from "@/features/credits/use-credit-balance";

export function OverviewView() {
  const { user } = useSession();
  const { balance, status, errorMessage, reload } = useCreditBalance(
    Boolean(user),
  );

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)]">
          Overview
        </h1>
        {user ? (
          <p className="font-mono-ui mt-1 break-all text-xs text-[var(--muted)]">
            {user.walletAddress}
          </p>
        ) : null}
      </header>

      {status === "loading" && !balance ? (
        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          Loading credits…
        </p>
      ) : null}

      {status === "error" ? (
        <div
          role="alert"
          className="alert-error flex flex-wrap items-center gap-3"
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm min-h-11"
            onClick={() => void reload()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {balance ? <CreditCards balance={balance} /> : null}

      <div className="card p-5">
        <p className="font-medium text-[var(--fg)]">How credits work</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <li>One live check uses one credit.</li>
          <li>Cached results and token search are free.</li>
          <li>Promo credits are used first, because they expire soonest.</li>
        </ul>
      </div>

      <Link href="/dashboard/check" className="btn btn-primary btn-sm min-h-11">
        Run a token check
      </Link>
    </div>
  );
}

function CreditCards({ balance }: { balance: CreditBalance }) {
  const { promo, topup } = balance;
  const hasPromoExpiry = promo.balance > 0 && promo.soonestExpiresAt !== null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="card p-5" aria-labelledby="topup-credits-title">
        <h2
          id="topup-credits-title"
          className="text-sm font-medium text-[var(--muted)]"
        >
          Top-up credits
        </h2>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--fg)]">
          {topup.balance}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Bought with crypto and never expire. Top-up is not available yet.
        </p>
      </section>

      <section className="card p-5" aria-labelledby="promo-credits-title">
        <h2
          id="promo-credits-title"
          className="text-sm font-medium text-[var(--muted)]"
        >
          Promo credits
        </h2>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--fg)]">
          {promo.balance}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {hasPromoExpiry && promo.soonestExpiresAt
            ? `Soonest expiry: ${formatExpiry(promo.soonestExpiresAt)}`
            : "No active promo credits."}
        </p>
      </section>
    </div>
  );
}
