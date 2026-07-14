// Finds the ACTUAL, published synthesis chemistry for a molecule by searching the
// web, not by inferring reactions from the structure. It is the online source
// used in the feasibility flow after a curated route and the structured PubChem /
// Wikipedia lookup, and before we give up.
//
// Two grounding paths, in order:
//   1. SearXNG web search (FREE, no credit): fetch real results from the verified
//      references below via the /api/search proxy, then have a FREE model extract
//      the documented route strictly from those results. Grounding: "web".
//   2. OpenRouter web plugin / model knowledge (needs credit for true web; falls
//      back to a free model answering from its own knowledge). Grounding: "ai".
//
// Preferred references (the ones the business asked us to use):
//   - LibreTexts Chemistry (chem.libretexts.org)
//   - Organic Chemistry Portal (organic-chemistry.org)
//   - PubChem, Wikipedia, patents, peer-reviewed papers, producer literature
//
// The result is shaped like a SynthesisRoute so the report can treat every route
// source identically. It never guesses from structure.

import type { AiConfig } from "./aiConfig";
import { hasApiKey, WEB_MODEL } from "./aiConfig";
import { chatComplete, type ChatMsg } from "./openrouter";
import { requiredCapabilities, capabilityLabel } from "./chemLexicon";
import type { SynthesisRoute } from "./synthesisRoute";
import { cacheGet, cacheSet, DAY } from "./aiCache";
import { hasWebSearch, searchWeb, type SearchResult } from "./search";

type RawRoute = {
  found?: boolean;
  reactions?: string[];
  steps?: string[];
  source?: { name?: string; url?: string };
};

const SCHEMA = `{
  "found": boolean,            // true ONLY if a documented synthesis is present in the material provided
  "reactions": string[],      // the SPECIFIC named reactions the documented route uses,
                              // in order, e.g. "Methanol carbonylation", "Friedel-Crafts acylation",
                              // "Catalytic hydrogenation". Use recognised reaction names.
  "steps": string[],          // 1 to 3 short factual sentences describing the actual route
  "source": { "name": string, "url": string }  // the single best reference you relied on (a real URL)
}`;

// Asks the web-grounded model for the documented route, then normalises it into a
// SynthesisRoute. Returns null when nothing is configured, nothing is found, or
// the answer is unusable, so the caller can fall back to pointing the user at the
// verified references. Never guesses from structure.
export async function researchSynthesisRoute(
  cfg: AiConfig,
  name: string,
  iupac: string | null,
  signal?: AbortSignal,
): Promise<SynthesisRoute | null> {
  if (!hasApiKey(cfg)) return null;

  const key = `webroute:${name.toLowerCase()}`;
  const hit = cacheGet<SynthesisRoute>(key);
  if (hit) return hit;

  // Path 1: SearXNG web search + free-model extraction (no credit needed).
  let route: SynthesisRoute | null = null;
  if (hasWebSearch()) {
    route = await fromSearxng(cfg, name, iupac, signal);
  }
  // Path 2: OpenRouter web plugin (billed) or free-model knowledge fallback.
  if (!route) {
    route = await fromModel(cfg, name, iupac, signal);
  }

  if (route) cacheSet(key, route, DAY);
  return route;
}

// --- Path 1: SearXNG-grounded ---------------------------------------------
async function fromSearxng(
  cfg: AiConfig,
  name: string,
  iupac: string | null,
  signal?: AbortSignal,
): Promise<SynthesisRoute | null> {
  const queries = [
    `${name} synthesis route`,
    `${name} manufacturing process reaction`,
    `${name} preparation organic-chemistry.org OR libretexts`,
  ];
  // Fire the queries in parallel so the whole search phase costs one round-trip,
  // not three, leaving the time budget for the model extraction.
  const batches = await Promise.all(queries.map((q) => searchWeb(q, signal)));
  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const batch of batches) {
    for (const r of batch) {
      if (r.url && !seen.has(r.url) && results.length < 8) {
        seen.add(r.url);
        results.push(r);
      }
    }
  }
  if (results.length === 0) return null;

  const context = results
    .slice(0, 8)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`)
    .join("\n\n");

  const system = [
    "You are a process-chemistry researcher. Using ONLY the web-search results provided, report how the compound is ACTUALLY manufactured or synthesised.",
    "Prefer results from LibreTexts (chem.libretexts.org), the Organic Chemistry Portal (organic-chemistry.org), PubChem, Wikipedia, patents and papers.",
    "Do NOT infer or guess a route from the molecule's structure or functional groups. If the results do not document a synthesis, set found=false.",
    "Name the SPECIFIC reactions used (e.g. 'Methanol carbonylation', 'Friedel-Crafts acylation', 'Catalytic hydrogenation', 'Diazotization').",
    "Cite the single most relevant result's real URL in 'source'. Never invent a URL.",
    "Return ONLY a single JSON object, no prose, no markdown, matching exactly this schema:",
    SCHEMA,
  ].join("\n");

  const ask = iupac ? `${name} (IUPAC: ${iupac})` : name;
  const messages: ChatMsg[] = [
    { role: "system", content: system },
    { role: "user", content: `Compound: ${ask}\n\nWeb-search results:\n${context}` },
  ];

  // A free model is fine here: it only has to extract, not browse, so no credit
  // is needed. cfg keeps the user's/default model and its free-tier fallback.
  let raw: string;
  try {
    raw = await chatComplete(cfg, messages, signal);
  } catch (e) {
    if (signal?.aborted) throw e;
    return null;
  }
  return normalise(raw, name, "web");
}

// --- Path 2: OpenRouter web plugin / model knowledge ----------------------
async function fromModel(
  cfg: AiConfig,
  name: string,
  iupac: string | null,
  signal?: AbortSignal,
): Promise<SynthesisRoute | null> {
  const system = [
    "You are a process-chemistry researcher. Find how a compound is ACTUALLY manufactured or synthesised, from the published literature only.",
    "Consult these verified references first and prefer them: LibreTexts Chemistry (chem.libretexts.org), the Organic Chemistry Portal (organic-chemistry.org), PubChem, Wikipedia's Production/Synthesis section, peer-reviewed papers, patents, and producer technical literature.",
    "Report only the route the sources document. Do NOT infer or guess a route from the molecule's structure or functional groups. If you cannot find a documented synthesis, set found=false and leave the arrays empty.",
    "Name the SPECIFIC reactions used (e.g. 'Methanol carbonylation', 'Friedel-Crafts acylation', 'Catalytic hydrogenation', 'Diazotization'), not vague categories.",
    "Always give a real, openable source URL you actually relied on. Never invent a citation.",
    "Return ONLY a single JSON object, no prose, no markdown, matching exactly this schema:",
    SCHEMA,
  ].join("\n");

  const ask = iupac ? `${name} (IUPAC: ${iupac})` : name;
  const messages: ChatMsg[] = [
    { role: "system", content: system },
    { role: "user", content: `Find the documented industrial or laboratory synthesis of: ${ask}` },
  ];

  // Request a web-capable model so the web-search plugin can attach (never on a
  // free model). With no credit this falls back down the free chain, answering
  // from model knowledge without web; labelled "ai" either way.
  const webCfg: AiConfig = { ...cfg, model: WEB_MODEL };
  let raw: string;
  try {
    raw = await chatComplete(webCfg, messages, signal, { web: true });
  } catch (e) {
    if (signal?.aborted) throw e;
    return null;
  }
  return normalise(raw, name, "ai");
}

function normalise(raw: string, name: string, grounding: "web" | "ai"): SynthesisRoute | null {
  let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);

  let obj: RawRoute;
  try {
    obj = JSON.parse(text) as RawRoute;
  } catch {
    return null;
  }

  if (obj.found === false) return null;

  const reactions = (Array.isArray(obj.reactions) ? obj.reactions : [])
    .map((r) => String(r).replace(/\s+/g, " ").trim())
    .filter((r) => r.length > 1)
    .slice(0, 8);
  if (reactions.length === 0) return null;

  const steps = (Array.isArray(obj.steps) ? obj.steps : [])
    .map((s) => String(s).replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 20)
    .slice(0, 3);

  // Map the named reactions onto the vendor-matchable capability labels via the
  // shared lexicon, so a web-found route drives the manufacturer match exactly
  // like a structured one.
  const categories = requiredCapabilities(reactions).map(capabilityLabel);

  const url = obj.source?.url && /^https?:\/\//i.test(obj.source.url) ? obj.source.url : "";
  const source = url
    ? { name: obj.source?.name?.trim() || "Web research", url }
    : { name: `Web search: ${name}`, url: `https://www.google.com/search?q=${encodeURIComponent(`${name} synthesis route`)}` };

  return { reactions, categories, steps, source, confirmedByName: false, grounding };
}
