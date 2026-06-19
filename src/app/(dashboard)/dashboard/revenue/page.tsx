import type { Metadata } from "next";
import { RevenueIntelligence } from "@/features/revenue/components/revenue-intelligence";

export const metadata: Metadata = { title: "Revenue Intelligence" };

export default function RevenuePage() {
  return <RevenueIntelligence />;
}
