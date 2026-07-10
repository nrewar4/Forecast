// Live country trade data from the World Bank Indicators API. Free, keyless,
// CORS-friendly, and an authoritative source. It powers the Market Overview for
// the six focus markets. The API is browser-fetchable directly.
//
// Chemical trade is derived from merchandise trade x the WITS chemical share
// (see src/data/chemicalTrade). Results are cached per day; a bundled fallback
// keeps the page populated when the API cannot be reached.

import { CHEM_SHARE, CHEM_FALLBACK } from "@/data/chemicalTrade";

export type CountryCode = "USA" | "IND" | "CHN" | "JPN" | "KOR" | "SAU";

export type FocusCountry = {
  code: CountryCode;
  name: string; // short display name
  flag: string;
};

// The six markets the Overview covers, in display order.
export const FOCUS_COUNTRIES: FocusCountry[] = [
  { code: "USA", name: "United States", flag: "🇺🇸" },
  { code: "CHN", name: "China", flag: "🇨🇳" },
  { code: "IND", name: "India", flag: "🇮🇳" },
  { code: "JPN", name: "Japan", flag: "🇯🇵" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷" },
  { code: "SAU", name: "Saudi Arabia", flag: "🇸🇦" },
];

// World Bank merchandise-trade indicators (reliable, well populated). Chemical
// trade is derived as merchandise x the WITS chemical share (see chemicalTrade).
const IND_EXPORTS = "TX.VAL.MRCH.CD.WT"; // Merchandise exports (current US$)
const IND_IMPORTS = "TM.VAL.MRCH.CD.WT"; // Merchandise imports (current US$)
const IND_TRADE_GDP = "NE.TRD.GNFS.ZS"; // Trade (% of GDP)

const CODES = FOCUS_COUNTRIES.map((c) => c.code).join(";");
const BASE = "https://api.worldbank.org/v2";
const CACHE_KEY = "apac.worldbank.chem.v3";

export type YearValue = { year: number; value: number };

export type CountryTrade = {
  code: CountryCode;
  name: string;
  flag: string;
  exports: number | null; // latest reported, US$
  imports: number | null;
  balance: number | null;
  tradeGdp: number | null; // trade as % of GDP
  latestYear: number | null;
  history: YearValue[]; // total trade (exports + imports) by year, ascending
};

export type TradeSnapshot = {
  countries: CountryTrade[];
  sourceUpdated: string | null; // World Bank "lastupdated" date
  fetchedAt: string; // ISO timestamp of our fetch
};

type WBPoint = {
  countryiso3code: string;
  date: string;
  value: number | null;
};

type WBMeta = { lastupdated?: string };

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Fetches one indicator for all six countries across a year range. Returns a map
// of country code to ascending year/value points, plus the source update date.
// Wraps fetch with a timeout so a hanging network fails fast into the error
// state instead of leaving the page on its loading skeleton forever.
async function fetchWithTimeout(url: string, signal?: AbortSignal, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

async function fetchIndicator(
  indicator: string,
  signal?: AbortSignal,
): Promise<{ byCountry: Map<string, YearValue[]>; lastUpdated: string | null }> {
  const url = `${BASE}/country/${CODES}/indicator/${indicator}?format=json&date=2010:2025&per_page=200`;
  const res = await fetchWithTimeout(url, signal);
  if (!res.ok) throw new Error(`World Bank ${res.status}`);
  const json = (await res.json()) as [WBMeta, WBPoint[] | null];
  const meta = json[0] ?? {};
  const rows = json[1] ?? [];
  const byCountry = new Map<string, YearValue[]>();
  for (const r of rows) {
    if (r.value == null) continue;
    const arr = byCountry.get(r.countryiso3code) ?? [];
    arr.push({ year: Number(r.date), value: r.value });
    byCountry.set(r.countryiso3code, arr);
  }
  for (const arr of byCountry.values()) arr.sort((a, b) => a.year - b.year);
  return { byCountry, lastUpdated: meta.lastupdated ?? null };
}

function latest(points: YearValue[] | undefined): YearValue | null {
  if (!points || points.length === 0) return null;
  return points[points.length - 1];
}

// The bundled fallback snapshot: chemical trade from World Bank 2022 merchandise
// trade x the WITS chemical share. Used when the live fetch is unavailable so
// the page always shows sourced figures rather than zeros.
function fallbackSnapshot(): TradeSnapshot {
  const countries: CountryTrade[] = FOCUS_COUNTRIES.map((c) => {
    const f = CHEM_FALLBACK.find((x) => x.code === c.code)!;
    return {
      code: c.code,
      name: c.name,
      flag: c.flag,
      exports: f.exports,
      imports: f.imports,
      balance: f.exports - f.imports,
      tradeGdp: null,
      latestYear: f.year,
      history: [], // multi-year history comes from the live series only
    };
  });
  return { countries, sourceUpdated: "2022", fetchedAt: new Date().toISOString() };
}

// Fetches merchandise trade from the World Bank and derives chemical trade by
// applying each country's WITS chemical share. If a country returns no data it
// falls back to the bundled figure, so the snapshot is always complete.
async function fetchSnapshot(signal?: AbortSignal): Promise<TradeSnapshot> {
  const [exp, imp, gdp] = await Promise.all([
    fetchIndicator(IND_EXPORTS, signal),
    fetchIndicator(IND_IMPORTS, signal),
    fetchIndicator(IND_TRADE_GDP, signal),
  ]);

  const countries: CountryTrade[] = FOCUS_COUNTRIES.map((c) => {
    const share = CHEM_SHARE[c.code];
    const fb = CHEM_FALLBACK.find((x) => x.code === c.code)!;
    const expPts = exp.byCountry.get(c.code) ?? [];
    const impPts = imp.byCountry.get(c.code) ?? [];
    const gLatest = latest(gdp.byCountry.get(c.code));

    // Chemical value per year = merchandise value x chemical share / 100.
    const impMap = new Map(impPts.map((p) => [p.year, p.value]));
    const historyMap = new Map<number, number>();
    let latestYear: number | null = null;
    let exportsVal: number | null = null;
    let importsVal: number | null = null;

    for (const p of expPts) {
      const chemE = (p.value * share.exportPct) / 100;
      let total = chemE;
      const impVal = impMap.get(p.year);
      const chemI = impVal != null ? (impVal * share.importPct) / 100 : null;
      if (chemI != null) total += chemI;
      historyMap.set(p.year, total);
      if (latestYear == null || p.year >= latestYear) {
        latestYear = p.year;
        exportsVal = chemE;
        importsVal = chemI;
      }
    }

    const history: YearValue[] = [...historyMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, value]) => ({ year, value }));

    // Fall back to the bundled figure when the live series is empty.
    if (exportsVal == null) {
      return {
        code: c.code,
        name: c.name,
        flag: c.flag,
        exports: fb.exports,
        imports: fb.imports,
        balance: fb.exports - fb.imports,
        tradeGdp: gLatest?.value ?? null,
        latestYear: fb.year,
        history: [],
      };
    }

    return {
      code: c.code,
      name: c.name,
      flag: c.flag,
      exports: exportsVal,
      imports: importsVal,
      balance: exportsVal != null && importsVal != null ? exportsVal - importsVal : null,
      tradeGdp: gLatest?.value ?? null,
      latestYear,
      history,
    };
  });

  return {
    countries,
    sourceUpdated: exp.lastUpdated,
    fetchedAt: new Date().toISOString(),
  };
}

type CachePayload = { day: string; snapshot: TradeSnapshot };

function readCache(): TradeSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (parsed.day !== todayKey()) return null; // stale, refetch daily
    return parsed.snapshot;
  } catch {
    return null;
  }
}

function writeCache(snapshot: TradeSnapshot) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ day: todayKey(), snapshot }));
  } catch {
    // ignore storage failures
  }
}

// Returns the daily snapshot, using today's cache when present. Pass force to
// bypass the cache (the manual refresh button). If the live fetch fails, returns
// the bundled fallback so the Market Overview always shows sourced figures.
export async function loadTradeSnapshot(
  opts: { force?: boolean; signal?: AbortSignal } = {},
): Promise<TradeSnapshot> {
  if (!opts.force) {
    const cached = readCache();
    if (cached) return cached;
  }
  try {
    const snapshot = await fetchSnapshot(opts.signal);
    writeCache(snapshot);
    return snapshot;
  } catch {
    // Network blocked or offline: show the bundled World Bank / WITS figures.
    return fallbackSnapshot();
  }
}
