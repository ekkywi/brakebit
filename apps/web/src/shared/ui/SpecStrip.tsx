import type { CSSProperties } from "react";
import {
  SIGNALS,
  signalLabel,
} from "@/shared/content/product";

const READ_COUNT = SIGNALS.filter((signal) => signal.readToday).length;

type Props = {
  /** A mint of plausible length is in the field: the readable signals light in order. */
  ready: boolean;
};

/**
 * The six signals as a strip of square tiles, plus the line that says what is
 * read today. Used inside a `.sheet` by the landing hero and the public check
 * page. It is not live data: nothing is fetched, and the tiles only light once
 * a mint of plausible length is in the field.
 */
export function SpecStrip({ ready }: Props) {
  return (
    <>
      <div className="spec-wrap border-t border-[var(--border)]">
        <ol aria-label="The six signals a report covers" className="spec-strip">
          {SIGNALS.map((signal, index) => (
            <li
              key={signal.key}
              className="spec-tile"
              data-read={signal.readToday}
              data-lit={(ready && signal.readToday) || undefined}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="spec-num">{signalLabel(index + 1)}</span>
              <span>
                <span className="spec-title">{signal.title}</span>
                <span className="spec-state">
                  {!signal.readToday
                    ? "No source yet"
                    : ready
                      ? "Will read"
                      : "Has a source"}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p
        aria-live="polite"
        className="cell border-t border-[var(--border)] py-4 text-sm text-[var(--muted)]"
      >
        {ready
          ? `Ready: ${READ_COUNT} signals have a data source for this mint. Any one can still show Unknown.`
          : `${READ_COUNT} of ${SIGNALS.length} signals have a data source. Any one can still show Unknown.`}
      </p>
    </>
  );
}
