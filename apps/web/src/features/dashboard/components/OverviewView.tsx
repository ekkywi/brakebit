"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/session";
import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import { useCreditBalance } from "@/features/credits/use-credit-balance";

/**
 * The job of this screen: see what can be spent, then run a check. It holds the
 * balance, the action, and the credit rules, and nothing that explains the product.
 */
export function OverviewView() {
  const { user } = useSession();
  const { balance, status, reload } = useCreditBalance(Boolean(user));

  return (
    <div className="sheet sheet--flush">
      <h1 className="sr-only">Your credits</h1>

      <section aria-labelledby="credits-heading" className="cell py-6 md:py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            id="credits-heading"
            className="text-base font-semibold text-[var(--fg)]"
          >
            Credits
          </h2>
          {user ? (
            <p className="font-mono-ui break-all text-xs text-[var(--muted)]">
              {user.walletAddress}
            </p>
          ) : null}
        </div>

        {status === "error" ? (
          <div
            role="alert"
            className="alert-error mt-4 flex flex-wrap items-center gap-3"
          >
            <span>
              Credits could not be loaded. Your balance is unchanged. Try again
              in a moment.
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

        {balance ? (
          <Balance balance={balance} />
        ) : status !== "error" ? (
          <div className="mt-4" aria-busy="true">
            <p role="status" className="sr-only">
              Loading credits…
            </p>
            <div
              className="h-36 animate-pulse border-y border-[var(--border)] bg-[var(--subtle)]"
              aria-hidden
            />
          </div>
        ) : null}

        <div className="mt-6">
          <Link
            href="/dashboard/check"
            className="btn btn-primary w-full sm:w-auto"
          >
            Run a token check
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="credit-rules-title"
        className="border-t border-[var(--border)]"
      >
        <div className="cell pb-3 pt-5">
          <h2
            id="credit-rules-title"
            className="text-base font-semibold text-[var(--fg)]"
          >
            How credits work
          </h2>
        </div>
        <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)] text-sm text-[var(--muted)]">
          <li className="cell py-3">One live check uses one credit.</li>
          <li className="cell py-3">Cached results and token search are free.</li>
          <li className="cell py-3">
            Promo credits are used first, because they expire soonest.
          </li>
        </ul>
      </section>
    </div>
  );
}

/** The total, then where it comes from: top-up and promo, each with its own rule. */
function Balance({ balance }: { balance: CreditBalance }) {
  const { promo, topup } = balance;
  const total = promo.balance + topup.balance;
  const promoExpiry =
    promo.balance > 0 && promo.soonestExpiresAt !== null
      ? promo.soonestExpiresAt
      : null;

  return (
    <>
      <dl className="mt-4 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
        <Block label="Available" value={total} note="One credit runs one live check." />
        <Block
          label="Top-up"
          value={topup.balance}
          note="Never expires. Top-up is not available yet."
        />
        <Block
          label="Promo"
          value={promo.balance}
          note={
            promoExpiry
              ? `Soonest expiry: ${formatExpiry(promoExpiry)}`
              : "No active promo credits."
          }
        />
      </dl>
      {total === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          No credits left. Top-up is not available yet, so live checks are
          paused. Cached results stay free.
        </p>
      ) : null}
    </>
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
  note: string;
}) {
  return (
    <div className="flex min-h-28 flex-col justify-between gap-4 bg-[var(--bg)] p-4">
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <div>
        <dd className="font-mono-ui text-2xl font-semibold tabular-nums text-[var(--fg)]">
          {value}
        </dd>
        <dd className="mt-1 text-xs text-[var(--muted)]">{note}</dd>
      </div>
    </div>
  );
}
