"use client";

import { useState } from "react";
import type { RiskLevel, RiskReport } from "@brakebit/shared";
import { explorerName, explorerTokenUrl } from "../lib/explorer";
import { chainLabel, levelLabel } from "../lib/format";

type Props = {
  report: RiskReport;
  onCheckAnother?: () => void;
  compact?: boolean;
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

export function RiskReportView({
  report,
  onCheckAnother,
  compact = false,
}: Props) {
  const tone = scoreTone(report.level);
  const checkedLocal = new Date(report.checkedAt).toLocaleString();
  const explorerUrl = explorerTokenUrl(report.chain, report.address);
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(report.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className={
        compact
          ? "report-in report-in--compact card overflow-hidden"
          : "report-in card overflow-hidden"
      }
    >
      <div className={compact ? "instrument-face p-5" : "instrument-face p-6"}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/55">Risk score</p>
            <p
              className={
                compact
                  ? "mt-2 text-4xl font-semibold leading-none tracking-[-0.04em]"
                  : "mt-2 text-6xl font-semibold leading-none tracking-[-0.04em]"
              }
              style={{ color: tone }}
            >
              {report.score}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">{checkedLocal}</p>
            <p className="font-mono-ui mt-2 text-[10px] uppercase tracking-wide text-white/45">
              Solana · {report.cached ? 'cached' : 'live'}
            </p>
          </div>
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

        <div className="mt-5 flex items-start gap-3">
          {report.token?.imageUrl ? (
            <img
              src={report.token.imageUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-[10px] object-cover ring-1 ring-white/15"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-xs font-medium text-white/55"
            >
              {(report.token?.symbol ?? "?").slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">
              {report.token?.name ?? "Unnamed mint"}
              {report.token?.symbol ? (
                <span className="ml-2 font-normal text-white/55">
                  {report.token.symbol}
                </span>
              ) : null}
            </p>
            <p className="font-mono-ui mt-1 break-all text-xs text-white/45">
              {chainLabel(report.chain)} · {report.address}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              Confirm name and mint match the token you intend to review.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-6 py-3">
        <button type="button" className="btn btn-secondary btn-sm" onClick={copyAddress}>
          {copied ? "Copied" : "Copy address"}
        </button>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          Open on {explorerName(report.chain)}
        </a>
        {onCheckAnother ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCheckAnother}
          >
            Check another
          </button>
        ) : null}
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

      <footer className="space-y-2 border-t border-[var(--border)] bg-[var(--subtle)] px-6 py-4 text-xs text-[var(--muted)]">
        <p>
          Sources:{" "}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-soft)] underline-offset-2 hover:underline"
          >
            {explorerName(report.chain)}
          </a>
          {report.sources.length > 0
            ? ` · ${report.sources.join(", ")}`
            : null}
        </p>
        <p>{report.freshnessNote}</p>
        <p className="pt-1 text-[var(--ink-soft)]">{report.disclaimer}</p>
      </footer>
    </section>
  );
}
