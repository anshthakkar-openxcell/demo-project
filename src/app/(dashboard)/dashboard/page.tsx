import type { Metadata } from "next";
import { ExecutiveOverview } from "@/features/executive/components/executive-overview";

export const metadata: Metadata = { title: "Executive Overview" };

export default function DashboardPage() {
  return <ExecutiveOverview />;
}
