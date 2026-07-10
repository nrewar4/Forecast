// Live country trade data from the World Bank Indicators API. Free, keyless,
// CORS-friendly, and an authoritative source. It powers the Market Overview for
// the six focus markets. The API is browser-fetchable directly.
//
// Official merchandise trade is published annually, so the newest figure is the
// latest reported year per country. To keep the page "current" we re-check once
// per day: results are cached in localStorage under today's date, so the first
// visit each day refetches and later visits are instant. A manual refresh clears
// the cache.

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

// World Bank indicator codes used, all "current US$" or a ratio. Chemical trade
// is derived from merchandise trade and the World Bank / WITS chemical-share
// indicators, so the figures stay from a single authoritative source.
const IND_EXPORTS = "TX.VAL.MRCH.CD.WT"; // Merchandise exports (current US$)
const IND_IMPORTS = "TM.VAL.MRCH.CD.WT"; // Merchandise imports (current US$)
const IND_TRADE_GDP = "NE.TRD.GNFS.ZS"; // Trade (% of GDP)
const IND_CHEM_EXP_PCT = "TX.VAL.CHEM.ZS.UN"; // Chemicals, % of merchandise exports
const IND_CHEM_IMP_PCT = "TM.VAL.CHEM.ZS.UN"; // Chemicals, % of merchandise imports

const CODES = FOCUS_COUNTRIES.map((c) => c.code).join(";");
const BASE = "https://api.worldbank.org/v2";
const CACHE_KEY = "apac.worldbank.chem.v2";

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

// The chemical share for a given year, or the latest available share as a
// fallback (the share moves slowly, so carrying it forward is reasonable and
// keeps the figure sourced from the World Bank rather than invented).
function pctForYear(points: YearValue[] | undefined, year: number): number | null {
  if (!points || points.length === 0) return null;
  const exact = points.find((p) => p.year === year);
  if (exact) return exact.value;
  return points[points.length - 1].value;
}

// Fetches the full snapshot from the World Bank API and derives chemical-only
// trade (merchandise value multiplied by the chemical share). Everything the
// Market Overview shows is chemical trade.
async function fetchSnapshot(signal?: AbortSignal): Promise<TradeSnapshot> {
  const [exp, imp, gdp, chemExp, chemImp] = await Promise.all([
    fetchIndicator(IND_EXPORTS, signal),
    fetchIndicator(IND_IMPORTS, signal),
    fetchIndicator(IND_TRADE_GDP, signal),
    fetchIndicator(IND_CHEM_EXP_PCT, signal),
    fetchIndicator(IND_CHEM_IMP_PCT, signal),
  ]);

  const countries: CountryTrade[] = FOCUS_COUNTRIES.map((c) => {
    const expPts = exp.byCountry.get(c.code) ?? [];
    const impPts = imp.byCountry.get(c.code) ?? [];
    const chemExpPts = chemExp.byCountry.get(c.code) ?? [];
    const chemImpPts = chemImp.byCountry.get(c.code) ?? [];
    const gLatest = latest(gdp.byCountry.get(c.code));

    // Chemical value per year = merchandise value x chemical share / 100.
    const impMap = new Map(impPts.map((p) => [p.year, p.value]));
    const chemExpByYear: YearValue[] = [];
    const historyMap = new Map<number, number>();
    for (const p of expPts) {
      const pct = pctForYear(chemExpPts, p.year);
      if (pct == null) continue;
      const chemE = (p.value * pct) / 100;
      chemExpByYear.push({ year: p.year, value: chemE });
      let total = chemE;
      const impVal = impMap.get(p.year);
      const impPct = pctForYear(chemImpPts, p.year);
      if (impVal != null && impPct != null) total += (impVal * impPct) / 100;
      historyMap.set(p.year, total);
    }

    const eLatestChem = latest(chemExpByYear);
    const latestYear = eLatestChem?.year ?? null;
    const exportsVal = eLatestChem?.value ?? null;

    let importsVal: number | null = null;
    if (latestYear != null) {
      const impVal = impMap.get(latestYear);
      const impPct = pctForYear(chemImpPts, latestYear);
      if (impVal != null && impPct != null) importsVal = (impVal * impPct) / 100;
    }

    const history: YearValue[] = [...historyMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, value]) => ({ year, value }));

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
// bypass the cache (the manual refresh button).
export async function loadTradeSnapshot(
  opts: { force?: boolean; signal?: AbortSignal } = {},
): Promise<TradeSnapshot> {
  if (!opts.force) {
    const cached = readCache();
    if (cached) return cached;
  }
  const snapshot = await fetchSnapshot(opts.signal);
  writeCache(snapshot);
  return snapshot;
}
