import type { ReactNode } from "react";

type Props = {
  /** Mono line above the title. */
  meta: ReactNode;
  /** Title text without a final period. The full stop is drawn as the brand square. */
  title: string;
  /** Short supporting line, set on the right from the md breakpoint. */
  note?: ReactNode;
};

/**
 * First row of a public sheet: meta line, large title ending in the square full
 * stop, and a note. The heading carries an `aria-label` with a normal period,
 * because the square is decoration. Public pages only: the dashboard is a work
 * area and does not use a title block.
 */
export function SheetTitle({ meta, title, note }: Props) {
  return (
    <div className="cell anim-rise grid gap-6 pb-8 pt-10 md:grid-cols-12 md:items-end md:pb-10 md:pt-14">
      <div className="min-w-0 md:col-span-8">
        <p className="font-mono-ui break-words text-xs text-[var(--muted)]">
          {meta}
        </p>
        <h1
          aria-label={`${title}.`}
          className="mt-5 text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--fg)]"
        >
          <span aria-hidden>
            {title}
            <span className="stop" />
          </span>
        </h1>
      </div>
      {note ? (
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-[var(--muted)] md:col-span-4">
          {note}
        </p>
      ) : null}
    </div>
  );
}
