import { signalLabel } from "@/shared/content/product";
import {
  SignalStrip,
  signalStatusColor,
  type SignalStatus,
} from "./SignalStrip";

/**
 * Landing sample report. Figures are illustrative only.
 * Shape mirrors RiskReportView: score face, findings, signals, sources.
 * Content mirrors Solana-first live signals (not EVM / invented LP locks).
 */
export function FieldReportPreview() {
  const findings = [
    {
      title: "Mint authority still active",
      severity: "high",
      color: "var(--bad)",
      detail: "Supply can still change after launch.",
    },
    {
      title: "Top holder share is elevated",
      severity: "medium",
      color: "var(--warn)",
      detail: "A large share of supply sits with one account.",
    },
  ];

  const signals: ReadonlyArray<{
    label: string;
    value: string;
    status: SignalStatus;
    reason?: string;
  }> = [
    { label: "Mint authority", value: "Active", status: "bad" },
    { label: "Freeze authority", value: "Clear", status: "ok" },
    {
      label: "LP lock/burn",
      value: "Unknown",
      status: "unknown",
      reason: "A pool shows a partial locked share that is not verified yet.",
    },
    { label: "Top holder %", value: "24%", status: "warn" },
    { label: "Liquidity (USD)", value: "$763K", status: "ok" },
    { label: "Age (hours)", value: "5400", status: "ok" },
  ];

  return (
    <aside
      aria-label="Illustrative example of a Brakebit risk report"
      className="card card-elevated overflow-hidden text-left"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--subtle)] px-5 py-3">
        <p className="text-xs text-[var(--muted)]">Example report</p>
        <p className="font-mono-ui text-xs text-[var(--accent)]">
          Solana · illustrative
        </p>
      </div>

      <div className="instrument-face p-6" data-part="score">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/55">Risk score</p>
            <p className="mt-2 text-6xl font-semibold leading-none tracking-[-0.04em] text-[#F0C36A]">
              45
            </p>
          </div>
          <p className="text-xs text-white/60">Sample · 5 of 6 signals read</p>
        </div>
        <p className="mt-4 text-sm font-medium text-[#F0C36A]">Elevated risk</p>
        <div className="score-bar mt-3 max-w-md">
          <span className="w-[45%] bg-[#F0C36A]" />
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
          Mint authority is active and top-holder concentration is elevated.
        </p>
        <div className="mt-5 flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-xs font-medium text-white/55"
          >
            BK
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">
              Bonk
              <span className="ml-2 font-normal text-white/55">BONK</span>
            </p>
            <p className="font-mono-ui mt-1 break-all text-xs text-white/55">
              Solana · DezXAZ…B263
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border)] px-6 py-4" data-part="strip">
        <SignalStrip
          items={signals.map((signal, index) => ({
            n: index + 1,
            label: signal.label,
            status: signal.status,
          }))}
        />
      </div>

      <div className="p-6" data-part="findings">
        <p className="text-sm font-medium text-[var(--fg)]">Findings</p>
        <ul className="mt-4 space-y-4">
          {findings.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">
                  {item.title}
                  <span
                    className="ml-2 text-xs font-normal capitalize"
                    style={{ color: item.color }}
                  >
                    {item.severity}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[var(--border)] p-6" data-part="findings">
        <p className="text-sm font-medium text-[var(--fg)]">Signals</p>
        <ul className="mt-3 divide-y divide-[var(--border)]">
          {signals.map((signal, index) => (
            <li
              key={signal.label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="flex items-start gap-3 text-sm text-[var(--ink-soft)]">
                <span className="sq-index sq-index--sm">
                  {signalLabel(index + 1)}
                </span>
                <span className="min-w-0">
                  <span className="block">{signal.label}</span>
                  {signal.reason ? (
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--muted)]">
                      {signal.reason}
                    </span>
                  ) : null}
                </span>
              </span>
              <span
                className="font-mono-ui text-sm"
                style={{ color: signalStatusColor(signal.status) }}
              >
                {signal.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <footer
        className="border-t border-[var(--border)] bg-[var(--subtle)] px-6 py-4 text-xs text-[var(--muted)]"
        data-part="findings"
      >
        <p>Sources: solana-rpc · illustrative</p>
        <p className="mt-1">
          Illustrative figures only. Not a live assessment of any token.
        </p>
      </footer>
    </aside>
  );
}
