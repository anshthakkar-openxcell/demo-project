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
