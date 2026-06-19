export const featureAdoptionData = [
  { feature: "Core Dashboard", adoptionRate: 98, activeUsers: 842, trend: 2 },
  { feature: "Revenue Reports", adoptionRate: 76, activeUsers: 654, trend: 8 },
  { feature: "Customer Health", adoptionRate: 68, activeUsers: 585, trend: 12 },
  { feature: "AI Copilot", adoptionRate: 54, activeUsers: 464, trend: 24 },
  { feature: "Churn Prediction", adoptionRate: 48, activeUsers: 413, trend: 15 },
  { feature: "Expansion Engine", adoptionRate: 41, activeUsers: 352, trend: 18 },
  { feature: "Forecasting", adoptionRate: 35, activeUsers: 301, trend: 6 },
  { feature: "Report Exports", adoptionRate: 62, activeUsers: 533, trend: -3 },
  { feature: "Integrations", adoptionRate: 29, activeUsers: 249, trend: 10 },
  { feature: "API Access", adoptionRate: 18, activeUsers: 155, trend: 22 },
];

export const engagementTrend = [
  { month: "Mar 24", dau: 312, wau: 542, mau: 721, sessions: 4820 },
  { month: "Apr 24", dau: 334, wau: 578, mau: 756, sessions: 5120 },
  { month: "May 24", dau: 358, wau: 612, mau: 798, sessions: 5480 },
  { month: "Jun 24", dau: 345, wau: 594, mau: 772, sessions: 5210 },
  { month: "Jul 24", dau: 372, wau: 638, mau: 824, sessions: 5680 },
  { month: "Aug 24", dau: 391, wau: 671, mau: 859, sessions: 6010 },
];

export const activationFunnel = [
  { stage: "Signed Up", count: 1200, percentage: 100 },
  { stage: "Completed Onboarding", count: 978, percentage: 81.5 },
  { stage: "Connected Integration", count: 742, percentage: 61.8 },
  { stage: "Created First Dashboard", count: 631, percentage: 52.6 },
  { stage: "Invited Team Member", count: 412, percentage: 34.3 },
  { stage: "Viewed AI Insights", count: 298, percentage: 24.8 },
  { stage: "Active (30d)", count: 859, percentage: 71.6 },
];

export const retentionCohorts = [
  { cohort: "Week 1", w1: 100, w2: 78, w4: 64, w8: 58, w12: 53 },
  { cohort: "Week 2", w1: 100, w2: 81, w4: 67, w8: 61, w12: 56 },
  { cohort: "Week 3", w1: 100, w2: 76, w4: 62, w8: 57, w12: 52 },
  { cohort: "Week 4", w1: 100, w2: 83, w4: 69, w8: 63, w12: null },
  { cohort: "Week 5", w1: 100, w2: 80, w4: 66, w8: null, w12: null },
  { cohort: "Week 6", w1: 100, w2: 79, w4: null, w8: null, w12: null },
];

export const powerUsers = [
  { userId: "usr-001", company: "Apex Technologies", sessionsPerWeek: 14, featuresUsed: 9, lastSeen: "Today" },
  { userId: "usr-002", company: "CloudNova Systems", sessionsPerWeek: 11, featuresUsed: 8, lastSeen: "Today" },
  { userId: "usr-003", company: "Nexus Analytics", sessionsPerWeek: 10, featuresUsed: 8, lastSeen: "Yesterday" },
  { userId: "usr-004", company: "Velocity Health", sessionsPerWeek: 9, featuresUsed: 7, lastSeen: "Today" },
  { userId: "usr-005", company: "DataBridge Corp", sessionsPerWeek: 8, featuresUsed: 7, lastSeen: "2 days ago" },
];

export const usageTrends = {
  categories: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  series: [
    { name: "DAU", data: [312, 334, 358, 345, 372, 391] },
    { name: "WAU", data: [542, 578, 612, 594, 638, 671] },
  ],
};
