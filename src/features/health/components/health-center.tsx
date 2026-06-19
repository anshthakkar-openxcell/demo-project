"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { mockCustomers, healthDistribution } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { AlertTriangle, TrendingDown, Activity, Zap } from "lucide-react";

const HEALTH_COLORS = { healthy: "#10b981", monitor: "#f59e0b", at_risk: "#f97316", critical: "#ef4444" };
const HEALTH_LABELS = { healthy: "Healthy", monitor: "Monitor", at_risk: "At Risk", critical: "Critical" };
const HEALTH_BADGE = {
  healthy: "success" as const, monitor: "warning" as const, at_risk: "orange" as const, critical: "destructive" as const,
};

export function HealthCenter() {
  const pieData = (["healthy", "monitor", "at_risk", "critical"] as const).map((s) => ({
    name: HEALTH_LABELS[s],
    value: healthDistribution[s],
    color: HEALTH_COLORS[s],
  }));

  const barData = mockCustomers
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 8)
    .map((c) => ({ name: c.name.split(" ")[0], score: c.healthScore, status: c.healthStatus }));

  const atRiskCustomers = mockCustomers.filter((c) =>
    c.healthStatus === "at_risk" || c.healthStatus === "critical",
  ).sort((a, b) => a.healthScore - b.healthScore);

  const atRiskArr = atRiskCustomers.reduce((s, c) => s + c.arr, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Customer Health Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-computed health scores across your portfolio</p>
        </div>
        <Button size="sm" variant="outline">Export Report</Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["healthy", "monitor", "at_risk", "critical"] as const).map((s) => (
          <Card key={s}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: HEALTH_COLORS[s] }}>{healthDistribution[s]}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{HEALTH_LABELS[s]}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(
                    mockCustomers.filter((c) => c.healthStatus === s).reduce((sum, c) => sum + c.arr, 0),
                    { compact: true },
                  )} ARR
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Distribution pie */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Portfolio Health Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Customer Health Scores (Lowest 8)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 40 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={45} />
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={HEALTH_COLORS[entry.status as keyof typeof HEALTH_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Customers */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Customers Requiring Attention</CardTitle>
            <Badge variant="destructive">{atRiskCustomers.length} customers · {formatCurrency(atRiskArr, { compact: true })} ARR at risk</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {atRiskCustomers.map((customer, i) => (
              <div key={customer.id}>
                <div className="py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-sm font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={customer.healthScore}
                          className={cn("h-2 flex-1", {
                            "[&>div]:bg-orange-500": customer.healthStatus === "at_risk",
                            "[&>div]:bg-red-500": customer.healthStatus === "critical",
                          })}
                        />
                        <span className="text-sm font-bold text-red-600">{customer.healthScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ARR · Churn Risk</p>
                      <p className="text-sm font-medium mt-0.5">
                        {formatCurrency(customer.arr, { compact: true })} ·{" "}
                        <span className="text-red-600">{Math.round(customer.churnProbability * 100)}%</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recommended Action</p>
                      <p className="text-xs font-medium mt-0.5 text-orange-700 dark:text-orange-400">
                        {customer.healthScore < 40 ? "Executive escalation required" : "Schedule QBR this week"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={HEALTH_BADGE[customer.healthStatus]}>
                    {HEALTH_LABELS[customer.healthStatus]}
                  </Badge>
                </div>
                {i < atRiskCustomers.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
