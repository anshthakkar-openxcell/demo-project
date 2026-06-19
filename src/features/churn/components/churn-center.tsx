"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { mockCustomers } from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { AlertTriangle, ChevronRight, Brain } from "lucide-react";

const riskBadge = {
  low: "success" as const, medium: "warning" as const, high: "orange" as const, critical: "destructive" as const,
};

const riskFactorsByCustomer: Record<string, string[]> = {
  "cust-004": ["Login frequency dropped 84%", "Only 15% seat utilization", "3 support escalations in 30 days", "No QBR in 6 months", "Renewal in 45 days"],
  "cust-012": ["DAU fell from 120 to 45", "Champion left company", "Competitor evaluation noted", "NPS score: 4/10", "Contract up for renewal in 90 days"],
  "cust-009": ["Usage down 60% MoM", "Missed last two check-ins", "Budget freeze mentioned", "Feature requests unanswered 60+ days"],
  "cust-002": ["Active users dropped 180→140", "Support tickets +40%", "QBR overdue 3 months", "Secondary champion disengaged"],
  "cust-006": ["Seat utilization at 60%", "Feature adoption stalled", "Pricing objection raised at last QBR"],
};

const interventions: Record<string, string[]> = {
  "cust-004": ["Schedule CEO-to-CEO call within 48h", "Offer complimentary onboarding session", "Provide usage improvement plan", "Create custom ROI report"],
  "cust-012": ["Re-engage with new champion immediately", "Executive escalation: arrange onsite visit", "Offer competitive migration incentive"],
  "cust-009": ["Immediate outreach from CSM", "Offer flexible payment arrangement", "Fast-track pending feature requests"],
  "cust-002": ["Schedule QBR this week", "Send re-engagement campaign", "Provide dedicated support channel"],
  "cust-006": ["Run QBR with usage review", "Offer tier flexibility discussion", "Deliver feature adoption training"],
};

export function ChurnCenter() {
  const riskyCustomers = mockCustomers
    .filter((c) => c.churnProbability >= 0.15)
    .sort((a, b) => b.churnProbability - a.churnProbability);

  const totalAtRiskArr = riskyCustomers.reduce((s, c) => s + c.arr, 0);

  const churnByRisk = [
    { risk: "Critical (>60%)", count: riskyCustomers.filter((c) => c.churnProbability >= 0.6).length, arr: riskyCustomers.filter((c) => c.churnProbability >= 0.6).reduce((s, c) => s + c.arr, 0) },
    { risk: "High (40–60%)", count: riskyCustomers.filter((c) => c.churnProbability >= 0.4 && c.churnProbability < 0.6).length, arr: riskyCustomers.filter((c) => c.churnProbability >= 0.4 && c.churnProbability < 0.6).reduce((s, c) => s + c.arr, 0) },
    { risk: "Medium (25–40%)", count: riskyCustomers.filter((c) => c.churnProbability >= 0.25 && c.churnProbability < 0.4).length, arr: riskyCustomers.filter((c) => c.churnProbability >= 0.25 && c.churnProbability < 0.4).reduce((s, c) => s + c.arr, 0) },
    { risk: "Monitor (15–25%)", count: riskyCustomers.filter((c) => c.churnProbability >= 0.15 && c.churnProbability < 0.25).length, arr: riskyCustomers.filter((c) => c.churnProbability >= 0.15 && c.churnProbability < 0.25).reduce((s, c) => s + c.arr, 0) },
  ];

  const barColors = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Churn Prediction Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered churn risk scoring and intervention playbooks</p>
        </div>
        <Button size="sm" variant="outline">Export Risk Report</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-red-200 dark:border-red-900/50">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-red-600">{riskyCustomers.filter((c) => c.churnProbability >= 0.5).length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Critical risk customers</p>
            <p className="text-xs font-medium text-red-600 mt-1">{formatCurrency(riskyCustomers.filter((c) => c.churnProbability >= 0.5).reduce((s, c) => s + c.arr, 0), { compact: true })} ARR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{riskyCustomers.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Customers flagged for risk</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{formatCurrency(totalAtRiskArr, { compact: true })} total ARR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{formatPercent(mockCustomers.filter((c) => c.churnProbability < 0.1).length / mockCustomers.length * 100, 0)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Customers low risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{formatCurrency(totalAtRiskArr, { compact: true })}</p>
            <p className="text-xs text-muted-foreground mt-0.5">ARR at risk total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Risk Distribution by ARR</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={churnByRisk} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <YAxis type="category" dataKey="risk" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={88} />
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [formatCurrency(v, { compact: true }), "ARR"]} />
                <Bar dataKey="arr" radius={[0, 3, 3, 0]}>
                  {churnByRisk.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">High-Risk Customers with AI Reasoning</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {riskyCustomers.slice(0, 4).map((c, i) => (
                <div key={c.id}>
                  <div className="py-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <Link href={`/dashboard/customers/${c.id}`} className="text-sm font-semibold hover:text-primary">{c.name}</Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{formatCurrency(c.arr, { compact: true })} ARR</span>
                          <span className="text-xs text-muted-foreground">· Renews {c.renewalDate}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-red-600">{Math.round(c.churnProbability * 100)}%</div>
                        <Badge variant={riskBadge[c.riskLevel]} className="text-[10px]">{c.riskLevel}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Brain className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {(riskFactorsByCustomer[c.id] ?? ["Usage declining", "Engagement low"]).slice(0, 2).join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(interventions[c.id] ?? ["Schedule call", "Send check-in"]).slice(0, 2).map((action) => (
                        <span key={action} className="text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < 3 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
