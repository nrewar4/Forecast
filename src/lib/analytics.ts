// First-party site analytics. Every visit records lightweight events in
// localStorage (no cookies, nothing leaves the browser); the admin dashboard
// aggregates them. Storage is capped so it never grows unbounded.

export type AnalyticsEvent = {
  /** view = a route render, search = a query, everything else is a named event */
  kind: "view" | "search" | "event";
  ts: number;
  /** visitor session id (per browser tab session) */
  sid: string;
  path?: string;
  query?: string;
  name?: string;
  /** viewport bucket at the time of the event */
  device?: "phone" | "tablet" | "desktop";
  referrer?: string;
};

const STORE_KEY = "apac.analytics.v1";
const SID_KEY = "apac.analytics.sid";
const MAX_EVENTS = 5000;

function deviceBucket(): AnalyticsEvent["device"] {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "phone";
  if (w < 1024) return "tablet";
  return "desktop";
}

function sessionId(): string {
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return "anonymous";
  }
}

export function loadEvents(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]") as AnalyticsEvent[];
  } catch {
    return [];
  }
}

function append(event: AnalyticsEvent): void {
  try {
    const events = loadEvents();
    events.push(event);
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(events.slice(-MAX_EVENTS)),
    );
  } catch {
    // storage full or unavailable; analytics are best-effort
  }
}

export function trackPageView(path: string): void {
  append({
    kind: "view",
    ts: Date.now(),
    sid: sessionId(),
    path,
    device: deviceBucket(),
    referrer: document.referrer && !document.referrer.includes(location.host)
      ? document.referrer
      : undefined,
  });
}

export function trackSearch(query: string, scope: string): void {
  const q = query.trim();
  if (!q) return;
  append({ kind: "search", ts: Date.now(), sid: sessionId(), query: q, name: scope });
}

export function trackEvent(name: string, path?: string): void {
  append({ kind: "event", ts: Date.now(), sid: sessionId(), name, path });
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    // ignore
  }
}

// ---------- Aggregation helpers (used by the admin dashboard) ----------

const DAY = 24 * 60 * 60 * 1000;

export function since(events: AnalyticsEvent[], days: number): AnalyticsEvent[] {
  const cutoff = Date.now() - days * DAY;
  return events.filter((e) => e.ts >= cutoff);
}

export type DailyPoint = { label: string; views: number; visitors: number };

/** Page views and unique visitor sessions per day for the trailing window. */
export function dailySeries(events: AnalyticsEvent[], days: number): DailyPoint[] {
  const out: DailyPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const start = day.getTime();
    const end = start + DAY;
    const inDay = events.filter((e) => e.kind === "view" && e.ts >= start && e.ts < end);
    out.push({
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: inDay.length,
      visitors: new Set(inDay.map((e) => e.sid)).size,
    });
  }
  return out;
}

export function countBy<T extends string>(
  events: AnalyticsEvent[],
  key: (e: AnalyticsEvent) => T | undefined,
): { name: T; value: number }[] {
  const map = new Map<T, number>();
  for (const e of events) {
    const k = key(e);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value,
  );
}

export function hourlyHistogram(events: AnalyticsEvent[]): { hour: string; views: number }[] {
  const buckets = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    views: 0,
  }));
  for (const e of events) {
    if (e.kind !== "view") continue;
    buckets[new Date(e.ts).getHours()].views += 1;
  }
  return buckets;
}
