import { ApiError, apiRequest } from "@/shared/api/client";

export type AuthUser = {
  id: string;
  walletAddress: string;
};

/** Returns null when there is no valid session (401). */
export async function fetchAuthMe(): Promise<AuthUser | null> {
  try {
    const body = await apiRequest<{ user?: AuthUser }>("/auth/me", {
      fallbackError: "Failed to load session",
    });
    return body.user ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function requestSignInNonce(
  address: string,
): Promise<{ message: string; nonce: string }> {
  const body = await apiRequest<{ message?: string; nonce?: string }>(
    "/auth/solana/nonce",
    {
      method: "POST",
      body: { address },
      fallbackError: "Failed to start sign-in",
    },
  );

  if (!body.message || !body.nonce) {
    throw new Error("Invalid nonce response");
  }
  return { message: body.message, nonce: body.nonce };
}

export async function verifySignIn(input: {
  address: string;
  message: string;
  signature: string;
}): Promise<AuthUser> {
  const body = await apiRequest<{ user?: AuthUser }>("/auth/solana/verify", {
    method: "POST",
    body: input,
    fallbackError: "Sign-in failed",
  });

  if (!body.user?.walletAddress) {
    throw new Error("Sign-in response missing user");
  }
  return body.user;
}

export async function logoutAuth(): Promise<void> {
  await apiRequest<{ ok?: boolean }>("/auth/logout", {
    method: "POST",
    fallbackError: "Logout failed",
  });
}
