import { Suspense } from "react";
import { TokenCheckForm } from "@/features/token-check/components/TokenCheckForm";

function CheckFormFallback() {
  return (
    <div className="card p-6">
      <p className="text-sm text-[var(--muted)]">Loading workspace…</p>
    </div>
  );
}

export default function CheckPage() {
  return (
    <section className="check-stage wrap pb-24 pt-14 md:pt-20">
      <div className="anim-rise mb-10">
        <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
          Assessment workspace
        </p>
        <h1 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--fg)]">
          Token risk review
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          Paste a Solana mint for a risk report: score, findings, and signal
          details. Indicators for your own diligence, not investment advice.
        </p>
      </div>

      <Suspense fallback={<CheckFormFallback />}>
        <TokenCheckForm />
      </Suspense>
    </section>
  );
}
