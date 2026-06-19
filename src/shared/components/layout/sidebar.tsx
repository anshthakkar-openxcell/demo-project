"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Users, Activity, TrendingUp, AlertTriangle,
  Zap, LineChart, Bot, FileText, Settings, ChevronRight,
  Building2, HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import { mockOrganization } from "@/lib/mock-data";

const integrations = [
  {
    name: "Salesforce",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#00A1E0">
        <path d="M10.003 4.4c.972-1.01 2.328-1.637 3.828-1.637 1.99 0 3.734 1.094 4.672 2.722a5.86 5.86 0 0 1 2.344-.488c3.262 0 5.91 2.668 5.91 5.957 0 3.29-2.648 5.957-5.91 5.957-.406 0-.8-.043-1.18-.125a4.347 4.347 0 0 1-3.886 2.414 4.33 4.33 0 0 1-1.844-.41A4.842 4.842 0 0 1 9.6 21c-1.79 0-3.348-.973-4.184-2.414a5.17 5.17 0 0 1-.937.086C2.007 18.672 0 16.652 0 14.164c0-1.703.934-3.191 2.32-3.993a5.21 5.21 0 0 1-.215-1.496c0-2.875 2.316-5.207 5.172-5.207 1.02 0 1.97.297 2.726.932z"/>
      </svg>
    ),
  },
  {
    name: "HubSpot",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#FF7A59">
        <path d="M22.5 10.92a3.54 3.54 0 0 0-2.13-3.23V5.46a1.46 1.46 0 0 0 .84-1.32 1.47 1.47 0 1 0-2.94 0c0 .57.33 1.07.84 1.32v2.23a3.54 3.54 0 0 0-1.49.87L10.5 4.5a2.5 2.5 0 1 0-.82.82l6.93 4.45a3.54 3.54 0 1 0 5.89 1.15zM18.96 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#635BFF">
        <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-1.023 1.361-1.023 1.56 0 3.168.604 4.27 1.158l.63-3.85C16.089 3.72 14.44 3 12.343 3 9.01 3 6.75 4.803 6.75 7.563c0 2.824 2.051 4.03 4.336 4.85 1.67.593 2.225 1.044 2.225 1.78 0 .674-.556 1.112-1.56 1.112-1.399 0-3.375-.7-4.627-1.612l-.653 3.903c1.18.768 3.155 1.38 5.28 1.38 3.5 0 5.836-1.726 5.836-4.628 0-2.78-1.71-3.964-4.108-4.465z"/>
      </svg>
    ),
  },
  {
    name: "Chargebee",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#FF6B35">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.5 14.5h-3v-5h-2l5-5 5 5h-2v5h-3z"/>
      </svg>
    ),
  },
  {
    name: "Mixpanel",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#7856FF">
        <path d="M4 4h3.5l4.5 7 4.5-7H20v16h-3.5v-9.5L12 17.5l-4.5-7V20H4V4z"/>
      </svg>
    ),
  },
  {
    name: "Amplitude",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1B73E8">
        <path d="M12 2L2 20h4l1.5-3h9L18 20h4L12 2zm0 5.5l3 6H9l3-6z"/>
      </svg>
    ),
  },
  {
    name: "Intercom",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#286EFA">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM8 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
    ),
  },
  {
    name: "Zendesk",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#03363D">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H7l6-8v8h-2zm2-8h4l-6 8V8h2z"/>
      </svg>
    ),
  },
  {
    name: "Slack",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
      </svg>
    ),
  },
];

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: BarChart3,
    exact: true,
  },
  {
    label: "Revenue",
    href: "/dashboard/revenue",
    icon: TrendingUp,
    badge: "Pro",
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Product Analytics",
    href: "/dashboard/product",
    icon: Activity,
    badge: "Pro",
  },
  {
    label: "Health Center",
    href: "/dashboard/health",
    icon: HeartPulse,
    badge: "Pro",
  },
  {
    label: "Churn Prediction",
    href: "/dashboard/churn",
    icon: AlertTriangle,
    badge: "Pro",
  },
  {
    label: "Expansion Engine",
    href: "/dashboard/expansion",
    icon: Zap,
    badge: "Pro",
  },
  {
    label: "Forecasting",
    href: "/dashboard/forecasting",
    icon: LineChart,
    badge: "Pro",
  },
  {
    label: "AI Copilot",
    href: "/dashboard/copilot",
    icon: Bot,
    badge: "Pro",
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
          <BarChart3 className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Growth Intel</span>
      </div>

      {/* Organization */}
      <div className="px-3 py-3 border-b">
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 shrink-0">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{mockOrganization.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{mockOrganization.plan} plan</p>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Integrations */}
      <div className="px-3 py-3 border-t">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Integrations</p>
        <div className="grid grid-cols-3 gap-1">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              title={integration.name}
              className="flex flex-col items-center gap-1 rounded-md px-1 py-1.5 hover:bg-sidebar-accent cursor-pointer transition-colors group"
            >
              <div className="h-6 w-6 flex items-center justify-center">
                {integration.icon}
              </div>
              <span className="text-[9px] text-muted-foreground group-hover:text-foreground truncate w-full text-center leading-tight">
                {integration.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-3 py-3 border-t">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors",
            pathname.startsWith("/dashboard/settings") && "bg-sidebar-accent text-foreground font-medium",
          )}
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
