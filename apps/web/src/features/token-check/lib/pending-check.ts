import { isAddressReady } from "./address";

const STORAGE_KEY = "brakebit:pending-check";
const MAX_AGE_MS = 10 * 60_000;

type PendingCheck = {
  mint: string;
  savedAt: number;
};

/**
 * Remembers the mint a guest was checking when the free limit hit,
 * so the dashboard can offer to continue after sign-in.
 */
export function savePendingCheck(mint: string): void {
  try {
    const value: PendingCheck = { mint, savedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be blocked. The user just checks again by hand.
  }
}

/** Reads and clears the saved mint. Returns null when missing, expired, or invalid. */
export function takePendingCheck(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);

    const parsed = JSON.parse(raw) as Partial<PendingCheck>;
    if (typeof parsed.mint !== "string") return null;
    if (typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;

    return isAddressReady(parsed.mint) ? parsed.mint : null;
  } catch {
    return null;
  }
}
