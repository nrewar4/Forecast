# APAC Sourcing Intelligence

A data and analytics platform for APAC Supply Chain (a CDMO and chemical sourcing
company). It builds on the Forecasting and Data Integration concept, adds more
analytics, makes the data easy to scan, visualises everything, and surfaces
possible clients and suppliers. It is designed so more databases can be plugged
in over time.

Styled in the APAC brand colours, orange and white. Clean, professional, not
cluttered. No em dash is used anywhere in the product copy.

## Run the app

This repository contains the complete app as a Vite, React, TypeScript, Tailwind,
and Recharts project.

```
npm install
npm run dev      # local dev server
npm run build    # production build to dist
npm run preview  # serve the production build
```

## Pages, all nine built

- Dashboard. Live KPI cards and top products, buyers, and manufacturers, all
  derived from the trade database and refreshed whenever you upload, each chart
  with a short takeaway.
- Trade Analytics. Imports and exports toggle, working HS, country, sector, and
  transport filters, monthly trend, trade by country, transport mix, and a
  sortable shipment table. Charts and KPIs derive from the live database.
- Demand Forecast. Product and model selectors that fit a real model to the
  product demand series and redraw the forecast line and confidence band, with a
  growth ranking built live from the database. The three models are genuine
  algorithms: Holt damped trend smoothing (Prophet slot), a differenced least
  squares autoregression (SARIMA slot), and gradient boosted regression trees
  (XGBoost slot). Each reports its own walk forward backtested error.
- Product Knowledge Base. Searchable, scrollable list of 200 products with
  manufacturing route, cost drivers, end use industries, pricing, and makers.
- Product Research. Comprehensive per product research for 200 products with
  global capacity, feedstock, industrial route shares, a full step by step
  process with operating conditions, and a country by country table of which
  method each region prefers.
- Clients (Buyers). Buyer directory built live from import activity, enriched
  with curated sector and status when known.
- Suppliers (Manufacturers). Supplier directory built live from trade activity,
  enriched with certifications when known, searchable and filterable.
- Documents. Upload Datamyne Excel extracts that are parsed in the browser and
  appended to the trade database, with assumed pricing, a recent documents log,
  and a template.
- Integrations. Catalog of databases to connect plus the live application
  database status.

## Uploading trade data

The Documents page accepts Datamyne style Excel files. Rows are parsed with
SheetJS, mapped by column header, and appended to the trade database, which then
flows into Trade Analytics. Choose Imports or Exports before uploading, and use
the Template button to get the exact column layout. Uploaded rows persist in the
browser and can be cleared with Reset uploads. Every section, the Dashboard,
Trade Analytics, Clients, Suppliers, and Demand Forecast, updates from this same
live database. The parser also reads real Datamyne export manifests, including
files where the HS code and chemical name sit inside a free text container
description. It pulls the HS code from HTS, NCM, Schedule B, and Harmonized
labels, maps common chemicals to clean names, and infers the sector from the HS
chapter. There are 200 products covered across the data set.

## Shared database, optional

The app runs out of the box with browser storage. To share uploads across users,
connect a free Supabase project. The app reads VITE_SUPABASE_URL and
VITE_SUPABASE_ANON_KEY at build time. When they are present it uses the shared
cloud database, otherwise it falls back to browser storage automatically. Step by
step instructions and the table schema are in SUPABASE_SETUP.md. The Integrations
page shows the active backend.

## Integrate with your live website

The app can run standalone, embed into your existing site with the mount helper
in `src/embed.tsx`, sit in an iframe, or you can reuse just the data layer. To
point it at your own backend, reimplement the three functions in
`src/lib/tradeStore.ts`. Full guidance, the data model, and scaling notes are in
INTEGRATION.md.

## Lovable version

The first three pages were also built in Lovable. The remaining pages were then
finished here in code because the Lovable workspace ran out of credits. Matching
build prompts are kept in `docs/remaining_page_prompts.md`.

- Preview: https://id-preview--26f36d35-b868-470e-9cc7-16a880f73d51.lovable.app
- Editor: https://lovable.dev/projects/26f36d35-b868-470e-9cc7-16a880f73d51

## Analytics added beyond the original document

- Top buyers and top manufacturers ranked by value.
- Trade by country of origin and transport mode mix.
- Monthly trade value trend with seasonality.
- Forecast confidence bands and a growth ranking with action signals.
- Average unit price, trade balance, and fastest rising HS code.
- Cost driver and end use industry breakdowns per product.

## Data

All seed data lives in `/data` as JSON so it can move into the app or a real
database without rework.

- `clients_buyers.json`. Possible clients, Indian buyers.
- `suppliers_manufacturers.json`. Possible suppliers, manufacturers only.
- `products_knowledge.json`. Routes, cost drivers, industries, pricing, producers.
- `integrations_catalog.json`. Databases and APIs to connect.

Source of the trade figures is the Descartes Datamyne import and export sample
for February 2026. Replace with the full three year history for production
forecasts.

## Room for more databases

The platform is built to ingest more sources over time. See
`integrations_catalog.json`. Candidates include PubChem and ChemSpider for
chemical identity, ICIS and Platts for pricing, ISO, REACH, and FDA directories
for certifications, DGFT IEC for company data, and energy and macro feeds for
forecast drivers.

## Design

- Colours. Orange #F47920 as the accent, white background, slate text.
- Components. shadcn ui, recharts for charts, Inter font.
- Principle. Short crisp labels, KPI cards, charts, and compact tables. No long
  paragraphs. No em dash anywhere.
