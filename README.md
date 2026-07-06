# APAC Sourcing Intelligence

The web platform for APAC Supply Chain (a CDMO and chemical sourcing company):
a public marketing site, a knowledge workspace, a custom synthesis workspace,
and an admin area with site analytics and trade intelligence.

Styled in the APAC brand colours, orange and white. Clean, professional, not
cluttered. No em dash is used anywhere in the product copy, and none should be
added.

## Run the app

This repository contains the complete app as a Vite, React, TypeScript, Tailwind,
and Recharts project.

```
npm install
npm run dev      # local dev server
npm run build    # production build to dist
npm run preview  # serve the production build
```

To verify the main flows end to end (homepage, synthesis workspace, login,
admin dashboard, route gating), build, run the preview server, then:

```
node scripts/verify.mjs http://localhost:4173
```

## Site map

Public:

- `/` Homepage. Hero with the network headline (8,927 products across 3,241
  manufacturers in 30+ countries), the three entry options (Buy, Knowledge,
  Custom Synthesis), and an animated About section with the division and
  country figures.
- `/custom-synthesis` CDMO services overview. "Explore synthesis routes" opens
  the synthesis workspace.
- `/synthesis/...` Custom synthesis workspace with its own sidebar: Custom
  Synthesis Routes (ML-assisted retrosynthesis), Process Development, Scale-up
  and Manufacturing, Start a Project (confidential enquiry form).
- `/dashboard` Market overview and `/knowledge-base` Product Knowledge Base,
  the public part of the knowledge workspace.

Admin only (require sign in):

- `/admin` Site Analytics. First party usage analytics (page views, visitors,
  searches, devices, referrers, hourly pattern) recorded in the browser via
  `src/lib/analytics.ts`, plus catalog analytics and data status.
- `/trade-analytics`, `/demand-forecast`, `/partners`, `/documents` Trade
  intelligence sections, visible in the sidebar only while signed in.

## Admin login

The login page lives at `/login`. Default credentials:

- Username: `admin`
- Password: `apacss@2026`

Sessions persist in the browser for 7 days. The password is checked against a
SHA-256 hash (`src/lib/auth.ts`); override without code changes by setting
`VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD_SHA256` in `.env`. Generate a
hash with:

```
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"
```

This is a client side gate suitable for hiding admin sections on a static
deployment. For hard security put the app behind a real auth provider or
server.

## Uploading trade data

The Documents page (admin) accepts Datamyne style Excel files. Rows are parsed
with SheetJS, mapped by column header, and appended to the trade database, which
then flows into Trade Analytics, the Market Overview, Demand Forecast, and Trade
Partners. The parser also reads real Datamyne export manifests, including files
where the HS code and chemical name sit inside a free text container
description.

## Shared database, optional

The app runs out of the box with browser storage. To share uploads across users,
connect a free Supabase project. The app reads VITE_SUPABASE_URL and
VITE_SUPABASE_ANON_KEY at build time. When they are present it uses the shared
cloud database, otherwise it falls back to browser storage automatically. Step by
step instructions and the table schema are in SUPABASE_SETUP.md.

## AI features

The AI Product Search, research profiles, synthesis routes, and CDMO
intelligence use OpenRouter. Put a key in `.env` as `VITE_OPENROUTER_API_KEY`
(see `.env.example`). Without a key the catalog, analytics, and knowledge base
still work; the AI surfaces explain what is missing.

## Integrate with your live website

The app can run standalone, embed into your existing site with the mount helper
in `src/embed.tsx`, sit in an iframe, or you can reuse just the data layer. To
point it at your own backend, reimplement the three functions in
`src/lib/tradeStore.ts`. Full guidance, the data model, and scaling notes are in
INTEGRATION.md.

## Data

All seed data lives in `/data` as JSON so it can move into the app or a real
database without rework.

- `clients_buyers.json`. Possible clients, Indian buyers.
- `suppliers_manufacturers.json`. Possible suppliers, manufacturers only.
- `products_knowledge.json`. Routes, cost drivers, industries, pricing, producers.
- `integrations_catalog.json`. Databases and APIs to connect.

Headline network figures (products, manufacturers, countries, divisions) live in
`src/data/network.ts` and come from the APACSS admin portal.

Source of the trade figures is the Descartes Datamyne import and export sample
for February 2026. Replace with the full three year history for production
forecasts.

## Design

- Colours. Orange #F47920 as the accent, white background, slate text.
- Components. Custom Tailwind UI kit, recharts for charts, Inter font.
- Motion. Scroll reveals, count-up numbers, and the animated route map live in
  `src/components/motion.tsx` and `src/index.css`; everything respects
  prefers-reduced-motion.
- Principle. Short crisp labels, KPI cards, charts, and compact tables. No long
  paragraphs. No em dash anywhere.
