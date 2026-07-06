# Integrating and scaling the platform

This app is built to drop into your existing website and to grow with your data.
It is a Vite, React, and TypeScript single page app with a clean data layer, so
you can host it on its own, embed it in another site, or point it at your own
backend.

## Architecture in one minute

- UI pages live in `src/pages`. They never read files directly, they read from
  the data layer.
- The trade database is exposed through one React context, `src/context/TradeData.tsx`.
  Every section (Dashboard, Trade Analytics, Clients, Suppliers, Demand Forecast)
  derives from it, so when the data changes the whole app updates.
- Storage is abstracted in `src/lib/tradeStore.ts`. It talks to Supabase when
  configured, and to browser storage otherwise. Swap this one file to use any
  backend.
- Ingestion is in `src/lib/parseTrade.ts`. It turns a Datamyne Excel file into
  shipment records and is tolerant of different column layouts.
- Aggregations for the dynamic sections live in `src/lib/derive.ts`.

## Four ways to integrate

### 1. Standalone deploy
Build and host the static output on any static host (Netlify, Vercel, S3, Nginx).
```
npm run build      # outputs to dist
```
Serve `dist` and you are done.

### 2. Embed into your existing site
A mount helper is exported from `src/embed.tsx`. From your site, mount the app
into any element:
```ts
import { mountApacApp } from "apac-sourcing/embed";
const unmount = mountApacApp(document.getElementById("analytics"), {
  basename: "/analytics",
});
```
Use `basename` when the app sits under a sub route of your site.

### 3. iframe
The simplest option. Host the standalone build and embed it:
```html
<iframe src="https://analytics.yourdomain.com" style="width:100%;height:100vh;border:0"></iframe>
```

### 4. Use only the data layer
If you already have a front end, import the ingestion and aggregation utilities
directly:
```ts
import { parseTradeFile } from "@/lib/parseTrade";
import { deriveBuyers, deriveSuppliers, topProducts } from "@/lib/derive";
```

## Connecting your own backend

The whole app reads and writes shipments through `src/lib/tradeStore.ts`, which
exposes three functions: `loadUploaded`, `addUploaded`, and `clearUploaded`.

- To use Supabase, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. See
  SUPABASE_SETUP.md.
- To use your own REST or GraphQL API, reimplement those three functions to call
  your endpoints. Nothing else in the app needs to change. Keep the `Shipment`
  shape from `src/data/trade.ts` or map to it inside the store.

## Scaling to large datasets

The current build keeps uploaded rows in memory and in storage, which is fine up
to tens of thousands of rows. For larger volumes:

- Move aggregation to the backend. Replace the `derive.ts` calls with API calls
  that return pre-aggregated top products, buyers, suppliers, and country splits.
  Postgres or a warehouse can group millions of rows quickly.
- Paginate the shipment table and fetch on demand rather than loading everything.
- Store uploads server side so every user shares one database. Supabase already
  does this when configured.
- Cache aggregates and refresh them on upload.

## Data model

A shipment is the single unit of trade data, defined in `src/data/trade.ts`:
```ts
type Shipment = {
  mode: "Imports" | "Exports";
  date: string;        // ISO date
  hsCode: string;
  product: string;
  sector: string;
  transport: "Sea" | "ICD" | "Road" | "Air";
  importer: string;
  supplier: string;
  origin: string;
  quantityT: number;
  unitPrice: number;
  totalValue: number;
  estimated?: boolean; // true when value came from assumed pricing
};
```
Keep this shape when integrating and every page will work without changes.

## Reference libraries

Product reference data lives in `src/data/products.ts` (knowledge base) and
`src/data/research.ts` (country by country manufacturing research). These are
plain arrays, so adding products is a data edit, not a code change. The app keys
products by a slug of the name, so products may share an HS code safely.
