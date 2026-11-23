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
    <section className="check-stage wrap pb-24 pt-10 md:pt-14">
      <div className="anim-rise mb-6">
        <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
          Assessment workspace
        </p>
        <h1 className="mt-2 text-[clamp(1.75rem,3.5vw,2.35rem)] font-semibold tracking-[-0.04em] text-[var(--fg)]">
          Token risk review
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Search or paste a Solana mint. Reviewed tokens appear in the table;
          the report opens beside it on desktop.
        </p>
      </div>

      <Suspense fallback={<CheckFormFallback />}>
        <TokenCheckForm />
      </Suspense>
    </section>
  );
}
