import Link from "next/link";
import { DASHBOARD_NAV, isNavItemActive } from "../nav";
import { BrandMark } from "@/shared/ui/BrandMark";
import { NavIcon } from "./icons";

type Props = {
  pathname: string;
  /** Icon rail on desktop. The mobile drawer never collapses. */
  collapsed?: boolean;
  onNavigate?: () => void;
};

/**
 * Sidebar content. Used directly on desktop and inside the mobile drawer.
 * The current page is marked by a framed box, an accent icon, and heavier
 * text, so the marker survives the icon rail and does not rely on color alone.
 *
 * The brand row is as tall as the dashboard header (h-14) so the two bottom
 * borders form one line. Collapsing is done from the header hamburger.
 */
export function DashboardSidebar({
  pathname,
  collapsed = false,
  onNavigate,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-14 shrink-0 items-center border-b border-[var(--border)] ${
          collapsed ? "justify-center px-3" : "px-4"
        }`}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          title={collapsed ? "Brakebit" : undefined}
          className={`flex min-h-11 items-center gap-2.5 text-[0.9375rem] font-semibold tracking-[-0.02em] text-[var(--fg)] ${
            collapsed ? "justify-center" : "px-2"
          }`}
        >
          <BrandMark />
          <span className={collapsed ? "sr-only" : undefined}>Brakebit</span>
        </Link>
      </div>

      <nav
        aria-label="Dashboard"
        className={`flex flex-col gap-1 ${collapsed ? "p-3" : "p-4"}`}
      >
        {DASHBOARD_NAV.map((item) => {
          const active = isNavItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex min-h-11 items-center gap-3 border text-sm transition-colors ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "border-[var(--border)] bg-[var(--bg)] font-semibold text-[var(--fg)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <span
                className={
                  active ? "text-[var(--accent)]" : "text-current"
                }
              >
                <NavIcon name={item.icon} />
              </span>
              <span className={collapsed ? "sr-only" : undefined}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
