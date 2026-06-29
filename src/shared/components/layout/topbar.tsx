"use client";

import { Bell, Search, Moon, Sun, LogOut, User, CreditCard, ChevronRight, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { mockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAGE_NAMES: Record<string, string> = {
  "/dashboard": "Executive Overview",
  "/dashboard/revenue": "Revenue Intelligence",
  "/dashboard/customers": "Customers",
  "/dashboard/product": "Product Analytics",
  "/dashboard/health": "Health Center",
  "/dashboard/churn": "Churn Prediction",
  "/dashboard/expansion": "Expansion Engine",
  "/dashboard/forecasting": "Forecasting",
  "/dashboard/copilot": "AI Copilot",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

const NOTIFICATION_COUNT = 5;

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const initials = mockUser.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  const pageName =
    Object.entries(PAGE_NAMES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => pathname === path || pathname.startsWith(path + "/"))?.[1] ?? "Dashboard";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-violet-100 dark:border-white/[0.07] bg-background/95 backdrop-blur-sm glass-topbar px-6 sticky top-0 z-10">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-sm shrink-0">
        <span className="text-slate-400 dark:text-white/30 font-medium text-xs">Growth Intel</span>
        <ChevronRight className="h-3 w-3 text-slate-300 dark:text-white/20" />
        <span className="text-slate-700 dark:text-white/85 font-semibold text-sm">{pageName}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs ml-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-white/30" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 h-8 text-sm
              bg-white/70 border-violet-200/70 text-slate-700 placeholder:text-slate-400
              focus:bg-white focus:border-violet-400/60
              dark:bg-white/[0.06] dark:border-white/[0.1] dark:text-white/85 dark:placeholder:text-white/25
              dark:focus:bg-white/[0.09] dark:focus:border-white/20
              transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[10px] font-mono
            text-slate-300 bg-slate-50 border-slate-200
            dark:text-white/20 dark:bg-white/[0.05] dark:border-white/10
            px-1.5 py-0.5 rounded border">
            <span>⌘</span><span>K</span>
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold mr-2
          text-emerald-600 bg-emerald-50 border-emerald-200
          dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-700/40
          border px-2 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse dark:shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          Live
        </div>

        {/* Upgrade hint */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex h-8 gap-1.5 text-xs font-semibold text-primary hover:bg-primary/8 hover:text-primary"
        >
          <Zap className="h-3.5 w-3.5" />
          Upgrade
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"
              className="h-8 w-8 relative
                text-slate-500 hover:text-slate-700 hover:bg-slate-100
                dark:text-white/50 dark:hover:text-white/85 dark:hover:bg-white/[0.07]">
              <Bell className="h-4 w-4" />
              {NOTIFICATION_COUNT > 0 && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full text-[9px] font-bold text-white flex items-center justify-center dark:shadow-[0_0_8px_rgba(255,90,120,0.7)]",
                  "bg-rose-500",
                )}>
                  {NOTIFICATION_COUNT}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.08]">
              <p className="font-semibold text-sm">Notifications</p>
              <Badge variant="secondary" className="text-[10px]">{NOTIFICATION_COUNT} new</Badge>
            </div>
            {[
              { title: "RetailPulse churn risk escalated", time: "2m ago", dot: "bg-red-500" },
              { title: "CloudNova expansion proposal ready", time: "1h ago", dot: "bg-emerald-500" },
              { title: "Meridian Financial — QBR overdue", time: "3h ago", dot: "bg-amber-500" },
              { title: "August MRR report available", time: "1d ago", dot: "bg-blue-500" },
              { title: "SwiftPay renewal in 60 days", time: "2d ago", dot: "bg-orange-500" },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.05] cursor-pointer transition-colors border-b border-slate-100 dark:border-white/[0.06] last:border-0">
                <span className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", n.dot)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/[0.06]">
              <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-muted-foreground hover:text-foreground">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8
            text-slate-500 hover:text-slate-700 hover:bg-slate-100
            dark:text-white/50 dark:hover:text-white/85 dark:hover:bg-white/[0.07]"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost"
              className="h-8 gap-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.07]"
              aria-label="User menu">
              <Avatar className="h-6 w-6 ring-2 ring-primary/25 dark:shadow-[0_0_10px_rgba(139,127,255,0.3)]">
                <AvatarImage src={mockUser.avatarUrl ?? undefined} alt={mockUser.fullName ?? ""} />
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block text-slate-700 dark:text-white/75">{mockUser.fullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal pb-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold">{mockUser.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 cursor-pointer">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
