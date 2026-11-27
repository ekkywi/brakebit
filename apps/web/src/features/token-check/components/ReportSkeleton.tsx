import type { CSSProperties } from "react";
import { SIGNALS, signalLabel } from "@/shared/content/product";

/**
 * Loading state of the report. The six squares light in order while the check
 * runs, so the wait shows the same signals the report will fill in. The motion
 * ends when the report replaces this panel.
 */
export function ReportSkeleton() {
  return (
    <section
      className="card overflow-hidden"
      aria-busy="true"
      aria-label="Preparing risk report"
    >
      <div className="instrument-face p-6">
        <p className="text-xs text-white/55">Reading signals…</p>
        <div className="mt-4 h-14 w-28 animate-pulse bg-white/10" />
        <div className="mt-4 h-4 w-36 animate-pulse bg-white/10" />
        <div className="score-bar mt-4 max-w-md">
          <span className="w-1/3 animate-pulse bg-white/25" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-3 max-w-xl animate-pulse bg-white/10" />
          <div className="h-3 max-w-md animate-pulse bg-white/10" />
        </div>
      </div>

      <div className="border-b border-[var(--border)] px-6 py-4">
        <p className="text-xs text-[var(--muted)]">Signals at a glance</p>
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-hidden>
          {SIGNALS.map((signal, index) => (
            <li
              key={signal.key}
              className="sq-index sq-scan"
              style={{ "--i": index } as CSSProperties}
            >
              {signalLabel(index + 1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6">
        <p className="text-sm font-medium text-[var(--fg)]">Findings</p>
        <ul className="mt-4 space-y-4">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse bg-[var(--border)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-[40%] animate-pulse bg-[var(--border)]" />
                <div className="h-3 w-[80%] animate-pulse bg-[var(--border)]" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[var(--border)] p-6">
        <p className="text-sm font-medium text-[var(--fg)]">Signals</p>
        <ul className="mt-3 divide-y divide-[var(--border)]">
          {SIGNALS.map((signal, index) => (
            <li
              key={signal.key}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
                <span className="sq-index sq-index--sm">
                  {signalLabel(index + 1)}
                </span>
                {signal.field}
              </span>
              <span className="h-3 w-16 animate-pulse bg-[var(--border)]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
