# APAC Supply Chain — CDMO & Sourcing platform

A client-side web app for APAC Supply Chain (apacss.com), a chemical sourcing and
CDMO company. It has three public surfaces and a small internal area:

- **CDMO** (`/cdmo`) — the main conversion page: an AI assistant that takes a
  molecule or a project and returns feasibility, the process chemistry needed to
  make it, a manufacturer-capability count, patent/route landscape, and a
  contact handoff.
- **Product Discovery** (`/knowledge-base`) — a searchable catalogue of products
  with identity, chemistry and sourcing detail.
- **Market Overview** (`/dashboard`) — chemical trade figures for the focus
  markets, from the World Bank.
- **Admin** (`/admin`, `/synthesis-routes`) — usage analytics and an internal
  retrosynthesis explorer, behind a client-side login.

It is a static single-page app: no backend, no database. Everything runs in the
browser against public, keyless APIs. All figures are in USD. Product copy uses
no em dashes (use a comma, a colon, or "to").

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to ./dist
npm run preview  # serve the production build
```

Runs with zero configuration. Optional `.env` values (see `.env.example`) add
LLM free-text understanding and change the admin password.

## The CDMO assistant

The `/cdmo` page and a floating widget on every public page host an assistant
that qualifies a visitor and routes them to one of two journeys, then to an APAC
enquiry (contact details in `src/data/contact.ts`):

- **Feasibility** — name a molecule or CAS. Identity resolves across public
  databases (PubChem, then NCI CACTUS, then OPSIN), and the card shows the broad
  chemical classes, the **process chemistries needed to make it** (halogenation,
  nitration, esterification, ...), how many network manufacturers can run that
  chemistry (a count only, identities withheld), and the patent/literature route
  landscape (PubChem/SureChEMBL + PubMed, with Google Patents / WIPO / Espacenet
  links).
- **Pathway** — describe a situation and it maps a stage-by-stage CDMO
  development pathway with deliverables and gates, with durations scaled to the
  molecule's complexity.

Both flows are deterministic, so they always complete quickly even with no API
key. When `VITE_OPENROUTER_API_KEY` is set, the LLM (`src/lib/openrouter.ts`, with
model fallback) only adds natural phrasing and free-text understanding.

## Admin login

At `/login` (linked from the landing footer and the workspace sidebar).

- Username: `admin`
- Default password: `apac-admin` (override with `VITE_ADMIN_PASSWORD_HASH`, the
  SHA-256 hex of your password). Sessions last 12 hours.

This is a client-side gate for hiding internal tooling, **not** a security
boundary. See `SECURITY.md`.

## Project structure

```
index.html                Page shell + metadata
vite.config.ts            Build config (base path, alias, chunking, dev proxy)
tailwind.config.js        Brand tokens (orange accent, neutral scale)

src/
  main.tsx                Entry: router (basename from VITE_BASE_PATH) + providers
  App.tsx                 Routes + page-view tracking + floating assistant
  index.css               Tailwind layers, motion utilities, print styles

  pages/                  One file per route
    Landing.tsx           Public homepage
    Cdmo.tsx              CDMO assistant experience (main conversion page)
    KnowledgeBase.tsx     Product Discovery catalogue
    Dashboard.tsx         Market Overview (chemical trade)
    SynthesisRoutes.tsx   Admin: retrosynthesis explorer
    AdminDashboard.tsx    Admin: usage analytics
    Login.tsx             Admin sign in

  components/
    layout/               AppShell, Sidebar, MarketingLayout, Logo
    ui/                   Primitives (Card/Badge/Chip), KpiCard, Reveal, CountUp
    chat/                 Floating + embedded assistant (ChatWidget, ChatPanel)
    cdmo/                 CDMO result surfaces (FeasibilityReport, PathwaySpine,
                          EnquiryForm)
    knowledge/            Discovery/synthesis domain components

  context/                React contexts: Auth (admin), Currency (USD), Chat
                          (the app-wide conversation, persisted across routes)

  lib/                    Framework-free logic (dependency-light, degrades safely)
    auth.ts               Admin credential check + session
    aiConfig.ts           AI key/model resolution
    openrouter.ts         OpenRouter chat client (model fallback)
    chatAssistant.ts      Assistant brain: intent, feasibility, pathway
    casResolve.ts         Identity resolution (PubChem -> CACTUS -> OPSIN)
    chemClasses.ts        Chemical classes + process chemistries + complexity
    patents.ts            Patent + literature landscape (PubChem xrefs)
    cdmoMatch.ts          Manufacturer-capability count (gated by chemistry)
    worldbank.ts          Market Overview chemical-trade data
    analytics.ts          Page-view/event recorder for the Admin Dashboard
    retrosynthesis.ts     Route generation (admin explorer)

  data/                   Bundled datasets: products, suppliers, clients, verified
                          sources, cdmoPathway, chemicalTrade, contact
```

Conventions:

- Pages own routing; components stay route-agnostic.
- Anything touching an API or storage lives in `lib/`, is dependency-light, and
  degrades gracefully (a failed lookup never breaks the page).
- Imports use the `@/` alias (`@/components/...`, `@/lib/...`).
- Motion: reuse `animate-fade-up`, `stagger`, `press`, `Reveal`, `CountUp`;
  reduced-motion is respected globally.

## Integrating with apacss.com

See `INTEGRATION.md` for subdomain, sub-path and iframe deployment, the SPA
fallback config, and the brand/contact config points. The app builds to static
files and works under any path via `VITE_BASE_PATH`.

## Verify

`scripts/verify.mjs` drives the built app in a headless browser end to end.
`SECURITY.md` records the security audit and hardening recommendations.
