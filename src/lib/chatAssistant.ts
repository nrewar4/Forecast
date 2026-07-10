// The assistant's brain. Everything a visitor needs is produced deterministically
// from official and local data (PubChem identity, the product catalog, the vendor
// matcher, the APAC stage library), so the two flows always complete, even with
// no API key. The LLM only adds natural phrasing and a grounded chemistry note
// when a key exists, and it is prompted strictly to avoid inventing anything.

import { streamChat, type ChatMsg } from "@/lib/openrouter";
import { loadAiConfig, hasApiKey } from "@/lib/aiConfig";
import { resolveMolecule } from "@/lib/pubchem";
import { findCatalogProduct, matchVendors, type VendorMatch } from "@/lib/cdmoMatch";
import { research } from "@/data/research";
import { slug } from "@/lib/utils";
import { matchArchetype, type Archetype } from "@/data/cdmoPathway";

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

// Builds the Path B feasibility answer. onAiToken streams a grounded chemistry
// note when the molecule is not in our catalog and an API key is present.
export async function buildFeasibility(
  query: string,
  opts: { signal?: AbortSignal; onAiToken?: (t: string) => void } = {},
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
    // Not in the catalog. Optionally add a grounded, strictly-bounded AI note.
    const cfg = loadAiConfig();
    if (hasApiKey(cfg) && identity) {
      chemistry = { source: "ai", overview: "", routes: [], startingMaterials: [], hazards: "" };
      try {
        let text = "";
        const messages: ChatMsg[] = [
          {
            role: "system",
            content: [
              "You are a CDMO process chemist writing a short preliminary note for a buyer.",
              "Using only broadly established, textbook-level chemistry, describe in at most 80 words: the general class of synthetic route, common starting materials, and one handling or hazard consideration.",
              "Strict rules: do NOT invent patent numbers, yields, specific process conditions, company names, prices, or citations. If the established route is not something you are confident about, say the route should be scoped by our process chemists. Plain text only, no markdown.",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Molecule: ${resolvedName}. PubChem formula: ${identity.formula ?? "n/a"}. SMILES: ${identity.smiles ?? "n/a"}. Write the preliminary note.`,
          },
        ];
        await streamChat(cfg, messages, (tok) => {
          text += tok;
          opts.onAiToken?.(tok);
        }, opts.signal);
        chemistry.overview = text.trim();
        if (!chemistry.overview) chemistry.source = "pending";
      } catch {
        chemistry = { source: "pending", overview: "", routes: [], startingMaterials: [], hazards: "" };
      }
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

// Path A: a situation maps to a CDMO archetype (deterministic keyword match).
export function classifySituation(text: string): Archetype {
  return matchArchetype(text);
}
