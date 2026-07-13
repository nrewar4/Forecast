# Deploying the AI chemistry lookup (keyless proxy)

The app can look up a molecule's real synthesis chemistry online. That lookup
calls OpenRouter, which needs an API key. To keep the key **off the client**, the
app ships with a small server-side proxy: the browser calls `/api/ai`, and the
proxy adds the key from the server environment. The key is therefore never in the
bundle and never visible to visitors.

## 1. Get (and protect) a key

1. Create a key at <https://openrouter.ai/keys>.
2. Add a little credit at <https://openrouter.ai/settings/credits> (about $5 is
   plenty). Web search is a billed plugin; with **$0 credit** the lookup still
   works but falls back to a free model answering from its own knowledge, shown
   in the UI as **"AI-researched, verify"** rather than web-grounded.
3. **Never commit the key or put it in a `VITE_` variable.** Anything with a
   `VITE_` prefix is bundled into the browser. If a key was ever pasted in chat,
   email, or a commit, revoke it and make a new one.

## 2. Set two environment variables

| Variable | Value | Where |
| --- | --- | --- |
| `VITE_AI_PROXY_URL` | `/api/ai` | build-time (client) |
| `OPENROUTER_API_KEY` | `sk-or-...` | server env only (secret) |

`VITE_AI_PROXY_URL` tells the client to use the proxy. `OPENROUTER_API_KEY` is
read by the proxy on the server and is the only place the real key lives.

## 3. Host specifics

- **Vercel** — `api/ai.ts` is already a serverless function. Add
  `OPENROUTER_API_KEY` under Project → Settings → Environment Variables, and set
  `VITE_AI_PROXY_URL=/api/ai`. Deploy.
- **Netlify** — move/rename the handler to `netlify/functions/ai.ts` (same
  logic), set the two env vars in Site settings, and either use
  `VITE_AI_PROXY_URL=/.netlify/functions/ai` or add a redirect
  `/api/ai -> /.netlify/functions/ai`.
- **Cloudflare Pages** — put the handler at `functions/api/ai.ts` (Pages
  Functions), set the env vars, keep `VITE_AI_PROXY_URL=/api/ai`.
- **Static host with no functions** (plain S3/Nginx) — you need a function
  runtime for the proxy. Either deploy on one of the above, or run the tiny
  Node handler in `api/ai.ts` behind your reverse proxy at `/api/ai`.

## 4. Local development

Put the server key in a local `.env` (git-ignored) as a **non-VITE** variable:

```
OPENROUTER_API_KEY=sk-or-...
VITE_AI_PROXY_URL=/api/ai
```

`npm run dev` and `npm run preview` both mount the same `/api/ai` proxy (see
`vite.config.ts`), so the full flow works locally with the key staying
server-side.

## Web search without credits (SearXNG)

The synthesis-route lookup can be web-grounded **without any OpenRouter credit**:
the app searches a [SearXNG](https://github.com/searxng/searxng) instance (free,
self-hostable) and a **free** model extracts the route from the results. This is
the recommended no-credit path for real web grounding.

1. Run a SearXNG instance with the JSON API enabled. Quick Docker start:

   ```bash
   docker run -d --name searxng -p 8080:8080 \
     -e "SEARXNG_SETTINGS_PATH=/etc/searxng/settings.yml" \
     -v ./searxng:/etc/searxng searxng/searxng:latest
   ```

   In `searxng/settings.yml` enable JSON output:

   ```yaml
   search:
     formats: [html, json]
   ```

2. Set two env vars:

   | Variable | Value | Where |
   | --- | --- | --- |
   | `VITE_SEARCH_URL` | `/api/search` | build-time (client) |
   | `SEARXNG_URL` | `https://your-searxng.example.com` | server env only |

   The client calls `/api/search`; the proxy (api/search.ts, and the Vite
   dev/preview middleware) queries your SearXNG instance and returns the results.
   With `SEARXNG_URL` unset the proxy returns an empty set and the app falls back
   to the model-knowledge path, so nothing breaks.

3. Route provenance in the report tells you which path produced the chemistry:
   **Verified** (curated cited route or PubChem/Wikipedia), **Web-researched**
   (SearXNG results, free), or **AI-researched** (model knowledge). The last two
   carry a "verify against the cited source" note.

Priority order for the chemistry: curated cited routes (offline, most accurate)
→ PubChem/Wikipedia → SearXNG web search → model knowledge.

## Curated routes (fully offline, no key or credit)

`src/data/verifiedRoutes.ts` holds hand-authored, source-cited routes that always
show for the molecules listed, with no network call at all. Add your priority
molecules there: give the match names/CAS, the ordered named reactions, 1 to 3
cited step sentences, and a real source URL. Seeded with the IMiD family
(pomalidomide, lenalidomide, thalidomide) and a few classics (aspirin,
paracetamol, ibuprofen).

## 5. Verify

Open `/cdmo`, enter a molecule (e.g. `pomalidomide`), and check the
"Core chemistry to make it" card. With credit you get web-grounded reactions
badged **Verified/AI-researched** with a real source link; with no credit you get
the free-model fallback badged **AI-researched, verify**. If it shows
"no documented route", the proxy is not reachable or the key/credit is missing,
check the two env vars above.
