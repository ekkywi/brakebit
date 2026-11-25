"use client";

import { useCallback, useState } from "react";
import type { ApiError } from "@/shared/api/client";
import { GuestLimitDialog } from "./GuestLimitDialog";
import { TokenCheckForm } from "./TokenCheckForm";

/** Check workspace for visitors without an account. One free live check per day. */
export function GuestCheck() {
  const [limitMint, setLimitMint] = useState<string | null>(null);
  const closeLimit = useCallback(() => setLimitMint(null), []);

  const handleApiError = useCallback(
    (error: ApiError, context: { mint: string }) => {
      if (error.code !== "guest_limit_reached") return false;
      setLimitMint(context.mint);
      return true;
    },
    [],
  );

  return (
    <>
      <TokenCheckForm
        notice="Without an account you get one free live check per day. Cached results are always free."
        onApiError={handleApiError}
      />
      {limitMint ? (
        <GuestLimitDialog mint={limitMint} onClose={closeLimit} />
      ) : null}
    </>
  );
}
