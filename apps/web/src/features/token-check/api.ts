import type { CreateCheckRequest, RiskReport } from "@brakebit/shared";
import { getApiBaseUrl } from "@/shared/config/env";

export async function createTokenCheck(
  payload: CreateCheckRequest,
): Promise<RiskReport> {
  const response = await fetch(`${getApiBaseUrl()}/checks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(errorBody?.message ?? "Token check failed");
  }

  return response.json() as Promise<RiskReport>;
}
