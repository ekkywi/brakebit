import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import {
  isSidebarCollapsed,
  SIDEBAR_COOKIE,
} from "@/features/dashboard/sidebar-cookie";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Read on the server so the first paint already has the saved sidebar width.
  const cookieStore = await cookies();
  const initialCollapsed = isSidebarCollapsed(
    cookieStore.get(SIDEBAR_COOKIE)?.value,
  );

  return (
    <DashboardShell initialCollapsed={initialCollapsed}>{children}</DashboardShell>
  );
}
