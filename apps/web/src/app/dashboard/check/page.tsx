import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberCheck } from "@/features/token-check/components/MemberCheck";

export const metadata: Metadata = {
  title: "Check | Brakebit",
};

function CheckFallback() {
  return (
    <div className="card p-6">
      <p className="text-sm text-[var(--muted)]">Loading workspace…</p>
    </div>
  );
}

export default function DashboardCheckPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--fg)]">
          Token risk review
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Search or paste a Solana mint. The report opens beside the table on
          desktop.
        </p>
      </header>

      <Suspense fallback={<CheckFallback />}>
        <MemberCheck />
      </Suspense>
    </div>
  );
}
