import type { Metadata } from "next";
import { SettingsHub } from "@/features/settings/components/settings-hub";
export const metadata: Metadata = { title: "Settings" };
export default function SettingsPage() { return <SettingsHub />; }
