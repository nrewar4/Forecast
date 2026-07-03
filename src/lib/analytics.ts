// Lightweight, self-contained website analytics. Records page views and named
// events into localStorage (capped ring buffer) with an anonymous session id.
// No external service and no personal data. The Admin Dashboard reads this to
// chart traffic; clearing browser storage clears the history.
//
// Note: because storage is per browser, this measures activity on each device.
// Wiring the same records into a Supabase table later would make it site-wide.

export type PageView = {
  t: number; // timestamp (ms)
  path: string;
  session: string;
  referrer: string;
  width: number;
  device: "desktop" | "tablet" | "mobile";
};

export type AppEvent = {
  t: number;
  name: string;
  session: string;
  data: Record<string, string>;
};

const VIEWS_KEY = "apac.analytics.views.v1";
const EVENTS_KEY = "apac.analytics.events.v1";
const SESSION_KEY = "apac.analytics.session.v1";
const MAX_ROWS = 5000;
const SESSION_GAP_MIN = 30;

function readArr<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArr<T>(key: string, rows: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(rows.slice(-MAX_ROWS)));
  } catch {
    // storage full or unavailable; analytics is best-effort
  }
}

// A session id that renews after 30 minutes of inactivity.
function sessionId(): string {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const now = Date.now();
    if (raw) {
      const s = JSON.parse(raw) as { id: string; last: number };
      if (now - s.last < SESSION_GAP_MIN * 60 * 1000) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id: s.id, last: now }));
        return s.id;
      }
    }
    const id = Math.random().toString(36).slice(2, 10);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
    return id;
  } catch {
    return "anon";
  }
}

function device(width: number): PageView["device"] {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function trackPageView(path: string): void {
  const view: PageView = {
    t: Date.now(),
    path,
    session: sessionId(),
    referrer: document.referrer || "",
    width: window.innerWidth,
    device: device(window.innerWidth),
  };
  writeArr(VIEWS_KEY, [...readArr<PageView>(VIEWS_KEY), view]);
}

export function track(name: string, data: Record<string, string>): void {
  const ev: AppEvent = { t: Date.now(), name, session: sessionId(), data };
  writeArr(EVENTS_KEY, [...readArr<AppEvent>(EVENTS_KEY), ev]);
}

export function loadPageViews(): PageView[] {
  return readArr<PageView>(VIEWS_KEY);
}

export function loadEvents(): AppEvent[] {
  return readArr<AppEvent>(EVENTS_KEY);
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(VIEWS_KEY);
    localStorage.removeItem(EVENTS_KEY);
  } catch {
    // ignore
  }
}
