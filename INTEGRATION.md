# Integrating with the official APAC website

This app is a **static single-page application** (Vite + React). `npm run build`
produces a `dist/` folder of plain HTML, CSS and JS with **no server runtime** and
**no database** of its own. That makes it easy to drop into apacss.com in one of a
few ways. Pick the one that matches how the main site is hosted.

At runtime the app only calls **public, keyless, CORS-enabled APIs** from the
browser (PubChem, NCI CACTUS, OPSIN, the World Bank, Google News RSS). Nothing
server-side is required for it to work.

---

## 1. Build

```bash
npm install
npm run build      # outputs static files to ./dist
```

The whole of `dist/` is deployable to any static host or CDN (Nginx, Apache,
S3+CloudFront, Netlify, Vercel, Cloudflare Pages, GitHub Pages, ...).

Configuration is via build-time env vars (all optional, see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_PATH` | Sub-path the app is served from, e.g. `/platform/`. Default `/`. |
| `VITE_OPENROUTER_API_KEY` | Optional. Adds LLM free-text understanding. **Exposed in the browser — see SECURITY.md.** |
| `VITE_OPENROUTER_MODEL` | Optional model id (default `openrouter/auto`). |
| `VITE_ADMIN_PASSWORD_HASH` | SHA-256 of the admin password (default `apac-admin`). |

---

## 2. Choose a deployment shape

### Option A — Subdomain (recommended, cleanest)

Serve the app at e.g. **`platform.apacss.com`**.

1. Build with the default base (`VITE_BASE_PATH` unset).
2. Upload `dist/` to the host for that subdomain.
3. Point the DNS record at the host.
4. Add the **SPA fallback** (section 3) so deep links work.

Link to it from the main site's nav (the app already links back to `apacss.com`
via its "Procurement" button and enquiry CTAs).

### Option B — Sub-path of the main domain

Serve the app under a folder, e.g. **`apacss.com/platform`**.

1. Build with the sub-path:
   ```bash
   VITE_BASE_PATH=/platform/ npm run build
   ```
   The router reads `import.meta.env.BASE_URL` as its `basename`, so **every
   internal route works automatically** with no code changes.
2. Copy `dist/` so it is served at `/platform/` by the main web server / CDN.
3. Add the SPA fallback scoped to `/platform/` (section 3).

### Option C — iframe embed (fastest, least integrated)

Deploy via Option A or B, then embed a page of it in the main site:

```html
<iframe
  src="https://platform.apacss.com/cdmo"
  title="APAC CDMO Assistant"
  style="width:100%;height:900px;border:0"
  loading="lazy"
  allow="clipboard-write"
></iframe>
```

Good for dropping just the CDMO assistant onto an existing marketing page. The
floating assistant and full-page chrome are best experienced full-window
(Option A/B).

---

## 3. SPA fallback (required for A and B)

This is a client-side-routed SPA, so the server must serve `index.html` for any
unknown path (otherwise a refresh on `/cdmo` 404s).

**Nginx** (sub-path example):
```nginx
location /platform/ {
  try_files $uri $uri/ /platform/index.html;
}
```

**Apache** (`.htaccess` in the served folder):
```apache
RewriteEngine On
RewriteBase /platform/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /platform/index.html [L]
```

**Netlify** (`public/_redirects`): `/*  /index.html  200`
**Vercel** (`vercel.json`): `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

---

## 4. Public routes to link from apacss.com

| Path | Page |
| --- | --- |
| `/` | Landing (3 entry points) |
| `/cdmo` | CDMO assistant + feasibility (main conversion page) |
| `/knowledge-base` | Product Discovery catalogue |
| `/dashboard` | Market Overview (chemical trade) |

`/admin` and `/synthesis-routes` are gated by the admin login and are internal.

---

## 5. Brand & content config points

A developer can rebrand/retarget without touching feature code:

- **Contact details** (phone, email, company, SLA): `src/data/contact.ts` — the
  single source of truth for every CTA, enquiry form and assistant handoff.
- **Brand accent colour & theme**: `tailwind.config.js` (the orange accent and
  neutral scale) and `src/index.css`.
- **Logo**: `src/components/layout/Logo.tsx` and `public/`.
- **Catalogue data**: `src/data/products.ts`, `suppliers.ts`, `clients.ts`,
  `verified.ts`.
- **Page metadata** (title/description): `index.html`.

---

## 6. Enquiry handoff

The enquiry form (`src/components/cdmo/EnquiryForm.tsx`) currently records leads
to the browser (and the admin analytics). To route real leads into APAC's CRM or
inbox, wire its submit handler to your endpoint (a form service, an email API, or
your CRM's intake webhook). This is the one place a backend is worth adding; the
rest of the app needs none.
