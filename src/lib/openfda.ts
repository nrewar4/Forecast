// Live FDA lookups via openFDA (api.fda.gov). CORS-enabled, free, no key needed
// (rate-limited). Used to ground the regulatory panel with real approved-product
// and applicant data, the Orange Book "product + sponsor" layer, and to detect
// biologics (Purple Book signal) via BLA application numbers.

export type FdaProduct = {
  brandName: string;
  sponsor: string;          // applicant / originator company
  applicationNumber: string; // e.g. NDA019992, ANDA040..., BLA125...
  appType: "NDA" | "ANDA" | "BLA" | "OTC" | "Other";
  dosageForm: string;
  route: string;
  marketingStatus: string;  // Prescription / OTC / Discontinued / ...
  strength: string;
};

export type FdaLookup = {
  query: string;
  products: FdaProduct[];
  originators: string[];     // distinct NDA/BLA sponsors (brand originators)
  genericSponsors: string[]; // distinct ANDA sponsors (generics)
  isBiologic: boolean;       // any BLA → Purple Book item
  total: number;
};

import { cacheGet, cacheSet, DAY } from "./aiCache";

const ENDPOINT = "https://api.fda.gov/drug/drugsfda.json";

const MARKETING: Record<string, string> = {
  "1": "Prescription",
  "2": "Over-the-counter",
  "3": "Discontinued",
  "4": "Tentative Approval",
  "5": "None (other)",
};

function appType(appNum: string): FdaProduct["appType"] {
  if (/^BLA/i.test(appNum)) return "BLA";
  if (/^ANDA/i.test(appNum)) return "ANDA";
  if (/^NDA/i.test(appNum)) return "NDA";
  return "Other";
}

// US FDA ingredient naming differs from INN/common names. Map a few we cover so
// the search hits (e.g. paracetamol is listed as ACETAMINOPHEN in openFDA).
const SYNONYMS: Record<string, string[]> = {
  paracetamol: ["acetaminophen"],
  acetaminophen: ["paracetamol"],
  aspirin: ["aspirin", "acetylsalicylic acid"],
  "acetylsalicylic acid": ["aspirin"],
  salbutamol: ["albuterol"],
  adrenaline: ["epinephrine"],
};

// Build a quoted OR query across ingredient/generic/substance/brand fields so a
// common name matches regardless of which field FDA indexed it under.
function buildSearch(term: string): string {
  const base = term.toLowerCase();
  const terms = Array.from(new Set([base, ...(SYNONYMS[base] ?? [])]));
  // Encode spaces inside a quoted phrase as %20; keep +OR+ and field: literal.
  const enc = (s: string) => s.replace(/ /g, "%20");
  const clauses: string[] = [];
  for (const t of terms) {
    const T = enc(t.toUpperCase());
    const tl = enc(t);
    clauses.push(`products.active_ingredients.name:"${T}"`);
    clauses.push(`openfda.generic_name:"${T}"`);
    clauses.push(`openfda.substance_name:"${T}"`);
    clauses.push(`openfda.brand_name:"${tl}"`);
  }
  return `(${clauses.join("+OR+")})`;
}

export async function lookupFda(
  name: string,
  signal?: AbortSignal,
): Promise<FdaLookup> {
  const term = name.trim();
  const empty: FdaLookup = {
    query: term,
    products: [],
    originators: [],
    genericSponsors: [],
    isBiologic: false,
    total: 0,
  };
  if (!term) return empty;

  const cacheKey = `fda:${term.toLowerCase()}`;
  const hit = cacheGet<FdaLookup>(cacheKey);
  if (hit) return hit;

  // OR across ingredient/generic/substance/brand fields (+ synonyms).
  const search = buildSearch(term);
  const url = `${ENDPOINT}?search=${search}&limit=50`;

  let json: { results?: unknown[]; meta?: { results?: { total?: number } } };
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return empty; // 404 = no match, treat as empty
    json = (await res.json()) as typeof json;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return empty;
  }

  const results = Array.isArray(json.results) ? json.results : [];
  const products: FdaProduct[] = [];

  for (const r of results) {
    const rec = r as Record<string, unknown>;
    const sponsor = typeof rec.sponsor_name === "string" ? rec.sponsor_name : "";
    const appNum = typeof rec.application_number === "string" ? rec.application_number : "";
    const prods = Array.isArray(rec.products) ? rec.products : [];

    for (const p of prods as Record<string, unknown>[]) {
      const ings = Array.isArray(p.active_ingredients) ? p.active_ingredients : [];
      const strength = (ings as Record<string, unknown>[])
        .map((a) => (typeof a.strength === "string" ? a.strength : ""))
        .filter(Boolean)
        .join(" / ");
      const ms = typeof p.marketing_status === "string" ? p.marketing_status : "";
      products.push({
        brandName: typeof p.brand_name === "string" ? p.brand_name : "",
        sponsor,
        applicationNumber: appNum,
        appType: appType(appNum),
        dosageForm: typeof p.dosage_form === "string" ? p.dosage_form : "",
        route: typeof p.route === "string" ? p.route : "",
        marketingStatus: MARKETING[ms] ?? (ms || "Unknown"),
        strength,
      });
    }
  }

  const originators = Array.from(
    new Set(
      products
        .filter((p) => p.appType === "NDA" || p.appType === "BLA")
        .map((p) => p.sponsor)
        .filter(Boolean),
    ),
  );
  const genericSponsors = Array.from(
    new Set(products.filter((p) => p.appType === "ANDA").map((p) => p.sponsor).filter(Boolean)),
  );

  const lookup: FdaLookup = {
    query: term,
    // Surface branded/originator products first, then generics; cap for UI.
    products: products
      .sort((a, b) => Number(b.appType !== "ANDA") - Number(a.appType !== "ANDA"))
      .slice(0, 20),
    originators,
    genericSponsors,
    isBiologic: products.some((p) => p.appType === "BLA"),
    total: json.meta?.results?.total ?? products.length,
  };
  cacheSet(cacheKey, lookup, DAY);
  return lookup;
}
