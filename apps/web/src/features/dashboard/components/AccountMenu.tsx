"use client";

import { useEffect, useId, useRef, useState } from "react";
import { logoutAuth } from "@/features/auth/api";
import { useSession } from "@/features/auth/session";
import { formatExpiry } from "@/features/credits/format";
import { useCreditBalance } from "@/features/credits/use-credit-balance";
import { UserIcon } from "./icons";

export function AccountMenu() {
  const { user, loading, setUser } = useSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  // Balance is fetched only while the menu is open, so the header makes no extra request.
  const { balance, status, errorMessage, reload } = useCreditBalance(
    open && Boolean(user),
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) {
    // Same footprint as the button, so the header does not shift when the session arrives.
    return loading ? (
      <span
        aria-hidden
        className="block h-11 w-11 animate-pulse rounded-full border border-[var(--border)]"
      />
    ) : null;
  }

  async function onLogout() {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await logoutAuth();
      setOpen(false);
      // DashboardShell sees the missing user and redirects to "/".
      setUser(null);
    } catch (err) {
      setLogoutError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }

  const promoExpiry =
    balance && balance.promo.balance > 0 ? balance.promo.soonestExpiresAt : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Account menu"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <UserIcon size={18} />
      </button>

      {open ? (
        <div
          id={panelId}
          className="card absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(20rem,calc(100vw-2rem))] p-4"
        >
          <p className="text-xs text-[var(--muted)]">Wallet</p>
          <p className="font-mono-ui mt-1 break-all text-xs text-[var(--fg)]">
            {user.walletAddress}
          </p>

          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <p className="text-xs text-[var(--muted)]">Credits</p>

            {balance ? (
              <dl className="mt-2 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Top-up</dt>
                  <dd className="tabular-nums text-[var(--fg)]">
                    {balance.topup.balance}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Promo</dt>
                  <dd className="text-right tabular-nums text-[var(--fg)]">
                    {balance.promo.balance}
                    {promoExpiry ? (
                      <span className="block text-xs text-[var(--muted)]">
                        Expires {formatExpiry(promoExpiry)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>
            ) : status === "error" ? (
              <div role="alert" className="mt-2 space-y-2 text-sm">
                <p className="text-[var(--bad)]">{errorMessage}</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm min-h-11"
                  onClick={() => void reload()}
                >
                  Try again
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]" aria-live="polite">
                Loading…
              </p>
            )}
          </div>

          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              className="btn btn-secondary btn-sm min-h-11 w-full"
              onClick={() => void onLogout()}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
            {logoutError ? (
              <p role="alert" className="mt-2 text-xs text-[var(--bad)]">
                {logoutError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}