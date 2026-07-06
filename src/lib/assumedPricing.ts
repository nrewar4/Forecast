import { products } from "@/data/products";

export type AssumedConfig = {
  enabled: boolean;
  defaultPerTonne: number;
  overrides: Record<string, number>; // hsCode -> assumed USD per tonne
};

const KEY = "apac.assumedPricing.v1";

// Indicative prices per HS code (USD per tonne) parsed from the product
// knowledge base. Used as the default assumption when a file lacks values.
export const indicativePerTonne: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const p of products) {
    const m = p.priceIndicative.match(/([\d,]+(?:\.\d+)?)\s*per\s*(kg|tonne|ton)/i);
    if (!m) continue;
    let val = Number(m[1].replace(/,/g, ""));
    if (/kg/i.test(m[2])) val = val * 1000; // convert per kg to per tonne
    if (Number.isFinite(val)) map[p.hsCode] = Math.round(val);
  }
  return map;
})();

export const defaultAssumedConfig: AssumedConfig = {
  enabled: false,
  defaultPerTonne: 800,
  overrides: {},
};

export function loadAssumedConfig(): AssumedConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultAssumedConfig;
    return { ...defaultAssumedConfig, ...(JSON.parse(raw) as Partial<AssumedConfig>) };
  } catch {
    return defaultAssumedConfig;
  }
}

export function saveAssumedConfig(c: AssumedConfig) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // storage may be unavailable, ignore
  }
}

// Assumed price per tonne for an HS code. Prefers a manual override, then the
// indicative book price, then the global default.
export function assumedPriceFor(hs: string, c: AssumedConfig): number {
  return c.overrides[hs] ?? indicativePerTonne[hs] ?? c.defaultPerTonne;
}
