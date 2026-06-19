"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { forecastData, monthlyRevenue, currentMetrics } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function ForecastingCenter() {
  const [scenario, setScenario] = useState<"best" | "expected" | "worst">("expected");

  const historicalArr = monthlyRevenue.slice(-6).map((d) => ({
    period: d.month,
    actual: Math.round(d.arr / 1000),
  }));

  const forecastArr = forecastData.arr.map((d) => ({
    period: d.period,
    bestCase: Math.round(d.bestCase / 1000),
    expected: Math.round(d.expected / 1000),
    worstCase: Math.round(d.worstCase / 1000),
  }));

  const combinedArr = [
    ...historicalArr.map((d) => ({ ...d, bestCase: null as number | null, expected: null as number | null, worstCase: null as number | null })),
    ...forecastArr.map((d) => ({ ...d, actual: null as number | null })),
  ];

  const lastForecast = forecastData.arr[forecastData.arr.length - 1];
  const scenarioConfig = {
    best: { label: "Best Case", color: "#10b981", value: lastForecast?.bestCase ?? 0 },
    expected: { label: "Expected", color: "#3b82f6", value: lastForecast?.expected ?? 0 },
    worst: { label: "Worst Case", color: "#ef4444", value: lastForecast?.worstCase ?? 0 },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Forecasting Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Revenue forecasts with scenario planning</p>
        </div>
        <Button size="sm" variant="outline">Export Forecast</Button>
      </div>

      {/* Scenario selector */}
      <div className="grid grid-cols-3 gap-4">
        {(["best", "expected", "worst"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              scenario === s ? "border-foreground bg-muted" : "hover:bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {s === "best" ? <TrendingUp className="h-4 w-4 text-emerald-600" /> :
               s === "expected" ? <Minus className="h-4 w-4 text-blue-600" /> :
               <TrendingDown className="h-4 w-4 text-red-600" />}
              <span className="text-xs font-semibold text-muted-foreground uppercase">{scenarioConfig[s].label}</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(scenarioConfig[s].value, { compact: true })}</p>
            <p className="text-xs text-muted-foreground mt-0.5">ARR by Feb 2025</p>
            <div className={cn("text-xs font-medium mt-1", {
              "text-emerald-600": s === "best",
              "text-blue-600": s === "expected",
              "text-red-600": s === "worst",
            })}>
              {s === "best" ? "+49%" : s === "expected" ? "+36%" : "+20%"} from current
            </div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">ARR Forecast · {scenarioConfig[scenario].label} Scenario</CardTitle>
            <Badge variant="secondary" className="text-xs">6-month horizon</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={combinedArr} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={scenarioConfig[scenario].color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={scenarioConfig[scenario].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number, name: string) => [`$${v}K`, name]}
              />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fill="url(#actualFill)" name="Actual ARR" connectNulls={false} />
              <Area type="monotone" dataKey={scenario === "best" ? "bestCase" : scenario === "worst" ? "worstCase" : "expected"}
                stroke={scenarioConfig[scenario].color} strokeWidth={2} strokeDasharray="5 5"
                fill="url(#forecastFill)" name="Forecast ARR" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2 text-right">Dashed line = forecast · ARR in USD thousands · Historical: Mar–Aug 2024 · Forecast: Sep 2024–Feb 2025</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Forecast Assumptions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[
                ["Monthly new business", "$22–38K MRR"],
                ["Expansion rate", "8–15% of existing ARR"],
                ["Expected churn rate", "3.5–5.5% annually"],
                ["Contraction assumption", "1–2% of ARR"],
                ["Forecast confidence", "78%"],
                ["Model last updated", "Aug 14, 2024"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Scenario Comparison at 6 Months</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(["best", "expected", "worst"] as const).map((s) => {
                const uplift = ((scenarioConfig[s].value - currentMetrics.arr) / currentMetrics.arr * 100).toFixed(0);
                return (
                  <div key={s} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{scenarioConfig[s].label}</span>
                      <span className="font-bold">{formatCurrency(scenarioConfig[s].value, { compact: true })}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (scenarioConfig[s].value / scenarioConfig.best.value) * 100)}%`,
                          backgroundColor: scenarioConfig[s].color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">+{uplift}% growth from current ARR</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
