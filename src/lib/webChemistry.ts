// Finds the ACTUAL, published synthesis chemistry for a molecule by searching the
// web, not by inferring reactions from the structure. It is used as the second
// online source in the feasibility flow, after the structured PubChem "Methods of
// Manufacturing" / Wikipedia lookup and before we give up. It runs only when an
// OpenRouter key is configured (the web-search plugin is billed), and it is told,
// explicitly, to read the verified references below and to report only the route
// the literature actually documents.
//
// Preferred references (the ones the business asked us to use):
//   - LibreTexts Chemistry (chem.libretexts.org)
//   - Organic Chemistry Portal (organic-chemistry.org)
//   - PubChem, Wikipedia, patents, peer-reviewed papers, producer literature
//
// The result is shaped like a SynthesisRoute so the report can treat a web-found
// route and a structured route identically.

import type { AiConfig } from "./aiConfig";
import { hasApiKey, WEB_MODEL } from "./aiConfig";
import { chatComplete, type ChatMsg } from "./openrouter";
import { requiredCapabilities, capabilityLabel } from "./chemLexicon";
import type { SynthesisRoute } from "./synthesisRoute";
import { cacheGet, cacheSet, DAY } from "./aiCache";

type RawRoute = {
  found?: boolean;
  reactions?: string[];
  steps?: string[];
  source?: { name?: string; url?: string };
};

const SCHEMA = `{
  "found": boolean,            // true ONLY if a documented synthesis was located in the sources
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

  // Request a web-capable model so the web-search plugin can attach (it is never
  // added to a free model). If the account has no credit this cleanly falls back
  // down the free chain in chatComplete, answering from model knowledge without
  // web; either way the result is labelled "ai" so the UI shows it as needing
  // verification against its cited source.
  const webCfg: AiConfig = { ...cfg, model: WEB_MODEL };
  let raw: string;
  try {
    raw = await chatComplete(webCfg, messages, signal, { web: true });
  } catch (e) {
    if (signal?.aborted) throw e;
    return null;
  }

  const route = normalise(raw, name);
  if (route) cacheSet(key, route, DAY);
  return route;
}

function normalise(raw: string, name: string): SynthesisRoute | null {
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

  return { reactions, categories, steps, source, confirmedByName: false, grounding: "ai" };
}
