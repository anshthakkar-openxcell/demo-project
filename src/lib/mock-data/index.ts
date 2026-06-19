export * from "./customers";
export * from "./revenue";
export * from "./product-usage";

export const aiInsights = [
  {
    id: "insight-001",
    type: "churn_risk",
    severity: "critical" as const,
    title: "RetailPulse Inc renewal risk — 72% churn probability",
    description: "Login frequency dropped 84% in the past 30 days. Renewal is due in 45 days. Immediate executive outreach recommended.",
    customer: "RetailPulse Inc",
    customerId: "cust-004",
    action: "Schedule executive call",
    timestamp: "2 hours ago",
  },
  {
    id: "insight-002",
    type: "expansion",
    severity: "opportunity" as const,
    title: "CloudNova Systems is ready for tier upgrade",
    description: "Using 89% of seat capacity. Feature adoption at 94%. Strong candidate for Enterprise tier at +$36K ARR.",
    customer: "CloudNova Systems",
    customerId: "cust-003",
    action: "Send upgrade proposal",
    timestamp: "4 hours ago",
  },
  {
    id: "insight-003",
    type: "churn_risk",
    severity: "high" as const,
    title: "Meridian Financial showing disengagement signals",
    description: "Active users fell from 280 to 180 over 60 days. Support tickets increased 40%. QBR overdue by 3 months.",
    customer: "Meridian Financial",
    customerId: "cust-002",
    action: "Run QBR this week",
    timestamp: "6 hours ago",
  },
  {
    id: "insight-004",
    type: "revenue",
    severity: "info" as const,
    title: "August MRR declined 2.7% — churn events exceeded new business",
    description: "Two churn events totaling $15K MRR offset growth. Investigate Quantum Retail and SwiftPay intervention urgency.",
    customer: null,
    customerId: null,
    action: "Review churn report",
    timestamp: "1 day ago",
  },
  {
    id: "insight-005",
    type: "expansion",
    severity: "opportunity" as const,
    title: "Velocity Health NPS score: 9.2 — referral opportunity",
    description: "Highest NPS in your portfolio. Recommend requesting case study and warm introductions to peer companies.",
    customer: "Velocity Health",
    customerId: "cust-007",
    action: "Request referral",
    timestamp: "1 day ago",
  },
];

export const mockOrganization = {
  id: "org-001",
  name: "Acme Corp",
  slug: "acme-corp",
  plan: "pro" as const,
};

export const mockUser = {
  id: "user-001",
  email: "demo@acmecorp.com",
  fullName: "Alex Johnson",
  avatarUrl: null,
  role: "owner" as const,
};

export const mockTeamMembers = [
  { id: "user-001", fullName: "Alex Johnson", email: "demo@acmecorp.com", role: "owner" as const, joinedAt: "Jan 2024", avatarUrl: null },
  { id: "user-002", fullName: "Sarah Chen", email: "sarah@acmecorp.com", role: "admin" as const, joinedAt: "Feb 2024", avatarUrl: null },
  { id: "user-003", fullName: "James Park", email: "james@acmecorp.com", role: "member" as const, joinedAt: "Mar 2024", avatarUrl: null },
  { id: "user-004", fullName: "Maria Rodriguez", email: "maria@acmecorp.com", role: "member" as const, joinedAt: "Apr 2024", avatarUrl: null },
  { id: "user-005", fullName: "David Kim", email: "david@acmecorp.com", role: "member" as const, joinedAt: "May 2024", avatarUrl: null },
];
