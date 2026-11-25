export type NavIconName = "overview" | "check";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

/**
 * Sidebar items for `/dashboard`. Add a feature here once its page exists.
 * Pages that are not built yet (for example top-up) stay out of the list.
 */
export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/check", label: "Check", icon: "check" },
];

/** True when `pathname` is the item itself or a page nested under it. */
export function isNavItemActive(item: DashboardNavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  // Overview is the root of the area, so it must not match every nested page.
  return item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`);
}

/** Page title for the dashboard header, taken from the nav item that matches the path. */
export function dashboardTitle(pathname: string): string {
  return (
    DASHBOARD_NAV.find((item) => isNavItemActive(item, pathname))?.label ??
    "Dashboard"
  );
}
