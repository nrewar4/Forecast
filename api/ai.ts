// Keyless AI proxy. The browser POSTs an OpenRouter chat-completions payload here
// and this function forwards it to OpenRouter with the API key read from the
// server environment (OPENROUTER_API_KEY). The key is therefore never shipped to
// the client. Deploy target: Vercel (a file in /api is a serverless function).
// For other hosts see DEPLOYMENT.md; the same forwarding logic runs in the Vite
// dev/preview server (see vite.config.ts) so `npm run dev` works locally too.
//
// Set OPENROUTER_API_KEY in the host's environment variables (NOT in the repo,
// NOT with a VITE_ prefix). The response is passed through verbatim, so the
// client's existing error handling and model-fallback logic are unchanged.

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

type Req = { method?: string; body?: unknown; headers?: Record<string, string> };
type Res = {
  status: (code: number) => Res;
  setHeader: (k: string, v: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed. Use POST." } });
    return;
  }
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    res.status(500).json({ error: { message: "Server is missing OPENROUTER_API_KEY." } });
    return;
  }

  const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

  try {
    const upstream = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": req.headers?.origin || "https://apacss.com",
        "X-Title": "APAC Sourcing Intelligence",
      },
      body: payload,
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: { message: `Proxy request failed: ${(e as Error)?.message || e}` } });
  }
}
