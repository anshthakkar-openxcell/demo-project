"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { mockCustomers } from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { Zap, TrendingUp, ArrowUpRight } from "lucide-react";

export function ExpansionEngine() {
  const opportunities = mockCustomers
    .filter((c) => c.expansionScore >= 50 && c.healthStatus !== "critical" && c.healthStatus !== "at_risk")
    .sort((a, b) => b.expansionScore - a.expansionScore);

  const totalPipeline = opportunities.reduce((s, c) => s + c.potentialExpansionArr, 0);

  const opsByType = [
    { type: "Tier Upgrade", icon: "🔼", customers: opportunities.filter((c) => c.expansionScore >= 75), desc: "Ready for next plan tier" },
    { type: "Seat Expansion", icon: "👥", customers: opportunities.filter((c) => c.expansionScore >= 60 && c.expansionScore < 75 && (c.activeUsers / c.totalSeats) > 0.8), desc: "Near seat capacity" },
    { type: "Add-on Features", icon: "✨", customers: opportunities.filter((c) => c.expansionScore >= 50 && c.expansionScore < 65), desc: "High adoption, untapped modules" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Expansion Opportunity Engine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-identified upsell and cross-sell opportunities across your portfolio</p>
        </div>
        <Button size="sm" variant="outline">Export Pipeline</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-emerald-600">{opportunities.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Expansion opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{formatCurrency(totalPipeline, { compact: true })}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Potential ARR pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{opportunities.filter((c) => c.expansionScore >= 75).length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">High-confidence opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-2xl font-bold">{formatCurrency(totalPipeline / (opportunities.length || 1), { compact: true })}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Avg. opportunity value</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {opportunities.map((customer) => (
          <Card key={customer.id} className="hover:border-foreground/20 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link href={`/dashboard/customers/${customer.id}`} className="text-sm font-semibold hover:text-primary">
                    {customer.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{customer.industry} · {customer.segment.replace("_", " ")}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">{customer.expansionScore}</div>
                  <div className="text-[10px] text-muted-foreground">score</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current ARR</span>
                  <span className="font-medium">{formatCurrency(customer.arr, { compact: true })}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Potential Expansion</span>
                  <span className="font-semibold text-emerald-600">+{formatCurrency(customer.potentialExpansionArr, { compact: true })}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Seat Utilization</span>
                  <span className="font-medium">{Math.round((customer.activeUsers / customer.totalSeats) * 100)}%</span>
                </div>
              </div>

              <Progress
                value={customer.expansionScore}
                className="h-1.5 mb-3 [&>div]:bg-emerald-500"
              />

              <div className="flex flex-wrap gap-1 mb-4">
                {customer.tags.filter((t) => t.includes("expansion") || t.includes("upgrade") || t.includes("advocate")).map((tag) => (
                  <span key={tag} className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/customers/${customer.id}`}>
                  View Account <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
