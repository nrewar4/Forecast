import type { AiConfig } from "./aiConfig";
import { WEB_MODEL } from "./aiConfig";
import { chatComplete, type ChatMsg } from "./openrouter";

export type AiPct = { label: string; percent: number };
export type AiRouteShare = { name: string; description: string; share: number };
export type AiProcessStep = { title: string; detail: string; conditions?: string };
export type AiCountryMethod = { country: string; share: number; method: string; note: string };
export type AiLink = { name: string; url: string };

// A researched product profile that mirrors the fields the catalog shows.
export type AiProfile = {
  name: string;
  hsCode?: string;
  cas?: string;
  plantType?: string;
  overview?: string;
  globalCapacity?: string;
  feedstock?: string[];
  verifiedRoutes?: string[];
  mainProcess?: { name: string; detail: string };
  primaryRoutes?: AiRouteShare[];
  process?: AiProcessStep[];
  costDrivers?: AiPct[];
  industries?: AiPct[];
  countryMethods?: AiCountryMethod[];
  qualitySpecs?: string[];
  hazards?: string;
  manufacturers?: AiLink[];
  priceRange?: string;
  priceIndicative?: string;
  sources?: AiLink[];
};

const SCHEMA = `{
  "name": string,
  "hsCode": string,                // HS tariff code if known, else ""
  "cas": string,                   // CAS number if applicable, else ""
  "plantType": "Batch" | "Continuous",
  "overview": string,              // 2-3 sentence summary
  "globalCapacity": string,        // e.g. "About 5 million tonnes per year"
  "feedstock": string[],           // key raw materials
  "verifiedRoutes": string[],      // major industrial manufacturing routes
  "mainProcess": { "name": string, "detail": string },  // the predominant process, explained in detail
  "primaryRoutes": [ { "name": string, "description": string, "share": number } ],  // shares ~sum to 100
  "process": [ { "title": string, "detail": string, "conditions": string } ],        // full step-by-step
  "countryMethods": [ { "country": string, "share": number, "method": string, "note": string } ], // shares ~sum to 100
  "costDrivers": [ { "label": string, "percent": number } ],   // ~sum to 100
  "industries": [ { "label": string, "percent": number } ],    // end-use demand split, ~sum to 100
  "qualitySpecs": string[],
  "hazards": string,
  "manufacturers": [ { "name": string, "url": string } ],      // major producers with official website URLs
  "priceRange": string,            // e.g. "USD 800 to 1,200 per tonne"
  "priceIndicative": string,       // e.g. "USD 1,000 per tonne"
  "sources": [ { "name": string, "url": string } ]             // verifiable references actually used
}`;

export async function researchProduct(
  cfg: AiConfig,
  query: string,
  signal?: AbortSignal,
): Promise<AiProfile> {
  const system = [
    "You are a chemical product research analyst for a B2B sourcing platform.",
    "Research the product named by the user using the web search results provided, and produce a complete, factual profile.",
    "For the chemistry and manufacturing route ('verifiedRoutes', 'mainProcess', 'process', 'primaryRoutes'), report only what published sources document. Do NOT infer the route from the molecule's structure or functional groups.",
    "Prioritise these verified chemistry references for the route: LibreTexts Chemistry (chem.libretexts.org), the Organic Chemistry Portal (organic-chemistry.org), PubChem 'Methods of Manufacturing', and Wikipedia's Production/Synthesis section.",
    "Prioritise trustworthy/verifiable sources overall: producer/manufacturer websites, ICIS / ChemAnalyst / market reports, government and regulatory bodies (EPA, ECHA, FAO), pharmacopoeias, peer-reviewed papers and patents, and Wikipedia for orientation.",
    "Always populate the 'sources' array with the real URLs you actually relied on. Prefer official manufacturer homepages for the 'manufacturers' URLs.",
    "Give realistic figures. Percentage arrays (primaryRoutes.share, countryMethods.share, costDrivers.percent, industries.percent) should each sum to roughly 100. If a value is uncertain, give your best estimate.",
    "If the user's text is a misspelling or a synonym/abbreviation, resolve it to the correct chemical and use that as 'name'.",
    "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly this TypeScript-like schema:",
    SCHEMA,
  ].join("\n");

  const messages: ChatMsg[] = [
    { role: "system", content: system },
    { role: "user", content: `Research this product and return the JSON profile: ${query}` },
  ];

  // Prefer web-grounded answers; if the web plugin errors or is unavailable,
  // fall back to a normal completion so the user still gets a profile. A
  // web-capable model is requested so the web-search plugin can attach (it is
  // never added to a free model); chatComplete falls back down the free chain
  // when the account has no credit.
  const webCfg: AiConfig = { ...cfg, model: WEB_MODEL };
  let raw: string;
  try {
    raw = await chatComplete(webCfg, messages, signal, { web: true });
  } catch (e) {
    if (signal?.aborted) throw e;
    raw = await chatComplete(cfg, messages, signal);
  }

  return parseProfile(raw, query);
}

function parseProfile(raw: string, fallbackName: string): AiProfile {
  let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  let obj: AiProfile;
  try {
    obj = JSON.parse(text) as AiProfile;
  } catch {
    throw new Error("The model did not return a readable profile. Try rephrasing the product name.");
  }
  if (!obj.name) obj.name = fallbackName;
  // Defensive: keep arrays as arrays.
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  obj.feedstock = arr(obj.feedstock);
  obj.verifiedRoutes = arr(obj.verifiedRoutes);
  obj.primaryRoutes = arr(obj.primaryRoutes);
  obj.process = arr(obj.process);
  obj.countryMethods = arr(obj.countryMethods);
  obj.costDrivers = arr(obj.costDrivers);
  obj.industries = arr(obj.industries);
  obj.qualitySpecs = arr(obj.qualitySpecs);
  obj.manufacturers = arr(obj.manufacturers);
  obj.sources = arr(obj.sources);
  return obj;
}
