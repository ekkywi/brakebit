import type { CreateCheckRequest, RiskReport } from "@brakebit/shared";
import { getApiBaseUrl } from "@/shared/config/env";

export type TokenSearchHit = {
  mint: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
};

function readErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const message = (body as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message) && typeof message[0] === "string") {
    return message[0].trim();
  }
  return null;
}

export async function createTokenCheck(
  payload: CreateCheckRequest,
): Promise<RiskReport> {
  const response = await fetch(`${getApiBaseUrl()}/checks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    if (response.status === 429) {
      throw new Error(
        readErrorMessage(errorBody) ??
          "Too many checks from this network right now. Wait about a minute, then try again.",
      );
    }
    throw new Error(readErrorMessage(errorBody) ?? "Token check failed");
  }

  return response.json() as Promise<RiskReport>;
}

export async function searchTokens(query: string): Promise<TokenSearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL(`${getApiBaseUrl()}/tokens/search`);
  url.searchParams.set("q", q);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(readErrorMessage(errorBody) ?? "Token search failed");
  }

  const body = (await response.json()) as { results?: TokenSearchHit[] };
  return Array.isArray(body.results) ? body.results : [];
}
