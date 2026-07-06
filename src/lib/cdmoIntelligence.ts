import type { AiConfig } from "./aiConfig";
import { chatComplete } from "./openrouter";
import { searchLiterature, type Paper } from "./openalex";
import type { PubchemResult } from "./pubchem";
import type { RouteResult } from "./retrosynthesis";
import { products, type Product } from "@/data/products";
import { supplierGroups, type Supplier } from "@/data/suppliers";
import { cacheGet, cacheSet, DAY } from "./aiCache";

export type ManufacturerProcess = {
  company: string;
  country: string;
  route: string;       // named process / synthesis route used at scale
  technology: string;  // batch / continuous / catalytic system / licensed tech
  scaleNote: string;   // capacity or market-position note
};

export type CdmoOpportunity = {
  positioning: string;       // how a CDMO realistically slots in
  capacityGap: string;       // the gap / unmet demand to target
  differentiation: string[]; // concrete ways to differentiate
  targetSegment: string;     // who to sell to (generics, innovator, agro, etc.)
};

export type OptimizationLever = {
  lever: string;        // e.g. "Catalyst recovery"
  technique: string;    // the concrete change
  expectedGain: string; // e.g. "+8-12% yield" or "-30% solvent use"
  maturity: string;     // Proven / Emerging / Pilot
};

export type CostLever = {
  category: string;       // Raw material / Solvent & process / Energy & labor / Yield
  action: string;         // the concrete cost move
  roughImpactPct: string; // e.g. "5-10%", rough COGS impact, flagged as estimate
  basis: string;          // why this number / what it ties to
};

export type Citation = {
  title: string;
  doi: string | null;
  year: number | null;
};

export type CdmoAnalysis = {
  manufacturerProcesses: ManufacturerProcess[];
  cdmoOpportunity: CdmoOpportunity;
  processOptimization: OptimizationLever[];
  costReduction: CostLever[];
  citations: Citation[];
  groundedFrom: string[]; // human-readable list of real sources used
};

// ---------------------------------------------------------------------------
// Grounding helpers, match the molecule against the app's real data sets.
// ---------------------------------------------------------------------------

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Match a resolved molecule to a verified product entry by name or CAS.
export function matchProduct(molecule: PubchemResult, query: string): Product | null {
  const candidates = [molecule.name, query].filter(Boolean).map((s) => norm(s as string));
  for (const p of products) {
    const pname = norm(p.name);
    if (candidates.some((c) => c === pname || c.includes(pname) || pname.includes(c))) {
      return p;
    }
    if (molecule.cid == null && p.cas && query.trim() === p.cas) return p;
    if (p.cas && (molecule.name ?? query).trim() === p.cas) return p;
  }
  return null;
}

// Token-overlap match against supplier product groups (e.g. "ibuprofen" against
// "Heterocyclic compounds and API intermediates (HS ...)"). Best-effort.
export function matchSuppliers(molecule: PubchemResult, query: string): Supplier[] {
  const target = norm([molecule.name, query].filter(Boolean).join(" "));
  const tokens = target.split(" ").filter((t) => t.length > 3);
  if (!tokens.length) return [];
  for (const g of supplierGroups) {
    const key = norm(g.product);
    if (tokens.some((t) => key.includes(t))) return g.suppliers;
  }
  return [];
}

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

const CDMO_SCHEMA = `{
  "manufacturerProcesses": [
    { "company": "real producer name", "country": "country", "route": "named process used at scale", "technology": "batch/continuous/catalytic/licensed tech", "scaleNote": "capacity or market position" }
  ],
  "cdmoOpportunity": {
    "positioning": "how a CDMO realistically enters this product",
    "capacityGap": "the specific unmet demand / supply gap to target",
    "differentiation": ["concrete differentiator 1", "concrete differentiator 2"],
    "targetSegment": "who to sell to"
  },
  "processOptimization": [
    { "lever": "short name", "technique": "the concrete change to the process", "expectedGain": "e.g. +8-12% yield or -30% solvent", "maturity": "Proven | Emerging | Pilot" }
  ],
  "costReduction": [
    { "category": "Raw material | Solvent & process | Energy & labor | Yield & throughput", "action": "the concrete cost move", "roughImpactPct": "e.g. 5-10%", "basis": "what this estimate ties to" }
  ]
}`;

function buildGrounding(
  product: Product | null,
  suppliers: Supplier[],
  papers: Paper[],
): { block: string; groundedFrom: string[] } {
  const lines: string[] = [];
  const groundedFrom: string[] = [];

  if (product) {
    groundedFrom.push(`Verified product data: ${product.name}`);
    lines.push(
      "VERIFIED PRODUCT DATA (real, anchor your manufacturer routes and cost split to this):",
      `  Name: ${product.name} (CAS ${product.cas}, HS ${product.hsCode})`,
      `  Plant type: ${product.plantType}`,
      `  Indicative price: ${product.priceIndicative}`,
      `  Industrial routes: ${product.route.join("; ")}`,
      `  Real cost driver split: ${product.costDrivers.map((d) => `${d.label} ${d.percent}%`).join(", ")}`,
      `  Known producers: ${product.producers.join(", ")}`,
    );
  }

  if (suppliers.length) {
    groundedFrom.push(`${suppliers.length} vetted suppliers`);
    lines.push(
      "VETTED MANUFACTURERS (real shortlist, use these as primary manufacturer entries):",
      ...suppliers
        .slice(0, 6)
        .map(
          (s) =>
            `  ${s.company} (${s.country}), ${s.type}; ${s.capacityNote}; certs: ${s.certifications.join(", ")}`,
        ),
    );
  }

  if (papers.length) {
    groundedFrom.push(`${papers.length} literature sources`);
    lines.push(
      "PROCESS LITERATURE (cite these where relevant; pull optimization ideas from here):",
      ...papers
        .slice(0, 6)
        .map(
          (p) =>
            `  "${p.title}" (${p.year ?? "n.d."})${p.doi ? ` doi:${p.doi}` : ""}`,
        ),
    );
  }

  if (!lines.length) {
    lines.push(
      "No verified internal data matched this molecule. Use web search and general industrial knowledge, and clearly treat all figures as estimates.",
    );
    groundedFrom.push("web search + general knowledge");
  }

  return { block: lines.join("\n"), groundedFrom };
}

function parseAnalysis(raw: string): Omit<CdmoAnalysis, "citations" | "groundedFrom"> {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("CDMO analysis failed. Retry.");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    throw new Error("CDMO analysis failed. Retry.");
  }

  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const str = (v: unknown): string => (typeof v === "string" ? v : "");

  const opp = (parsed.cdmoOpportunity ?? {}) as Record<string, unknown>;

  return {
    manufacturerProcesses: arr<Record<string, unknown>>(parsed.manufacturerProcesses).map(
      (m) => ({
        company: str(m.company),
        country: str(m.country),
        route: str(m.route),
        technology: str(m.technology),
        scaleNote: str(m.scaleNote),
      }),
    ),
    cdmoOpportunity: {
      positioning: str(opp.positioning),
      capacityGap: str(opp.capacityGap),
      differentiation: arr<string>(opp.differentiation).filter((x) => typeof x === "string"),
      targetSegment: str(opp.targetSegment),
    },
    processOptimization: arr<Record<string, unknown>>(parsed.processOptimization).map((o) => ({
      lever: str(o.lever),
      technique: str(o.technique),
      expectedGain: str(o.expectedGain),
      maturity: str(o.maturity) || "Emerging",
    })),
    costReduction: arr<Record<string, unknown>>(parsed.costReduction).map((c) => ({
      category: str(c.category),
      action: str(c.action),
      roughImpactPct: str(c.roughImpactPct),
      basis: str(c.basis),
    })),
  };
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export async function analyzeCdmo(
  molecule: PubchemResult,
  route: RouteResult,
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
  isBiologic = false,
): Promise<CdmoAnalysis> {
  const name = molecule.name ?? query;

  // Cache-aside: same molecule + route + mode returns instantly, no API call.
  const cacheKey = `cdmo:${cfg.model}:${name.toLowerCase()}:${route.id}:${isBiologic ? "bio" : "chem"}`;
  const hit = cacheGet<CdmoAnalysis>(cacheKey);
  if (hit) return hit;

  // 1. Real data grounding
  const product = matchProduct(molecule, query);
  const suppliers = matchSuppliers(molecule, query);

  // 2. Literature grounding (best-effort; empty on error)
  const litQuery = isBiologic
    ? `${name} biologic manufacturing cell culture upstream downstream process`
    : `${name} industrial process manufacturing scale-up`;
  let papers: Paper[] = [];
  try {
    papers = await searchLiterature(litQuery, signal);
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    papers = [];
  }

  const { block, groundedFrom } = buildGrounding(product, suppliers, papers);

  // 3. CDMO analyst call (web-grounded). Chemical synthesis vs. biologic bioprocess.
  const chemRules = [
    "RULES:",
    "- manufacturerProcesses: list the actual major producers and the real route/technology",
    "  they use at scale. Prefer the vetted manufacturers and known producers above. You may",
    "  add globally recognized producers from web search, but never invent capacity figures.",
    "- Anchor the cost-reduction logic to the real cost-driver split when provided. If the",
    "  biggest cost driver is feedstock, the biggest cost lever must address feedstock.",
    "- roughImpactPct must be a realistic COGS-impact range and is an ESTIMATE.",
    "- processOptimization: name real techniques (continuous-flow, catalyst recycle,",
    "  telescoping, solvent recovery, biocatalysis, crystallization control) with honest",
    "  maturity (Proven/Emerging/Pilot). No miracle yields.",
    "- cdmoOpportunity: realistic for a mid-size CDMO, capacity gaps, regulatory/geographic",
    "  arbitrage, niche scale, speed. Not 'disrupt the market'.",
    "- Cover all four cost categories where they apply: Raw material, Solvent & process,",
    "  Energy & labor, Yield & throughput.",
  ];
  const bioRules = [
    "This target is a BIOLOGIC (Purple Book / BLA), it is produced by BIOPROCESS, not chemical",
    "synthesis. Reframe every field for biomanufacturing:",
    "- manufacturerProcesses: real biologics makers / CDMOs and their PLATFORM (expression system",
    "  e.g. CHO, E. coli, microbial; route field = cell line/platform; technology = upstream",
    "  fed-batch vs perfusion, single-use vs stainless, downstream Protein A / chromatography).",
    "  Prefer real BLA holders and biologics CDMOs (Lonza, Samsung Biologics, WuXi Biologics,",
    "  Boehringer Ingelheim, Catalent). Never invent capacities.",
    "- processOptimization: titer improvement, perfusion/intensified seed, single-use adoption,",
    "  continuous downstream, Protein A resin reuse, media/feed optimization, with honest maturity.",
    "- costReduction categories become: Raw material (media, feeds, Protein A resin),",
    "  Solvent & process (buffers, consumables, single-use), Energy & labor (cleanroom, QC,",
    "  batch release), Yield & throughput (titer g/L, recovery, campaign length).",
    "- cdmoOpportunity: biosimilar timing, capacity reservation, fill-finish, drug-substance vs",
    "  drug-product split, regulatory (BLA/351(k)) positioning.",
    "- roughImpactPct is a realistic COGS-impact range and is an ESTIMATE.",
  ];

  const system = [
    "You are a senior CDMO (Contract Development & Manufacturing Organization) process and",
    "cost analyst. You advise a CDMO on how a product is made at industrial scale and how",
    "to win business making it. Be concrete, commercial, and REALISTIC, no hand-waving.",
    "",
    block,
    "",
    ...(isBiologic ? bioRules : chemRules),
    "Return ONLY a JSON object (no prose, no markdown, no code fences) matching this schema:",
    CDMO_SCHEMA,
  ].join("\n");

  const user = [
    `Target: ${name}`,
    molecule.formula ? `Formula: ${molecule.formula}` : "",
    `Selected synthesis route summary: ${route.summary || "(see steps)"}`,
    `Route steps: ${route.steps.map((s) => s.reaction_name).join(" -> ") || "n/a"}`,
    `Route starting materials: ${route.starting_materials.join(", ") || "n/a"}`,
    "",
    "Produce the CDMO production-intelligence analysis as JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await chatComplete(
    cfg,
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    signal,
    { web: true },
  );

  const parsed = parseAnalysis(raw);

  const citations: Citation[] = papers
    .slice(0, 6)
    .map((p) => ({ title: p.title, doi: p.doi, year: p.year }));

  const analysis: CdmoAnalysis = { ...parsed, citations, groundedFrom };
  cacheSet(cacheKey, analysis, DAY);
  return analysis;
}
