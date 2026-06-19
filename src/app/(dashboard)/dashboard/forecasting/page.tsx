import type { Metadata } from "next";
import { ForecastingCenter } from "@/features/forecasting/components/forecasting-center";
export const metadata: Metadata = { title: "Forecasting" };
export default function ForecastingPage() { return <ForecastingCenter />; }
