import Link from "next/link";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { ReportSection } from "@/features/landing/components/ReportSection";
import { SignalBoard } from "@/features/landing/components/SignalBoard";
import { FieldReportPreview } from "@/shared/ui/FieldReportPreview";
import {
  NEVER,
  READS,
  SAMPLE_CHECK_HREF,
  SIGNALS,
} from "@/shared/content/product";

const READ_COUNT = SIGNALS.filter((signal) => signal.readToday).length;

export default function HomePage() {
  return (
    <>
      <LandingHero />

      {/* Report: follows the theme. A subtle band, the sample report on the left, an interactive reading guide on the right. */}
      <section
        id="report"
        className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--subtle)]"
      >
        <ReportSection preview={<FieldReportPreview />} />
      </section>

      {/* Product: an oversized statement, then one filled count tile beside two lists. */}
      <section
        id="features"
        className="scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="sheet">
          <div className="cell py-16 md:py-24">
            <h2 className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
              Built for the pause before you commit.
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
              A Solana risk review tool. Not a trading desk, signal feed, or
              wallet.
            </p>
          </div>

          <div className="grid border-t border-[var(--border)] lg:grid-cols-12">
            <div className="focal cell flex flex-col justify-between gap-12 py-8 lg:col-span-4 lg:py-10">
              <p
                aria-label={`${READ_COUNT} of ${SIGNALS.length}`}
                className="font-mono-ui text-[clamp(5rem,13vw,9rem)] font-medium leading-[0.85] tracking-[-0.06em]"
              >
                <span aria-hidden>
                  {READ_COUNT}/{SIGNALS.length}
                </span>
              </p>
              <p className="text-[15px] leading-relaxed">
                signals are read today. LP lock and liquidity have no data
                source yet, so they show Unknown, never clear.
              </p>
            </div>

            <div className="cell border-t border-[var(--border)] py-8 lg:col-span-4 lg:border-t-0 lg:py-10">
              <h3 className="flex items-center gap-3 text-sm font-medium text-[var(--fg)]">
                <span
                  aria-hidden
                  className="h-3 w-3 bg-[var(--accent)]"
                />
                What a check reads
              </h3>
              <ul className="mt-5 border-t border-[var(--fg)]">
                {READS.map((item) => (
                  <li
                    key={item.title}
                    className="border-b border-[var(--border)] py-4"
                  >
                    <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cell border-t border-[var(--border)] py-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:py-10">
              <h3 className="flex items-center gap-3 text-sm font-medium text-[var(--fg)]">
                <span
                  aria-hidden
                  className="h-3 w-3 border border-[var(--muted)]"
                />
                What Brakebit never does
              </h3>
              <ul className="mt-5 border-t border-[var(--fg)]">
                {NEVER.map((item) => (
                  <li
                    key={item.title}
                    className="border-b border-[var(--border)] py-4"
                  >
                    <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Signals: heading row, then a board of six tiles beside one filled panel. */}
      <section
        id="signals"
        className="scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="sheet">
          <div className="cell grid gap-4 py-12 md:grid-cols-12 md:items-end md:py-16">
            <h2 className="text-3xl font-semibold leading-[1.02] tracking-[-0.045em] md:col-span-7 md:text-5xl">
              Six signals. Unknown stays visible.
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)] md:col-span-5">
              Every report lists all six. Dashed squares have no data source
              yet and always read Unknown.
            </p>
          </div>
          <SignalBoard />
          <p className="cell border-t border-[var(--border)] py-4 text-sm text-[var(--muted)]">
            The number is the same in the hero, the report, and this board. It
            follows the order the API returns the signals.
          </p>
        </div>
      </section>

      {/* CTA: one row of the sheet, same rules and type scale as the sections above. */}
      <section className="scroll-mt-16 border-t border-[var(--border)]">
        <div className="sheet grid md:grid-cols-12">
          <div className="cell py-12 md:col-span-8 md:py-16">
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">
              Check a token before you commit.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
              No account required. Solana is the only network Brakebit reads
              today. Use the token mint, not a wallet, and verify findings on
              Solscan.
            </p>
          </div>
          <div className="cell flex flex-wrap items-center gap-3 border-t border-[var(--border)] py-8 md:col-span-4 md:flex-col md:items-stretch md:justify-center md:border-l md:border-t-0 md:py-16">
            <Link href="/check" className="btn btn-primary">
              Start a review
            </Link>
            <Link href={SAMPLE_CHECK_HREF} className="btn btn-secondary">
              Try an example
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
