"use client";

import {
  TrendingUp, TrendingDown, Users, DollarSign,
  Activity, ArrowUpRight, AlertTriangle, Zap, BarChart3,
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

function MetricCard({
  title, value, change, changeLabel, icon: Icon, positive,
}: {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  const isPositive = positive !== undefined ? positive : (change ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-3 text-xs font-medium",
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

const COLORS = {
  newBusiness: "#10b981",
  expansion: "#3b82f6",
  contraction: "#f59e0b",
  churn: "#ef4444",
};

export function ExecutiveOverview() {
  const revenueChartData = monthlyRevenue.map((d) => ({
    month: d.month,
    ARR: Math.round(d.arr / 1000),
    MRR: Math.round(d.mrr / 1000),
  }));

  const waterfallData = monthlyRevenue.slice(-3).map((d) => ({
    month: d.month,
    "New Business": Math.round(d.newBusiness / 1000),
    Expansion: Math.round(d.expansion / 1000),
    Contraction: Math.round(Math.abs(d.contraction) / 1000),
    Churn: Math.round(Math.abs(d.churn) / 1000),
  }));

  const insightSeverityConfig = {
    critical: { badge: "destructive" as const, dot: "bg-red-500" },
    high: { badge: "orange" as const, dot: "bg-orange-500" },
    opportunity: { badge: "success" as const, dot: "bg-emerald-500" },
    info: { badge: "info" as const, dot: "bg-blue-500" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Executive Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            August 2024 · All figures in USD
          </p>
        </div>
        <Button size="sm" variant="outline">
          <BarChart3 className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MetricCard
          title="ARR"
          value={formatCurrency(currentMetrics.arr, { compact: true })}
          change={currentMetrics.arrGrowthMoM}
          icon={DollarSign}
        />
        <MetricCard
          title="MRR"
          value={formatCurrency(currentMetrics.mrr, { compact: true })}
          change={currentMetrics.mrrGrowthMoM}
          icon={TrendingUp}
        />
        <MetricCard
          title="NRR"
          value={`${currentMetrics.nrr}%`}
          change={currentMetrics.nrrChange}
          changeLabel="vs last quarter"
          icon={Activity}
        />
        <MetricCard
          title="Active Customers"
          value={currentMetrics.activeCustomers.toString()}
          icon={Users}
        />
        <MetricCard
          title="Churn Rate"
          value={`${currentMetrics.churnRate}%`}
          change={-0.4}
          changeLabel="vs last month"
          positive
          icon={AlertTriangle}
        />
        <MetricCard
          title="LTV"
          value={formatCurrency(currentMetrics.ltv, { compact: true })}
          icon={DollarSign}
        />
        <MetricCard
          title="CAC"
          value={formatCurrency(currentMetrics.cac, { compact: true })}
          change={-3.2}
          changeLabel="vs last quarter"
          positive
          icon={TrendingDown}
        />
        <MetricCard
          title="Retention"
          value={`${currentMetrics.retentionRate}%`}
          change={1.1}
          icon={Activity}
        />
        <MetricCard
          title="Expansion Rev."
          value={formatCurrency(currentMetrics.expansionRevenue, { compact: true })}
          change={12.4}
          icon={Zap}
        />
        <MetricCard
          title="Product Adoption"
          value={`${currentMetrics.productAdoption}%`}
          change={3.8}
          icon={BarChart3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ARR Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">ARR Growth Trend</CardTitle>
              <Badge variant="success" className="text-xs">+{currentMetrics.arrGrowthMoM}% MoM</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number) => [`$${v}K`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="ARR"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#arrGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground mt-2 text-right">Source: Mock billing data · Sep 2023 – Aug 2024</p>
          </CardContent>
        </Card>

        {/* Revenue Mix */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Revenue Mix (Last 3 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={waterfallData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number) => [`$${v}K`, ""]}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="New Business" fill={COLORS.newBusiness} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Expansion" fill={COLORS.expansion} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Churn" fill={COLORS.churn} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground mt-2 text-right">Source: Mock billing data · USD thousands</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">AI Insights Feed</CardTitle>
              <Badge variant="secondary" className="text-xs">5 new</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-0">
            {aiInsights.map((insight, i) => {
              const config = insightSeverityConfig[insight.severity];
              return (
                <div key={insight.id}>
                  <div className="flex gap-3 py-3">
                    <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", config.dot)} />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium leading-snug">{insight.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <span className="text-[10px] text-muted-foreground">{insight.timestamp}</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          {insight.action} <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant={config.badge} className="text-[10px] h-5 shrink-0">
                      {insight.severity === "opportunity" ? "Opportunity" : insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                    </Badge>
                  </div>
                  {i < aiInsights.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue Health</p>
              <p className="text-sm leading-relaxed">ARR reached <span className="font-semibold">$1.09M</span> in August with NRR at <span className="font-semibold text-emerald-600">109.4%</span>. Expansion revenue offsetting elevated churn from 2 enterprise accounts.</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Risk</p>
              <p className="text-sm leading-relaxed"><span className="font-semibold text-red-600">RetailPulse Inc</span> and <span className="font-semibold text-orange-600">Quantum Retail</span> carry combined $144K ARR at critical churn risk. Renewal windows open in 45–90 days.</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Growth Opportunity</p>
              <p className="text-sm leading-relaxed"><span className="font-semibold text-emerald-600">CloudNova</span> and <span className="font-semibold text-emerald-600">Velocity Health</span> are at seat capacity — combined <span className="font-semibold">$48K</span> potential expansion ARR identified.</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Focus This Week</p>
              <ol className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex gap-2"><span className="font-semibold text-foreground">1.</span> Executive call with RetailPulse — critical retention</li>
                <li className="flex gap-2"><span className="font-semibold text-foreground">2.</span> Expansion proposal to CloudNova</li>
                <li className="flex gap-2"><span className="font-semibold text-foreground">3.</span> QBR with Meridian Financial</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
