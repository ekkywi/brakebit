import { getApiBaseUrl } from "@/shared/config/env";

export type AuthUser = {
  id: string;
  walletAddress: string;
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

async function parseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export async function fetchAuthMe(): Promise<AuthUser | null> {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    const body = await parseJson(response);
    throw new Error(readErrorMessage(body) ?? "Failed to load session");
  }

  const body = (await parseJson(response)) as { user?: AuthUser };
  return body.user ?? null;
}

export async function requestSignInNonce(
  address: string,
): Promise<{ message: string; nonce: string }> {
  const response = await fetch(`${getApiBaseUrl()}/auth/solana/nonce`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  const body = await parseJson(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(body) ?? "Failed to start sign-in");
  }

  const parsed = body as { message?: string; nonce?: string };
  if (!parsed.message || !parsed.nonce) {
    throw new Error("Invalid nonce response");
  }
  return { message: parsed.message, nonce: parsed.nonce };
}

export async function verifySignIn(input: {
  address: string;
  message: string;
  signature: string;
}): Promise<AuthUser> {
  const response = await fetch(`${getApiBaseUrl()}/auth/solana/verify`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const body = await parseJson(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(body) ?? "Sign-in failed");
  }

  const user = (body as { user?: AuthUser }).user;
  if (!user?.walletAddress) {
    throw new Error("Sign-in response missing user");
  }
  return user;
}

export async function logoutAuth(): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await parseJson(response);
    throw new Error(readErrorMessage(body) ?? "Logout failed");
  }
}
