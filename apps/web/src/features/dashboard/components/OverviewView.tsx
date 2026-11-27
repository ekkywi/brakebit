"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/session";
import type { CreditBalance } from "@/features/credits/api";
import { formatExpiry } from "@/features/credits/format";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { CreditCell } from "@/features/token-check/components/CreditCell";
import { SheetTitle } from "@/shared/ui/SheetTitle";
import { SpecStrip } from "@/shared/ui/SpecStrip";

/**
 * The job of this screen: see what can be spent, then run a check. It is the
 * same spec sheet as the check workspace, with the credit numeral in the same
 * cell. Everything below the numeral is support.
 */
export function OverviewView() {
  const { user } = useSession();
  const { balance, status, reload } = useCreditBalance(Boolean(user));

  return (
    <div className="sheet sheet--flush">
      <SheetTitle
        scale="app"
        meta={user?.walletAddress ?? "Solana wallet"}
        title="Your credits"
        note="Credits pay for live checks. Cached results and token search are free."
      />

      {status === "error" && balance ? (
        <div className="cell flex flex-wrap items-center gap-3 border-t border-[var(--border)] py-4">
          <p role="alert" className="alert-error flex-1">
            Credits could not be refreshed. Your balance is unchanged. Try again
            in a moment.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm min-h-11"
            onClick={() => void reload()}
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="grid border-t border-[var(--border)] md:grid-cols-12">
        <div className="cell flex flex-col justify-between gap-6 py-6 md:col-span-8 md:py-8">
          <Split balance={balance} loading={!balance && status !== "error"} />
          <div>
            <Link
              href="/dashboard/check"
              className="btn btn-primary w-full sm:w-auto"
            >
              Run a token check
            </Link>
          </div>
        </div>

        <CreditCell
          balance={balance}
          status={status}
          onRetry={() => void reload()}
          showBreakdown={false}
          className="md:col-span-4"
        />
      </div>

      <section aria-labelledby="credit-buys-title">
        <div className="cell border-t border-[var(--border)] py-6">
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
        </div>
        <SpecStrip ready={false} />
      </section>

      <section
        aria-labelledby="credit-rules-title"
        className="border-t border-[var(--border)]"
      >
        <div className="cell py-6">
          <h2
            id="credit-rules-title"
            className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]"
          >
            How credits work
          </h2>
        </div>
        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)] text-sm leading-relaxed text-[var(--muted)]">
          <li className="cell py-4">One live check uses one credit.</li>
          <li className="cell py-4">Cached results and token search are free.</li>
          <li className="cell py-4">
            Promo credits are used first, because they expire soonest.
          </li>
        </ul>
      </section>
    </div>
  );
}

/** Where the number comes from: top-up and promo, each with its own rule. */
function Split({
  balance,
  loading,
}: {
  balance: CreditBalance | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-hidden>
        <div className="h-12 w-full animate-pulse bg-[var(--border)]" />
        <div className="h-12 w-full animate-pulse bg-[var(--border)]" />
      </div>
    );
  }

  if (!balance) return <div />;

  const { promo, topup } = balance;
  const promoExpiry =
    promo.balance > 0 && promo.soonestExpiresAt !== null
      ? promo.soonestExpiresAt
      : null;

  return (
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
  );
}
