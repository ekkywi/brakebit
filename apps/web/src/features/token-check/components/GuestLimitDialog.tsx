"use client";

import { useRef, useState } from "react";
import { useSession } from "@/features/auth/session";
import { signInWithPhantom } from "@/features/auth/sign-in";
import { Dialog } from "@/shared/ui/Dialog";
import { savePendingCheck } from "../lib/pending-check";

type Props = {
  /** The mint the guest was checking. It is offered again after sign-in. */
  mint: string;
  onClose: () => void;
};

/**
 * Shown when a guest has used today's free check.
 * After sign-in, the session change sends the user to the dashboard (see RedirectIfSignedIn).
 */
export function GuestLimitDialog({ mint, onClose }: Props) {
  const { setUser } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  async function onSignIn() {
    setBusy(true);
    setError(null);
    try {
      const user = await signInWithPhantom();
      // Save before the session changes, because that change triggers the redirect.
      savePendingCheck(mint);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <Dialog
      title="Today's free check is used"
      description="Guests get one free live check per day. Sign in with Phantom to keep checking with your credits. You will land in your dashboard and can continue this check there."
      onClose={onClose}
      dismissible={!busy}
      initialFocusRef={primaryRef}
    >
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          ref={primaryRef}
          type="button"
          className="btn btn-primary btn-sm min-h-11"
          onClick={() => void onSignIn()}
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in with Phantom"}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm min-h-11"
          onClick={onClose}
          disabled={busy}
        >
          Not now
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-[var(--bad)]">
          {error}
        </p>
      ) : null}
    </Dialog>
  );
}
