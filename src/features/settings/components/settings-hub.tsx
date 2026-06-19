"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { mockUser, mockTeamMembers, mockOrganization } from "@/lib/mock-data";
import { Building2, Users, CreditCard, Plug, Bell, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "@/shared/hooks/use-toast";

const integrationStatuses = {
  stripe: "connected",
  salesforce: "disconnected",
  hubspot: "disconnected",
  mixpanel: "connected",
  amplitude: "disconnected",
  intercom: "disconnected",
  zendesk: "disconnected",
  slack: "connected",
  chargebee: "disconnected",
};

const planFeatures = {
  free: ["Up to 50 customers", "Executive Overview", "Basic reports", "2 team members"],
  pro: ["Up to 500 customers", "All 10 modules", "AI Copilot (100 queries)", "Forecasting", "All integrations", "10 team members", "PDF/CSV/Excel exports"],
  enterprise: ["Unlimited customers", "Advanced AI", "Unlimited queries", "API access", "Custom integrations", "Unlimited team", "Dedicated CSM"],
};

export function SettingsHub() {
  function handleSave() {
    toast({ title: "Settings saved", description: "Your changes have been saved successfully." });
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your organization, team, billing, and integrations</p>
      </div>

      <Tabs defaultValue="organization">
        <TabsList>
          <TabsTrigger value="organization"><Building2 className="h-3.5 w-3.5 mr-1.5" />Organization</TabsTrigger>
          <TabsTrigger value="team"><Users className="h-3.5 w-3.5 mr-1.5" />Team</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="h-3.5 w-3.5 mr-1.5" />Billing</TabsTrigger>
          <TabsTrigger value="integrations"><Plug className="h-3.5 w-3.5 mr-1.5" />Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Organization Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue={mockOrganization.name} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input defaultValue={mockOrganization.slug} />
                </div>
              </div>
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Team Members</CardTitle>
                <Button size="sm">Invite Member</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {mockTeamMembers.map((member, i) => (
                  <div key={member.id}>
                    <div className="flex items-center gap-3 py-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.fullName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize text-xs">{member.role}</Badge>
                      <span className="text-xs text-muted-foreground">Joined {member.joinedAt}</span>
                      {member.role !== "owner" && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive">Remove</Button>
                      )}
                    </div>
                    {i < mockTeamMembers.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Current Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold capitalize">{mockOrganization.plan} Plan</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">$199/month · Billed monthly · Next billing: Sep 1, 2024</p>
                </div>
                <Button size="sm">Upgrade to Enterprise</Button>
              </div>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-2">
                {planFeatures[mockOrganization.plan].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Data Integrations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-0">
                {Object.entries(integrationStatuses).map(([provider, status], i) => (
                  <div key={provider}>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium capitalize">{provider}</p>
                        <p className="text-xs text-muted-foreground capitalize">{status === "connected" ? "Connected · Last synced 2h ago" : "Not connected"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status === "connected" ? "success" : "secondary"} className="text-xs">
                          {status}
                        </Badge>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          {status === "connected" ? "Configure" : "Connect"}
                        </Button>
                      </div>
                    </div>
                    {i < Object.entries(integrationStatuses).length - 1 && <Separator />}
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
