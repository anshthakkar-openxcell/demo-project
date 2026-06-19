export type RevenueDataPoint = {
  month: string;
  arr: number;
  mrr: number;
  newBusiness: number;
  expansion: number;
  contraction: number;
  churn: number;
  nrr: number;
  activeCustomers: number;
};

export const monthlyRevenue: RevenueDataPoint[] = [
  { month: "Sep 23", arr: 720000, mrr: 60000, newBusiness: 28000, expansion: 8000, contraction: -3000, churn: -5000, nrr: 101.2, activeCustomers: 8 },
  { month: "Oct 23", arr: 756000, mrr: 63000, newBusiness: 22000, expansion: 12000, contraction: -2000, churn: -4000, nrr: 104.1, activeCustomers: 9 },
  { month: "Nov 23", arr: 810000, mrr: 67500, newBusiness: 35000, expansion: 9000, contraction: -4000, churn: -6000, nrr: 102.8, activeCustomers: 9 },
  { month: "Dec 23", arr: 792000, mrr: 66000, newBusiness: 18000, expansion: 6000, contraction: -3000, churn: -10000, nrr: 99.4, activeCustomers: 9 },
  { month: "Jan 24", arr: 840000, mrr: 70000, newBusiness: 32000, expansion: 14000, contraction: -2000, churn: -8000, nrr: 105.2, activeCustomers: 10 },
  { month: "Feb 24", arr: 888000, mrr: 74000, newBusiness: 29000, expansion: 18000, contraction: -1000, churn: -5000, nrr: 107.8, activeCustomers: 10 },
  { month: "Mar 24", arr: 936000, mrr: 78000, newBusiness: 38000, expansion: 11000, contraction: -3000, churn: -7000, nrr: 103.9, activeCustomers: 11 },
  { month: "Apr 24", arr: 984000, mrr: 82000, newBusiness: 26000, expansion: 22000, contraction: -2000, churn: -9000, nrr: 106.1, activeCustomers: 11 },
  { month: "May 24", arr: 1044000, mrr: 87000, newBusiness: 42000, expansion: 16000, contraction: -4000, churn: -6000, nrr: 108.4, activeCustomers: 12 },
  { month: "Jun 24", arr: 1080000, mrr: 90000, newBusiness: 24000, expansion: 14000, contraction: -2000, churn: -12000, nrr: 104.7, activeCustomers: 12 },
  { month: "Jul 24", arr: 1116000, mrr: 93000, newBusiness: 30000, expansion: 10000, contraction: -3000, churn: -8000, nrr: 105.9, activeCustomers: 12 },
  { month: "Aug 24", arr: 1086000, mrr: 90500, newBusiness: 18000, expansion: 8000, contraction: -5000, churn: -15000, nrr: 99.8, activeCustomers: 12 },
];

export const currentMetrics = {
  arr: 1086000,
  mrr: 90500,
  nrr: 109.4,
  cac: 8200,
  ltv: 64500,
  retentionRate: 91.2,
  churnRate: 3.8,
  expansionRevenue: 182000,
  activeCustomers: 12,
  productAdoption: 74.3,
  arrGrowthMoM: 8.4,
  mrrGrowthMoM: 8.4,
  nrrChange: 2.1,
  cacPayback: 14.2,
  ltvCacRatio: 7.9,
};

export const revenueWaterfall = [
  { category: "Starting ARR", value: 720000, type: "base" as const },
  { category: "New Business", value: 287000, type: "positive" as const },
  { category: "Expansion", value: 148000, type: "positive" as const },
  { category: "Contraction", value: -32000, type: "negative" as const },
  { category: "Churn", value: -95000, type: "negative" as const },
  { category: "Ending ARR", value: 1086000, type: "base" as const },
];

export const cohortRetention = [
  { cohort: "Q1 2023", m1: 100, m2: 96, m3: 93, m6: 89, m9: 86, m12: 82 },
  { cohort: "Q2 2023", m1: 100, m2: 97, m3: 94, m6: 91, m9: 88, m12: 85 },
  { cohort: "Q3 2023", m1: 100, m2: 95, m3: 91, m6: 87, m9: 84, m12: null },
  { cohort: "Q4 2023", m1: 100, m2: 98, m3: 95, m6: 92, m9: null, m12: null },
  { cohort: "Q1 2024", m1: 100, m2: 96, m3: 93, m6: null, m9: null, m12: null },
  { cohort: "Q2 2024", m1: 100, m2: 97, m3: null, m6: null, m9: null, m12: null },
];

export const revenueBySegment = [
  { segment: "Enterprise", arr: 642000, customers: 4, avgArr: 160500, percentage: 59.1 },
  { segment: "Mid-Market", arr: 330000, customers: 6, avgArr: 55000, percentage: 30.4 },
  { segment: "SMB", arr: 114000, customers: 2, avgArr: 57000, percentage: 10.5 },
];

export const revenueByIndustry = [
  { industry: "SaaS / Dev Tools", arr: 180000 },
  { industry: "FinTech", arr: 240000 },
  { industry: "Cloud Infra", arr: 72000 },
  { industry: "Data & Analytics", arr: 156000 },
  { industry: "HealthTech", arr: 18000 },
  { industry: "Retail Tech", arr: 144000 },
  { industry: "Other", arr: 276000 },
];

export const forecastData = {
  arr: [
    { period: "Sep 24", bestCase: 1180000, expected: 1140000, worstCase: 1090000, actual: null },
    { period: "Oct 24", bestCase: 1260000, expected: 1200000, worstCase: 1130000, actual: null },
    { period: "Nov 24", bestCase: 1350000, expected: 1270000, worstCase: 1180000, actual: null },
    { period: "Dec 24", bestCase: 1440000, expected: 1340000, worstCase: 1230000, actual: null },
    { period: "Jan 25", bestCase: 1530000, expected: 1410000, worstCase: 1290000, actual: null },
    { period: "Feb 25", bestCase: 1620000, expected: 1480000, worstCase: 1340000, actual: null },
  ],
  mrr: [
    { period: "Sep 24", bestCase: 98333, expected: 95000, worstCase: 90833, actual: null },
    { period: "Oct 24", bestCase: 105000, expected: 100000, worstCase: 94167, actual: null },
    { period: "Nov 24", bestCase: 112500, expected: 105833, worstCase: 98333, actual: null },
    { period: "Dec 24", bestCase: 120000, expected: 111667, worstCase: 102500, actual: null },
  ],
};
