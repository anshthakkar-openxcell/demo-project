"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { FileText, Download, BarChart3, Users, Activity, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const reports = [
  {
    id: "exec-summary",
    title: "Executive Summary Report",
    description: "ARR, MRR, NRR, churn, retention, and AI insights for leadership",
    icon: BarChart3,
    formats: ["PDF", "Excel"],
    lastGenerated: "Aug 14, 2024",
    frequency: "Weekly",
    category: "Executive",
  },
  {
    id: "revenue-analysis",
    title: "Revenue Analysis Report",
    description: "Full revenue waterfall, cohort retention, segment breakdown",
    icon: TrendingUp,
    formats: ["PDF", "CSV", "Excel"],
    lastGenerated: "Aug 12, 2024",
    frequency: "Monthly",
    category: "Revenue",
  },
  {
    id: "customer-health",
    title: "Customer Health Report",
    description: "Health scores, at-risk accounts, churn predictions, intervention priorities",
    icon: Users,
    formats: ["PDF", "CSV"],
    lastGenerated: "Aug 14, 2024",
    frequency: "Weekly",
    category: "Customer Success",
  },
  {
    id: "product-adoption",
    title: "Product Adoption Report",
    description: "Feature adoption rates, activation funnel, engagement metrics",
    icon: Activity,
    formats: ["PDF", "CSV", "Excel"],
    lastGenerated: "Aug 10, 2024",
    frequency: "Monthly",
    category: "Product",
  },
  {
    id: "churn-risk",
    title: "Churn Risk Report",
    description: "High-risk customers ranked by probability, AI reasoning, recommended interventions",
    icon: FileText,
    formats: ["PDF", "CSV"],
    lastGenerated: "Aug 14, 2024",
    frequency: "Weekly",
    category: "Customer Success",
  },
  {
    id: "expansion-pipeline",
    title: "Expansion Pipeline Report",
    description: "Upsell and cross-sell opportunities, expansion scores, potential revenue impact",
    icon: TrendingUp,
    formats: ["PDF", "Excel"],
    lastGenerated: "Aug 12, 2024",
    frequency: "Monthly",
    category: "Revenue",
  },
];

export function ReportsHub() {
  function handleDownload(reportId: string, format: string) {
    alert(`Demo: Generating ${format} for ${reportId}. In production, this triggers a server-side report generation and download.`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate and export platform reports in PDF, CSV, or Excel</p>
        </div>
        <Button size="sm">Schedule Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="flex flex-col">
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 shrink-0">
                  <report.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{report.title}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">{report.category}</Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                {report.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{report.frequency}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>Last: {report.lastGenerated}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {report.formats.map((fmt) => (
                    <Button
                      key={fmt}
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleDownload(report.id, fmt)}
                    >
                      <Download className="h-3 w-3" />
                      {fmt}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Report", "Frequency", "Recipients", "Last Sent", "Status"].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Executive Weekly Digest", freq: "Every Monday 9am", recipients: "3 recipients", lastSent: "Aug 12, 2024", status: "Active" },
                { name: "Churn Risk Report", freq: "Every Friday 5pm", recipients: "5 recipients", lastSent: "Aug 9, 2024", status: "Active" },
                { name: "Monthly Revenue Review", freq: "1st of month", recipients: "2 recipients", lastSent: "Aug 1, 2024", status: "Active" },
              ].map((row) => (
                <tr key={row.name} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{row.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.freq}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.recipients}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.lastSent}</td>
                  <td className="py-3 pr-4"><Badge variant="success" className="text-xs">{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
