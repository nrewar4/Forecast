// Keyless web-search proxy backed by SearXNG (a free, self-hostable metasearch
// engine). The browser GETs /api/search?q=..., and this function queries the
// SearXNG instance named by SEARXNG_URL and returns its JSON results. Nothing is
// billed: SearXNG is free, and the caller then feeds the snippets to a free model
// to extract the synthesis route. This is the no-credit web-grounding path.
//
// Set SEARXNG_URL in the host's server environment, e.g.
//   SEARXNG_URL=https://your-searxng.example.com
// The instance must have the JSON output format enabled (search.formats: [json]
// in its settings.yml). See DEPLOYMENT.md for a one-line Docker instance.

const DEFAULT_TIMEOUT_MS = 12000;

type Req = { method?: string; query?: Record<string, string | string[]>; url?: string };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

type SxResult = { title?: string; url?: string; content?: string };

function pickQuery(req: Req): string {
  const q = req.query?.q;
  if (typeof q === "string") return q;
  if (Array.isArray(q)) return q[0] ?? "";
  // Fallback: parse from the raw URL.
  try {
    const u = new URL(req.url || "", "http://localhost");
    return u.searchParams.get("q") || "";
  } catch {
    return "";
  }
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method && req.method !== "GET") {
    res.status(405).json({ error: { message: "Use GET." } });
    return;
  }
  const base = process.env.SEARXNG_URL;
  if (!base) {
    // Not configured: return an empty result set so the app degrades gracefully.
    res.status(200).setHeader?.("Content-Type", "application/json");
    res.status(200).json({ results: [], note: "SEARXNG_URL not set" });
    return;
  }
  const q = pickQuery(req).slice(0, 300).trim();
  if (!q) {
    res.status(400).json({ error: { message: "Missing q." } });
    return;
  }

  const url = `${base.replace(/\/+$/, "")}/search?q=${encodeURIComponent(q)}&format=json&safesearch=0&categories=general,science`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const upstream = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "APAC-Sourcing-Intelligence/1.0" },
      signal: ctrl.signal,
    });
    if (!upstream.ok) {
      res.status(502).json({ error: { message: `SearXNG returned ${upstream.status}` }, results: [] });
      return;
    }
    const json = (await upstream.json()) as { results?: SxResult[] };
    const results = (json.results || [])
      .slice(0, 8)
      .map((r) => ({ title: r.title || "", url: r.url || "", content: r.content || "" }))
      .filter((r) => r.url);
    res.status(200).setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({ results }));
  } catch (e) {
    res.status(502).json({ error: { message: `Search failed: ${(e as Error)?.message || e}` }, results: [] });
  } finally {
    clearTimeout(t);
  }
}
