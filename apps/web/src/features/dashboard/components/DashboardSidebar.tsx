import Link from "next/link";
import { DASHBOARD_NAV, isNavItemActive } from "../nav";

type Props = {
  pathname: string;
  onNavigate?: () => void;
};

/** Sidebar content. Used directly on desktop and inside the mobile drawer. */
export function DashboardSidebar({ pathname, onNavigate }: Props) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex min-h-11 items-center px-2 text-[15px] font-semibold tracking-[-0.02em] text-[var(--fg)]"
      >
        Brakebit
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
              className={`flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors ${
                active
                  ? "bg-[var(--bg)] font-medium text-[var(--fg)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
