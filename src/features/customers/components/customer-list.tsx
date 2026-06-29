"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, SlidersHorizontal, Users } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Progress } from "@/shared/components/ui/progress";
import { mockCustomers, healthDistribution, type MockCustomer } from "@/lib/mock-data";
import { formatCurrency, formatPercent, getDaysUntil, cn } from "@/lib/utils";

const healthConfig = {
  healthy:  { badge: "success" as const,     label: "Healthy",  bar: "[&>div]:bg-emerald-500", dot: "bg-emerald-500" },
  monitor:  { badge: "warning" as const,     label: "Monitor",  bar: "[&>div]:bg-amber-500",   dot: "bg-amber-500"   },
  at_risk:  { badge: "orange" as const,      label: "At Risk",  bar: "[&>div]:bg-orange-500",  dot: "bg-orange-500"  },
  critical: { badge: "destructive" as const, label: "Critical", bar: "[&>div]:bg-red-500",     dot: "bg-red-500"     },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
];

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border border-white/60 dark:border-white/10 shadow-sm", color)}>
      {initials}
    </div>
  );
}

function RenewalCell({ date }: { date: string }) {
  const days = getDaysUntil(date);
  const isUrgent = days > 0 && days < 60;
  const isWarning = days > 0 && days >= 60 && days < 90;
  return (
    <div className="space-y-0.5">
      <div className={cn("text-xs font-semibold", isUrgent ? "text-red-600 dark:text-red-400" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>
        {date}
      </div>
      <div className={cn("text-[10px] font-medium", isUrgent ? "text-red-500" : isWarning ? "text-amber-500" : "text-muted-foreground")}>
        {days > 0 ? `${days}d remaining` : days === 0 ? "Today" : "Overdue"}
      </div>
    </div>
  );
}

function SeatUtilization({ active, total }: { active: number; total: number }) {
  const pct = Math.round((active / total) * 100);
  const isHigh = pct >= 85;
  const isMed = pct >= 60;
  return (
    <div className="space-y-1 w-20">
      <div className="flex items-center justify-between text-[10px] font-medium">
        <span className={cn(isHigh ? "text-emerald-600 dark:text-emerald-400" : isMed ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
          {pct}%
        </span>
        <span className="text-muted-foreground/60">{active}/{total}</span>
      </div>
      <Progress
        value={pct}
        className={cn("h-1", isHigh ? "[&>div]:bg-emerald-500" : isMed ? "[&>div]:bg-amber-500" : "[&>div]:bg-slate-400")}
      />
    </div>
  );
}

const HEALTH_SUMMARY_COLORS = {
  healthy:  { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", activeBg: "bg-emerald-500/10 border-emerald-500" },
  monitor:  { text: "text-amber-600 dark:text-amber-400",    bg: "bg-amber-50 dark:bg-amber-900/20",    border: "border-amber-200 dark:border-amber-800",    activeBg: "bg-amber-500/10 border-amber-500" },
  at_risk:  { text: "text-orange-600 dark:text-orange-400",  bg: "bg-orange-50 dark:bg-orange-900/20",  border: "border-orange-200 dark:border-orange-800",  activeBg: "bg-orange-500/10 border-orange-500" },
  critical: { text: "text-red-600 dark:text-red-400",        bg: "bg-red-50 dark:bg-red-900/20",        border: "border-red-200 dark:border-red-800",        activeBg: "bg-red-500/10 border-red-500" },
};

export function CustomerList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"arr" | "health" | "name" | "churn">("arr");

  const filtered = mockCustomers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.csmName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.healthStatus === statusFilter;
      const matchSegment = segmentFilter === "all" || c.segment === segmentFilter;
      return matchSearch && matchStatus && matchSegment;
    })
    .sort((a, b) => {
      if (sortBy === "arr")    return b.arr - a.arr;
      if (sortBy === "health") return a.healthScore - b.healthScore;
      if (sortBy === "churn")  return b.churnProbability - a.churnProbability;
      return a.name.localeCompare(b.name);
    });

  const totalARR = mockCustomers.reduce((s, c) => s + c.arr, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockCustomers.length} customers · {formatCurrency(totalARR, { compact: true })} total ARR
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Users className="h-3.5 w-3.5" />
          Add Customer
        </Button>
      </div>

      {/* Health summary tiles */}
      <div className="grid grid-cols-4 gap-3">
        {(["healthy", "monitor", "at_risk", "critical"] as const).map((status) => {
          const colors = HEALTH_SUMMARY_COLORS[status];
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm",
                isActive ? colors.activeBg : cn("border-border hover:border-border/80", colors.bg, "border-transparent border"),
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn("h-2 w-2 rounded-full", healthConfig[status].dot)} />
                {isActive && <span className="text-[9px] font-semibold text-muted-foreground">ACTIVE</span>}
              </div>
              <div className={cn("text-2xl font-bold tabular-nums", colors.text)}>
                {healthDistribution[status]}
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">
                {healthConfig[status].label}
              </div>
              <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                {formatCurrency(
                  mockCustomers.filter((c) => c.healthStatus === status).reduce((s, c) => s + c.arr, 0),
                  { compact: true },
                )} ARR
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search name, domain, industry, CSM..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Health status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="monitor">Monitor</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All segments</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="mid_market">Mid-Market</SelectItem>
            <SelectItem value="smb">SMB</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arr">Sort by ARR</SelectItem>
            <SelectItem value="health">Sort by Health</SelectItem>
            <SelectItem value="churn">Sort by Churn Risk</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground ml-1">
          {filtered.length} of {mockCustomers.length} customers
        </p>
      </div>

      {/* Customer Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {["Customer", "ARR", "Seats", "Health", "Churn Risk", "Renewal", "CSM", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No customers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CustomerRow({ customer }: { customer: MockCustomer }) {
  const cfg = healthConfig[customer.healthStatus];

  const churnVariant =
    customer.churnProbability >= 0.5 ? "destructive" :
    customer.churnProbability >= 0.25 ? "orange" :
    customer.churnProbability >= 0.1 ? "warning" : "success";

  return (
    <tr className="hover:bg-muted/30 transition-colors group cursor-pointer">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.name} />
          <div className="space-y-0.5 min-w-0">
            <Link
              href={`/dashboard/customers/${customer.id}`}
              className="font-semibold hover:text-primary transition-colors text-sm block truncate"
            >
              {customer.name}
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground truncate">{customer.industry}</span>
              <Badge variant="secondary" className="text-[9px] py-0 h-3.5 capitalize font-medium">
                {customer.segment.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-bold tabular-nums">{formatCurrency(customer.arr, { compact: true })}</span>
        <div className="text-[10px] text-muted-foreground tabular-nums">/yr</div>
      </td>
      <td className="px-4 py-3">
        <SeatUtilization active={customer.activeUsers} total={customer.totalSeats} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
          <div className="space-y-0.5">
            <Badge variant={cfg.badge} className="text-[10px] h-5">
              {cfg.label}
            </Badge>
            <div className="text-[10px] text-muted-foreground tabular-nums">{customer.healthScore}/100</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={churnVariant} className="text-[10px] font-bold tabular-nums">
          {formatPercent(customer.churnProbability * 100, 0)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <RenewalCell date={customer.renewalDate} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
            {customer.csmName.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{customer.csmName.split(" ")[0]}</span>
        </div>
      </td>
      <td className="px-4 py-3 w-10">
        <Link href={`/dashboard/customers/${customer.id}`}>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        </Link>
      </td>
    </tr>
  );
}
