import type { Metadata } from "next";
import { HealthCenter } from "@/features/health/components/health-center";

export const metadata: Metadata = { title: "Health Center" };

export default function HealthPage() {
  return <HealthCenter />;
}
