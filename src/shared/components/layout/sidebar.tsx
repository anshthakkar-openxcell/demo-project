"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BarChart3, Users, Activity, TrendingUp, AlertTriangle,
  Zap, LineChart, FileText, Settings, ChevronRight,
  Building2, HeartPulse, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { mockOrganization } from "@/lib/mock-data";
import { triggerGlassShatter } from "./glass-shatter-overlay";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string;
  highlight?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Platform",
    items: [
      { label: "Overview", href: "/dashboard", icon: BarChart3, exact: true },
      { label: "Customers", href: "/dashboard/customers", icon: Users },
      { label: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Revenue", href: "/dashboard/revenue", icon: TrendingUp, badge: "Pro" },
      { label: "Health Center", href: "/dashboard/health", icon: HeartPulse, badge: "Pro" },
      { label: "Churn Prediction", href: "/dashboard/churn", icon: AlertTriangle, badge: "Pro" },
      { label: "Expansion Engine", href: "/dashboard/expansion", icon: Zap, badge: "Pro" },
      { label: "Forecasting", href: "/dashboard/forecasting", icon: LineChart, badge: "Pro" },
      { label: "Product Analytics", href: "/dashboard/product", icon: Activity, badge: "Pro" },
    ],
  },
  {
    label: "AI",
    items: [
      { label: "AI Copilot", href: "/dashboard/copilot", icon: Sparkles, badge: "Pro", highlight: true },
    ],
  },
];

const integrations = [
  { name: "Salesforce", color: "#00A1E0", letter: "SF" },
  { name: "HubSpot", color: "#FF7A59", letter: "HS" },
  { name: "Stripe", color: "#635BFF", letter: "S" },
  { name: "Mixpanel", color: "#7856FF", letter: "MX" },
  { name: "Intercom", color: "#286EFA", letter: "IC" },
  { name: "Slack", color: "#E01E5A", letter: "SL" },
];

function NavItemLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { resolvedTheme } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) return;
    if (resolvedTheme === "dark") {
      e.preventDefault();
      triggerGlassShatter(item.href);
    }
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-150 overflow-hidden",
        "active:scale-[0.96]",
        isActive
          ? "nav-item-active bg-primary/[0.12] text-primary font-medium border border-primary/20 shadow-[0_0_14px_rgba(139,127,255,0.10)]"
          : item.highlight
          ? "text-primary/70 hover:bg-violet-50 hover:text-primary dark:hover:bg-white/[0.06]"
          : "text-slate-500 hover:bg-violet-50 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white/85",
      )}
    >
      {isActive && (
        <>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary shadow-[0_0_8px_rgba(139,127,255,0.9)]" />
          {/* Active shimmer sweep */}
          <span className="nav-active-shimmer absolute inset-0 pointer-events-none" />
        </>
      )}
      <item.icon
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isActive
            ? "text-primary drop-shadow-[0_0_4px_rgba(139,127,255,0.7)]"
            : item.highlight
            ? "text-primary/60 group-hover:text-primary"
            : "text-slate-400 group-hover:text-slate-600 dark:text-white/30 dark:group-hover:text-white/70",
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {isActive ? (
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0 shadow-[0_0_4px_rgba(139,127,255,0.6)]" />
      ) : item.badge ? (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/60 shrink-0">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function SettingsLink({ pathname }: { pathname: string }) {
  const { resolvedTheme } = useTheme();
  const isActive = pathname.startsWith("/dashboard/settings");

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) return;
    if (resolvedTheme === "dark") {
      e.preventDefault();
      triggerGlassShatter("/dashboard/settings");
    }
  };

  return (
    <div className="px-3 pb-3 border-t border-violet-100 dark:border-white/[0.07] pt-2">
      <Link
        href="/dashboard/settings"
        onClick={handleClick}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-150 overflow-hidden",
          "active:scale-[0.96]",
          isActive
            ? "nav-item-active bg-primary/[0.12] text-primary font-medium border border-primary/20 shadow-[0_0_14px_rgba(139,127,255,0.10)]"
            : "text-slate-500 hover:bg-violet-50 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white/85",
        )}
      >
        {isActive && <span className="nav-active-shimmer absolute inset-0 pointer-events-none" />}
        <Settings className={cn(
          "h-3.5 w-3.5",
          isActive
            ? "text-primary drop-shadow-[0_0_4px_rgba(139,127,255,0.7)]"
            : "text-slate-400 group-hover:text-slate-600 dark:text-white/30 dark:group-hover:text-white/70",
        )} />
        <span>Settings</span>
      </Link>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  function isItemActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <aside className="w-56 shrink-0 border-r border-violet-100 bg-sidebar glass-sidebar flex flex-col dark:border-white/[0.07]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-violet-100 dark:border-white/[0.07] px-4">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
          <BarChart3 className="h-4 w-4 text-white" />
          <div className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-white/90">Growth Intel</span>
          <span className="block text-[9px] text-slate-400 dark:text-white/35 -mt-0.5 font-medium tracking-wide">AI Platform</span>
        </div>
      </div>

      {/* Organization switcher */}
      <div className="px-3 py-2.5 border-b border-violet-100 dark:border-white/[0.07]">
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-violet-50 dark:hover:bg-white/[0.06] transition-colors group">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-purple-600 shrink-0 shadow-sm shadow-violet-500/25">
            <Building2 className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-slate-700 dark:text-white/80">{mockOrganization.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-white/35 capitalize font-medium">
              {mockOrganization.plan} plan
            </p>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300 dark:text-white/25 shrink-0 group-hover:text-slate-500 dark:group-hover:text-white/50 transition-colors" />
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/25 px-2.5 mb-1.5">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItemLink key={item.href} item={item} isActive={isItemActive(item)} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Integrations */}
      <div className="px-3 pt-2 pb-3 border-t border-violet-100 dark:border-white/[0.07]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/25 px-2 mb-2">
          Connected
        </p>
        <div className="flex flex-wrap gap-1.5 px-1">
          {integrations.map((intg) => (
            <div
              key={intg.name}
              title={intg.name}
              className="h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white cursor-pointer hover:scale-110 transition-transform shadow-sm ring-1 ring-black/10 dark:ring-white/10"
              style={{ backgroundColor: intg.color }}
            >
              {intg.letter}
            </div>
          ))}
          <div
            title="Add integration"
            className="h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-semibold text-slate-400 dark:text-white/30 border border-dashed border-slate-200 dark:border-white/15 hover:border-primary/50 hover:text-primary cursor-pointer transition-colors"
          >
            +
          </div>
        </div>
      </div>

      {/* Settings */}
      <SettingsLink pathname={pathname} />
    </aside>
  );
}
