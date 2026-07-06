import type { Shipment } from "@/data/trade";
import { monthlyTradeValue, type Mode } from "@/data/trade";
import { products } from "@/data/products";
import { research } from "@/data/research";
import { slug } from "@/lib/utils";

// Real forecasting engine. Each model is an actual algorithm fitted to the
// product monthly demand series derived from the live trade database, not a
// preset curve. The three models produce genuinely different forecasts and
// each reports a backtested error so the numbers are honest.

export type ModelKey = "prophet" | "sarima" | "xgboost";

export const modelLabels: Record<ModelKey, string> = {
  prophet: "Holt trend",
  sarima: "Seasonal AR",
  xgboost: "Gradient boosted trees",
};

export const modelBlurb: Record<ModelKey, string> = {
  prophet:
    "Double exponential smoothing with a damped trend. Smoothing weights are fitted by minimising one step error.",
  sarima:
    "Differenced autoregression solved by least squares with a seasonal lag. Captures momentum and yearly shape.",
  xgboost:
    "Gradient boosted regression trees trained on lagged demand features. Learns nonlinear lag interactions.",
};

export type ForecastPoint = {
  month: string;
  actual?: number;
  forecast?: number;
  band?: [number, number];
};

export type ForecastResult = {
  points: ForecastPoint[];
  history: number[];
  forecast: number[];
  mapePct: number;
  growthPct: number;
  current: number;
  horizonValue: number;
  monthsOfHistory: number;
  syntheticHistory: boolean;
};

const HISTORY_WINDOW = 12;
const HORIZON = 6;

// ----- month helpers -------------------------------------------------------

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ym(date: string): string {
  return date.slice(0, 7);
}

function labelFor(year: number, monthIndex0: number): string {
  return `${MONTH_NAMES[monthIndex0]} ${String(year).slice(2)}`;
}

// Builds a run of month labels ending at the given year and month.
function monthLabels(endYear: number, endMonth0: number, count: number, offset = 0): string[] {
  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const idx = endMonth0 + offset - i;
    const y = endYear + Math.floor(idx / 12);
    const m = ((idx % 12) + 12) % 12;
    out.push(labelFor(y, m));
  }
  return out;
}

// ----- series construction -------------------------------------------------

export type Series = {
  values: number[];
  labels: string[];
  futureLabels: string[];
  synthetic: boolean;
  monthsOfHistory: number;
  // Number of forecast steps. Normally HORIZON, but extended so the projection
  // always reaches at least six months past today when the latest trade month
  // is in the past (e.g. a snapshot extract that ends a few months ago).
  horizon: number;
};

// Months from the given year/month0 anchor to the current calendar month.
// Negative when the anchor is in the future (e.g. freshly uploaded data).
function monthsToNow(endYear: number, endMonth0: number): number {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth() - (endYear * 12 + endMonth0);
}

// Picks the dominant trade direction for a product so the synthetic backbone
// follows the right aggregate index.
function dominantMode(rows: Shipment[]): Mode {
  let imp = 0;
  let exp = 0;
  for (const r of rows) {
    if (r.mode === "Imports") imp += r.quantityT;
    else exp += r.quantityT;
  }
  return exp > imp ? "Exports" : "Imports";
}

// Builds a 12 point monthly demand series for one product. When the database
// ----- catalog baselines ---------------------------------------------------

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Parses a capacity string like "About 75 Mt per year" or "About 1,500 tonnes
// per year" into tonnes per year.
function parseCapacity(s: string): number {
  const m = s.match(/([\d,.]+)\s*(Mt|kt|tonnes|t)\b/i);
  if (!m) return 0;
  const v = parseFloat(m[1].replace(/,/g, ""));
  const u = m[2].toLowerCase();
  if (u === "mt") return v * 1e6;
  if (u === "kt") return v * 1e3;
  return v;
}

const capacityBySlug = new Map(research.map((r) => [slug(r.name), parseCapacity(r.globalCapacity)]));

const DRUGS = new Set(
  [
    "Paracetamol","Ibuprofen","Aspirin","Metformin","Amoxicillin","Azithromycin","Ciprofloxacin",
    "Atorvastatin","Omeprazole","Pantoprazole","Metoprolol","Amlodipine","Losartan","Telmisartan",
    "Diclofenac sodium","Cetirizine","Ranitidine","Ceftriaxone","Cefixime","Clopidogrel","Levofloxacin",
    "Lansoprazole","Esomeprazole","Rabeprazole","Gabapentin","Pregabalin","Sertraline","Fluoxetine",
    "Escitalopram","Montelukast","Rosuvastatin","Sitagliptin","Glimepiride","Gliclazide","Lisinopril",
    "Enalapril","Hydrochlorothiazide","Furosemide","Warfarin","Levothyroxine","Prednisolone",
    "Dexamethasone","Salbutamol","Budesonide","Doxycycline","Clarithromycin","Metronidazole",
    "Fluconazole","Itraconazole","Acyclovir","Tramadol","Naproxen","Famotidine","Domperidone",
    "Ondansetron","Tamsulosin","Valsartan","Carvedilol","Olmesartan","Duloxetine","Venlafaxine",
    "Rivaroxaban","Apixaban","Dapagliflozin","Empagliflozin",
  ].map((d) => d.toLowerCase()),
);

// Detects an active pharmaceutical ingredient by known name, common stems, or an
// explicit API or intermediate label.
function isPharma(name: string): boolean {
  const n = name.toLowerCase();
  if (n.includes("api") || n.includes("intermediate")) return true;
  if (DRUGS.has(n)) return true;
  return /(azole|prazole|sartan|statin|pril|dipine|gliptin|gliflozin|floxacin|cillin|mycin|setron|profen|parin|caine|olol|pam|mab|nib|prost|tadine|sterone)$/.test(n);
}

// Indicative annual demand growth by sector, used only as a baseline for catalog
// products that have no trade records yet. APIs and specialty chemicals trend
// faster than bulk commodities and inorganics.
function sectorAnnualGrowth(name: string, hsCode: string): number {
  if (isPharma(name)) return 12;
  const ch = hsCode.slice(0, 2);
  if (ch === "38" || ch === "34" || ch === "32") return 9; // specialty, surfactants, pigments
  if (ch === "39") return 6; // polymers
  if (ch === "31") return 4; // fertilisers
  if (ch === "28") return 4; // inorganics
  if (ch === "29") return 5; // organic intermediates
  return 5;
}

export type Baseline = { runRate: number; annualGrowth: number; mode: Mode };

// Builds an indicative baseline for a catalog product with no observed trade.
// Run rate scales sub linearly from global capacity so commodities and fine
// chemicals land in sensible and distinct ranges. Returns null when unknown.
export function makeBaseline(name: string, hsCode: string): Baseline | null {
  const annual = capacityBySlug.get(slug(name)) ?? 0;
  if (!annual) return null;
  const runRate = Math.round(clamp(Math.sqrt(annual) * 1.5, 30, 40000));
  return { runRate, annualGrowth: sectorAnnualGrowth(name, hsCode), mode: "Imports" };
}

// 12 point indicative series from a baseline: trends at the sector growth with a
// mild seasonal wobble so the models have a realistic curve to fit.
function baselineSeries(b: Baseline): number[] {
  const monthlyG = b.annualGrowth / 100 / 12;
  const seasonal = [0, 0.012, 0.028, -0.01, 0.035, 0.045, 0.02, 0.05, 0.035, 0.06, 0.075, 0.085];
  const start = b.runRate / Math.pow(1 + monthlyG, 11);
  return seasonal.map((sf, i) =>
    Math.max(1, Math.round(start * Math.pow(1 + monthlyG, i) * (1 + sf * 0.12))),
  );
}

// holds at least six distinct months it uses the real per month tonnage. When
// uploads only cover one or two months it falls back to a backbone shaped by
// the real aggregate monthly trade index, scaled to the product run rate, so
// the algorithms still operate on a realistic curve. A catalog product with no
// observed trade uses an indicative baseline instead. The fallback is flagged.
export function buildSeries(allRows: Shipment[], productRows: Shipment[], baseline?: Baseline | null): Series {
  const globalMonths = Array.from(new Set(allRows.map((s) => ym(s.date)))).sort();
  const productMonths = new Set(productRows.map((s) => ym(s.date)));

  const last = globalMonths[globalMonths.length - 1] ?? "2026-02";
  const [ly, lm] = last.split("-").map(Number);
  const endYear = ly;
  const endMonth0 = lm - 1;

  // Extend the forecast so it always spans up to six months beyond today. When
  // the latest trade month is stale, the extra steps cover the gap to the
  // present and beyond; capped so a very old snapshot does not explode the run.
  const horizon = Math.min(18, HORIZON + Math.max(0, monthsToNow(endYear, endMonth0)));

  const labels = monthLabels(endYear, endMonth0, HISTORY_WINDOW);
  const futureLabels = monthLabels(endYear, endMonth0, horizon, horizon);

  if (globalMonths.length >= 3) {
    // Real monthly tonnage aligned to the last twelve global months. Datamyne
    // extracts are snapshot months, so three or more distinct months is enough
    // to build a real per month series rather than a reconstructed backbone.
    const byMonth = new Map<string, number>();
    for (const s of productRows) byMonth.set(ym(s.date), (byMonth.get(ym(s.date)) ?? 0) + s.quantityT);
    const span = monthLabels(endYear, endMonth0, HISTORY_WINDOW);
    // Map the global month keys onto our twelve label slots.
    const keys: string[] = [];
    for (let i = HISTORY_WINDOW - 1; i >= 0; i--) {
      const idx = endMonth0 - i;
      const y = endYear + Math.floor(idx / 12);
      const m = ((idx % 12) + 12) % 12;
      keys.push(`${y}-${String(m + 1).padStart(2, "0")}`);
    }
    const raw = keys.map((k) => Math.round(byMonth.get(k) ?? 0));
    const obsIdx = raw.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0);
    // Only treat this as a real series when the product actually has in window
    // tonnage; otherwise fall through to the capacity baseline below.
    if (obsIdx.length > 0) {
      // Reconstruct the monthly path from the observed snapshot months: hold the
      // level flat before the first and after the last observation, and linearly
      // interpolate between observations. A single snapshot reads as a flat
      // level (no fake trend); two or more give the real trend between them.
      const values = raw.slice();
      const first = obsIdx[0];
      const lastObs = obsIdx[obsIdx.length - 1];
      for (let i = 0; i < first; i++) values[i] = raw[first];
      for (let i = lastObs + 1; i < values.length; i++) values[i] = raw[lastObs];
      for (let k = 0; k < obsIdx.length - 1; k++) {
        const a = obsIdx[k];
        const b = obsIdx[k + 1];
        for (let i = a + 1; i < b; i++) {
          values[i] = Math.round(raw[a] + ((raw[b] - raw[a]) * (i - a)) / (b - a));
        }
      }
      void span;
      return { values, labels, futureLabels, synthetic: false, monthsOfHistory: obsIdx.length, horizon };
    }
  }

  // Catalog product with no observed trade: indicative baseline series.
  const totalQty = productRows.reduce((a, s) => a + s.quantityT, 0);
  if (totalQty <= 0 && baseline) {
    return { values: baselineSeries(baseline), labels, futureLabels, synthetic: true, monthsOfHistory: 0, horizon };
  }

  // Fallback: disaggregate the real aggregate index to a per product backbone.
  const mode = dominantMode(productRows);
  const index = monthlyTradeValue[mode];
  const idxVals = index.slice(-HISTORY_WINDOW).map((p) => p.value);
  const idxMean = idxVals.reduce((a, b) => a + b, 0) / idxVals.length || 1;
  const runRate = totalQty / Math.max(1, productMonths.size);
  const values = idxVals.map((v) => Math.max(1, Math.round((v / idxMean) * runRate)));

  return {
    values,
    labels,
    futureLabels,
    synthetic: true,
    monthsOfHistory: productMonths.size,
    horizon,
  };
}

// ----- model 1: Holt linear with damped trend (Prophet slot) --------------

function holtForecast(y: number[], h: number): number[] {
  const n = y.length;
  if (n < 2) return Array(h).fill(y[n - 1] ?? 0);
  const phi = 0.92; // trend damping

  let bestAlpha = 0.5;
  let bestBeta = 0.2;
  let bestSse = Infinity;
  for (let a = 0.1; a <= 0.9; a += 0.1) {
    for (let b = 0.05; b <= 0.6; b += 0.05) {
      let level = y[0];
      let trend = y[1] - y[0];
      let sse = 0;
      for (let t = 1; t < n; t++) {
        const pred = level + phi * trend;
        const err = y[t] - pred;
        sse += err * err;
        const newLevel = a * y[t] + (1 - a) * (level + phi * trend);
        trend = b * (newLevel - level) + (1 - b) * phi * trend;
        level = newLevel;
      }
      if (sse < bestSse) {
        bestSse = sse;
        bestAlpha = a;
        bestBeta = b;
      }
    }
  }

  let level = y[0];
  let trend = y[1] - y[0];
  for (let t = 1; t < n; t++) {
    const newLevel = bestAlpha * y[t] + (1 - bestAlpha) * (level + phi * trend);
    trend = bestBeta * (newLevel - level) + (1 - bestBeta) * phi * trend;
    level = newLevel;
  }

  const out: number[] = [];
  let damp = 0;
  for (let i = 1; i <= h; i++) {
    damp += Math.pow(phi, i);
    out.push(Math.max(0, level + damp * trend));
  }
  return out;
}

// ----- model 2: ARIMA style differenced autoregression (SARIMA slot) ------

// Solves a small linear system (X'X + ridge) b = X'y by Gaussian elimination.
function solve(A: number[][], b: number[]): number[] {
  const n = b.length;
  const m = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    [m[col], m[pivot]] = [m[pivot], m[col]];
    const d = m[col][col] || 1e-9;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r][col] / d;
      for (let c = col; c <= n; c++) m[r][c] -= f * m[col][c];
    }
  }
  return m.map((row, i) => row[n] / (row[i] || 1e-9));
}

function arForecast(y: number[], h: number): number[] {
  const n = y.length;
  if (n < 4) return holtForecast(y, h);
  // First difference for stationarity (the I in ARIMA, d = 1).
  const d: number[] = [];
  for (let t = 1; t < n; t++) d.push(y[t] - y[t - 1]);
  const p = Math.min(3, d.length - 1);
  const seasonal = d.length >= 13; // include a yearly lag when history allows
  const lags = seasonal ? [...Array(p).keys()].map((i) => i + 1).concat(12) : [...Array(p).keys()].map((i) => i + 1);

  const rows: number[][] = [];
  const targets: number[] = [];
  for (let t = Math.max(...lags); t < d.length; t++) {
    rows.push([1, ...lags.map((L) => d[t - L])]);
    targets.push(d[t]);
  }
  if (rows.length < lags.length + 1) return holtForecast(y, h);

  const k = lags.length + 1;
  const ata = Array.from({ length: k }, () => Array(k).fill(0));
  const aty = Array(k).fill(0);
  for (let r = 0; r < rows.length; r++) {
    for (let i = 0; i < k; i++) {
      aty[i] += rows[r][i] * targets[r];
      for (let j = 0; j < k; j++) ata[i][j] += rows[r][i] * rows[r][j];
    }
  }
  for (let i = 0; i < k; i++) ata[i][i] += 1e-3; // ridge for stability
  const coef = solve(ata, aty);

  const diffs = [...d];
  const out: number[] = [];
  let lastLevel = y[n - 1];
  for (let i = 0; i < h; i++) {
    const feat = [1, ...lags.map((L) => diffs[diffs.length - L] ?? 0)];
    let dHat = 0;
    for (let c = 0; c < k; c++) dHat += coef[c] * feat[c];
    diffs.push(dHat);
    lastLevel = Math.max(0, lastLevel + dHat);
    out.push(lastLevel);
  }
  return out;
}

// ----- model 3: gradient boosted regression trees (XGBoost slot) ----------

type TreeNode =
  | { leaf: true; value: number }
  | { leaf: false; feature: number; threshold: number; left: TreeNode; right: TreeNode };

function buildTree(rows: number[][], target: number[], depth: number, maxDepth: number): TreeNode {
  const mean = target.reduce((a, b) => a + b, 0) / (target.length || 1);
  if (depth >= maxDepth || rows.length <= 2) return { leaf: true, value: mean };

  const nFeat = rows[0].length;
  let best = { sse: Infinity, feature: -1, threshold: 0 };
  let baseSse = 0;
  for (const t of target) baseSse += (t - mean) * (t - mean);

  for (let f = 0; f < nFeat; f++) {
    const vals = Array.from(new Set(rows.map((r) => r[f]))).sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const thr = (vals[i] + vals[i + 1]) / 2;
      let ls = 0, lc = 0, rs = 0, rc = 0;
      for (let j = 0; j < rows.length; j++) {
        if (rows[j][f] <= thr) { ls += target[j]; lc++; }
        else { rs += target[j]; rc++; }
      }
      if (lc === 0 || rc === 0) continue;
      const lm = ls / lc;
      const rm = rs / rc;
      let sse = 0;
      for (let j = 0; j < rows.length; j++) {
        const m = rows[j][f] <= thr ? lm : rm;
        sse += (target[j] - m) * (target[j] - m);
      }
      if (sse < best.sse) best = { sse, feature: f, threshold: thr };
    }
  }

  if (best.feature === -1 || best.sse >= baseSse - 1e-9) return { leaf: true, value: mean };

  const lr: number[][] = [], rr: number[][] = [], lt: number[] = [], rt: number[] = [];
  for (let j = 0; j < rows.length; j++) {
    if (rows[j][best.feature] <= best.threshold) { lr.push(rows[j]); lt.push(target[j]); }
    else { rr.push(rows[j]); rt.push(target[j]); }
  }
  return {
    leaf: false,
    feature: best.feature,
    threshold: best.threshold,
    left: buildTree(lr, lt, depth + 1, maxDepth),
    right: buildTree(rr, rt, depth + 1, maxDepth),
  };
}

function predictTree(node: TreeNode, x: number[]): number {
  let cur: TreeNode = node;
  while (cur.leaf === false) {
    cur = x[cur.feature] <= cur.threshold ? cur.left : cur.right;
  }
  return cur.value;
}

function gbtForecast(y: number[], h: number): number[] {
  const n = y.length;
  // Model first differences so the trees can extrapolate a trend. Tree
  // ensembles cannot predict outside the range of the training target, so a
  // levels model would flatline. Learning the period to period change and
  // accumulating it is the standard gradient boosted time series recipe.
  const diff: number[] = [];
  for (let t = 1; t < n; t++) diff.push(y[t] - y[t - 1]);
  const k = Math.min(3, diff.length - 1);
  if (n < 5 || k < 1) return holtForecast(y, h);

  // Features: lagged differences plus a normalised time index for drift.
  const rows: number[][] = [];
  const target: number[] = [];
  for (let t = k; t < diff.length; t++) {
    const lags = [];
    for (let L = 1; L <= k; L++) lags.push(diff[t - L]);
    rows.push([...lags, t / diff.length]);
    target.push(diff[t]);
  }
  if (rows.length < 3) return holtForecast(y, h);

  const base = target.reduce((a, b) => a + b, 0) / target.length;
  const lr = 0.15;
  const nTrees = 60;
  const maxDepth = 2;
  const residual = target.map((v) => v - base);
  const trees: TreeNode[] = [];
  for (let i = 0; i < nTrees; i++) {
    const tree = buildTree(rows, residual, 0, maxDepth);
    trees.push(tree);
    for (let j = 0; j < rows.length; j++) residual[j] -= lr * predictTree(tree, rows[j]);
  }

  const predict = (x: number[]) => {
    let v = base;
    for (const tree of trees) v += lr * predictTree(tree, x);
    return v;
  };

  const diffs = [...diff];
  const out: number[] = [];
  let level = y[n - 1];
  for (let i = 0; i < h; i++) {
    const feat = [];
    for (let L = 1; L <= k; L++) feat.push(diffs[diffs.length - L] ?? 0);
    feat.push((diff.length + i) / diff.length);
    const dHat = predict(feat);
    diffs.push(dHat);
    level = Math.max(0, level + dHat);
    out.push(level);
  }
  return out;
}

const MODELS: Record<ModelKey, (y: number[], h: number) => number[]> = {
  prophet: holtForecast,
  sarima: arForecast,
  xgboost: gbtForecast,
};

// ----- backtesting ---------------------------------------------------------

// Walk forward one step MAPE: for the last few points, fit on the prefix and
// predict the next value, then average the percentage errors. This is a real
// accuracy measure, recomputed per model and series.
export function backtestMape(y: number[], model: ModelKey): number {
  const n = y.length;
  if (n < 5) return NaN;
  const fn = MODELS[model];
  const start = Math.max(4, n - 5);
  let sum = 0;
  let count = 0;
  for (let t = start; t < n; t++) {
    const pred = fn(y.slice(0, t), 1)[0];
    const actual = y[t];
    if (actual <= 0) continue;
    sum += Math.abs(actual - pred) / actual;
    count++;
  }
  return count ? (sum / count) * 100 : NaN;
}

function residualSigma(y: number[], model: ModelKey): number {
  const n = y.length;
  const fn = MODELS[model];
  let sum = 0;
  let count = 0;
  for (let t = Math.max(3, n - 6); t < n; t++) {
    const pred = fn(y.slice(0, t), 1)[0];
    const err = y[t] - pred;
    sum += err * err;
    count++;
  }
  const variance = count ? sum / count : 0;
  return Math.sqrt(variance);
}

// ----- public forecast assembly -------------------------------------------

export function runForecast(
  allRows: Shipment[],
  productRows: Shipment[],
  model: ModelKey,
  baseline?: Baseline | null,
): ForecastResult {
  const series = buildSeries(allRows, productRows, baseline);
  const y = series.values;
  const fn = MODELS[model];
  // Forecast across the (possibly extended) horizon so the chart reaches the
  // present. The first HORIZON steps are identical to a plain six month run, so
  // the six month growth figure below stays consistent with the ranking.
  const forecast = fn(y, series.horizon).map((v) => Math.round(v));

  const sigma = residualSigma(y, model);
  const z = 1.28; // about an 80 percent band
  const points: ForecastPoint[] = [];
  for (let i = 0; i < y.length; i++) {
    const last = i === y.length - 1;
    points.push(
      last
        ? { month: series.labels[i], actual: y[i], forecast: y[i], band: [y[i], y[i]] }
        : { month: series.labels[i], actual: y[i] },
    );
  }
  for (let i = 0; i < forecast.length; i++) {
    const spread = Math.round(z * sigma * Math.sqrt(i + 1));
    points.push({
      month: series.futureLabels[i],
      forecast: forecast[i],
      band: [Math.max(0, forecast[i] - spread), forecast[i] + spread],
    });
  }

  const current = y[y.length - 1] || 1;
  // Six month growth keeps its meaning even when the chart horizon is longer.
  const sixIdx = Math.min(HORIZON, forecast.length) - 1;
  const horizonValue = forecast[sixIdx] ?? current;
  const growthPct = Math.round(((horizonValue - current) / current) * 100);
  const mapePct = backtestMape(y, model);

  return {
    points,
    history: y,
    forecast,
    mapePct,
    growthPct,
    current,
    horizonValue,
    monthsOfHistory: series.monthsOfHistory,
    syntheticHistory: series.synthetic,
  };
}

// ----- growth ranking from real model forecasts ---------------------------

export type Signal = "Strong buy" | "Buy" | "Hold" | "Watch";

export type GrowthRow = {
  product: string;
  hsCode: string;
  current: number;
  forecast: number;
  growth: number;
  signal: Signal;
};

function signalFor(g: number): Signal {
  if (g >= 14) return "Strong buy";
  if (g >= 6) return "Buy";
  if (g >= 0) return "Hold";
  return "Watch";
}

// Lightweight forecast used for the ranking: one model fit, no backtest, so the
// full catalog can be scored on every render. Also reports whether the series is
// real and how many distinct months it observed, so the ranking can drop
// products that have no genuine forecast (a single month reads as a flat line).
function quickGrowth(
  allRows: Shipment[],
  productRows: Shipment[],
  baseline: Baseline | null,
  model: ModelKey,
): { current: number; horizon: number; growth: number; synthetic: boolean; monthsOfHistory: number } {
  const series = buildSeries(allRows, productRows, baseline);
  const y = series.values;
  const f = MODELS[model](y, HORIZON).map((v) => Math.round(v));
  const current = y[y.length - 1] || 1;
  const horizon = f[f.length - 1] ?? current;
  return {
    current,
    horizon,
    growth: Math.round(((horizon - current) / current) * 100),
    synthetic: series.synthetic,
    monthsOfHistory: series.monthsOfHistory,
  };
}

// Full forecast for one product. Uses observed trade when present, otherwise an
// indicative catalog baseline.
export function forecastProduct(
  allRows: Shipment[],
  name: string,
  hsCode: string,
  model: ModelKey,
): ForecastResult {
  const key = name.trim() || hsCode;
  const rows = allRows.filter((s) => (s.product.trim() || s.hsCode) === key);
  return runForecast(allRows, rows, model, makeBaseline(name, hsCode));
}

// Minimum distinct observed months a product needs to qualify for the forecast
// list. With a single month the series is held flat and the "forecast" is just a
// horizontal line (zero growth, zero error), which is not a real prediction. Two
// or more observed months give the models an actual trend to project.
const MIN_REAL_MONTHS = 2;

// Ranks the product universe by the forecasted six month change under the
// selected model. Only products with a genuine, data-driven forecast are kept:
// they must have real observed trade across at least MIN_REAL_MONTHS distinct
// months. Products with no trade, or only a single snapshot month, produce a
// flat line rather than a prediction and are excluded.
export function deriveGrowthRanking(shipments: Shipment[], model: ModelKey, n = 1000): GrowthRow[] {
  const universe = new Map<string, { name: string; hsCode: string }>();
  for (const p of products) universe.set(slug(p.name), { name: p.name, hsCode: p.hsCode });
  for (const s of shipments) {
    const name = s.product.trim() || `HS ${s.hsCode}`;
    const key = slug(name);
    if (!universe.has(key)) universe.set(key, { name, hsCode: s.hsCode });
  }

  const out: GrowthRow[] = [];
  for (const { name, hsCode } of universe.values()) {
    const key = name.trim() || hsCode;
    const rows = shipments.filter((s) => (s.product.trim() || s.hsCode) === key);
    const baseline = makeBaseline(name, hsCode);
    if (rows.length === 0 && !baseline) continue;
    const q = quickGrowth(shipments, rows, baseline, model);
    // Drop products without a real, multi-month series: their forecast is flat.
    if (q.synthetic || q.monthsOfHistory < MIN_REAL_MONTHS) continue;
    out.push({
      product: name,
      hsCode,
      current: q.current,
      forecast: q.horizon,
      growth: q.growth,
      signal: signalFor(q.growth),
    });
  }
  return out.sort((a, b) => b.growth - a.growth || b.current - a.current).slice(0, n);
}
