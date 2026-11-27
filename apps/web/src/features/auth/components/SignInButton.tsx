"use client";

import { useEffect, useState } from "react";
import { getPhantomProvider } from "../lib/phantom";
import { useSession } from "../session";
import { signInWithPhantom } from "../sign-in";

/**
 * Sign-in for visitors on public pages. Renders nothing once signed in:
 * the redirect to the dashboard happens in RedirectIfSignedIn.
 */
export function SignInButton() {
  const { user, loading, setUser } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    setHasPhantom(Boolean(getPhantomProvider()));
  }, []);

  async function onSignIn() {
    setBusy(true);
    setError(null);
    try {
      setUser(await signInWithPhantom());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  if (user) return null;

  // Reserve the button's space while the session loads, so the nav does not jump.
  if (loading) {
    return <span className="inline-block h-9 w-[4.5rem]" aria-hidden />;
  }

  return (
    <div className="flex flex-col items-end gap-1">
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
      {error ? (
        <p
          className="max-w-[14rem] text-right text-xs text-[var(--bad)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {!hasPhantom ? (
        <p className="max-w-[14rem] text-right text-xs text-[var(--muted)]">
          Phantom required
        </p>
      ) : null}
    </div>
  );
}
