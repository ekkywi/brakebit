import type { ReactNode } from "react";

type Props = {
  /** Mono line above the title. */
  meta: ReactNode;
  /** Title text without a final period. The full stop is drawn as the brand square. */
  title: string;
  /** Short supporting line, set on the right from the md breakpoint. */
  note?: ReactNode;
  /** `page` is the landing scale. `app` is smaller, for screens inside the dashboard. */
  scale?: "page" | "app";
};

const SCALE = {
  page: {
    row: "anim-rise pb-8 pt-10 md:pb-10 md:pt-14",
    heading: "text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.055em]",
  },
  app: {
    row: "pb-6 pt-8 md:pb-8 md:pt-10",
    heading: "text-[clamp(2rem,4.5vw,3.25rem)] leading-none tracking-[-0.05em]",
  },
} as const;

/**
 * First row of a sheet: meta line, large title ending in the square full stop,
 * and a note. The heading carries an `aria-label` with a normal period, because
 * the square is decoration. Only the page scale rises on load; the app scale
 * stays still, since people read data on those screens.
 */
export function SheetTitle({ meta, title, note, scale = "page" }: Props) {
  const s = SCALE[scale];

  return (
    <div className={`cell grid gap-6 md:grid-cols-12 md:items-end ${s.row}`}>
      <div className="min-w-0 md:col-span-8">
        <p className="font-mono-ui break-words text-xs text-[var(--muted)]">
          {meta}
        </p>
        <h1
          aria-label={`${title}.`}
          className={`mt-5 font-semibold text-[var(--fg)] ${s.heading}`}
        >
          <span aria-hidden>
            {title}
            <span className="stop" />
          </span>
        </h1>
      </div>
      {note ? (
        <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)] md:col-span-4">
          {note}
        </p>
      ) : null}
    </div>
  );
}
