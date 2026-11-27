"use client";

import { useId, useState } from "react";
import { SIGNALS, signalLabel } from "@/shared/content/product";

/**
 * The six signals as a board of squares on shared hairlines. The panel beside
 * it is the section's one filled tile and shows a giant number for the
 * selected signal. Dashed tiles mark a signal without a data source (none today),
 * matching the dashed Unknown square in the report. Static: no blinking below the hero.
 */
export function SignalBoard() {
  const panelId = useId();
  const [selected, setSelected] = useState(0);
  const current = SIGNALS[selected];

  return (
    <div className="grid border-t border-[var(--border)] lg:grid-cols-12">
      <div
        role="group"
        aria-label="Six signals"
        className="sb-grid lg:col-span-7"
      >
        {SIGNALS.map((signal, index) => (
          <button
            key={signal.key}
            type="button"
            className="sb-tile"
            data-unread={!signal.readToday || undefined}
            aria-pressed={selected === index}
            aria-controls={panelId}
            onClick={() => setSelected(index)}
          >
            <span className="sb-num">{signalLabel(index + 1)}</span>
            <span>
              <span className="sb-title">{signal.title}</span>
              <span className="sb-state">
                {signal.readToday ? "Has a data source" : "No source yet"}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div
        id={panelId}
        aria-live="polite"
        className="focal cell flex flex-col justify-between gap-10 py-8 lg:col-span-5 lg:py-10"
      >
        <div>
          <p className="font-mono-ui text-xs">
            Report row: {current.field}
          </p>
          <span aria-hidden className="sb-panel-num mt-6">
            {signalLabel(selected + 1)}
          </span>
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-[-0.03em]">
            <span className="sr-only">{signalLabel(selected + 1)} · </span>
            {current.title}
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed">{current.detail}</p>
          <p className="mt-5 border-t border-[color-mix(in_srgb,var(--bg)_45%,transparent)] pt-4 text-sm leading-relaxed">
            {current.readToday
              ? "Read from its source when the mint allows it. If the source has no data for this mint, the row shows Unknown."
              : "No data source yet, so every report shows Unknown here. Unknown is never counted as clear."}
          </p>
        </div>
      </div>
    </div>
  );
}
