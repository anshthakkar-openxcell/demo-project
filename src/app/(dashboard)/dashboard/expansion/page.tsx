import type { Metadata } from "next";
import { ExpansionEngine } from "@/features/expansion/components/expansion-engine";
export const metadata: Metadata = { title: "Expansion Engine" };
export default function ExpansionPage() { return <ExpansionEngine />; }
