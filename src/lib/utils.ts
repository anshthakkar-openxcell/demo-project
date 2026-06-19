import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: number } = {},
): string {
  const { compact = false, decimals = 0 } = options;

  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date, style: "short" | "medium" | "long" = "medium"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    style === "short"
      ? { month: "short", day: "numeric" }
      : style === "long"
        ? { year: "numeric", month: "long", day: "numeric" }
        : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getHealthColor(status: string): string {
  switch (status) {
    case "healthy": return "text-emerald-600 dark:text-emerald-400";
    case "monitor": return "text-amber-600 dark:text-amber-400";
    case "at_risk": return "text-orange-600 dark:text-orange-400";
    case "critical": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

export function getHealthBadgeVariant(status: string) {
  switch (status) {
    case "healthy": return "success" as const;
    case "monitor": return "warning" as const;
    case "at_risk": return "orange" as const;
    case "critical": return "destructive" as const;
    default: return "secondary" as const;
  }
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "low": return "text-emerald-600 dark:text-emerald-400";
    case "medium": return "text-amber-600 dark:text-amber-400";
    case "high": return "text-orange-600 dark:text-orange-400";
    case "critical": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
