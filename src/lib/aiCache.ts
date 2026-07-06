// Tiny TTL cache (in-memory + localStorage) used to avoid re-hitting the AI /
// FDA APIs for inputs we have already resolved. On the free OpenRouter tier this
// is the difference between an instant repeat search and a 429 rate-limit error.

// Bump the version segment to invalidate all previously cached AI/FDA results
// (e.g. after a prompt or parsing fix that changes the output).
const PREFIX = "apac.cache.v2.";
const mem = new Map<string, { exp: number; value: unknown }>();

export const DAY = 24 * 60 * 60 * 1000;

export function cacheGet<T>(key: string): T | null {
  const k = PREFIX + key;
  const now = Date.now();

  const hit = mem.get(k);
  if (hit) {
    if (hit.exp > now) return hit.value as T;
    mem.delete(k);
  }

  try {
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { exp: number; value: T };
    if (parsed.exp > now) {
      mem.set(k, parsed);
      return parsed.value;
    }
    localStorage.removeItem(k);
  } catch {
    // ignore malformed / unavailable storage
  }
  return null;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number = DAY): void {
  const k = PREFIX + key;
  const entry = { exp: Date.now() + ttlMs, value };
  mem.set(k, entry);
  try {
    localStorage.setItem(k, JSON.stringify(entry));
  } catch {
    // storage full / private mode — in-memory cache still applies this session
  }
}

// Wrap an async producer with cache-aside semantics.
export async function cached<T>(
  key: string,
  ttlMs: number,
  produce: () => Promise<T>,
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== null) return hit;
  const value = await produce();
  cacheSet(key, value, ttlMs);
  return value;
}
