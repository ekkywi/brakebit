"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { SIGNALS, signalLabel } from "@/shared/content/product";

const COLS = 12;
const ROWS = 8;
const NEAR_RADIUS = 2.3;

/**
 * One numbered cell per signal, as [col, row]. Order matches SIGNALS.
 * Cells stay at least two squares apart so the 44px hit areas never overlap.
 */
const SIGNAL_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [2, 1],
  [8, 1],
  [5, 3],
  [10, 4],
  [2, 5],
  [7, 6],
];

const SIGNAL_AT = new Map<number, number>(
  SIGNAL_POSITIONS.map(([col, row], signal) => [row * COLS + col, signal]),
);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded so server and client render the same markup. */
const CELLS = (() => {
  const rng = mulberry32(20260);
  return Array.from({ length: COLS * ROWS }, () => {
    const blinks = rng() < 0.55;
    const dur = 5 + rng() * 6;
    const delay = -(rng() * dur);
    const peak = 0.3 + rng() * 0.4;
    const rest = rng() < 0.16 ? peak * 0.6 : 0;
    return {
      blinks,
      style: {
        "--dur": `${dur.toFixed(2)}s`,
        "--delay": `${delay.toFixed(2)}s`,
        "--peak": peak.toFixed(2),
        "--rest": rest.toFixed(2),
      } as CSSProperties,
    };
  });
})();

/**
 * Hero grid. Squares blink on their own; the pointer lights a trail.
 * Six numbered cells are the real controls: hover, focus, or tap one to read
 * what that signal covers. Everything else is decoration, not data.
 */
export function SignalGrid() {
  const captionId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Array<HTMLElement | null>>([]);
  const lastIndex = useRef(-1);
  const [active, setActive] = useState<number | null>(null);

  function clearNear() {
    for (const el of cellRefs.current) {
      if (el && el.dataset.near !== undefined) delete el.dataset.near;
    }
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * COLS);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * ROWS);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const index = row * COLS + col;
    if (index === lastIndex.current) return;
    lastIndex.current = index;
    clearNear();
    const reach = Math.ceil(NEAR_RADIUS);
    for (let dr = -reach; dr <= reach; dr += 1) {
      for (let dc = -reach; dc <= reach; dc += 1) {
        const c = col + dc;
        const r = row + dr;
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
        const distance = Math.hypot(dc, dr);
        if (distance > NEAR_RADIUS) continue;
        const el = cellRefs.current[r * COLS + c];
        if (!el || el.dataset.signal !== undefined) continue;
        el.dataset.near = distance === 0 ? "0" : distance <= 1.5 ? "1" : "2";
      }
    }
  }

  function handleLeave() {
    lastIndex.current = -1;
    clearNear();
  }

  const current = active === null ? null : SIGNALS[active];

  return (
    <div className="card overflow-hidden">
      <div className="p-3 md:p-4">
        <div
          ref={gridRef}
          role="group"
          aria-label="The six signals a report covers"
          className="sg-grid"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          {CELLS.map((cell, index) => {
            const signal = SIGNAL_AT.get(index);
            if (signal !== undefined) {
              return (
                <button
                  key={index}
                  type="button"
                  ref={(el) => {
                    cellRefs.current[index] = el;
                  }}
                  className="sg-cell sg-signal"
                  data-signal=""
                  data-active={active === signal}
                  aria-label={SIGNALS[signal].title}
                  aria-controls={captionId}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setActive(signal);
                  }}
                  onFocus={() => setActive(signal)}
                  onClick={() => setActive(signal)}
                >
                  <span aria-hidden>{signalLabel(signal + 1)}</span>
                </button>
              );
            }
            return (
              <div
                key={index}
                ref={(el) => {
                  cellRefs.current[index] = el;
                }}
                aria-hidden
                className={
                  cell.blinks ? "sg-cell" : "sg-cell sg-cell--still"
                }
                style={cell.style}
              />
            );
          })}
        </div>
      </div>

      <div
        id={captionId}
        aria-live="polite"
        className="min-h-[9rem] border-t border-[var(--border)] bg-[var(--subtle)] px-4 py-3 md:px-5"
      >
        {current ? (
          <>
            <p className="text-sm font-semibold text-[var(--fg)]">
              {signalLabel((active ?? 0) + 1)} · {current.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {current.detail}
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Six squares are numbered. Hover, focus, or tap one to see what a
            check reads.
          </p>
        )}
        <p className="font-mono-ui mt-3 text-xs text-[var(--muted)]">
          Illustrative grid. Not live data.
        </p>
      </div>
    </div>
  );
}
