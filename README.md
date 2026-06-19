# Growth Intelligence Platform

An AI-powered executive operating system that unifies revenue, customer, product usage, and retention intelligence into a single platform for CEOs, founders, product leaders, and customer success teams.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router + RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query + Zustand |
| Validation | Zod + React Hook Form |
| Database | Supabase (PostgreSQL + RLS) |
| ORM | Drizzle ORM |
| Billing | Stripe (Checkout + Webhooks) |
| AI | OpenAI GPT-4o |
| Email | Resend |
| Deployment | Vercel |
| Testing | Vitest + React Testing Library |

---

## Getting Started

### 1. Clone & Install

```bash
cd "d:\Demo Project"
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server only)
- `DATABASE_URL` — PostgreSQL connection string
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `OPENAI_API_KEY` — OpenAI API key
- `RESEND_API_KEY` — Resend API key

> **Demo Mode**: Set `NEXT_PUBLIC_USE_MOCK_DATA=true` (default) to run with realistic seeded data without any external services.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

In demo mode, use **any email/password** to log in — the platform loads with pre-seeded mock data.

---

## Platform Modules

| # | Module | Path | Plan |
|---|--------|------|------|
| 1 | Executive Overview | `/dashboard` | Free |
| 2 | Revenue Intelligence | `/dashboard/revenue` | Pro |
| 3 | Customer 360 | `/dashboard/customers` | Free |
| 4 | Product Analytics | `/dashboard/product` | Pro |
| 5 | Customer Health Center | `/dashboard/health` | Pro |
| 6 | Churn Prediction Center | `/dashboard/churn` | Pro |
| 7 | Expansion Opportunity Engine | `/dashboard/expansion` | Pro |
| 8 | Forecasting Center | `/dashboard/forecasting` | Pro |
| 9 | AI Copilot | `/dashboard/copilot` | Pro |
| 10 | Reports | `/dashboard/reports` | Free |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/         # Protected dashboard
│   │   └── dashboard/
│   │       ├── page.tsx     # Executive Overview
│   │       ├── revenue/
│   │       ├── customers/
│   │       ├── product/
│   │       ├── health/
│   │       ├── churn/
│   │       ├── expansion/
│   │       ├── forecasting/
│   │       ├── copilot/
│   │       ├── reports/
│   │       └── settings/
│   ├── auth/callback/       # OAuth callback
│   └── api/
│       └── webhooks/stripe/ # Stripe webhooks
├── features/                # Feature-based modules
│   ├── auth/
│   ├── executive/
│   ├── revenue/
│   ├── customers/
│   ├── product-usage/
│   ├── health/
│   ├── churn/
│   ├── expansion/
│   ├── forecasting/
│   ├── ai-copilot/
│   ├── reports/
│   └── settings/
├── shared/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── layout/          # Sidebar, Topbar
│   └── hooks/
└── lib/
    ├── db/                  # Drizzle schema + client
    ├── supabase/            # Supabase clients
    ├── mock-data/           # Seeded demo data
    └── utils.ts
```

---

## Billing Plans

| Feature | Free | Pro ($199/mo) | Enterprise |
|---------|------|----------------|------------|
| Customers | 50 | 500 | Unlimited |
| Team members | 2 | 10 | Unlimited |
| Integrations | Stripe only | All 9 | All + custom |
| AI Copilot | — | 100 queries/mo | Unlimited |
| Forecasting | — | ✓ | Advanced |
| API Access | — | — | ✓ |
| Reports | Basic | PDF/CSV/Excel | Scheduled + white-label |

---

## Database

Run Drizzle migrations against your Supabase database:

```bash
npm run db:generate   # Generate migration files
npm run db:migrate    # Apply migrations
npm run db:studio     # Open Drizzle Studio
```

---

## Integrations

The platform supports 9 integrations via the Adapter pattern:

- **CRM**: Salesforce, HubSpot
- **Billing**: Stripe, Chargebee
- **Product Analytics**: Mixpanel, Amplitude
- **Support**: Intercom, Zendesk
- **Notifications**: Slack

Set `USE_MOCK_ADAPTERS=false` in `.env.local` to enable production adapters.

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build    # Verify build passes locally
```

### Stripe Webhook Setup

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Security

- Row Level Security (RLS) enforced at database level
- Supabase Auth with JWT tokens
- Stripe webhook signature verification
- All mutations logged to `audit_logs` table
- No raw SQL — Drizzle ORM parameterized queries only
- Service role key never exposed to client

---

## License

Private — Growth Intelligence Platform
