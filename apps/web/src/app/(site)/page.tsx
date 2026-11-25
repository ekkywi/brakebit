import Link from "next/link";
import { FieldReportPreview } from "@/shared/ui/FieldReportPreview";
import {
  FEATURES,
  SAMPLE_CHECK,
  SIGNALS,
  STEPS,
} from "@/shared/content/product";

const SAMPLE_HREF = `/check?chain=solana&address=${encodeURIComponent(SAMPLE_CHECK.address)}&example=1`;

export default function HomePage() {
  return (
    <>
      <section className="hero-stage">
        <div className="wrap pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <div className="anim-rise mx-auto max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--fg)]">
              Brake before you buy.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
              Paste a Solana mint, get a risk report with findings and signals.
              Indicators only. Not investment advice.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/check" className="btn btn-primary">
                Start a review
              </Link>
              <Link href={SAMPLE_HREF} className="btn btn-secondary">
                Try an example
              </Link>
            </div>
          </div>

          <div className="anim-rise-delay mx-auto mt-14 max-w-5xl md:mt-16">
            <FieldReportPreview />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="band-subtle scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="wrap py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
              Product
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
              Built for the pause before you commit.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              Brakebit is a Solana risk review tool, not a trading desk, signal
              feed, or wallet.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="card feature-card p-6">
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
              <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                Three steps to a report.
              </h2>
              <ol className="mt-10 space-y-8">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="font-mono-ui step-index mt-0.5 text-xs">
                      {step.n}
                    </span>
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
              <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                Signals
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                Four signals every time.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
                One readout shape so each Solana check is easy to scan.
              </p>
              <ul className="mt-10 space-y-5">
                {SIGNALS.map((signal, index) => (
                  <li
                    key={signal.title}
                    className="card flex gap-4 px-5 py-4"
                  >
                    <span className="font-mono-ui step-index mt-0.5 text-xs">
                      {String(index + 1).padStart(2, "0")}
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
