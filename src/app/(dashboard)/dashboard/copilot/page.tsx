import type { Metadata } from "next";
import { AICopilot } from "@/features/ai-copilot/components/ai-copilot";
export const metadata: Metadata = { title: "AI Copilot" };
export default function CopilotPage() { return <AICopilot />; }
