// The assistant's brain. Everything a visitor needs is produced deterministically
// from official and local data (PubChem identity, the product catalog, the vendor
// matcher, the APAC stage library), so the two flows always complete, even with
// no API key. The LLM only adds natural phrasing and a grounded chemistry note
// when a key exists, and it is prompted strictly to avoid inventing anything.

import { chatComplete, streamChat, type ChatMsg } from "@/lib/openrouter";
import { loadAiConfig, hasApiKey, type AiConfig } from "@/lib/aiConfig";
import { resolveMolecule } from "@/lib/pubchem";
import { findCatalogProduct, matchVendors, type VendorMatch } from "@/lib/cdmoMatch";
import { research } from "@/data/research";
import { slug } from "@/lib/utils";
import {
  matchArchetype,
  type Archetype,
  type EndPoint,
  type Pathway,
  type PathwayRefinements,
  type SpeedPref,
  type StartPoint,
} from "@/data/cdmoPathway";

const researchBySlug = new Map(research.map((r) => [slug(r.name), r]));

export type QuickReply = { label: string; path: "A" | "B"; seed?: string };

export const GREETING =
  "Hi, I am the APAC assistant. Tell me what you are trying to do and I will map the path, or name a molecule and I will check if we can make it.";

export const QUICK_REPLIES: QuickReply[] = [
  { label: "Get a molecule made", path: "B", seed: "" },
  { label: "De-risk my supply", path: "A", seed: "Our supplier is concentrated in one country and we want it de-risked." },
  { label: "Reduce my cost", path: "A", seed: "This molecule costs too much to make and we need it cheaper." },
  { label: "We hold a patent, no plant", path: "A", seed: "We own the molecule but have no manufacturing of our own." },
];

const CAS_RE = /\b\d{2,7}-\d{2}-\d\b/;

// Decides which path a free-text message belongs to.
export function detectPath(text: string): "A" | "B" {
  const t = text.trim().toLowerCase();
  if (CAS_RE.test(t)) return "B";
  if (/[=#@]/.test(t) && !/\s/.test(t)) return "B"; // SMILES-ish
  if (/^(can you (make|produce|synthesi[sz]e)|do you make|make|produce|manufacture|synthesi[sz]e)\b/.test(t)) return "B";
  const situational = ["de-risk", "derisk", "supplier", "patent", "cost", "too expensive", "cheaper", "scale", "no plant", "second source", "dual source", "china", "tariff", "diversify"];
  if (situational.some((k) => t.includes(k))) return "A";
  // Short, single-token, chemical-looking input is treated as a molecule query.
  const words = t.replace(/[?.!]/g, "").split(/\s+/).filter(Boolean);
  if (words.length <= 3) return "B";
  return "A";
}

// Strips lead-in verbs so "can you make ibuprofen for us?" becomes "ibuprofen".
export function extractMolecule(text: string): string {
  return text
    .trim()
    .replace(/^(can you|could you|do you|would you|please)\s+/i, "")
    .replace(/^(make|produce|manufacture|synthesi[sz]e|source|supply|get)\s+/i, "")
    .replace(/\b(for us|for me|for our (company|plant)|please)\b/gi, "")
    .replace(/\bmade\b/gi, "")
    .replace(/[?.!]+$/, "")
    .trim();
}

export type ChemSource = "catalog" | "ai" | "pending";

export type Feasibility = {
  query: string;
  resolvedName: string;
  identity: { cid: number | null; formula: string | null; mw: string | null; smiles: string | null; iupac: string | null } | null;
  structureUrl: string | null;
  chemistry: {
    source: ChemSource;
    overview: string;
    routes: string[];
    startingMaterials: string[];
    hazards: string;
  };
  vendor: VendorMatch;
};

export function structureImageUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
}

// Builds the Path B feasibility answer for any molecule: PubChem identity,
// catalog chemistry when we hold it, AI-scoped chemistry otherwise (gated by the
// model's own confidence), and the deterministic vendor count.
export async function buildFeasibility(
  query: string,
  opts: { signal?: AbortSignal } = {},
): Promise<Feasibility> {
  const clean = query.trim();

  // 1. PubChem identity (official). Null on any failure, shown as an empty state.
  let identity: Feasibility["identity"] = null;
  try {
    const r = await resolveMolecule(clean, opts.signal);
    if (r.cid || r.formula) {
      identity = { cid: r.cid, formula: r.formula, mw: r.mw, smiles: r.smiles, iupac: r.name };
    }
  } catch {
    identity = null;
  }

  // 2. Catalog + research grounding.
  const catalogProduct = findCatalogProduct(clean);
  const resolvedName = catalogProduct?.name ?? clean;
  const researchItem = researchBySlug.get(slug(catalogProduct?.name ?? clean));

  let chemistry: Feasibility["chemistry"];
  if (researchItem) {
    chemistry = {
      source: "catalog",
      overview: researchItem.overview,
      routes: researchItem.primaryRoutes.map((r) => `${r.name}: ${r.description}`),
      startingMaterials: researchItem.feedstock,
      hazards: researchItem.hazards,
    };
  } else if (catalogProduct) {
    chemistry = {
      source: "catalog",
      overview: "",
      routes: catalogProduct.route,
      startingMaterials: [],
      hazards: "",
    };
  } else {
    // Not in the catalog: any drug or molecule is scoped with the AI, grounded on
    // the PubChem identity and gated by a confidence flag so nothing is invented.
    const cfg = loadAiConfig();
    if (hasApiKey(cfg) && identity) {
      chemistry = await aiChemistry(cfg, resolvedName, identity, opts.signal);
    } else {
      chemistry = { source: "pending", overview: "", routes: [], startingMaterials: [], hazards: "" };
    }
  }

  // 3. Deterministic vendor count.
  const vendor = matchVendors(clean, catalogProduct);

  return {
    query: clean,
    resolvedName,
    identity,
    structureUrl: identity?.cid ? structureImageUrl(identity.cid) : null,
    chemistry,
    vendor,
  };
}

// Structured chemistry for a molecule outside the catalog. The model must return
// JSON and declare its own confidence; anything not high-confidence, or any parse
// failure, falls back to the honest "to be scoped" state. The prompt forbids
// invented specifics, so the output stays at textbook level.
async function aiChemistry(
  cfg: AiConfig,
  name: string,
  identity: NonNullable<Feasibility["identity"]>,
  signal?: AbortSignal,
): Promise<Feasibility["chemistry"]> {
  const system = [
    "You are a senior CDMO process chemist writing a preliminary technical note for a buyer.",
    "Use only broadly established, textbook-level knowledge about this specific compound.",
    "Strict rules:",
    "- NEVER invent patent numbers, yields, prices, specific temperatures or process conditions, company names, or citations.",
    "- Route descriptions stay at the level of named reaction classes and well-known industrial approaches.",
    "- If you are not confident about this exact compound, set confident to false and leave the arrays empty.",
    'Return ONLY a JSON object (no prose, no code fences) matching exactly:',
    `{
  "confident": boolean,
  "overview": string,            // <= 60 words: what it is and how it is generally made
  "routes": string[],            // 1 to 3 short route descriptions, general class level
  "startingMaterials": string[], // typical commercial starting materials
  "hazards": string              // <= 30 words on key handling considerations, or ""
}`,
  ].join("\n");

  const messages: ChatMsg[] = [
    { role: "system", content: system },
    {
      role: "user",
      content: `Compound: ${name}. PubChem CID ${identity.cid ?? "n/a"}, formula ${identity.formula ?? "n/a"}, SMILES ${identity.smiles ?? "n/a"}. Write the JSON note.`,
    },
  ];

  try {
    const raw = await chatComplete(cfg, messages, signal);
    let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) text = text.slice(start, end + 1);
    const obj = JSON.parse(text) as {
      confident?: boolean;
      overview?: string;
      routes?: string[];
      startingMaterials?: string[];
      hazards?: string;
    };
    const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    if (obj.confident !== true || !obj.overview) {
      return { source: "pending", overview: "", routes: [], startingMaterials: [], hazards: "" };
    }
    return {
      source: "ai",
      overview: String(obj.overview).trim(),
      routes: arr(obj.routes).slice(0, 3),
      startingMaterials: arr(obj.startingMaterials).slice(0, 6),
      hazards: typeof obj.hazards === "string" ? obj.hazards.trim() : "",
    };
  } catch {
    return { source: "pending", overview: "", routes: [], startingMaterials: [], hazards: "" };
  }
}

// Path A: a situation maps to a CDMO archetype (deterministic keyword match).
export function classifySituation(text: string): Archetype {
  return matchArchetype(text);
}

// ---------------------------------------------------------------------------
// The refine script: the questions the assistant asks before drawing a pathway.
// Each answer materially changes the output. Answers arrive as chip clicks or
// free text; free text is matched by keywords with a sensible default.
// ---------------------------------------------------------------------------

export type RefineOption<T extends string> = { value: T; label: string; keywords: string[] };

export type RefineQuestion<T extends string> = {
  key: "start" | "goal" | "speed";
  question: string;
  options: RefineOption<T>[];
  fallback: T;
};

export const REFINE_START: RefineQuestion<StartPoint> = {
  key: "start",
  question: "Where are you today with it?",
  fallback: "idea",
  options: [
    { value: "idea", label: "Just the molecule", keywords: ["idea", "nothing", "molecule", "scratch", "no process", "start"] },
    { value: "lab", label: "Working lab process", keywords: ["lab", "bench", "process works", "grams"] },
    { value: "validated", label: "Validated process, need scale", keywords: ["validated", "pilot", "scale", "proven"] },
    { value: "second", label: "Made elsewhere, need a second source", keywords: ["second", "another supplier", "alternate", "existing supplier", "dual", "transfer"] },
  ],
};

export const REFINE_GOAL: RefineQuestion<EndPoint> = {
  key: "goal",
  question: "Where should the engagement finish?",
  fallback: "commercial",
  options: [
    { value: "samples", label: "Samples to kilo quantities", keywords: ["sample", "kilo", "kg", "small", "trial"] },
    { value: "commercial", label: "Commercial supply", keywords: ["commercial", "tonne", "supply", "volume", "production"] },
    { value: "regulated", label: "Regulated filing (DMF, FDA)", keywords: ["regulat", "dmf", "fda", "filing", "dossier", "gmp", "usfda", "ema"] },
  ],
};

export const REFINE_SPEED: RefineQuestion<SpeedPref> = {
  key: "speed",
  question: "What matters more, speed or certainty?",
  fallback: "balanced",
  options: [
    { value: "fast", label: "Fastest possible", keywords: ["fast", "speed", "urgent", "asap", "quick"] },
    { value: "balanced", label: "Balanced", keywords: ["balance", "both", "normal", "standard"] },
    { value: "certain", label: "Maximum certainty", keywords: ["certain", "safe", "quality", "sure", "risk"] },
  ],
};

export const REFINE_SEQUENCE = [REFINE_START, REFINE_GOAL, REFINE_SPEED] as const;

// Matches a typed answer to one of a question's options; falls back sensibly.
export function matchRefineAnswer<T extends string>(q: RefineQuestion<T>, text: string): T {
  const t = text.toLowerCase();
  for (const opt of q.options) {
    if (opt.keywords.some((kw) => t.includes(kw))) return opt.value;
  }
  return q.fallback;
}

// Streams a short, product-specific commentary under a tailored pathway when a
// key is present. Bounded to general programme knowledge; invented specifics are
// forbidden, and the timeline it may reference is the one we computed.
export async function pathwayCommentary(
  pathway: Pathway,
  situation: string,
  onToken: (t: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const cfg = loadAiConfig();
  if (!hasApiKey(cfg)) return;
  const r = pathway.refinements;
  const messages: ChatMsg[] = [
    {
      role: "system",
      content: [
        "You are a senior CDMO programme manager. Write a short note (max 80 words, plain text, no markdown, no em dash) on the critical path for this project.",
        "You may reference the product's general chemistry class and which milestone usually dominates the timeline.",
        "Strict rules: do not invent prices, patent numbers, regulatory decisions, specific yields or conditions. Do not change the computed timeline; you may repeat it.",
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        `Product: ${pathway.product || "not named"}.`,
        `Situation: ${situation}.`,
        r ? `Start: ${r.start}. Goal: ${r.goal}. Priority: ${r.speed}.` : "",
        `Computed timeline: ${pathway.weeks[0]} to ${pathway.weeks[1]} weeks across milestones ${pathway.milestones.map((m) => m.label).join(", ")}.`,
        "Write the note.",
      ].join("\n"),
    },
  ];
  try {
    await streamChat(cfg, messages, onToken, signal);
  } catch {
    // Commentary is optional; the deterministic pathway already rendered.
  }
}
