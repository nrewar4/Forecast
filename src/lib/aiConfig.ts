// Settings for the OpenRouter-powered Product Research Assistant. The API key is
// kept in browser localStorage (never committed). A build-time key/model can be
// supplied via Vite env as a fallback for shared deployments.
export type AiConfig = { apiKey: string; model: string };

const STORAGE_KEY = "apac.ai.config.v1";
const ENV_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
const ENV_MODEL = import.meta.env.VITE_OPENROUTER_MODEL as string | undefined;

// Default model. "openrouter/auto" is OpenRouter's Auto Router, it lets
// OpenRouter pick any available model for the request, so you never hit a
// "model not found" error. You can pin a specific model in .env or settings.
export const DEFAULT_MODEL = "openrouter/auto";

export const MODEL_SUGGESTIONS = [
  "openrouter/auto",
  "google/gemini-2.0-flash-001",
  "anthropic/claude-3.7-sonnet",
  "meta-llama/llama-3.3-70b-instruct",
  // Free options (no credit needed; require the free-model privacy setting and
  // have lower rate limits). Web search is auto-disabled on these.
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// Free models are tried automatically when paid models return 402 (no credit),
// and the client jumps back to the better paid model as soon as credit returns
// (every request retries the preferred model first). Models tagged ":free" or
// "openrouter/free" cost nothing; web search is skipped on them since the web
// plugin is billed separately.
export const FREE_FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-120b:free",
  "openrouter/free", // free auto-router
];

// If the chosen model is unavailable/deprecated OR the account has no credit
// (402), the client retries down this chain: paid models first, then free
// models, ending at the paid Auto Router as a last resort.
export const FALLBACK_MODELS = [
  "google/gemini-2.0-flash-001",
  "anthropic/claude-3.7-sonnet",
  "meta-llama/llama-3.3-70b-instruct",
  ...FREE_FALLBACK_MODELS,
  "openrouter/auto",
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

export function hasApiKey(cfg: AiConfig): boolean {
  return Boolean(cfg.apiKey && cfg.apiKey.trim());
}
