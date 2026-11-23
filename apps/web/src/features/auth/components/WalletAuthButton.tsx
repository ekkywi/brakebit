"use client";

import { useEffect, useState } from "react";
import bs58 from "bs58";
import {
  fetchAuthMe,
  logoutAuth,
  requestSignInNonce,
  verifySignIn,
  type AuthUser,
} from "../api";
import { connectPhantom, getPhantomProvider, signUtf8Message } from "../lib/phantom";
import { shortAddress } from "../lib/short-address";

export function WalletAuthButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    setHasPhantom(Boolean(getPhantomProvider()));

    let cancelled = false;
    void fetchAuthMe()
      .then((sessionUser) => {
        if (!cancelled) setUser(sessionUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onSignIn() {
    setBusy(true);
    setError(null);
    try {
      const address = await connectPhantom();
      const { message } = await requestSignInNonce(address);
      const signatureBytes = await signUtf8Message(message);
      const nextUser = await verifySignIn({
        address,
        message,
        signature: bs58.encode(signatureBytes),
      });
      setUser(nextUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    setBusy(true);
    setError(null);
    try {
      await logoutAuth();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <span className="nav-link text-xs" aria-live="polite">
        …
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {user ? (
        <div className="flex items-center gap-2">
          <span
            className="font-mono-ui hidden text-xs text-[var(--muted)] sm:inline"
            title={user.walletAddress}
          >
            {shortAddress(user.walletAddress)}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => void onLogout()}
            disabled={busy}
          >
            {busy ? "…" : "Log out"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => void onSignIn()}
          disabled={busy || !hasPhantom}
          title={
            hasPhantom
              ? "Sign in with Phantom"
              : "Install the Phantom browser extension to sign in"
          }
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      )}
      {error ? (
        <p className="max-w-[14rem] text-right text-[11px] text-[var(--bad)]" role="alert">
          {error}
        </p>
      ) : null}
      {!user && !hasPhantom ? (
        <p className="max-w-[14rem] text-right text-[11px] text-[var(--muted)]">
          Phantom required
        </p>
      ) : null}
    </div>
  );
}
