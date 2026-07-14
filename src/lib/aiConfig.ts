// Settings for the OpenRouter-powered Product Research Assistant. The API key is
// kept in browser localStorage (never committed). A build-time key/model can be
// supplied via Vite env as a fallback for shared deployments.
export type AiConfig = { apiKey: string; model: string };

const STORAGE_KEY = "apac.ai.config.v1";
const ENV_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
const ENV_MODEL = import.meta.env.VITE_OPENROUTER_MODEL as string | undefined;

// Optional keyless proxy. When VITE_AI_PROXY_URL is set (e.g. "/api/ai"), the
// browser talks to that endpoint instead of OpenRouter directly, and the API key
// lives ONLY in the server's environment (never shipped to the client). This is
// the recommended way to run the AI features for all visitors without handing
// each of them a key. See DEPLOYMENT.md.
export const AI_PROXY_URL = ((import.meta.env.VITE_AI_PROXY_URL as string | undefined) || "").trim();

export function hasProxy(): boolean {
  return AI_PROXY_URL.length > 0;
}

// The model used for web-grounded research calls. The web-search plugin is billed
// and is never attached to a free model, so a web-capable paid model is requested
// for these calls; if the account has no credit it cleanly falls back down the
// free chain (answering from model knowledge, without web). Override with
// VITE_OPENROUTER_WEB_MODEL.
export const WEB_MODEL = ((import.meta.env.VITE_OPENROUTER_WEB_MODEL as string | undefined) || "openai/gpt-4o-mini").trim();

// Default to the free tier, so a key with no paid credit works out of the box
// with no billing errors. "openrouter/free" is OpenRouter's free Auto Router: it
// always resolves to some available free model, so it can never 404 or 402.
export const DEFAULT_MODEL = "openrouter/free";

// Good free models (no credit needed, tagged ":free"), in rough quality order.
// The client (src/lib/openrouter.ts) rotates through these across calls, so it
// "switches between" them and a single rate-limited model never blocks every
// request. Any id that is deprecated is skipped on a 404, and every chain ends
// at FREE_TERMINAL, so requests never dead-end on an error. Web search is not
// attached to free models (that plugin is billed separately).
// Kept short and current: dead slugs cost a 404 round-trip on every request and
// slow the whole chain, so only models confirmed available are listed. The
// terminal FREE_TERMINAL (openrouter/free) is always appended as the guaranteed
// fallback, so this can safely be empty. Add specific ":free" slugs here only
// after confirming they resolve at https://openrouter.ai/models.
export const FREE_MODELS: string[] = [];

// Guaranteed terminal fallback: the free Auto Router. Always available, free, so
// the model chain can never end on a 402 (no credit) or 404 (bad id).
export const FREE_TERMINAL = "openrouter/free";

// Shown in the settings picker: free options first (recommended, no credit), then
// a couple of paid models for users who add credit and want top quality. A pinned
// paid model is still backed up by the free models, so a 402 never dead-ends.
export const MODEL_SUGGESTIONS = [
  "openrouter/free",
  ...FREE_MODELS,
  "google/gemini-2.0-flash-001",
  "anthropic/claude-3.7-sonnet",
];

export function loadAiConfig(): AiConfig {
  let saved: Partial<AiConfig> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    // ignore malformed storage
  }
  return {
    apiKey: (saved.apiKey || ENV_KEY || "").trim(),
    model: (saved.model || ENV_MODEL || DEFAULT_MODEL).trim(),
  };
}

export function saveAiConfig(cfg: AiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: cfg.apiKey.trim(), model: cfg.model.trim() }));
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}

// AI features are available when the user (or deployment) supplied a key, OR when
// a keyless proxy is configured to hold the key server-side.
export function hasApiKey(cfg: AiConfig): boolean {
  return Boolean((cfg.apiKey && cfg.apiKey.trim()) || hasProxy());
}
