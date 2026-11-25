import type { CreateCheckRequest, RiskReport } from "@brakebit/shared";
import { apiRequest } from "@/shared/api/client";

export type TokenSearchHit = {
  mint: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
};

export type RecentCheckItem = {
  id: string;
  address: string;
  chain: string;
  score: number;
  level: string;
  summary: string;
  createdAt: string;
  token: {
    name: string | null;
    symbol: string | null;
    imageUrl: string | null;
  } | null;
};

export function createTokenCheck(
  payload: CreateCheckRequest,
): Promise<RiskReport> {
  return apiRequest<RiskReport>("/checks", {
    method: "POST",
    body: payload,
    fallbackError: "Token check failed",
  });
}

export async function searchTokens(query: string): Promise<TokenSearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const body = await apiRequest<{ results?: TokenSearchHit[] }>(
    "/tokens/search",
    { query: { q }, fallbackError: "Token search failed" },
  );
  return Array.isArray(body.results) ? body.results : [];
}

export async function fetchRecentChecks(
  limit = 5,
): Promise<RecentCheckItem[]> {
  const body = await apiRequest<{ results?: RecentCheckItem[] }>(
    "/checks/recent",
    {
      query: { limit: String(limit) },
      fallbackError: "Failed to load recent checks",
    },
  );
  return Array.isArray(body.results) ? body.results : [];
}
