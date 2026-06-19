"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Progress } from "@/shared/components/ui/progress";
import { mockCustomers, healthDistribution, type MockCustomer } from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

const healthBadgeVariant = {
  healthy: "success" as const,
  monitor: "warning" as const,
  at_risk: "orange" as const,
  critical: "destructive" as const,
};

const healthLabel = {
  healthy: "Healthy",
  monitor: "Monitor",
  at_risk: "At Risk",
  critical: "Critical",
};

export function CustomerList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"arr" | "health" | "name">("arr");

  const filtered = mockCustomers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.healthStatus === statusFilter;
      const matchSegment = segmentFilter === "all" || c.segment === segmentFilter;
      return matchSearch && matchStatus && matchSegment;
    })
    .sort((a, b) => {
      if (sortBy === "arr") return b.arr - a.arr;
      if (sortBy === "health") return a.healthScore - b.healthScore;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{mockCustomers.length} customers · {formatCurrency(mockCustomers.reduce((s, c) => s + c.arr, 0), { compact: true })} total ARR</p>
        </div>
        <Button size="sm">Add Customer</Button>
      </div>

      {/* Health summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["healthy", "monitor", "at_risk", "critical"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              statusFilter === status ? "border-foreground bg-muted" : "hover:bg-muted/50",
            )}
          >
            <div className={cn("text-2xl font-bold", {
              "text-emerald-600 dark:text-emerald-400": status === "healthy",
              "text-amber-600 dark:text-amber-400": status === "monitor",
              "text-orange-600 dark:text-orange-400": status === "at_risk",
              "text-red-600 dark:text-red-400": status === "critical",
            })}>
              {healthDistribution[status]}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-0.5">{healthLabel[status]}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, domain, or industry..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9">
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
          <SelectTrigger className="w-36 h-9">
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
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arr">Sort by ARR</SelectItem>
            <SelectItem value="health">Sort by Health</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
        <p className="flex items-center text-sm text-muted-foreground">{filtered.length} results</p>
      </div>

      {/* Customer Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Customer", "ARR", "MRR", "Health", "Churn Risk", "Renewal", "CSM"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {customer.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{customer.industry}</span>
                        <Badge variant="secondary" className="text-[10px] py-0 h-4 capitalize">
                          {customer.segment.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(customer.arr, { compact: true })}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatCurrency(customer.mrr, { compact: true })}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16">
                        <Progress
                          value={customer.healthScore}
                          className={cn("h-1.5", {
                            "[&>div]:bg-emerald-500": customer.healthStatus === "healthy",
                            "[&>div]:bg-amber-500": customer.healthStatus === "monitor",
                            "[&>div]:bg-orange-500": customer.healthStatus === "at_risk",
                            "[&>div]:bg-red-500": customer.healthStatus === "critical",
                          })}
                        />
                      </div>
                      <Badge variant={healthBadgeVariant[customer.healthStatus]} className="text-[10px]">
                        {healthLabel[customer.healthStatus]}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        customer.churnProbability >= 0.5 ? "destructive" :
                        customer.churnProbability >= 0.25 ? "orange" :
                        customer.churnProbability >= 0.1 ? "warning" : "success"
                      }
                      className="text-[10px]"
                    >
                      {formatPercent(customer.churnProbability * 100, 0)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {customer.renewalDate}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {customer.csmName}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
