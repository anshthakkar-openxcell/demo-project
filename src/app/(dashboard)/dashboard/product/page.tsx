import type { Metadata } from "next";
import { ProductAnalytics } from "@/features/product-usage/components/product-analytics";
export const metadata: Metadata = { title: "Product Analytics" };
export default function ProductPage() { return <ProductAnalytics />; }
