"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, Legend } from "recharts";
import { featureAdoptionData, engagementTrend, activationFunnel, powerUsers, usageTrends } from "@/lib/mock-data";
import { formatPercent, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Activity } from "lucide-react";

export function ProductAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Product Usage Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Feature adoption, engagement, and activation metrics</p>
        </div>
        <Button size="sm" variant="outline">Export</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><p className="text-2xl font-bold">391</p><p className="text-xs text-muted-foreground mt-0.5">Daily Active Users</p><Badge variant="success" className="mt-2 text-xs">+5.1% MoM</Badge></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-2xl font-bold">859</p><p className="text-xs text-muted-foreground mt-0.5">Monthly Active Users</p><Badge variant="success" className="mt-2 text-xs">+4.2% MoM</Badge></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-2xl font-bold">74.3%</p><p className="text-xs text-muted-foreground mt-0.5">Product Adoption Rate</p><Badge variant="success" className="mt-2 text-xs">+3.8% MoM</Badge></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-2xl font-bold">6,010</p><p className="text-xs text-muted-foreground mt-0.5">Sessions this month</p><Badge variant="success" className="mt-2 text-xs">+5.8% MoM</Badge></CardContent></Card>
      </div>

      <Tabs defaultValue="adoption">
        <TabsList>
          <TabsTrigger value="adoption">Feature Adoption</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="funnel">Activation Funnel</TabsTrigger>
          <TabsTrigger value="users">Power Users</TabsTrigger>
        </TabsList>

        <TabsContent value="adoption" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Feature Adoption Rates — Last 30 Days</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featureAdoptionData.map((f) => (
                  <div key={f.feature} className="flex items-center gap-3">
                    <span className="text-sm w-44 shrink-0">{f.feature}</span>
                    <Progress value={f.adoptionRate} className="flex-1 h-2" />
                    <span className="text-xs font-semibold w-10 text-right">{f.adoptionRate}%</span>
                    <div className={cn("flex items-center gap-0.5 text-xs w-14 shrink-0", f.trend > 0 ? "text-emerald-600" : "text-red-500")}>
                      {f.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(f.trend)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">User Engagement Trend · Mar – Aug 2024</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={usageTrends.categories.map((m, i) => ({
                  month: m,
                  DAU: usageTrends.series[0].data[i],
                  WAU: usageTrends.series[1].data[i],
                }))} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="WAU" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Activation Funnel</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activationFunnel.map((stage, i) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{stage.count.toLocaleString()} users</span>
                        <span className="font-semibold w-12 text-right">{stage.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={stage.percentage} className="h-3" />
                    {i < activationFunnel.length - 1 && (
                      <p className="text-xs text-muted-foreground text-right">
                        Drop-off: {activationFunnel[i].count - activationFunnel[i + 1].count} users ({formatPercent(100 - (activationFunnel[i + 1].count / activationFunnel[i].count * 100), 1)})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Power Users</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {["Company", "Sessions/Week", "Features Used", "Last Seen"].map((h) => (
                      <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {powerUsers.map((u) => (
                    <tr key={u.userId} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 pr-4 font-medium">{u.company}</td>
                      <td className="py-2.5 pr-4">{u.sessionsPerWeek}</td>
                      <td className="py-2.5 pr-4">{u.featuresUsed} / 10</td>
                      <td className="py-2.5 pr-4"><Badge variant="success" className="text-xs">{u.lastSeen}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
