import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberCheck } from "@/features/token-check/components/MemberCheck";

export const metadata: Metadata = {
  title: "Check | Brakebit",
};

function CheckFallback() {
  return (
    <div className="sheet sheet--flush">
      <p role="status" className="cell py-8 text-sm text-[var(--muted)]">
        Loading workspace…
      </p>
    </div>
  );
}

export default function DashboardCheckPage() {
  return (
    <Suspense fallback={<CheckFallback />}>
      <MemberCheck />
    </Suspense>
  );
}
