// The brain of the CDMO assistant. It stays deterministic and dependency-light
// so the two customer journeys always complete, even with no API key or credit:
//
//   Path B (feasibility): resolve the molecule against PubChem, summarise the
//     core chemistry from the catalog when known, and match APAC vendors by count.
//   Path A (pathway): map the customer's situation to a CDMO archetype and build
//     a development pathway.
//
// When an OpenRouter key IS configured, the LLM only adds natural phrasing and
// free-text understanding on top; if it errors we fall back to the rule-based
// result. This is the "fast, no errors" contract.

import type { AiConfig } from "@/lib/aiConfig";
import { hasApiKey } from "@/lib/aiConfig";
import { chatComplete, type ChatMsg } from "@/lib/openrouter";
import { resolveMolecule, type PubchemResult } from "@/lib/pubchem";
import { matchVendors, findProduct, type CdmoMatch } from "@/lib/cdmoMatch";
import { ARCHETYPES, buildPathway, type Archetype, type Pathway } from "@/data/cdmoPathway";
import { products } from "@/data/products";

export type Intent = "feasibility" | "pathway" | "discovery" | "contact" | "unknown";

// Cheap keyword classifier used when no key is present, and as a safety net.
export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/\b(contact|call|email|phone|speak|talk|reach|quote|enquir|inquir)\b/.test(t)) return "contact";
  if (/\b(make|manufactur|produce|synthesi|cdmo|scale|tonne|kg|batch|api|custom)\b/.test(t))
    return "feasibility";
  if (/\b(supplier|supply|china|de-?risk|second source|patent|develop|pathway|plan|project|generic)\b/.test(t))
    return "pathway";
  if (/\b(price|pricing|cost|route|knowledge|discover|browse|search|product|find)\b/.test(t))
    return "discovery";
  return "unknown";
}

export type QuickReply = { label: string; value: string; intent?: Intent };

export const GREETING =
  "Hello. I am the APAC sourcing assistant. Tell me what you are working on and I will point you to the fastest path. What brings you here today?";

export const START_REPLIES: QuickReply[] = [
  { label: "I want a product made", value: "I want to get a product manufactured", intent: "feasibility" },
  { label: "Plan a CDMO project", value: "Help me plan a CDMO development project", intent: "pathway" },
  { label: "Explore products", value: "I want to explore products", intent: "discovery" },
  { label: "Talk to APAC", value: "I would like to contact APAC", intent: "contact" },
];

export const SITUATION_REPLIES: QuickReply[] = ARCHETYPES.map((a) => ({
  label: a.title,
  value: a.situation,
}));

// ---- Path B: feasibility -------------------------------------------------

export type CoreChemistry = {
  headline: string;
  route: string[];
  startingMaterials: string[];
  plantType: string;
  hazardNote: string;
};

export type Feasibility = {
  query: string;
  pubchem: PubchemResult | null;
  chemistry: CoreChemistry | null;
  match: CdmoMatch;
  /** optional LLM-written précis, added when a key is configured */
  aiSummary?: string;
};

// Derives concise, honest core chemistry from the catalog when the molecule is
// known. Starting materials are read from the first route step's feedstocks.
function coreChemistry(name: string): CoreChemistry | null {
  const p = findProduct(name);
  if (!p || !p.route.length) return null;
  const starting = p.costDrivers
    .filter((c) => /feedstock|raw|material|methanol|benzene|ethylene|acid|chlor|ammonia/i.test(c.label))
    .map((c) => c.label)
    .slice(0, 4);
  return {
    headline: p.route[0],
    route: p.route.slice(0, 4),
    startingMaterials: starting.length ? starting : p.producers.length ? [] : [],
    plantType: p.plantType,
    hazardNote:
      p.plantType === "Continuous"
        ? "Continuous processing; standard chemical handling and containment apply."
        : "Multipurpose batch chemistry; confirm hazard and containment class at feasibility.",
  };
}

// Runs the whole Path B lookup. PubChem is best-effort; the vendor match and
// chemistry never depend on it, so the report always renders.
export async function runFeasibility(
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<Feasibility> {
  // PubChem is best-effort and must never stall the report. Race the lookup
  // against a short timeout with its own abort so the card always renders fast.
  let pubchem: PubchemResult | null = null;
  const pubchemController = new AbortController();
  if (signal) signal.addEventListener("abort", () => pubchemController.abort(), { once: true });
  try {
    pubchem = await Promise.race([
      resolveMolecule(query, pubchemController.signal),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          pubchemController.abort();
          resolve(null);
        }, 4500),
      ),
    ]);
  } catch {
    pubchem = null; // outside PubChem or offline; keep going with catalog data
  }

  const displayName = pubchem?.name || undefined;
  const match = matchVendors(query, displayName);
  const chemistry = coreChemistry(match.productName) || coreChemistry(query);

  const result: Feasibility = { query, pubchem, chemistry, match };

  // Optional natural-language précis, only when a key exists and only as polish.
  if (hasApiKey(cfg)) {
    try {
      const facts = [
        `Product: ${match.productName}`,
        pubchem?.formula ? `Formula: ${pubchem.formula}` : "",
        pubchem?.mw ? `Molecular weight: ${pubchem.mw}` : "",
        chemistry ? `Primary route: ${chemistry.headline}` : "",
        `APAC group: ${match.group} / ${match.category}`,
      ]
        .filter(Boolean)
        .join("\n");
      const messages: ChatMsg[] = [
        {
          role: "system",
          content:
            "You are APAC's CDMO sourcing assistant. In 2 or 3 concise sentences, tell a B2B customer how APAC can help them manufacture this product. Be specific and factual, no marketing fluff, no invented numbers. Never use an em dash.",
        },
        { role: "user", content: facts },
      ];
      result.aiSummary = (await chatComplete(cfg, messages, signal)).trim();
    } catch {
      // LLM unavailable; the deterministic report already stands on its own.
    }
  }

  return result;
}

// ---- Path A: pathway -----------------------------------------------------

// Picks the closest archetype for a free-text situation. Uses the LLM as a
// classifier when available, else keyword scoring, always with a safe default.
export async function classifySituation(
  text: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<Archetype> {
  const byKeyword = scoreArchetype(text);

  if (hasApiKey(cfg)) {
    try {
      const list = ARCHETYPES.map((a) => `${a.id}: ${a.situation}`).join("\n");
      const messages: ChatMsg[] = [
        {
          role: "system",
          content:
            "You classify a customer's CDMO situation into exactly one archetype id. Reply with ONLY the id, nothing else.",
        },
        { role: "user", content: `Archetypes:\n${list}\n\nCustomer said: "${text}"\n\nBest archetype id:` },
      ];
      const reply = (await chatComplete(cfg, messages, signal)).trim().toLowerCase();
      const hit = ARCHETYPES.find((a) => reply.includes(a.id));
      if (hit) return hit;
    } catch {
      // fall through to keyword result
    }
  }
  return byKeyword;
}

function scoreArchetype(text: string): Archetype {
  const t = text.toLowerCase();
  const rules: { id: string; kw: RegExp }[] = [
    { id: "de-risk", kw: /china|de-?risk|diversif|single (region|source)|second source|board/ },
    { id: "generic-api", kw: /generic|expired|off-?patent|api\b/ },
    { id: "alt-process", kw: /patent|non-?infring|protected|freedom to operate|fto/ },
    { id: "scale-up", kw: /scale|lab process|kilo|pilot|already (have|make)/ },
    { id: "specialty", kw: /specialty|intermediate|custom|to spec/ },
  ];
  for (const r of rules) if (r.kw.test(t)) return ARCHETYPES.find((a) => a.id === r.id)!;
  return ARCHETYPES.find((a) => a.id === "specialty")!;
}

export function pathwayFor(archetype: Archetype): Pathway {
  return buildPathway(archetype.id)!;
}

// ---- Discovery -----------------------------------------------------------

// A few product suggestions for the discovery quick path.
export function sampleProducts(query: string, n = 5): string[] {
  const q = query.trim().toLowerCase();
  const pool = q
    ? products.filter((p) => p.name.toLowerCase().includes(q))
    : products;
  return pool.slice(0, n).map((p) => p.name);
}
