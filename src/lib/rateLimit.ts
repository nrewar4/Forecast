// Client-side rate limiting.
//
// IMPORTANT: this is not, and cannot be, DDoS protection. An attacker flooding
// the site does not run this JavaScript, so real DDoS / volumetric protection
// has to live at the CDN / WAF / reverse-proxy edge (see SECURITY.md for the
// Cloudflare and Nginx config).
//
// What this DOES protect, from within a normal browser session:
//   - the free public APIs the app calls (PubChem, NCI CACTUS, OPSIN, World
//     Bank), so a single tab cannot hammer them and get the user IP throttled,
//   - the OpenRouter budget, by capping how often the paid LLM path can fire,
//   - the UI, by stopping accidental rapid resubmits.
// It is a courtesy + cost guard, one layer of defence in depth.

type Limit = { max: number; windowMs: number };

const buckets = new Map<string, number[]>();

// Sliding-window check. Returns whether the action is allowed now, and if not,
// how long until it will be. Does not consume a slot when it blocks.
export function rateLimit(key: string, limit: Limit): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < limit.windowMs);
  if (hits.length >= limit.max) {
    buckets.set(key, hits);
    return { ok: false, retryAfterMs: Math.max(0, limit.windowMs - (now - hits[0])) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfterMs: 0 };
}

// Named limits used across the app. Generous enough that a real person never
// notices, tight enough to stop a runaway loop or an abusive script in the page.
export const LIMITS = {
  chat: { max: 15, windowMs: 60_000 }, // assistant messages per minute
  enquiry: { max: 3, windowMs: 60_000 }, // enquiry submissions per minute
  search: { max: 30, windowMs: 60_000 }, // catalogue / AI searches per minute
} as const;

export function retryHint(ms: number): string {
  const s = Math.ceil(ms / 1000);
  return s <= 1 ? "a moment" : `${s} seconds`;
}
