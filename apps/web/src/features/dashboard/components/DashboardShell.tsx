"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { SIGNED_OUT_URL } from "@/features/auth/routes";
import { useSession } from "@/features/auth/session";
import { dashboardTitle } from "../nav";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { MobileNavDrawer } from "./MobileNavDrawer";

/**
 * App shell for `/dashboard`: sidebar, own header, and content. No marketing chrome.
 * Without a valid session (logout, expiry, revoked) it sends the visitor to `/?signedout=1`.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!loading && !user) router.replace(SIGNED_OUT_URL);
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center text-sm text-[var(--muted)]"
        aria-live="polite"
      >
        Loading your dashboard…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-[var(--border)] bg-[var(--subtle)] md:block">
        <DashboardSidebar pathname={pathname} />
      </aside>

      {menuOpen ? (
        <MobileNavDrawer onClose={closeMenu}>
          <div className="pt-14">
            <DashboardSidebar pathname={pathname} onNavigate={closeMenu} />
          </div>
        </MobileNavDrawer>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <DashboardHeader
          title={dashboardTitle(pathname)}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-10 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
