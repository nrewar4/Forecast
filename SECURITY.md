# Security notes & audit

This app is a **static, client-only SPA**. It has no backend, no database, and
no server-side secrets. Its attack surface is therefore small: it renders public
reference data and calls public, keyless APIs from the browser. This document
records the audit findings and the few things a deployer must understand.

## Audit summary (current state)

| Area | Finding |
| --- | --- |
| XSS sinks | **None.** No `dangerouslySetInnerHTML`, `eval`, `new Function`, or direct `innerHTML`. All external text (PubChem descriptions, news titles, patent/lit data) renders through React, which escapes by default. |
| External links | **Safe.** Every `target="_blank"` link carries `rel="noreferrer noopener"` (reverse-tabnabbing + referrer leak protection). Verified 20/20. |
| Secrets in repo | **None committed.** No API keys or tokens in source; `.env` is git-ignored. |
| Dependencies | Minimal: `react`, `react-dom`, `react-router-dom`, `recharts`, `lucide-react`. The `xlsx` and `@supabase/supabase-js` packages were removed with their features. Run `npm audit` in CI. |
| Input validation | Every user-input boundary (chat, enquiry form, chemical lookups) is length-capped, control-character stripped, and allowlist/format validated in `src/lib/sanitize.ts`. Obvious injection/XSS patterns are rejected. |
| Client rate limiting | Chat, enquiry, and search actions are sliding-window rate-limited in `src/lib/rateLimit.ts` to protect the public APIs and OpenRouter budget. This is a cost/abuse guard, NOT DDoS protection (see below). |
| Data handled | Public reference data only. No PII is collected beyond what a user types into the enquiry form, which currently stays in their own browser. |
| Storage | `localStorage`/`sessionStorage` hold only the chat transcript, UI settings, the admin session token, and any user-entered API key — all per-browser, non-sensitive. |

## Rate limiting & DDoS protection

**Real DDoS protection must live at the edge, not in this app.** A volumetric
attacker does not run our JavaScript, so nothing the browser bundle does can stop
a flood. Put the deployment behind a CDN/WAF and enable its rate limiting:

- **Cloudflare** (recommended): proxy the domain, turn on "Under Attack" mode when
  needed, and add a Rate Limiting Rule, e.g. *more than 100 requests per minute
  per IP to `/*` → block for 1 minute*. Bot Fight Mode and the managed WAF
  rulesets cover the rest at no code cost.
- **Nginx** reverse proxy:
  ```nginx
  limit_req_zone $binary_remote_addr zone=apac:10m rate=10r/s;
  server {
    location / {
      limit_req zone=apac burst=20 nodelay;
      try_files $uri $uri/ /index.html;   # SPA fallback
    }
  }
  ```
- **AWS**: CloudFront + AWS WAF rate-based rules; **Vercel/Netlify**: their
  built-in edge/DDoS protection plus a firewall rule.

**In-app (this repo):** `src/lib/rateLimit.ts` adds a client-side sliding-window
limiter applied to the chat (15/min), enquiry submits (3/min), and searches
(30/min). Its job is to keep a single tab, a runaway loop, or an abusive script
in the page from hammering the free public APIs (PubChem, CACTUS, OPSIN, World
Bank) or burning OpenRouter credit. It is a second layer, not a substitute for
the edge.

## SQL injection

**There is no SQL database and no server-side query in this app**, so there is no
SQL-injection surface today. Defences are still in place as a matter of course:

- All user input is validated and sanitised at the boundary (`src/lib/sanitize.ts`):
  length caps, control-character stripping, an allowlist for chemical
  names/CAS, email-format checks, and rejection of classic injection/XSS
  patterns.
- Every value sent to an external API is `encodeURIComponent`-escaped, so it
  cannot break out of the URL.

**If a backend is ever added** (the enquiry endpoint in INTEGRATION.md §6 is the
likely first one), it MUST: use parameterised / prepared statements (never string
concatenation) or an ORM, validate input server-side (client checks are
bypassable), and apply its own server-side rate limiting and auth. The
client-side validation here reduces junk but is not a server's security control.

## Things a deployer must know

### 1. The admin gate is not a security boundary
`/admin` and `/synthesis-routes` are hidden behind a **client-side** password
check (`src/lib/auth.ts`, SHA-256 hashed, expiring session token). This keeps
internal tooling out of casual view, but because all code ships to the browser,
a determined user can reach those components. That is acceptable **only because
the admin area exposes no secrets** — it shows usage analytics kept in the
visitor's own `localStorage` and a public retrosynthesis explorer.

**Do not** put anything genuinely sensitive behind this gate. If you need real
protection, enforce it at the hosting/proxy tier (e.g. HTTP basic auth or SSO in
front of `/admin` and `/synthesis-routes`).

### 2. A build-time OpenRouter key is public
`VITE_OPENROUTER_API_KEY` is bundled into the JavaScript at build time, so
anyone who loads the app can read it and spend against it. The app is fully
functional **without** a key (its flows are deterministic), so:

- **Preferred:** leave the key unset in production and let each user paste their
  own key in the assistant settings, **or**
- proxy OpenRouter through a small backend that holds the key server-side and
  rate-limits requests.

If you must bundle a key, scope and cap it tightly in the OpenRouter dashboard.

### 3. Recommended response headers (set at the host/CDN)
Add these for a production deployment:

```
Content-Security-Policy:
  default-src 'self';
  img-src 'self' data: https://pubchem.ncbi.nlm.nih.gov;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self'
    https://pubchem.ncbi.nlm.nih.gov
    https://cactus.nci.nih.gov
    https://opsin.ch.cam.ac.uk
    https://api.worldbank.org
    https://news.google.com
    https://openrouter.ai;
  frame-ancestors 'self' https://*.apacss.com;
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Tune `connect-src`/`img-src` if you change which APIs the app calls, and
`frame-ancestors` to the domains allowed to iframe it.

### 4. Enquiry data
When you wire the enquiry form to a real destination (see INTEGRATION.md §6),
send it over HTTPS to an endpoint you control and handle it under your privacy
policy. Today no lead data leaves the browser.
