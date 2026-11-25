import type { ReactNode } from "react";
import { RedirectIfSignedIn } from "@/features/auth/components/RedirectIfSignedIn";
import { SiteHeader } from "@/shared/ui/SiteHeader";

/** Public marketing pages and the guest-facing check flow. Signed-in users are sent to the dashboard. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RedirectIfSignedIn />
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t border-[var(--border)]">
        <div className="wrap flex flex-col gap-3 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-start sm:justify-between">
          <p className="font-medium text-[var(--fg)]">Brakebit</p>
          <p className="max-w-lg sm:text-right">
            Risk indicators only. Brakebit does not execute trades, custody
            assets, or offer investment advice. Always verify findings against
            primary sources before you buy.
          </p>
        </div>
      </footer>
    </>
  );
}
