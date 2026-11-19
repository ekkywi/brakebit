import Link from "next/link";
import { FieldReportPreview } from "@/shared/ui/FieldReportPreview";
import {
  FEATURES,
  NETWORKS,
  SIGNALS,
  STEPS,
  USE_CASES,
} from "@/shared/content/product";

export default function HomePage() {
  return (
    <>
      <section className="wrap pb-16 pt-16 text-center md:pb-20 md:pt-24">
        <div className="anim-rise mx-auto max-w-3xl">
          <p className="text-sm font-medium text-[var(--muted)]">
            Multi-chain token risk review
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--fg)]">
            Brake before you buy.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
            Pick a network, paste a contract or mint address, and get a
            structured risk report: score, plain-language findings, and the
            signals behind them. Indicators only. Not investment advice.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/check" className="btn btn-primary">
              Start a review
            </Link>
            <a href="#how" className="btn btn-secondary">
              How it works
            </a>
          </div>
        </div>

        <div className="anim-rise-delay mx-auto mt-14 max-w-5xl text-left md:mt-16">
          <FieldReportPreview />
        </div>

        <div className="mt-14">
          <p className="text-xs text-[var(--muted)]">
            Networks in the workspace
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {NETWORKS.map((network) => (
              <li
                key={network.id}
                className="text-sm font-medium text-[var(--ink-soft)]"
              >
                {network.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--subtle)]"
      >
        <div className="wrap py-20 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
              Built for the pause before you commit.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              Brakebit is a risk review tool, not a trading desk, signal feed,
              or wallet. It reads the token so you can decide with clearer eyes.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="card p-6">
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
        id="signals"
        className="scroll-mt-16 border-t border-[var(--border)]"
      >
        <div className="wrap grid gap-12 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
              Four signals in every report.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              Chain mechanics differ. The report still returns the same four
              readouts so you can compare tokens side by side.
            </p>
            <Link href="/check" className="btn btn-secondary mt-8">
              Open the workspace
            </Link>
          </div>
          <ul className="space-y-6">
            {SIGNALS.map((signal, index) => (
              <li key={signal.title} className="flex gap-4">
                <span className="font-mono-ui mt-0.5 text-xs text-[var(--muted)]">
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
      </section>

      <section
        id="how"
        className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--subtle)]"
      >
        <div className="wrap py-20 md:py-24">
          <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            Three steps to a report.
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n}>
                <p className="font-mono-ui text-xs text-[var(--muted)]">
                  {step.n}
                </p>
                <p className="mt-3 text-[15px] font-semibold text-[var(--fg)]">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="wrap py-20 md:py-24">
          <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            When people reach for Brakebit
          </h2>
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {USE_CASES.map((item) => (
              <li key={item.title}>
                <p className="text-[15px] font-semibold text-[var(--fg)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="wrap flex flex-col items-center py-20 text-center md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            Check a token before you commit.
          </h2>
          <p className="mt-4 max-w-md text-[15px] text-[var(--muted)]">
            No account required. Read-only analysis across the networks in the
            workspace.
          </p>
          <Link href="/check" className="btn btn-primary mt-8">
            Start a review
          </Link>
        </div>
      </section>
    </>
  );
}
