import { FREE_MODELS, FREE_TERMINAL, DEFAULT_MODEL, type AiConfig } from "./aiConfig";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMsg = { role: ChatRole; content: string };

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function headers(cfg: AiConfig) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cfg.apiKey}`,
    // Optional attribution headers OpenRouter recommends.
    "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://localhost",
    "X-Title": "APAC Sourcing Intelligence",
  };
}

// Error carrying the HTTP status + any Retry-After so callers can back off.
class OpenRouterError extends Error {
  status: number;
  retryAfterMs?: number;
  constructor(message: string, status: number, retryAfterMs?: number) {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

// Free models are rate-limited hard (a few req/min). On 429 we retry the SAME
// model briefly, then fall through to the next (rotated) free model, which is
// usually faster than waiting out a long backoff on one model.
const MAX_RATE_RETRIES = 2;

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function isRateLimited(message: string): boolean {
  return message.includes("429") || message.toLowerCase().includes("rate limit");
}

// Exponential backoff with full jitter, honouring Retry-After when present.
function backoffMs(attempt: number, retryAfterMs?: number): number {
  if (retryAfterMs && retryAfterMs > 0) return Math.min(retryAfterMs, 20_000);
  const base = Math.min(1000 * 2 ** attempt, 12_000); // 1s,2s,4s,8s,12s…
  return Math.round(base / 2 + Math.random() * (base / 2));
}

// Parse a fetch Response into an OpenRouterError (consumes the body once).
async function toError(res: Response): Promise<OpenRouterError> {
  const message = await readError(res);
  const ra = res.headers.get("retry-after");
  let retryAfterMs: number | undefined;
  if (ra) {
    const secs = Number(ra);
    retryAfterMs = Number.isFinite(secs) ? secs * 1000 : undefined;
  }
  return new OpenRouterError(message, res.status, retryAfterMs);
}

// Rotates the free-model list one step per call, so successive requests start
// with a different free model. This spreads load, so a single rate-limited model
// does not block every request, and is the "switch between free models" behaviour.
let rotation = 0;

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length <= 1) return arr.slice();
  const k = ((by % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

// Builds the ordered list of models to try for one request. Any explicitly
// pinned model is tried first (so a paid pin keeps its quality), then the rotated
// free models, always ending at the free Auto Router (FREE_TERMINAL), which is
// always available and free. Because the chain terminates on a free model, a
// request can never dead-end on a 402 (no credit) or 404 (bad id): it self-heals
// down to a working free model every time.
function modelChain(primary?: string): string[] {
  const free = rotate(FREE_MODELS, rotation++);
  const chain: string[] = [];
  if (primary && primary !== DEFAULT_MODEL && primary !== FREE_TERMINAL && primary !== "openrouter/auto") {
    chain.push(primary);
  }
  chain.push(...free, FREE_TERMINAL);
  return Array.from(new Set(chain.filter(Boolean)));
}

function isModelUnavailable(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("404") ||
    m.includes("not found") ||
    m.includes("no endpoints") ||
    m.includes("not a valid model") ||
    m.includes("is not available") ||
    m.includes("no allowed providers")
  );
}

// 402 / insufficient-credit, the account can't pay for this model (or the web
// plugin). Treat like "unavailable" so we fall through to the next model, which
// includes the free tier. When credit returns, the preferred model is retried
// first on the next call, so the app auto-upgrades with no state to reset.
function isInsufficientCredit(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("402") || m.includes("no credit") || m.includes("insufficient");
}

function shouldFallThrough(message: string): boolean {
  return (
    isModelUnavailable(message) ||
    isInsufficientCredit(message) ||
    isRateLimited(message) // try a different model after local backoff is exhausted
  );
}

// Free models (":free" or the free auto-router) cost nothing, but the web-search
// plugin is billed separately, so we never attach web to a free model.
function isFreeModel(model?: string): boolean {
  return !!model && (model.includes(":free") || model === "openrouter/free");
}

// Streams a chat completion from OpenRouter, invoking onToken for each text
// delta. Runs client-side with the user's own key (OpenRouter allows CORS).
export async function streamChat(
  cfg: AiConfig,
  messages: ChatMsg[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const models = modelChain(cfg.model);
  let lastErr: unknown;
  for (let i = 0; i < models.length; i++) {
    // Back off and retry the same model on 429 before moving on.
    for (let attempt = 0; ; attempt++) {
      let started = false;
      try {
        await streamOnce({ ...cfg, model: models[i] }, messages, (t) => {
          started = true;
          onToken(t);
        }, signal);
        return;
      } catch (e) {
        lastErr = e;
        if (signal?.aborted) throw e;
        const msg = e instanceof Error ? e.message : String(e);
        const status = e instanceof OpenRouterError ? e.status : 0;
        // Retry same model on rate limit (only if nothing streamed yet).
        if (!started && (status === 429 || isRateLimited(msg)) && attempt < MAX_RATE_RETRIES) {
          await sleep(backoffMs(attempt, e instanceof OpenRouterError ? e.retryAfterMs : undefined), signal);
          continue;
        }
        // Otherwise: fall through to the next model when eligible, else surface.
        if (started || !shouldFallThrough(msg) || i === models.length - 1) throw e;
        break; // try next model
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Request failed.");
}

async function streamOnce(
  cfg: AiConfig,
  messages: ChatMsg[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(cfg),
    body: JSON.stringify({ model: cfg.model, messages, stream: true }),
    signal,
  });
  if (!res.ok || !res.body) throw await toError(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith(":")) continue; // skip keep-alive comments
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta: string | undefined = json?.choices?.[0]?.delta?.content;
        if (delta) onToken(delta);
      } catch {
        // partial/non-JSON keep-alive frame, ignore
      }
    }
  }
}

// Non-streaming completion, returns the full assistant message. Used for the
// AI product search and online research. Same fallback-through-models behaviour.
// opts.web enables OpenRouter's web-search plugin so the answer is grounded in
// real, citable sources.
export async function chatComplete(
  cfg: AiConfig,
  messages: ChatMsg[],
  signal?: AbortSignal,
  opts?: { web?: boolean },
): Promise<string> {
  const models = modelChain(cfg.model);
  let lastErr: unknown;
  for (let i = 0; i < models.length; i++) {
    try {
      return await completeOnce({ ...cfg, model: models[i] }, messages, signal, opts);
    } catch (e) {
      lastErr = e;
      if (signal?.aborted) throw e;
      const msg = e instanceof Error ? e.message : String(e);
      if (!shouldFallThrough(msg) || i === models.length - 1) throw e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Request failed.");
}

async function completeOnce(
  cfg: AiConfig,
  messages: ChatMsg[],
  signal?: AbortSignal,
  opts?: { web?: boolean },
): Promise<string> {
  // Never bill the web plugin on a free model.
  const useWeb = !!opts?.web && !isFreeModel(cfg.model);

  // Retry the same model on 429 with backoff before the outer loop tries a
  // different model. This is the key free-tier fix.
  for (let attempt = 0; ; attempt++) {
    try {
      return await postComplete(cfg, messages, signal, useWeb);
    } catch (e) {
      if (signal?.aborted) throw e;
      // If web search made it unaffordable, retry the same model without web.
      const msg = e instanceof Error ? e.message : String(e);
      if (useWeb && isInsufficientCredit(msg)) {
        return await postComplete(cfg, messages, signal, false);
      }
      const status = e instanceof OpenRouterError ? e.status : 0;
      if ((status === 429 || isRateLimited(msg)) && attempt < MAX_RATE_RETRIES) {
        const wait = backoffMs(attempt, e instanceof OpenRouterError ? e.retryAfterMs : undefined);
        await sleep(wait, signal);
        continue;
      }
      throw e;
    }
  }
}

async function postComplete(
  cfg: AiConfig,
  messages: ChatMsg[],
  signal: AbortSignal | undefined,
  web: boolean,
): Promise<string> {
  const body: Record<string, unknown> = { model: cfg.model, messages, temperature: 0.2 };
  if (web) body.plugins = [{ id: "web", max_results: 6 }];
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: headers(cfg),
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw await toError(res);
  const json = await res.json();
  return (json?.choices?.[0]?.message?.content as string) ?? "";
}

async function readError(res: Response): Promise<string> {
  let detail = "";
  try {
    const j = await res.json();
    detail = j?.error?.message || j?.message || JSON.stringify(j);
  } catch {
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
  }
  if (res.status === 401) return "Invalid or missing OpenRouter API key (401). Check your key.";
  if (res.status === 402) return "OpenRouter says this key has no credit for the chosen model (402).";
  if (res.status === 404) return `Model not found (404). ${detail}`.trim();
  if (res.status === 429) return "Rate limited by OpenRouter (429). Wait a moment and retry.";
  return `OpenRouter error ${res.status}: ${detail || res.statusText}`;
}
