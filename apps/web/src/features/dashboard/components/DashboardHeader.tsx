"use client";

import { AccountMenu } from "./AccountMenu";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";

type Props = {
  title: string;
  onOpenMenu: () => void;
};

/** Sticky header for the dashboard. Separate from the marketing header. */
export function DashboardHeader({ title, onOpenMenu }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-4 md:px-10">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="btn btn-secondary btn-sm min-h-11 min-w-11 md:hidden"
        >
          <MenuIcon />
        </button>
        <p className="truncate text-sm font-medium text-[var(--fg)]">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
