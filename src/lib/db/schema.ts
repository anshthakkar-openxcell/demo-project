import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  date,
  jsonb,
  inet,
  index,
  uniqueIndex,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);
export const healthStatusEnum = pgEnum("health_status", ["healthy", "monitor", "at_risk", "critical"]);
export const lifecycleEnum = pgEnum("lifecycle_stage", ["prospect", "onboarding", "active", "at_risk", "churned"]);
export const segmentEnum = pgEnum("segment", ["enterprise", "mid_market", "smb"]);
export const revenueEventTypeEnum = pgEnum("revenue_event_type", ["new_business", "expansion", "contraction", "churn", "reactivation"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "trial", "paused", "cancelled"]);
export const integrationProviderEnum = pgEnum("integration_provider", ["salesforce", "hubspot", "stripe", "chargebee", "mixpanel", "amplitude", "intercom", "zendesk", "slack"]);
export const integrationStatusEnum = pgEnum("integration_status", ["connected", "disconnected", "error", "syncing"]);
export const opportunityTypeEnum = pgEnum("opportunity_type", ["upsell", "cross_sell", "addon", "tier_upgrade"]);
export const opportunityStatusEnum = pgEnum("opportunity_status", ["open", "in_progress", "won", "lost"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "critical"]);
export const notificationTypeEnum = pgEnum("notification_type", ["health_alert", "churn_risk", "expansion", "report_ready", "invite"]);
export const auditActionEnum = pgEnum("audit_action", ["create", "update", "delete", "export", "login", "invite", "connect_integration"]);

// ─── Organizations ─────────────────────────────────────────────────────────────
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: planEnum("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  timezone: text("timezone").default("UTC"),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Organization Members ──────────────────────────────────────────────────────
export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("member"),
    invitedBy: uuid("invited_by").references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqueMember: uniqueIndex("unique_org_member").on(t.organizationId, t.userId),
    orgIdx: index("org_members_org_idx").on(t.organizationId),
    userIdx: index("org_members_user_idx").on(t.userId),
  }),
);

// ─── Invitations ──────────────────────────────────────────────────────────────
export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: roleEnum("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  invitedBy: uuid("invited_by").references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Customers ────────────────────────────────────────────────────────────────
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain"),
    industry: text("industry"),
    employeeCount: integer("employee_count"),
    arr: numeric("arr", { precision: 12, scale: 2 }).notNull().default("0"),
    mrr: numeric("mrr", { precision: 12, scale: 2 }).notNull().default("0"),
    healthScore: integer("health_score"),
    healthStatus: healthStatusEnum("health_status").notNull().default("healthy"),
    lifecycleStage: lifecycleEnum("lifecycle_stage").notNull().default("active"),
    csmUserId: uuid("csm_user_id").references(() => users.id),
    renewalDate: date("renewal_date"),
    contractStart: date("contract_start"),
    segment: segmentEnum("segment"),
    externalIds: jsonb("external_ids").$type<Record<string, string>>().default({}),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("customers_org_idx").on(t.organizationId),
    healthIdx: index("customers_health_idx").on(t.organizationId, t.healthStatus),
  }),
);

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  externalId: text("external_id"),
  planName: text("plan_name").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  mrr: numeric("mrr", { precision: 12, scale: 2 }).notNull().default("0"),
  arr: numeric("arr", { precision: 12, scale: 2 }).notNull().default("0"),
  billingInterval: text("billing_interval").notNull().default("monthly"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Revenue Events ────────────────────────────────────────────────────────────
export const revenueEvents = pgTable(
  "revenue_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
    type: revenueEventTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    arrImpact: numeric("arr_impact", { precision: 12, scale: 2 }).notNull(),
    period: date("period").notNull(),
    source: text("source"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgPeriodIdx: index("revenue_events_org_period_idx").on(t.organizationId, t.period),
  }),
);

// ─── Product Usage Events ──────────────────────────────────────────────────────
export const productUsageEvents = pgTable(
  "product_usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    endUserId: text("end_user_id").notNull(),
    sessionId: text("session_id"),
    feature: text("feature").notNull(),
    eventName: text("event_name").notNull(),
    properties: jsonb("properties").$type<Record<string, unknown>>().default({}),
    source: text("source"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    orgCustomerIdx: index("usage_events_org_customer_idx").on(t.organizationId, t.customerId),
    occurredIdx: index("usage_events_occurred_idx").on(t.organizationId, t.occurredAt),
  }),
);

// ─── Feature Adoptions ────────────────────────────────────────────────────────
export const featureAdoptions = pgTable("feature_adoptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  featureName: text("feature_name").notNull(),
  adoptionRate: numeric("adoption_rate", { precision: 5, scale: 2 }),
  activeUsers: integer("active_users").notNull().default(0),
  totalEvents: integer("total_events").notNull().default(0),
  firstUsedAt: timestamp("first_used_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  computedAt: timestamp("computed_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Health Scores ────────────────────────────────────────────────────────────
export const healthScores = pgTable(
  "health_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    score: integer("score").notNull(),
    status: healthStatusEnum("status").notNull(),
    usageScore: integer("usage_score"),
    revenueScore: integer("revenue_score"),
    supportScore: integer("support_score"),
    engagementScore: integer("engagement_score"),
    factors: jsonb("factors").$type<Record<string, unknown>>().notNull().default({}),
    aiSummary: text("ai_summary"),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgCustomerIdx: index("health_scores_org_customer_idx").on(t.organizationId, t.customerId),
  }),
);

// ─── Churn Predictions ────────────────────────────────────────────────────────
export const churnPredictions = pgTable("churn_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  churnProbability: numeric("churn_probability", { precision: 5, scale: 4 }).notNull(),
  riskLevel: riskLevelEnum("risk_level").notNull(),
  riskFactors: jsonb("risk_factors").$type<string[]>().notNull().default([]),
  historicalIndicators: jsonb("historical_indicators").$type<Record<string, unknown>>().notNull().default({}),
  aiReasoning: text("ai_reasoning"),
  recommendedActions: jsonb("recommended_actions").$type<string[]>().notNull().default([]),
  predictedAt: timestamp("predicted_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Expansion Opportunities ──────────────────────────────────────────────────
export const expansionOpportunities = pgTable("expansion_opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  type: opportunityTypeEnum("type").notNull(),
  title: text("title").notNull(),
  expansionScore: integer("expansion_score").notNull(),
  potentialArr: numeric("potential_arr", { precision: 12, scale: 2 }).notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 4 }),
  signals: jsonb("signals").$type<string[]>().notNull().default([]),
  recommendedActions: jsonb("recommended_actions").$type<string[]>().notNull().default([]),
  status: opportunityStatusEnum("status").notNull().default("open"),
  identifiedAt: timestamp("identified_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Forecasts ────────────────────────────────────────────────────────────────
export const forecasts = pgTable("forecasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  metric: text("metric").notNull(),
  period: date("period").notNull(),
  bestCase: numeric("best_case", { precision: 12, scale: 2 }).notNull(),
  expectedCase: numeric("expected_case", { precision: 12, scale: 2 }).notNull(),
  worstCase: numeric("worst_case", { precision: 12, scale: 2 }).notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 4 }),
  assumptions: jsonb("assumptions").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── AI Conversations ─────────────────────────────────────────────────────────
export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title"),
  messages: jsonb("messages").$type<Array<{
    role: "user" | "assistant";
    content: string;
    citations?: string[];
    timestamp: string;
  }>>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Integrations ─────────────────────────────────────────────────────────────
export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  provider: integrationProviderEnum("provider").notNull(),
  status: integrationStatusEnum("status").notNull().default("disconnected"),
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  syncConfig: jsonb("sync_config").$type<Record<string, unknown>>().notNull().default({}),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").references(() => users.id),
  action: auditActionEnum("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  changes: jsonb("changes").$type<{ old?: unknown; new?: unknown }>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  link: text("link"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  customers: many(customers),
  integrations: many(integrations),
  forecasts: many(forecasts),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, { fields: [customers.organizationId], references: [organizations.id] }),
  subscriptions: many(subscriptions),
  revenueEvents: many(revenueEvents),
  healthScores: many(healthScores),
  churnPredictions: many(churnPredictions),
  expansionOpportunities: many(expansionOpportunities),
}));

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type HealthScore = typeof healthScores.$inferSelect;
export type ChurnPrediction = typeof churnPredictions.$inferSelect;
export type ExpansionOpportunity = typeof expansionOpportunities.$inferSelect;
export type RevenueEvent = typeof revenueEvents.$inferSelect;
export type Forecast = typeof forecasts.$inferSelect;
export type AiConversation = typeof aiConversations.$inferSelect;
export type Integration = typeof integrations.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
