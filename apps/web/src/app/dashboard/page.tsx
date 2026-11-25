import type { Metadata } from "next";
import { OverviewView } from "@/features/dashboard/components/OverviewView";

export const metadata: Metadata = {
  title: "Overview | Brakebit",
};

export default function DashboardPage() {
  return <OverviewView />;
}
