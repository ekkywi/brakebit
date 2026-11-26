import { Suspense } from "react";
import { GuestCheck } from "@/features/token-check/components/GuestCheck";

function CheckFallback() {
  return (
    <div className="sheet">
      <p className="cell py-10 text-sm text-[var(--muted)] md:py-14">
        Loading workspace…
      </p>
    </div>
  );
}

export default function CheckPage() {
  return (
    <section>
      <Suspense fallback={<CheckFallback />}>
        <GuestCheck />
      </Suspense>
    </section>
  );
}
