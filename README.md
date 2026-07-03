# APAC Sourcing Intelligence

The data and analytics platform for APAC Supply Chain (apacss.com), a chemical
sourcing and CDMO company. It carries a public knowledge platform (product
knowledge base, trade partners, market overview), a custom synthesis workspace
(ML-assisted route exploration), and an admin area (trade analytics, demand
forecasting, document uploads, website analytics).

Styled in the APAC brand colours, orange and white. Clean and professional. No
em dash is used anywhere in the product copy; use a comma, a colon, or the word
"to" instead.

## Run the app

Vite + React 18 + TypeScript + Tailwind + Recharts.

```
npm install
npm run dev      # local dev server
npm run build    # production build to dist
npm run preview  # serve the production build
```

Everything works with zero configuration: data falls back to browser storage and
bundled datasets. `.env` values (see `.env.example`) switch on the shared
Supabase database and the AI research assistant.

## Admin login

The admin area is at `/login` (also linked from the landing footer and the
workspace sidebar).

- Username: `admin`
- Default password: `apac-admin`

Change it by setting `VITE_ADMIN_PASSWORD_HASH` in `.env` to the SHA-256 hex of
your password (`echo -n "yourpassword" | shasum -a 256`). Sessions last 12 hours.
This is a client-side gate that controls what the browser shows; it keeps
internal tooling out of casual view but is not a substitute for server-side
auth. Move to Supabase Auth when real account security is needed.

Admin-only pages: `/admin` (website analytics), `/trade-analytics`,
`/demand-forecast`, `/documents`.

## Project structure

```
src/
  App.tsx                 Routes (public, workspace, admin) + page-view tracking
  main.tsx                Entry: router + providers (Auth, Currency, TradeData)
  embed.tsx               Mount helper for embedding the app in another site
  index.css               Tailwind layers, motion utilities, print styles

  pages/                  One file per routed page
    Landing.tsx           Public homepage (hero, entry tiles, animated About)
    CustomSynthesis.tsx   CDMO marketing page
    SynthesisRoutes.tsx   Custom synthesis workspace (route explorer)
    Dashboard.tsx         Knowledge workspace: market overview
    KnowledgeBase.tsx     Knowledge workspace: 200-product knowledge base
    TradePartners.tsx     Knowledge workspace: buyers and manufacturers
    TradeAnalytics.tsx    Admin: shipment analytics
    DemandForecast.tsx    Admin: forecasting models
    Documents.tsx         Admin: Datamyne Excel uploads
    AdminDashboard.tsx    Admin: website analytics + platform data
    Login.tsx             Admin sign in

  components/
    layout/               App chrome: AppShell (workspace frame + global search),
                          Sidebar (workspace navs, admin filtering), MarketingLayout, Logo
    ui/                   Reusable primitives: Card/Badge/Chip (primitives.tsx),
                          KpiCard, EmptyState, Reveal (scroll animation), CountUp
    knowledge/            Domain components for the knowledge/synthesis pages
                          (AI search and profiles, CDMO intelligence, regulatory panel,
                          market news, route step cards)

  context/                React contexts: Auth (admin session), Currency (USD/INR),
                          TradeData (shared shipment store)

  lib/                    Framework-free logic
    auth.ts               Admin credential check + session storage
    analytics.ts          Page-view/event recorder for the Admin Dashboard
    tradeStore.ts         Shipments: Supabase when configured, else localStorage
    openrouter.ts         OpenRouter chat client (model fallback, web grounding)
    aiConfig.ts           AI key/model resolution (localStorage + env)
    retrosynthesis.ts     Route generation orchestrator (PubChem + ASKCOS + AI)
    ...                   pubchem, openfda, openalex, cas resolution, forecasting,
                          parsing, caching, derivations

  data/                   Bundled datasets (products, research, buyers, suppliers,
                          verified sources, FDA Orange Book extract)

scripts/screenshots.mjs   Headless-browser smoke test + screenshot capture
```

Conventions:

- Pages own routing concerns; components stay route-agnostic.
- Anything that talks to storage or an API lives in `lib/`, is dependency-light,
  and degrades gracefully (Supabase failures fall back to localStorage).
- Imports use the `@/` alias (`@/components/...`, `@/lib/...`).
- Motion: reuse `animate-fade-up`, `stagger`, `press`, `Reveal`, and `CountUp`.
  Respect reduced-motion (the global CSS override handles it).

## Website analytics

`src/lib/analytics.ts` records page views and named events into localStorage
(capped, anonymous session ids, no personal data). The Admin Dashboard charts
views over time, views by page, devices, referrers, and interactions, alongside
platform data counts. Because storage is per browser, numbers cover each device;
pointing the same recorder at a Supabase table later would make it site-wide.

## Shared database and AI (optional)

- `SUPABASE_SETUP.md` switches the trade database from browser storage to a
  shared Supabase project.
- `VITE_OPENROUTER_API_KEY` powers the Product Research Assistant, AI product
  search, and synthesis route generation. A build-time key is readable by anyone
  who can load the app, so use a limited key.
- `INTEGRATION.md` covers hosting the app standalone, under a sub-path, or
  embedded in another site via `src/embed.tsx`.
