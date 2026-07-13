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
import { matchVendors, type CdmoMatch } from "@/lib/cdmoMatch";
import { chemicalClasses, complexityScore } from "@/lib/chemClasses";
import { fetchIpLandscape, type IpLandscape } from "@/lib/patents";
import { fetchProperties, type ChemProperties } from "@/lib/properties";
import { fetchHazards, type HazardInfo } from "@/lib/hazards";
import { fetchSynthesisRoute, type SynthesisRoute } from "@/lib/synthesisRoute";
import { verifiedFor, type VerifiedLink } from "@/data/verified";
import { slug } from "@/lib/utils";
import {
  ARCHETYPES,
  buildPathway,
  productPathway,
  type Archetype,
  type Pathway,
  type ProductTimelineInputs,
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

export type Feasibility = {
  query: string;
  identity: ChemIdentity | null;
  description: string | null;
  /** broad chemical classes read from the PubChem structure */
  classes: string[];
  /** broad process chemistries needed to make it (Halogenation, Nitration, ...) */
  chemistries: string[];
  /** the verified, molecule-specific synthesis route from online sources, when found */
  route: SynthesisRoute | null;
  /** chemical + physical properties from PubChem */
  properties: ChemProperties | null;
  /** GHS hazard classification from PubChem */
  hazards: HazardInfo | null;
  /** patent + literature landscape from PubChem cross-references */
  ip: IpLandscape | null;
  /** 0..1 molecular complexity from PubChem descriptors; drives the timeline */
  complexity: number;
  match: CdmoMatch;
  /** cited sources (PubChem identity, patents, literature, verified refs) */
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

// Cited sources for the report, drawn from several public chemical databases so
// the identity can be cross-checked: PubChem, ChemSpider, and the resolver that
// matched (NCI CACTUS or OPSIN), plus the web-verified references when the
// molecule is in our catalog.
function collectSources(identity: ChemIdentity | null, productName: string): VerifiedLink[] {
  const out: VerifiedLink[] = [];
  if (identity?.cid) {
    out.push({ name: "PubChem (identity, CAS)", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}` });
  }
  const name = identity?.name || productName;
  if (name) {
    out.push({ name: "ChemSpider (RSC)", url: `https://www.chemspider.com/Search.aspx?q=${encodeURIComponent(name)}` });
    if (identity?.source?.includes("cactus")) {
      out.push({ name: "NCI CACTUS resolver", url: `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(identity.query)}/names` });
    }
  }
  const v = verifiedFor(slug(productName));
  if (v) for (const s of v.sources) out.push(s);
  // Dedupe by url.
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

// Runs the whole Path B lookup for any product, in or out of our catalog:
// resolve identity + CAS from PubChem, pull a short description, read the broad
// chemical classes from the structure, fetch the patent + literature landscape
// from PubChem cross-references, score molecular complexity (which drives the
// timeline), and match APAC vendors by capability. Every network step is
// best-effort and time-boxed, so the report always renders fast, and every
// figure it shows comes from a source the user can open and verify.
export async function runFeasibility(
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<Feasibility> {
  const identity = await withTimeout(
    (s) => resolveIdentity(query, s),
    9000, // allows the PubChem -> CACTUS -> OPSIN fallback chain to complete
    null as ChemIdentity | null,
    signal,
  );

  const description = identity?.cid
    ? await withTimeout((s) => fetchCompoundDescription(identity.cid, s), 4000, null as string | null, signal)
    : null;

  const displayName = identity?.name || undefined;
  const nameForChem = displayName || query;

  // Broad compound classes and a complexity score, read from the PubChem
  // structure. The complexity score drives the timeline.
  const classes = chemicalClasses(identity, nameForChem);
  const complexity = complexityScore(identity, nameForChem);

  // Fetched in parallel so the card fills fast. The synthesis route is looked up
  // ONLINE (a web-grounded LLM lookup, grounded further by PubChem Methods of
  // Manufacturing + Wikipedia), never guessed from the structure, so it gets a
  // longer budget than the other, purely-PubChem lookups. Each is time-boxed and
  // best-effort, so a slow or missing one never blocks the rest.
  const cid = identity?.cid || 0;
  const [route, ip, properties, hazards] = await Promise.all([
    identity
      ? withTimeout((s) => fetchSynthesisRoute(identity, cfg, s), 20000, null as SynthesisRoute | null, signal)
      : Promise.resolve(null as SynthesisRoute | null),
    cid ? withTimeout((s) => fetchIpLandscape(cid, displayName || query, s), 7000, null as IpLandscape | null, signal) : Promise.resolve(null as IpLandscape | null),
    cid ? withTimeout((s) => fetchProperties(cid, s), 7000, null as ChemProperties | null, signal) : Promise.resolve(null as ChemProperties | null),
    cid ? withTimeout((s) => fetchHazards(cid, s), 7000, null as HazardInfo | null, signal) : Promise.resolve(null as HazardInfo | null),
  ]);

  // The chemistry shown, and the chemistry the manufacturer match runs on, come
  // ONLY from the documented online route. We do not fall back to a
  // structure-derived guess: if no route was verified online, the report says so
  // honestly and the match is left empty rather than matched on a guess.
  const chemistries = route?.categories ?? [];
  const requirements = route ? [...route.reactions, ...route.categories] : [];
  const match = matchVendors(query, displayName, requirements);

  const sources = collectSources(identity, match.productName);
  if (ip) {
    // Every database the patent/literature counts were cross-checked against,
    // plus the patent-office search UIs, each linked so the figure is verifiable.
    for (const s of [...ip.patents, ...ip.literature]) {
      if (s.count !== null && !sources.some((x) => x.url === s.url)) sources.push({ name: s.source, url: s.url });
    }
    for (const l of ip.links) sources.push({ name: l.name, url: l.url });
  }
  if (hazards && hazards.status !== "unknown") {
    sources.push({ name: "PubChem safety and hazards (GHS)", url: hazards.sourceUrl });
  }
  if (route && !sources.some((s) => s.url === route.source.url)) {
    sources.push({ name: route.source.name, url: route.source.url });
  }

  const result: Feasibility = { query, identity, description, classes, chemistries, route, properties, hazards, ip, complexity, match, sources };

  // Optional natural-language précis, only when a key exists and only as polish.
  if (hasApiKey(cfg)) {
    try {
      const facts = [
        `Product: ${match.productName}`,
        identity?.primaryCas ? `CAS: ${identity.primaryCas}` : "",
        identity?.formula ? `Formula: ${identity.formula}` : "",
        classes.length ? `Chemical classes: ${classes.join(", ")}` : "",
        route?.reactions?.length ? `Verified synthesis route (${route.source.name}): ${route.reactions.join(", ")}` : "",
        chemistries.length ? `Process chemistries needed: ${chemistries.join(", ")}` : "",
        ip?.patentRange ? `Patents (cross-checked ${ip.patentSources} sources): ${ip.patentRange[0]} to ${ip.patentRange[1]}` : "",
        ip?.literatureRange ? `Literature refs: ${ip.literatureRange[0]} to ${ip.literatureRange[1]}` : "",
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

// The molecule-specific evidence that drives the timeline, captured from a
// feasibility result so a projection can be (re)built for any chosen urgency.
export type TimelineBasis = Omit<ProductTimelineInputs, "urgency">;

// Extracts the timeline basis from a feasibility result.
export function timelineBasis(f: Feasibility): TimelineBasis {
  return {
    isPharma: f.match.isPharma,
    complexity: f.complexity,
    chemistries: f.chemistries,
    hazardous: f.hazards?.status === "hazardous",
    hazardClasses: f.hazards?.classes ?? [],
    patentRange: f.ip?.patentRange ?? null,
    patentSources: f.ip?.patentSources ?? 0,
  };
}

// Milestone projection for a specific assessed product. The durations are an
// evidence-driven function of the molecule (complexity, the process chemistries
// needed, hazard classification, and the cross-verified patent landscape), so no
// two different molecules get the same static timeline.
export function milestonesForProduct(basis: TimelineBasis, urgency: Urgency): Pathway {
  return productPathway({ ...basis, urgency });
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
