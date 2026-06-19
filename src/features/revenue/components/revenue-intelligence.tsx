"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
  monthlyRevenue, revenueWaterfall, cohortRetention,
  revenueBySegment, revenueByIndustry, currentMetrics,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Download } from "lucide-react";

const SEGMENT_COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
const WATERFALL_COLORS = {
  base: "#6366f1",
  positive: "#10b981",
  negative: "#ef4444",
};

const cohortColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8"];

export function RevenueIntelligence() {
  const chartData = monthlyRevenue.map((d) => ({
    month: d.month,
    ARR: Math.round(d.arr / 1000),
    MRR: Math.round(d.mrr / 1000),
    NRR: d.nrr,
  }));

  const mrrMovementData = monthlyRevenue.slice(-6).map((d) => ({
    month: d.month,
    "New Biz": Math.round(d.newBusiness / 1000),
    Expansion: Math.round(d.expansion / 1000),
    Contraction: Math.round(Math.abs(d.contraction) / 1000),
    Churn: Math.round(Math.abs(d.churn) / 1000),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Revenue Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Annual & monthly recurring revenue analysis</p>
        </div>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "ARR", value: formatCurrency(currentMetrics.arr, { compact: true }), change: `+${currentMetrics.arrGrowthMoM}%`, positive: true },
          { label: "MRR", value: formatCurrency(currentMetrics.mrr, { compact: true }), change: `+${currentMetrics.mrrGrowthMoM}%`, positive: true },
          { label: "NRR", value: `${currentMetrics.nrr}%`, change: `+${currentMetrics.nrrChange}%`, positive: true },
          { label: "Expansion Rev.", value: formatCurrency(currentMetrics.expansionRevenue, { compact: true }), change: "+12.4%", positive: true },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <Badge variant={m.positive ? "success" : "destructive"} className="mt-2 text-xs">{m.change} MoM</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">ARR Growth</TabsTrigger>
          <TabsTrigger value="movement">MRR Movement</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Retention</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">ARR & NRR Trend · Sep 2023 – Aug 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="arrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="arr" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                  <YAxis yAxisId="nrr" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[95, 115]} />
                  <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area yAxisId="arr" type="monotone" dataKey="ARR" stroke="#3b82f6" strokeWidth={2} fill="url(#arrFill)" dot={false} name="ARR ($K)" />
                  <Area yAxisId="nrr" type="monotone" dataKey="NRR" stroke="#10b981" strokeWidth={2} fill="none" dot={false} name="NRR (%)" />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-muted-foreground mt-2 text-right">ARR in USD thousands · NRR shown on right axis</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">MRR Movement by Category · Last 6 Months</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mrrMovementData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                  <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`$${v}K`, ""]} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="New Biz" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Expansion" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Contraction" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Churn" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cohort Retention by Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Cohort</th>
                      {["Month 1", "Month 2", "Month 3", "Month 6", "Month 9", "Month 12"].map((h) => (
                        <th key={h} className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortRetention.map((row) => (
                      <tr key={row.cohort} className="border-b last:border-0">
                        <td className="py-2 pr-4 text-xs font-medium">{row.cohort}</td>
                        {[row.m1, row.m2, row.m3, row.m6, row.m9, row.m12].map((val, i) => (
                          <td key={i} className="text-center py-1 px-3">
                            {val !== null ? (
                              <span
                                className="inline-block w-12 py-1 rounded text-xs font-medium text-white"
                                style={{
                                  backgroundColor: val >= 90 ? "#10b981" : val >= 80 ? "#3b82f6" : val >= 70 ? "#f59e0b" : "#ef4444",
                                  opacity: 0.7 + (val / 100) * 0.3,
                                }}
                              >
                                {val}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">ARR by Customer Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBySegment.map((seg, i) => (
                    <div key={seg.segment} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[i] }} />
                          <span className="font-medium">{seg.segment}</span>
                          <span className="text-muted-foreground text-xs">({seg.customers} customers)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{formatCurrency(seg.arr, { compact: true })}</span>
                          <span className="text-xs text-muted-foreground ml-2">{formatPercent(seg.percentage)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${seg.percentage}%`, backgroundColor: SEGMENT_COLORS[i] }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Avg ARR: {formatCurrency(seg.avgArr, { compact: true })}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">ARR by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueByIndustry.sort((a, b) => b.arr - a.arr).map((ind) => {
                    const pct = (ind.arr / currentMetrics.arr) * 100;
                    return (
                      <div key={ind.industry} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="truncate font-medium">{ind.industry}</span>
                            <span className="text-muted-foreground ml-2 shrink-0">{formatCurrency(ind.arr, { compact: true })}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-10 text-right">{formatPercent(pct)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
