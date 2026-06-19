"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Phone, Mail, Calendar, TrendingUp, TrendingDown, AlertTriangle, Zap, Activity, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { MockCustomer } from "@/lib/mock-data";
import { formatCurrency, formatPercent, getDaysUntil, cn } from "@/lib/utils";

const healthBadgeVariant = {
  healthy: "success" as const,
  monitor: "warning" as const,
  at_risk: "orange" as const,
  critical: "destructive" as const,
};

const healthLabel = { healthy: "Healthy", monitor: "Monitor", at_risk: "At Risk", critical: "Critical" };

const mockUsageTrend = [
  { month: "Mar", dau: 0, sessions: 0 },
  { month: "Apr", dau: 0, sessions: 0 },
  { month: "May", dau: 0, sessions: 0 },
  { month: "Jun", dau: 0, sessions: 0 },
  { month: "Jul", dau: 0, sessions: 0 },
  { month: "Aug", dau: 0, sessions: 0 },
];

export function Customer360({ customer }: { customer: MockCustomer }) {
  const daysUntilRenewal = getDaysUntil(customer.renewalDate);

  const usageData = mockUsageTrend.map((m, i) => ({
    ...m,
    dau: Math.round(customer.activeUsers * (0.7 + Math.sin(i * 0.8) * 0.3)),
    sessions: Math.round(customer.activeUsers * (3 + Math.sin(i * 0.5) * 1.5)),
  }));

  const healthRadarData = [
    { subject: "Usage", value: customer.usageScore },
    { subject: "Revenue", value: customer.revenueScore },
    { subject: "Support", value: customer.supportScore },
    { subject: "Engagement", value: customer.engagementScore },
    { subject: "Adoption", value: Math.round((customer.activeUsers / customer.totalSeats) * 100) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/customers">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{customer.name}</h1>
              <Badge variant={healthBadgeVariant[customer.healthStatus]}>{healthLabel[customer.healthStatus]}</Badge>
              <Badge variant="secondary" className="capitalize">{customer.segment.replace("_", " ")}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
              <span>{customer.domain}</span>
              <span>·</span>
              <span>{customer.industry}</span>
              <span>·</span>
              <span>{customer.employeeCount.toLocaleString()} employees</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Phone className="h-4 w-4" />Call</Button>
          <Button size="sm" variant="outline"><Mail className="h-4 w-4" />Email</Button>
          <Button size="sm">Add Activity</Button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "ARR", value: formatCurrency(customer.arr, { compact: true }) },
          { label: "MRR", value: formatCurrency(customer.mrr, { compact: true }) },
          { label: "Health Score", value: `${customer.healthScore}/100` },
          { label: "Churn Risk", value: formatPercent(customer.churnProbability * 100, 0) },
          { label: "Active Users", value: `${customer.activeUsers}/${customer.totalSeats}` },
          { label: "Renewal", value: `${daysUntilRenewal > 0 ? `${daysUntilRenewal}d` : "Overdue"}` },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</p>
              <p className="text-xl font-bold mt-1">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Summary banner */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 shrink-0 mt-0.5">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AI Account Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {customer.healthStatus === "healthy" || customer.healthStatus === "monitor"
                  ? `${customer.name} is a ${customer.healthStatus === "healthy" ? "healthy" : "stable"} ${customer.segment.replace("_", " ")} account with ${formatCurrency(customer.arr)} ARR. Usage adoption is at ${Math.round((customer.activeUsers / customer.totalSeats) * 100)}% seat utilization with strong engagement scores. ${customer.expansionScore > 60 ? `Expansion opportunity identified — potential ${formatCurrency(customer.potentialExpansionArr)} additional ARR.` : "Continue nurturing relationship for renewal."}`
                  : `${customer.name} is showing concerning signals with a ${customer.healthScore}/100 health score. Active users dropped to ${customer.activeUsers} of ${customer.totalSeats} seats (${Math.round((customer.activeUsers / customer.totalSeats) * 100)}%). Churn probability is elevated at ${formatPercent(customer.churnProbability * 100, 0)} — immediate intervention recommended before ${customer.renewalDate} renewal.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Product Usage</TabsTrigger>
          <TabsTrigger value="health">Health Detail</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Usage Trend — Last 6 Months</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={usageData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                      <defs>
                        <linearGradient id="dauFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="dau" stroke="#3b82f6" strokeWidth={2} fill="url(#dauFill)" name="DAU" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Risk & Opportunity Signals</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {customer.churnProbability > 0.3 && (
                    <div className="flex gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">High Churn Risk</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Login frequency down, low seat utilization, renewal approaching</p>
                      </div>
                    </div>
                  )}
                  {customer.expansionScore > 60 && (
                    <div className="flex gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Expansion Opportunity</p>
                        <p className="text-xs text-muted-foreground mt-0.5">High adoption, near seat limit — potential {formatCurrency(customer.potentialExpansionArr, { compact: true })} additional ARR</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Renewal: {customer.renewalDate}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {daysUntilRenewal > 0 ? `${daysUntilRenewal} days away` : "Overdue"} · Contract started {customer.contractStart}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Health Radar</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={healthRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Account Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    ["CSM", customer.csmName],
                    ["Segment", customer.segment.replace("_", " ")],
                    ["Industry", customer.industry],
                    ["Employees", customer.employeeCount.toLocaleString()],
                    ["Contract Start", customer.contractStart],
                    ["Seats", `${customer.activeUsers} / ${customer.totalSeats}`],
                    ["Tags", customer.tags.join(", ")],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">{label}</span>
                      <span className="font-medium text-right capitalize">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Feature Adoption</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Dashboard", "Revenue Reports", "Health Center", "AI Copilot", "Exports", "Integrations"].map((f, i) => {
                  const rate = Math.max(0, Math.min(100, customer.usageScore - 10 + (i % 3) * 15 - (i % 2) * 8));
                  return (
                    <div key={f} className="flex items-center gap-3">
                      <span className="text-sm w-36 shrink-0">{f}</span>
                      <Progress value={rate} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-10 text-right">{rate}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Product Usage", score: customer.usageScore, description: "Daily active users, session frequency, feature breadth" },
              { label: "Revenue Health", score: customer.revenueScore, description: "Payment history, MRR stability, contract value" },
              { label: "Support Activity", score: customer.supportScore, description: "Ticket volume, CSAT, resolution time, escalations" },
              { label: "Engagement", score: customer.engagementScore, description: "Email open rates, meeting attendance, QBR recency" },
            ].map((factor) => (
              <Card key={factor.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-semibold">{factor.label}</p>
                    <span className={cn("text-xl font-bold", {
                      "text-emerald-600": factor.score >= 80,
                      "text-amber-600": factor.score >= 60 && factor.score < 80,
                      "text-orange-600": factor.score >= 40 && factor.score < 60,
                      "text-red-600": factor.score < 40,
                    })}>{factor.score}</span>
                  </div>
                  <Progress value={factor.score} className={cn("h-2 mb-2", {
                    "[&>div]:bg-emerald-500": factor.score >= 80,
                    "[&>div]:bg-amber-500": factor.score >= 60 && factor.score < 80,
                    "[&>div]:bg-orange-500": factor.score >= 40 && factor.score < 60,
                    "[&>div]:bg-red-500": factor.score < 40,
                  })} />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "email", icon: Mail, label: "Sent quarterly review deck", date: "2 days ago", user: customer.csmName },
                  { type: "call", icon: Phone, label: "Discovery call — renewal discussion", date: "1 week ago", user: customer.csmName },
                  { type: "note", icon: MessageSquare, label: "Champion expressed concern about adoption. Scheduled training.", date: "2 weeks ago", user: customer.csmName },
                  { type: "email", icon: Mail, label: "Onboarding follow-up email sent", date: "1 month ago", user: customer.csmName },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted shrink-0">
                      <activity.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.label}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} · {activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
