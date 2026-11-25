"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/session";
import { fetchCreditBalance, type CreditBalance } from "./api";

export type CreditBalanceStatus = "idle" | "loading" | "ready" | "error";

/**
 * Loads `/credits/me` while `enabled` is true, and again each time it turns on.
 * A missing session clears the shared user, and the dashboard shell then redirects to `/`.
 */
export function useCreditBalance(enabled: boolean) {
  const { setUser } = useSession();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [status, setStatus] = useState<CreditBalanceStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const result = await fetchCreditBalance();
      if (!result) {
        setUser(null);
        return;
      }
      setBalance(result);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load credits",
      );
      setStatus("error");
    }
  }, [setUser]);

  useEffect(() => {
    if (enabled) void reload();
  }, [enabled, reload]);

  return { balance, status, errorMessage, reload };
}
