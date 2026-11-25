import Link from "next/link";
import { DASHBOARD_NAV, isNavItemActive } from "../nav";
import { BrandMark, CollapseIcon, NavIcon } from "./icons";

type Props = {
  pathname: string;
  /** Icon rail on desktop. The mobile drawer never collapses. */
  collapsed?: boolean;
  /** Present only where collapsing makes sense (the desktop sidebar). */
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
};

/**
 * Sidebar content. Used directly on desktop and inside the mobile drawer.
 * The current page is marked by a framed box, an accent icon, and heavier
 * text, so the marker survives the icon rail and does not rely on color alone.
 */
export function DashboardSidebar({
  pathname,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: Props) {
  return (
    <div
      className={`flex h-full flex-col gap-6 ${collapsed ? "p-3" : "p-4"}`}
    >
      <Link
        href="/dashboard"
        onClick={onNavigate}
        title={collapsed ? "Brakebit" : undefined}
        className={`flex min-h-11 items-center gap-2.5 rounded-lg text-[15px] font-semibold tracking-[-0.02em] text-[var(--fg)] ${
          collapsed ? "justify-center" : "px-2"
        }`}
      >
        <BrandMark />
        <span className={collapsed ? "sr-only" : undefined}>Brakebit</span>
      </Link>

      <nav aria-label="Dashboard" className="flex flex-col gap-1">
        {DASHBOARD_NAV.map((item) => {
          const active = isNavItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg border text-sm transition-colors ${
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

      {onToggleCollapsed ? (
        <div className="mt-auto">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex min-h-11 w-full items-center gap-3 rounded-lg border border-transparent text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <span className={collapsed ? "rotate-180" : undefined}>
              <CollapseIcon />
            </span>
            <span className={collapsed ? "sr-only" : undefined}>
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
