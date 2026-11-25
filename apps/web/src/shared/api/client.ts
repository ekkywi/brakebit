import { getApiBaseUrl } from "@/shared/config/env";

/**
 * Error thrown for non-2xx API responses.
 * `code` is the machine-readable reason, for example `guest_limit_reached`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(message: string, status: number, code: string | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiRequestOptions = {
  method?: "GET" | "POST";
  query?: Record<string, string>;
  body?: unknown;
  fallbackError: string;
};

type ErrorBody = {
  code?: unknown;
  message?: unknown;
};

async function toApiError(
  response: Response,
  fallbackError: string,
): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as ErrorBody | null;
  const rawMessage = body?.message;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
  const code = typeof body?.code === "string" ? body.code : null;

  return new ApiError(
    typeof message === "string" && message.trim()
      ? message.trim()
      : fallbackError,
    response.status,
    code,
  );
}

/**
 * Single entry point for calls to the Nest API.
 * Always sends cookies (`credentials: "include"`) so the session is honoured.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<T> {
  const url = new URL(`${getApiBaseUrl()}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const hasBody = options.body !== undefined;
  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw await toApiError(response, options.fallbackError);
  }

  return (await response.json()) as T;
}
