"use client";

import { AccountMenu } from "./AccountMenu";
import { MenuIcon } from "./icons";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

type Props = {
  title: string;
  /** Desktop: whether the sidebar is an icon rail. */
  collapsed: boolean;
  /** Small screens: open the navigation drawer. */
  onOpenMenu: () => void;
  /** Desktop: switch the sidebar between full width and icon rail. */
  onToggleSidebar: () => void;
};

/*
 * Plain utilities on purpose, not `.btn`. `.btn` sets `display` outside any
 * Tailwind layer, so it beats `md:hidden` and the button showed on every width.
 */
const MENU_BUTTON =
  "items-center justify-center rounded-lg border border-transparent min-h-11 min-w-11 text-[var(--muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--fg)]";

/**
 * Sticky header for the dashboard. Separate from the marketing header.
 * One hamburger, two jobs: it opens the drawer on small screens and
 * collapses or expands the sidebar on desktop.
 */
export function DashboardHeader({
  title,
  collapsed,
  onOpenMenu,
  onToggleSidebar,
}: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-3 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className={`inline-flex md:hidden ${MENU_BUTTON}`}
        >
          <MenuIcon size={20} />
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={`hidden md:inline-flex ${MENU_BUTTON}`}
        >
          <MenuIcon size={20} />
        </button>
        <p className="truncate text-sm font-medium text-[var(--fg)]">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle size="large" />
        <AccountMenu />
      </div>
    </header>
  );
}
