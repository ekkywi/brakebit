/** Short, locale-stable date for credit expiry, e.g. "2 Dec 2026". */
export function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
