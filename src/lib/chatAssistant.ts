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
import { resolveIdentity, fetchCompoundDescription, type ChemIdentity } from "@/lib/casResolve";
import { matchVendors, findProduct, type CdmoMatch } from "@/lib/cdmoMatch";
import { deriveChemistry } from "@/lib/reactionClasses";
import { verifiedFor, type VerifiedLink } from "@/data/verified";
import { slug } from "@/lib/utils";
import {
  ARCHETYPES,
  buildPathway,
  productPathway,
  type Archetype,
  type Pathway,
  type Urgency,
} from "@/data/cdmoPathway";
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

const QUESTION_WORDS = /^(what|how|why|when|where|who|which|can|do|does|is|are|should|could|would|tell|explain|help)\b/i;

// Heuristic: a short, mostly-chemical string with no question framing is very
// likely a product name the user wants assessed, even if it is not in our data.
export function looksLikeProductQuery(text: string): boolean {
  const t = text.trim();
  if (!t || t.length > 48) return false;
  if (t.includes("?") || QUESTION_WORDS.test(t)) return false;
  const words = t.split(/\s+/);
  if (words.length > 5) return false;
  return /^[A-Za-z0-9][A-Za-z0-9\s,'()\-+/.]*$/.test(t);
}

// Words that name no specific product, so a phrase that reduces to only these
// is a generic request ("I want a product made") and should prompt for the name.
const GENERIC_TERMS = new Set([
  "product", "chemical", "molecule", "compound", "material", "api", "intermediate",
  "something", "it", "this", "that", "one", "stuff", "item",
]);

// Leading phrases stripped, iteratively, to pull the product out of natural
// requests like "I want to make Sucrose Stearate" or "can you produce aspirin".
const LEAD_PATTERNS: RegExp[] = [
  /^(hi|hello|hey|yo)\b[,\s]*/i,
  /^i\s*('?m|am|'d|would)?\s*(want|need|wanna|wish|like|looking|trying|hoping)\b/i,
  /^(can|could|would|will|do)\s+you\b/i,
  /^(please|kindly|just)\b/i,
  /^(help|assist)\s+(me|us)\b/i,
  /^(we|our team|my company|our company)\b/i,
  /^(to|for|of)\b/i,
  /^(get|make|manufacture|produce|synthesi[sz]e|source|develop|create|build|supply|order|find|buy)\b/i,
  /^(me|us)\b/i,
  /^(a|an|some|the|any)\b/i,
  /^(product|chemical|molecule|compound|api|material)\s+(called|named|like|:)\b/i,
];

// Extracts the product/molecule the user named from a natural sentence. Returns
// null when the message names nothing specific (only generic words remain).
export function extractProductPhrase(text: string): string | null {
  let s = text.trim().replace(/[?.!]+$/, "").trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const re of LEAD_PATTERNS) {
      const next = s.replace(re, "").trim();
      if (next !== s) {
        s = next;
        changed = true;
      }
    }
  }
  // Drop trailing filler and action words.
  s = s
    .replace(/\b(for me|for us|please|thanks|thank you|at scale|in bulk|to spec|manufactured|made|produced|synthesi[sz]ed|developed)\b[\s.]*$/gi, "")
    .replace(/[?.!,]+$/, "")
    .trim();
  if (!s || s.length > 60) return null;
  const words = s.split(/\s+/);
  if (words.every((w) => GENERIC_TERMS.has(w.toLowerCase()))) return null;
  return s;
}

export type Understanding = { intent: Intent; product?: string; situation?: string };

// Dynamic understanding of any prompt. With a key, one small LLM call classifies
// intent and pulls out a product or a situation from free-form text; without a
// key it falls back to keywords plus the product heuristic. Always safe.
export async function understand(
  text: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<Understanding> {
  const keyword = detectIntent(text);

  if (hasApiKey(cfg)) {
    try {
      const messages: ChatMsg[] = [
        {
          role: "system",
          content:
            'You route messages for a chemical sourcing and CDMO company. Reply with ONLY a JSON object, no prose. Shape: {"intent":"feasibility|pathway|discovery|contact|unknown","product":"<chemical name or CAS if the user named one, else empty>","situation":"<one-line paraphrase if they describe a CDMO problem, else empty>"}. Use "feasibility" when they name or ask to make/source a specific chemical or product. Use "pathway" when they describe a development or supply situation. Use "contact" when they want to reach a human. Use "discovery" to browse products. Never use an em dash.',
        },
        { role: "user", content: text },
      ];
      const raw = await chatComplete(cfg, messages, signal);
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]) as Understanding;
        const intent: Intent = ["feasibility", "pathway", "discovery", "contact", "unknown"].includes(
          parsed.intent,
        )
          ? parsed.intent
          : keyword;
        return {
          intent,
          product: parsed.product?.trim() || extractProductPhrase(text) || undefined,
          situation: parsed.situation?.trim() || undefined,
        };
      }
    } catch {
      // fall through to the deterministic path
    }
  }

  // No key: pull the product out of the phrasing ourselves.
  if (keyword === "feasibility") {
    return { intent: "feasibility", product: extractProductPhrase(text) || undefined };
  }
  if (keyword === "unknown" && looksLikeProductQuery(text)) {
    return { intent: "feasibility", product: extractProductPhrase(text) || text.trim() };
  }
  return { intent: keyword };
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
  /** broad reaction classes present (esterification, nitration, ozonolysis, ...) */
  reactionClasses?: string[];
  /** where the route came from: verified catalog, AI summary, or group-derived */
  source: "catalog" | "ai" | "derived";
};

export type Feasibility = {
  query: string;
  identity: ChemIdentity | null;
  description: string | null;
  chemistry: CoreChemistry | null;
  match: CdmoMatch;
  /** cited sources for the identity and chemistry (PubChem + verified refs) */
  sources: VerifiedLink[];
  /** optional LLM-written précis, added when a key is configured */
  aiSummary?: string;
};

// Races a promise against a timeout so PubChem never stalls the report. Returns
// the fallback on timeout and aborts the in-flight request.
function withTimeout<T>(
  make: (signal: AbortSignal) => Promise<T>,
  ms: number,
  fallback: T,
  parent?: AbortSignal,
): Promise<T> {
  const ctrl = new AbortController();
  if (parent) parent.addEventListener("abort", () => ctrl.abort(), { once: true });
  return Promise.race([
    make(ctrl.signal).catch(() => fallback),
    new Promise<T>((resolve) =>
      setTimeout(() => {
        ctrl.abort();
        resolve(fallback);
      }, ms),
    ),
  ]);
}

// Concise, honest core chemistry from the verified catalog when we cover the
// molecule. Prefers the web-verified route + named process (with citations),
// falling back to the catalog product's route. Starting materials are read from
// the route's feedstock cost drivers.
function catalogChemistry(name: string): CoreChemistry | null {
  const p = findProduct(name);
  const v = p ? verifiedFor(slug(p.name)) : verifiedFor(slug(name));

  if (v && v.routes.length) {
    return {
      headline: v.mainProcess.name,
      route: v.routes.slice(0, 5),
      startingMaterials: [],
      plantType: p?.plantType ?? "Batch",
      hazardNote: "Confirm hazard and containment class at the feasibility stage.",
      source: "catalog",
    };
  }

  if (!p || !p.route.length) return null;
  const starting = p.costDrivers
    .filter((c) => /feedstock|raw|material|methanol|benzene|ethylene|acid|chlor|ammonia/i.test(c.label))
    .map((c) => c.label)
    .slice(0, 4);
  return {
    headline: p.route[0],
    route: p.route.slice(0, 4),
    startingMaterials: starting,
    plantType: p.plantType,
    hazardNote:
      p.plantType === "Continuous"
        ? "Continuous processing; standard chemical handling and containment apply."
        : "Multipurpose batch chemistry; confirm hazard and containment class at feasibility.",
    source: "catalog",
  };
}

// Cited sources for the report: PubChem for identity, plus the web-verified
// references for the chemistry when the molecule is in our catalog.
function collectSources(identity: ChemIdentity | null, productName: string): VerifiedLink[] {
  const out: VerifiedLink[] = [];
  if (identity?.cid) {
    out.push({ name: "PubChem (identity, CAS)", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}` });
  }
  const v = verifiedFor(slug(productName));
  if (v) for (const s of v.sources) out.push(s);
  // Dedupe by url.
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

// When the catalog does not cover a molecule and a key is present, ask the LLM
// for the major industrial route as a short factual list. Parsed defensively.
async function aiChemistry(
  identity: ChemIdentity | null,
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<CoreChemistry | null> {
  if (!hasApiKey(cfg)) return null;
  const name = identity?.name || query;
  const facts = [
    `Compound: ${name}`,
    identity?.primaryCas ? `CAS: ${identity.primaryCas}` : "",
    identity?.formula ? `Formula: ${identity.formula}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  try {
    const messages: ChatMsg[] = [
      {
        role: "system",
        content:
          'Return ONLY JSON, no prose. For the given compound, give the major industrial synthesis route. Shape: {"headline":"<one-line name of the dominant route>","route":["step 1","step 2","step 3"],"startingMaterials":["m1","m2"],"hazardNote":"<one short handling note>"}. Keep 3 to 5 short factual steps. If you are not confident, use an empty route array. Never use an em dash.',
      },
      { role: "user", content: facts },
    ];
    const raw = await chatComplete(cfg, messages, signal);
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const parsed = JSON.parse(m[0]) as Partial<CoreChemistry>;
    if (!parsed.route || parsed.route.length === 0) return null;
    return {
      headline: parsed.headline || parsed.route[0],
      route: parsed.route.slice(0, 5),
      startingMaterials: (parsed.startingMaterials ?? []).slice(0, 4),
      plantType: "Batch",
      hazardNote: parsed.hazardNote || "Confirm hazard and containment class at feasibility.",
      source: "ai",
    };
  } catch {
    return null;
  }
}

// Runs the whole Path B lookup for any product, in or out of our catalog:
// resolve identity + CAS from PubChem, pull a short description, establish the
// core chemistry, and match APAC vendors by capability. Every step is
// best-effort and time-boxed, so the report always renders fast.
export async function runFeasibility(
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<Feasibility> {
  const identity = await withTimeout(
    (s) => resolveIdentity(query, s),
    5000,
    null as ChemIdentity | null,
    signal,
  );

  const description = identity?.cid
    ? await withTimeout((s) => fetchCompoundDescription(identity.cid, s), 4000, null as string | null, signal)
    : null;

  const displayName = identity?.name || undefined;
  const match = matchVendors(query, displayName);

  let chemistry = catalogChemistry(match.productName) || catalogChemistry(query);
  if (!chemistry) chemistry = await aiChemistry(identity, query, cfg, signal);
  // Always land on real chemistry: derive the broad reaction classes from the
  // molecule's functional groups when the catalog and LLM did not supply a route.
  if (!chemistry) chemistry = deriveChemistry(identity, match.productName || query);

  const sources = collectSources(identity, match.productName);

  const result: Feasibility = { query, identity, description, chemistry, match, sources };

  // Optional natural-language précis, only when a key exists and only as polish.
  if (hasApiKey(cfg)) {
    try {
      const facts = [
        `Product: ${match.productName}`,
        identity?.primaryCas ? `CAS: ${identity.primaryCas}` : "",
        identity?.formula ? `Formula: ${identity.formula}` : "",
        chemistry ? `Primary route: ${chemistry.headline}` : "",
        `APAC group: ${match.group} / ${match.category}`,
        `Capable vendors in network: ${match.vendorCount}`,
      ]
        .filter(Boolean)
        .join("\n");
      const messages: ChatMsg[] = [
        {
          role: "system",
          content:
            "You are APAC's CDMO sourcing assistant. In 2 or 3 concise sentences, tell a B2B customer how APAC can help them manufacture this product. Be specific and factual, no marketing fluff, no invented numbers, and do not name any vendor. Never use an em dash.",
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

export function pathwayFor(archetype: Archetype, urgency: Urgency = "balanced"): Pathway {
  return buildPathway(archetype.id, { urgency })!;
}

// Milestone projection for making a specific assessed product, tuned by urgency.
export function milestonesForProduct(match: CdmoMatch, urgency: Urgency): Pathway {
  return productPathway(match.isPharma, urgency);
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
