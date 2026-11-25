import Link from "next/link";
import { GridBackdrop } from "@/features/landing/components/GridBackdrop";
import { SignalGrid } from "@/features/landing/components/SignalGrid";
import { FieldReportPreview } from "@/shared/ui/FieldReportPreview";
import {
  FEATURES,
  SAMPLE_CHECK,
  SIGNALS,
  STEPS,
  signalLabel,
} from "@/shared/content/product";

const SAMPLE_HREF = `/check?chain=solana&address=${encodeURIComponent(SAMPLE_CHECK.address)}&example=1`;

const [FLAGSHIP_FEATURE, ...SUPPORTING_FEATURES] = FEATURES;

export default function HomePage() {
  return (
    <>
      <section className="hero-stage">
        <GridBackdrop />
        <div className="wrap grid items-center gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,29rem)] lg:gap-16">
          <div className="anim-rise">
            <h1 className="text-[clamp(2.5rem,5.2vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--fg)]">
              Brake before you buy.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
              Paste a Solana mint, get a risk report with findings and signals.
              Indicators only. Not investment advice.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/check" className="btn btn-primary">
                Start a review
              </Link>
              <Link href={SAMPLE_HREF} className="btn btn-secondary">
                Try an example
              </Link>
            </div>
          </div>

          <div className="anim-rise-delay">
            <SignalGrid />
          </div>
        </div>
      </section>

      <section
        id="report"
        className="scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="wrap py-20 md:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
            <div className="order-2 lg:order-1">
              <FieldReportPreview />
            </div>

            <div className="order-1 lg:sticky lg:top-24 lg:order-2">
              <p className="section-label">Report</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                What a finished review looks like.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
                Score, findings, signal details, and sources in one read-only
                report. The figures are an illustration, not a live assessment
                of any token.
              </p>

              <p className="mt-10 text-sm font-medium text-[var(--fg)]">
                Each numbered row in the report is one of the six squares
                above.
              </p>
              <ul className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {SIGNALS.map((signal, index) => (
                  <li key={signal.title} className="flex items-center gap-4 py-3">
                    <span className="sq-index">
                      {signalLabel(index + 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[var(--fg)]">
                        {signal.title}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--muted)]">
                        Report row:{" "}
                        <span className="font-mono-ui text-[13px]">
                          {signal.field}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="band-subtle scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="wrap py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="section-label">Product</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
              Built for the pause before you commit.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              Brakebit is a Solana risk review tool, not a trading desk, signal
              feed, or wallet.
            </p>
          </div>

          <div className="card mt-12 grid gap-4 p-7 md:grid-cols-2 md:gap-12 md:p-10">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)] md:text-3xl">
              {FLAGSHIP_FEATURE.title}
            </h3>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              {FLAGSHIP_FEATURE.detail}
            </p>
          </div>

          <ul className="mt-10 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-3 md:gap-10">
            {SUPPORTING_FEATURES.map((feature) => (
              <li key={feature.title}>
                <p className="text-[15px] font-semibold text-[var(--fg)]">
                  {feature.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {feature.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="how"
        className="scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="wrap py-20 md:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="section-label">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                Three steps to a report.
              </h2>
              <ol className="mt-10 space-y-8">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="sq-index sq-index--plain">{step.n}</span>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--fg)]">
                        {step.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div id="signals" className="scroll-mt-16">
              <p className="section-label">Signals</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                Six signals every time.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
                One readout shape so each Solana check is easy to scan.
              </p>
              <ul className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {SIGNALS.map((signal, index) => (
                  <li key={signal.title} className="flex gap-4 py-5">
                    <span className="sq-index">
                      {signalLabel(index + 1)}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--fg)]">
                        {signal.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                        {signal.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="band-subtle border-t border-[var(--border)]">
        <div className="wrap flex flex-col items-center py-20 text-center md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            Check a token before you commit.
          </h2>
          <p className="mt-4 max-w-md text-[15px] text-[var(--muted)]">
            No account required. Paste a Solana mint and read the report.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/check" className="btn btn-primary">
              Start a review
            </Link>
            <Link href={SAMPLE_HREF} className="btn btn-secondary">
              Try an example
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
