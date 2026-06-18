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

## Pages, all eight built

- Dashboard. KPI cards, top import and export products, top buyers and top
  manufacturers.
- Trade Analytics. Imports and exports toggle, filters, monthly trend area chart,
  trade by country, transport mix donut, and a sortable shipment table.
- Demand Forecast. Product and model selectors, a forecast line with a confidence
  band, and a colour coded growth ranking with buy, hold, and watch signals.
- Product Knowledge Base. Manufacturing route, cost drivers, end use industries,
  pricing, and key manufacturers per product.
- Clients (Buyers). Searchable, filterable directory of Indian importers.
- Suppliers (Manufacturers). Manufacturers only, grouped by product, filterable
  by certification.
- Documents. PDF and Excel upload area with a recent documents list.
- Integrations. Catalog of databases to connect, grouped by category.

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
