import type { Metadata } from "next";
import { ChurnCenter } from "@/features/churn/components/churn-center";
export const metadata: Metadata = { title: "Churn Prediction" };
export default function ChurnPage() { return <ChurnCenter />; }
