"use client";

import { useState, type ReactNode } from "react";

type Part = "score" | "strip" | "findings";

const GUIDE: ReadonlyArray<{ part: Part; title: string; detail: string }> = [
  {
    part: "score",
    title: "Score and level",
    detail:
      "How risky the mint looks, and how many of the six signals were read.",
  },
  {
    part: "strip",
    title: "Signals at a glance",
    detail:
      "One square per signal. Outlined is clear, thick border is watch, solid is elevated, dashed is unknown.",
  },
  {
    part: "findings",
    title: "Findings, signals, and sources",
    detail:
      "Each finding says what was found and how severe it is. Sources show where the data came from.",
  },
];

/**
 * Report section. The reading guide on the right points at parts of the sample
 * report: hover or focus previews a part, a click or tap pins it. The parts are
 * marked with `data-part` in FieldReportPreview.
 */
export function ReportSection({ preview }: { preview: ReactNode }) {
  const [hovered, setHovered] = useState<Part | null>(null);
  const [pinned, setPinned] = useState<Part | null>(null);
  const focus = hovered ?? pinned;

  return (
    <div
      className="report-guide sheet grid lg:grid-cols-12"
      data-focus={focus ?? undefined}
    >
      <div className="cell order-2 py-12 md:py-20 lg:order-1 lg:col-span-7 lg:border-r lg:border-[var(--border)]">
        {preview}
      </div>

      <div className="cell order-1 py-12 md:py-20 lg:order-2 lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <p className="font-mono-ui text-xs text-[var(--accent)]">
            Example report · Solana
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">
            What a finished review looks like.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
            Score, findings, signal details, and sources in one read-only
            report. The figures are an illustration, not a live assessment of
            any token.
          </p>

          <p className="mt-10 text-sm font-medium text-[var(--fg)]">
            Reading guide
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Hover, focus, or tap an item to see it in the report.
          </p>
          <div className="mt-4 border-t border-[var(--border)]">
            {GUIDE.map((item) => (
              <button
                key={item.part}
                type="button"
                className="guide-item"
                aria-pressed={pinned === item.part}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setHovered(item.part);
                }}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(item.part)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  setPinned((current) =>
                    current === item.part ? null : item.part,
                  )
                }
              >
                <span className="guide-title block text-sm font-semibold text-[var(--fg)]">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                  {item.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
