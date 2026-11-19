import { TokenCheckForm } from "@/features/token-check/components/TokenCheckForm";
import { CHECK_TIPS, NETWORKS } from "@/shared/content/product";

export default function CheckPage() {
  return (
    <section className="wrap wrap-narrow pb-24 pt-14 md:pt-20">
      <div className="anim-rise mb-10">
        <p className="text-sm font-medium text-[var(--muted)]">
          Assessment workspace
        </p>
        <h1 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-[var(--fg)]">
          Token risk review
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          Choose a network and paste a contract or mint address. Brakebit
          returns a score, plain-language findings, and signal details.
          Indicators for your own diligence, not investment advice.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {NETWORKS.map((network) => (
            <li
              key={network.id}
              className="text-xs font-medium text-[var(--ink-soft)]"
            >
              {network.label}
            </li>
          ))}
        </ul>
      </div>

      <TokenCheckForm />

      <aside className="mt-10 card p-6">
        <p className="text-sm font-medium text-[var(--fg)]">Before you submit</p>
        <ul className="mt-4 space-y-3">
          {CHECK_TIPS.map((tip) => (
            <li
              key={tip}
              className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]"
            >
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--fg)]"
              />
              {tip}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
