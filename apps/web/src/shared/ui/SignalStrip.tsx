import { signalLabel } from "@/shared/content/product";

export type SignalStatus = "ok" | "warn" | "bad" | "unknown";

export type SignalStripItem = {
  /** Signal number, 1 to 6. */
  n: number;
  label: string;
  status: SignalStatus;
};

const STATUS_TEXT: Record<SignalStatus, string> = {
  ok: "Clear",
  warn: "Watch",
  bad: "Elevated",
  unknown: "Unknown",
};

export function signalStatusColor(status: SignalStatus): string {
  if (status === "ok") return "var(--ok)";
  if (status === "warn") return "var(--warn)";
  if (status === "bad") return "var(--bad)";
  return "var(--unknown)";
}

export function signalStatusText(status: SignalStatus): string {
  return STATUS_TEXT[status];
}

/**
 * One numbered square per signal, filled by its real status. The shape backs up
 * the color: outlined = clear, thick border = watch, solid = elevated, dashed =
 * unknown. Rows below the strip carry the same numbers and the status text.
 */
export function SignalStrip({ items }: { items: ReadonlyArray<SignalStripItem> }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">Signals at a glance</p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Signal summary">
        {items.map((item) => (
          <li
            key={item.n}
            className="sq-index sq-status"
            data-status={item.status}
          >
            <span aria-hidden>{signalLabel(item.n)}</span>
            <span className="sr-only">
              {signalLabel(item.n)} {item.label}: {STATUS_TEXT[item.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
