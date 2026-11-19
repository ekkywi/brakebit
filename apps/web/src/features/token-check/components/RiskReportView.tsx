import type { RiskLevel, RiskReport } from "@brakebit/shared";
import { chainLabel, levelLabel } from "../lib/format";

type Props = {
  report: RiskReport;
};

function levelColor(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "var(--ok)";
    case "medium":
      return "var(--warn)";
    case "high":
    case "critical":
      return "var(--bad)";
    default:
      return "var(--unknown)";
  }
}

function scoreTone(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "#7DCFB6";
    case "medium":
      return "#F0C36A";
    case "high":
    case "critical":
      return "#F0A8A0";
    default:
      return "#EDEDED";
  }
}

function statusColor(status: string): string {
  if (status === "ok") return "var(--ok)";
  if (status === "warn") return "var(--warn)";
  if (status === "bad") return "var(--bad)";
  return "var(--unknown)";
}

function statusLabel(status: string): string {
  if (status === "ok") return "Clear";
  if (status === "warn") return "Watch";
  if (status === "bad") return "Elevated";
  return "Unknown";
}

export function RiskReportView({ report }: Props) {
  const tone = scoreTone(report.level);
  const checkedLocal = new Date(report.checkedAt).toLocaleString();

  return (
    <section className="report-in card overflow-hidden">
      <div className="instrument-face p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/55">Risk score</p>
            <p
              className="mt-2 text-6xl font-semibold leading-none tracking-[-0.04em]"
              style={{ color: tone }}
            >
              {report.score}
            </p>
          </div>
          <p className="text-xs text-white/50">{checkedLocal}</p>
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: tone }}>
          {levelLabel(report.level)}
        </p>
        <div className="score-bar mt-3 max-w-md">
          <span style={{ width: `${report.score}%`, background: tone }} />
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
          {report.summary}
        </p>
        <p className="font-mono-ui mt-4 break-all text-xs text-white/45">
          {chainLabel(report.chain)} · {report.address}
        </p>
      </div>

      <div className="p-6">
        <h2 className="text-sm font-medium text-[var(--fg)]">Findings</h2>
        <ul className="mt-4 space-y-4">
          {report.reasons.map((reason) => (
            <li key={reason.code} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: levelColor(reason.severity) }}
              />
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">
                  {reason.title}
                  <span
                    className="ml-2 text-xs font-normal capitalize"
                    style={{ color: levelColor(reason.severity) }}
                  >
                    {reason.severity}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {reason.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[var(--border)] p-6">
        <h2 className="text-sm font-medium text-[var(--fg)]">Signals</h2>
        <ul className="mt-3 divide-y divide-[var(--border)]">
          {report.signals.map((signal) => (
            <li
              key={signal.key}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-sm text-[var(--ink-soft)]">
                {signal.label}
              </span>
              <span className="flex items-center gap-3">
                <span
                  className="text-xs"
                  style={{ color: statusColor(signal.status) }}
                >
                  {statusLabel(signal.status)}
                </span>
                <span
                  className="font-mono-ui text-sm"
                  style={{ color: statusColor(signal.status) }}
                >
                  {signal.value === null ? "Unknown" : String(signal.value)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="space-y-1 border-t border-[var(--border)] bg-[var(--subtle)] px-6 py-4 text-xs text-[var(--muted)]">
        <p>Sources: {report.sources.join(", ")}</p>
        <p>{report.freshnessNote}</p>
        <p className="pt-1 text-[var(--ink-soft)]">{report.disclaimer}</p>
      </footer>
    </section>
  );
}
