import { ApiError, apiRequest } from "@/shared/api/client";

export type CreditBalance = {
  topup: { balance: number };
  promo: { balance: number; soonestExpiresAt: string | null };
};

/** Returns null when there is no valid session. */
export async function fetchCreditBalance(): Promise<CreditBalance | null> {
  try {
    return await apiRequest<CreditBalance>("/credits/me", {
      fallbackError: "Failed to load credits",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
