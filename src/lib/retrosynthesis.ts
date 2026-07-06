import type { AiConfig } from "./aiConfig";
import { chatComplete } from "./openrouter";
import { resolveMolecule, type PubchemResult } from "./pubchem";
import { getRetroSteps } from "./askcos";
import { cacheGet, cacheSet, DAY } from "./aiCache";

export type RouteStep = {
  order: number;
  reaction_name: string;   // e.g. "Friedel-Crafts acylation"
  reactants: string[];     // SMILES or common names of starting materials for this step
  reagents: string[];      // catalysts / solvents / additives e.g. ["AlCl₃"]
  conditions: string;      // e.g. "0°C, anhydrous DCM, 2 h"
  explanation: string;     // one sentence explaining why this step works
};

export type RouteNovelty = {
  classification: "Commercial" | "Literature" | "Novel" | string;
  // Commercial = currently used in industrial production; Literature = published/
  // tried but not necessarily commercial; Novel = AI-proposed, not known in use.
  rationale: string;        // one line: why this classification
  used_by: string[];        // named companies/processes known to run this route
};

export type RoutePatent = {
  status: string;           // e.g. "Off-patent", "Process patents active", "Patented"
  assignees: string[];      // companies/entities holding route or process patents
  note: string;             // one line on patent / freedom-to-operate signal
};

export type RouteResult = {
  id: string;
  source: "askcos+claude" | "claude";
  steps: RouteStep[];
  starting_materials: string[];   // commercially buyable starting materials
  feasibility_score: number;      // 0-100
  feasibility_notes: string[];
  summary: string;                // two-sentence route summary
  novelty: RouteNovelty;          // is this route novel or tried-and-tested
  patents: RoutePatent;           // patent / who-uses-it signal for this route
};

export type FindRoutesResult = {
  molecule: PubchemResult;
  routes: RouteResult[];
};

const ROUTE_SCHEMA = `[
  {
    "id": "route-1",
    "source": "askcos+claude",
    "steps": [
      {
        "order": 1,
        "reaction_name": "e.g. Friedel-Crafts acylation",
        "reactants": ["e.g. isobutylbenzene"],
        "reagents": ["e.g. AlCl₃", "e.g. propionyl chloride"],
        "conditions": "e.g. 0°C, anhydrous DCM, 2 h",
        "explanation": "One sentence explaining why this step works and why these conditions are used."
      }
    ],
    "starting_materials": ["commercially buyable compound A"],
    "feasibility_score": 75,
    "feasibility_notes": ["Short note on atom economy", "Short note on availability"],
    "summary": "Two sentences describing the overall strategy and key advantage of this route.",
    "novelty": {
      "classification": "Commercial",
      "rationale": "One line: e.g. this is the dominant industrial route used today.",
      "used_by": ["company or process that runs this route, if known"]
    },
    "patents": {
      "status": "e.g. Off-patent | Process patents active | Patented",
      "assignees": ["company holding a route/process patent, if any"],
      "note": "One line patent / freedom-to-operate signal — not legal advice."
    }
  }
]`;

// Heuristic: a molecule with no carbon backbone is an inorganic / industrial
// product (salt, mineral acid, oxide, simple gas). Its production is
// electrochemical / disproportionation / neutralisation / precipitation — NOT
// organic named reactions. Carbon present = "C" followed by an uppercase letter,
// a digit, or end-of-string (so "Ca", "Cl", "Cu" don't count as carbon).
function isInorganicFormula(formula: string | null): boolean {
  if (!formula) return false;
  return !/C([A-Z]|\d|$)/.test(formula);
}

function buildAskcosContext(
  targetSmiles: string,
  layer1: { smiles: string[]; score: number }[],
  layer2: { smiles: string[]; score: number }[],
): string {
  if (!layer1.length) return "";
  const lines: string[] = [
    "ASKCOS ML retrosynthesis data (use this to inform your route steps):",
    `Target SMILES: ${targetSmiles}`,
    "Layer 1 — one step back from target:",
    ...layer1.slice(0, 3).map(
      (s, i) =>
        `  Option ${i + 1}: reactants=[${s.smiles.join(", ")}]  confidence=${s.score.toFixed(3)}`,
    ),
  ];
  if (layer2.length) {
    lines.push(
      `Layer 2 — one step back from best precursor (${layer1[0]?.smiles[0] ?? ""}):`,
      ...layer2.slice(0, 3).map(
        (s, i) =>
          `  Option ${i + 1}: reactants=[${s.smiles.join(", ")}]  confidence=${s.score.toFixed(3)}`,
      ),
    );
  }
  return lines.join("\n");
}

function parseRoutes(raw: string, source: "askcos+claude" | "claude"): RouteResult[] {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start < 0 || end <= start) throw new Error("Route generation failed — retry");

  let parsed: RouteResult[];
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1)) as RouteResult[];
  } catch {
    throw new Error("Route generation failed — retry");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Route generation failed — retry");
  }

  return parsed.map((r, i) => ({
    id: typeof r.id === "string" ? r.id : `route-${i + 1}`,
    source,
    steps: Array.isArray(r.steps)
      ? r.steps.map((s, j) => ({
          order: typeof s.order === "number" ? s.order : j + 1,
          reaction_name: typeof s.reaction_name === "string" ? s.reaction_name : "Reaction",
          reactants: Array.isArray(s.reactants) ? (s.reactants as string[]) : [],
          reagents: Array.isArray(s.reagents) ? (s.reagents as string[]) : [],
          conditions: typeof s.conditions === "string" ? s.conditions : "",
          explanation: typeof s.explanation === "string" ? s.explanation : "",
        }))
      : [],
    starting_materials: Array.isArray(r.starting_materials)
      ? (r.starting_materials as string[])
      : [],
    feasibility_score:
      typeof r.feasibility_score === "number" ? r.feasibility_score : 70,
    feasibility_notes: Array.isArray(r.feasibility_notes)
      ? (r.feasibility_notes as string[])
      : [],
    summary: typeof r.summary === "string" ? r.summary : "",
    novelty: parseNovelty(r.novelty),
    patents: parsePatents(r.patents),
  }));
}

function parseNovelty(v: unknown): RouteNovelty {
  const o = (v ?? {}) as Record<string, unknown>;
  const cls = typeof o.classification === "string" ? o.classification : "Literature";
  return {
    classification: cls,
    rationale: typeof o.rationale === "string" ? o.rationale : "",
    used_by: Array.isArray(o.used_by)
      ? (o.used_by as unknown[]).filter((x): x is string => typeof x === "string")
      : [],
  };
}

function parsePatents(v: unknown): RoutePatent {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    status: typeof o.status === "string" ? o.status : "Unknown",
    assignees: Array.isArray(o.assignees)
      ? (o.assignees as unknown[]).filter((x): x is string => typeof x === "string")
      : [],
    note: typeof o.note === "string" ? o.note : "",
  };
}

export async function findRoutes(
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<FindRoutesResult> {
  // 0. Cache-aside: a repeat search returns instantly and never hits the API,
  //    which is what keeps the free tier under its rate limit.
  const cacheKey = `routes:${cfg.model}:${query.trim().toLowerCase()}`;
  const cachedResult = cacheGet<FindRoutesResult>(cacheKey);
  if (cachedResult) return cachedResult;

  // 1. Resolve molecule identity
  const molecule = await resolveMolecule(query, signal);
  const targetSmiles = molecule.smiles ?? query;

  // 2. ASKCOS two-layer tree (best-effort; errors return empty arrays)
  const layer1Result = await getRetroSteps(targetSmiles, signal);
  const layer1 = layer1Result.precursor_sets;

  let layer2: { smiles: string[]; score: number }[] = [];
  const bestPrecursor = layer1[0]?.smiles[0];
  if (bestPrecursor) {
    const layer2Result = await getRetroSteps(bestPrecursor, signal);
    layer2 = layer2Result.precursor_sets;
  }

  const source: "askcos+claude" | "claude" =
    layer1.length > 0 ? "askcos+claude" : "claude";
  const askcosContext = buildAskcosContext(targetSmiles, layer1, layer2);

  // 3. Claude route assembly — branch persona for inorganic/industrial products,
  //    which are NOT made by organic named reactions (ASKCOS also can't help).
  const inorganic = isInorganicFormula(molecule.formula);
  const systemLines = [
    inorganic
      ? "You are an industrial inorganic / process chemist working for a chemical sourcing platform."
      : "You are an expert synthetic organic chemist working for a chemical sourcing platform.",
    "Generate 1-3 viable industrial production routes for the given target compound.",
    askcosContext,
    "Rules:",
    "- Each route must have 2-5 steps",
    inorganic
      ? "- This is an INORGANIC / industrial compound (salt, mineral acid, oxide, or simple gas). Do NOT use organic named reactions. Use the real industrial process: electrolysis, electrochemical oxidation, disproportionation, neutralisation, precipitation/crystallisation, calcination, gas-phase oxidation, or metathesis. reaction_name should be the actual process name (e.g. \"Electrochemical oxidation of sodium bromide\", \"Disproportionation of bromine in hot caustic\")."
      : "- Use real named reactions (Grignard, Friedel-Crafts, reductive amination, etc.)",
    "- Reagents and conditions must be realistic for industrial or pilot scale",
    "- feasibility_score 0-100: consider atom economy, starting-material availability, step count, safety, scalability",
    "- starting_materials must be commercially available bulk chemicals",
    `- Set the source field to "${source}" for every route`,
    "- novelty.classification MUST be one of: \"Commercial\" (route is currently used in",
    "  industrial production), \"Literature\" (published/tried but not confirmed commercial),",
    "  or \"Novel\" (you are proposing it; not known to be in use). Be honest — do not label a",
    "  speculative route Commercial.",
    "- novelty.used_by: name real companies or named processes that run this route when you",
    "  know them (e.g. \"BASF (BHC green process)\"). Leave empty rather than guessing.",
    "- patents: give a realistic freedom-to-operate signal — whether the route is off-patent",
    "  or has active process patents, and likely assignees. Use web search. This is a signal,",
    "  not legal advice.",
    "- Prefer well-established commercial routes as the top-ranked routes; clearly flag any",
    "  genuinely novel route you add.",
    "Return ONLY a JSON array (no prose, no markdown, no code fences) matching this schema exactly:",
    ROUTE_SCHEMA,
  ].filter(Boolean);

  const userMsg = [
    `Target molecule: ${molecule.name ?? query}`,
    `SMILES: ${targetSmiles}`,
    `Formula: ${molecule.formula ?? "unknown"}`,
    `MW: ${molecule.mw ?? "unknown"}`,
    "",
    "Generate synthesis routes.",
  ].join("\n");

  const raw = await chatComplete(
    cfg,
    [
      { role: "system", content: systemLines.join("\n") },
      { role: "user", content: userMsg },
    ],
    signal,
    { web: true }, // ground novelty + patent signals in live sources
  );

  const result: FindRoutesResult = { molecule, routes: parseRoutes(raw, source) };
  cacheSet(cacheKey, result, DAY);
  return result;
}
