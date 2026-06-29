"use client";

import { useMemo } from "react";
import {
  TrendingUp, TrendingDown, Users, DollarSign,
  Activity, ArrowUpRight, AlertTriangle, Zap, BarChart3,
  ShieldCheck, Target, Brain,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { currentMetrics, monthlyRevenue, aiInsights } from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

type MetricAccent = "blue" | "emerald" | "violet" | "amber" | "rose" | "indigo" | "sky" | "orange";

const accentConfig: Record<MetricAccent, {
  border: string;
  icon: string;
  trend: string;
}> = {
  blue:    { border: "border-t-blue-400",    icon: "bg-blue-500/10 text-blue-400",    trend: "text-blue-400" },
  emerald: { border: "border-t-emerald-400", icon: "bg-emerald-500/10 text-emerald-400", trend: "text-emerald-400" },
  violet:  { border: "border-t-violet-400",  icon: "bg-violet-500/10 text-violet-400", trend: "text-violet-400" },
  amber:   { border: "border-t-amber-400",   icon: "bg-amber-500/10 text-amber-400",   trend: "text-amber-400" },
  rose:    { border: "border-t-rose-400",    icon: "bg-rose-500/10 text-rose-400",    trend: "text-rose-400" },
  indigo:  { border: "border-t-indigo-400",  icon: "bg-indigo-500/10 text-indigo-400", trend: "text-indigo-400" },
  sky:     { border: "border-t-sky-400",     icon: "bg-sky-500/10 text-sky-400",     trend: "text-sky-400" },
  orange:  { border: "border-t-orange-400",  icon: "bg-orange-500/10 text-orange-400", trend: "text-orange-400" },
};

function MetricCard({
  title, value, change, changeLabel, icon: Icon, positive, accent,
}: {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  positive?: boolean;
  accent: MetricAccent;
}) {
  const isPositive = positive !== undefined ? positive : (change ?? 0) >= 0;
  const colors = accentConfig[accent];

  return (
    <Card className={cn("overflow-hidden border-t-2 transition-shadow hover:shadow-md", colors.border)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          </div>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", colors.icon)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-3 text-xs font-semibold",
            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{isPositive ? "+" : ""}{formatPercent(change)} {changeLabel ?? "vs last month"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const CHART_COLORS = {
  newBusiness: "#72f0aa",
  expansion: "#8b7fff",
  contraction: "#ffd47a",
  churn: "#ff78e0",
};

const insightIcons = {
  critical: { icon: AlertTriangle, cls: "text-rose-400 bg-rose-500/12 ring-1 ring-rose-500/20" },
  high: { icon: TrendingDown, cls: "text-amber-400 bg-amber-500/12 ring-1 ring-amber-500/20" },
  opportunity: { icon: Zap, cls: "text-emerald-400 bg-emerald-500/12 ring-1 ring-emerald-500/20" },
  info: { icon: Activity, cls: "text-sky-400 bg-sky-500/12 ring-1 ring-sky-500/20" },
};

const insightSeverityConfig = {
  critical: { badge: "destructive" as const },
  high:     { badge: "orange" as const },
  opportunity: { badge: "success" as const },
  info:     { badge: "info" as const },
};

export function ExecutiveOverview() {
  const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const periodLabel = latestMonth?.month ?? "Latest";

  const revenueChartData = useMemo(() =>
    monthlyRevenue.map((d) => ({
      month: d.month,
      ARR: Math.round(d.arr / 1000),
      MRR: Math.round(d.mrr / 1000),
    })),
    [],
  );

  const waterfallData = useMemo(() =>
    monthlyRevenue.slice(-3).map((d) => ({
      month: d.month,
      "New Business": Math.round(d.newBusiness / 1000),
      Expansion: Math.round(d.expansion / 1000),
      Churn: Math.round(Math.abs(d.churn) / 1000),
    })),
    [],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {periodLabel} · All figures in USD
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MetricCard accent="blue"    title="ARR"            value={formatCurrency(currentMetrics.arr, { compact: true })}  change={currentMetrics.arrGrowthMoM} icon={DollarSign} />
        <MetricCard accent="emerald" title="MRR"            value={formatCurrency(currentMetrics.mrr, { compact: true })}  change={currentMetrics.mrrGrowthMoM} icon={TrendingUp} />
        <MetricCard accent="violet"  title="NRR"            value={`${currentMetrics.nrr}%`}   change={currentMetrics.nrrChange} changeLabel="vs last quarter" icon={Activity} />
        <MetricCard accent="sky"     title="Active Customers" value={currentMetrics.activeCustomers.toString()} icon={Users} />
        <MetricCard accent="rose"    title="Churn Rate"     value={`${currentMetrics.churnRate}%`} change={-0.4} changeLabel="vs last month" positive icon={AlertTriangle} />
        <MetricCard accent="indigo"  title="LTV"            value={formatCurrency(currentMetrics.ltv, { compact: true })} icon={Target} />
        <MetricCard accent="amber"   title="CAC"            value={formatCurrency(currentMetrics.cac, { compact: true })} change={-3.2} changeLabel="vs last quarter" positive icon={TrendingDown} />
        <MetricCard accent="emerald" title="Retention"      value={`${currentMetrics.retentionRate}%`} change={1.1} icon={ShieldCheck} />
        <MetricCard accent="blue"    title="Expansion Rev." value={formatCurrency(currentMetrics.expansionRevenue, { compact: true })} change={12.4} icon={Zap} />
        <MetricCard accent="violet"  title="Product Adoption" value={`${currentMetrics.productAdoption}%`} change={3.8} icon={BarChart3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ARR Trend */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">ARR Growth Trend</CardTitle>
              <Badge variant="success" className="text-xs font-semibold">+{currentMetrics.arrGrowthMoM}% MoM</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b7fff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b7fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} width={48} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
                    backgroundColor: "rgba(14,12,36,0.90)",
                    backdropFilter: "blur(20px)",
                    color: "rgba(237,233,255,0.9)",
                  }}
                  formatter={(v: number) => [`$${v}K`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="ARR"
                  stroke="#8b7fff"
                  strokeWidth={2.5}
                  fill="url(#arrGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#8b7fff", strokeWidth: 2, stroke: "rgba(139,127,255,0.4)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground/60 mt-2 text-right">
              Source: Mock billing data · Sep 2023 – {periodLabel}
            </p>
          </CardContent>
        </Card>

        {/* Revenue Mix */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Revenue Mix (Last 3 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={waterfallData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
                    backgroundColor: "rgba(14,12,36,0.90)",
                    backdropFilter: "blur(20px)",
                    color: "rgba(237,233,255,0.9)",
                  }}
                  formatter={(v: number) => [`$${v}K`, ""]}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="New Business" fill={CHART_COLORS.newBusiness} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Expansion"    fill={CHART_COLORS.expansion}   radius={[3, 3, 0, 0]} />
                <Bar dataKey="Churn"        fill={CHART_COLORS.churn}       radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground/60 mt-2 text-right">Source: USD thousands</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">AI Insights Feed</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                {aiInsights.length} new
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-0">
            {aiInsights.map((insight, i) => {
              const sev = insightSeverityConfig[insight.severity];
              const iconCfg = insightIcons[insight.severity];
              const IconComponent = iconCfg.icon;
              return (
                <div key={insight.id}>
                  <div className="flex gap-3 py-3">
                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", iconCfg.cls)}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold leading-snug">{insight.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <span className="text-[10px] text-muted-foreground/60">{insight.timestamp}</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-primary/8 font-medium">
                          {insight.action} <ArrowUpRight className="h-3 w-3 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant={sev.badge} className="text-[10px] h-5 shrink-0 self-start mt-0.5">
                      {insight.severity === "opportunity"
                        ? "Opportunity"
                        : insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                    </Badge>
                  </div>
                  {i < aiInsights.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Revenue Health</p>
              <p className="text-sm leading-relaxed">
                ARR reached{" "}
                <span className="font-bold text-foreground">$1.09M</span> with NRR at{" "}
                <span className="font-bold text-emerald-600">109.4%</span>. Expansion revenue offsetting elevated churn.
              </p>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Top Risk</p>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-red-600">RetailPulse</span> and{" "}
                <span className="font-bold text-orange-600">Quantum Retail</span> carry{" "}
                <span className="font-bold">$144K ARR</span> at critical risk. Renewals in 45–90 days.
              </p>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Growth Opportunity</p>
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-emerald-600">CloudNova</span> &{" "}
                <span className="font-bold text-emerald-600">Velocity Health</span> at seat capacity —{" "}
                <span className="font-bold">$48K</span> potential expansion ARR.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Focus This Week</p>
              <ol className="space-y-2">
                {[
                  { n: 1, text: "Executive call with RetailPulse", urgency: "Critical" },
                  { n: 2, text: "Expansion proposal to CloudNova", urgency: "Growth" },
                  { n: 3, text: "QBR with Meridian Financial", urgency: "Health" },
                ].map(({ n, text, urgency }) => (
                  <li key={n} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">
                      {n}
                    </span>
                    <span className="text-sm text-muted-foreground leading-snug">
                      {text}{" "}
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", {
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": urgency === "Critical",
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": urgency === "Growth",
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400": urgency === "Health",
                      })}>
                        {urgency}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
