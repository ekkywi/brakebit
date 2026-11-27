import type { ReactNode } from "react";
import { RedirectIfSignedIn } from "@/features/auth/components/RedirectIfSignedIn";
import { BrandMark } from "@/shared/ui/BrandMark";
import { SiteHeader } from "@/shared/ui/SiteHeader";

/** Public marketing pages and the guest-facing check flow. Signed-in users are sent to the dashboard. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RedirectIfSignedIn />
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t border-[var(--border)]">
        <div className="sheet grid text-sm text-[var(--muted)] sm:grid-cols-12">
          <p className="cell flex items-center gap-2 py-8 font-medium text-[var(--fg)] sm:col-span-4 sm:border-r sm:border-[var(--border)] sm:py-10">
            <BrandMark size={20} />
            Brakebit
          </p>
          <p className="cell max-w-xl border-t border-[var(--border)] py-8 sm:col-span-8 sm:border-t-0 sm:py-10">
            Risk indicators only. Brakebit does not execute trades, custody
            assets, or offer investment advice. Always verify findings against
            primary sources before you buy.
          </p>
        </div>
      </footer>
    </>
  );
}
