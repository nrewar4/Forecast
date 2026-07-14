import type { AiConfig } from "./aiConfig";
import { chatComplete } from "./openrouter";
import { resolveMolecule, type PubchemResult } from "./pubchem";
import { getRetroSteps } from "./askcos";
import { cacheGet, cacheSet, DAY } from "./aiCache";
import { requiredCapabilities, capabilityLabel } from "./chemLexicon";
import type { SynthesisRoute, RouteStepDetail } from "./synthesisRoute";

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

const ROUTE_SCHEMA = `{ "routes": [
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
      "note": "One line patent / freedom-to-operate signal, not legal advice."
    }
  }
] }`;

// Heuristic: a molecule with no carbon backbone is an inorganic / industrial
// product (salt, mineral acid, oxide, simple gas). Its production is
// electrochemical / disproportionation / neutralisation / precipitation, NOT
// organic named reactions. Carbon present = "C" followed by an uppercase letter,
// a digit, or end-of-string (so "Ca", "Cl", "Cu" don't count as carbon).
function isInorganicFormula(formula: string | null): boolean {
  if (!formula) return false;
  return !/C([A-Z]|\d|$)/.test(formula);
}

// Runs an ASKCOS call with a hard 4s cap, returning an empty tree on timeout or
// error so it can never stall route generation. Aborts the in-flight request.
async function askcosBoxed(
  smiles: string,
  parent?: AbortSignal,
  ms = 4000,
): Promise<{ precursor_sets: { smiles: string[]; score: number }[] }> {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  parent?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await getRetroSteps(smiles, ctrl.signal);
  } catch {
    return { precursor_sets: [] };
  } finally {
    clearTimeout(timer);
    parent?.removeEventListener("abort", onAbort);
  }
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
    "Layer 1, one step back from target:",
    ...layer1.slice(0, 3).map(
      (s, i) =>
        `  Option ${i + 1}: reactants=[${s.smiles.join(", ")}]  confidence=${s.score.toFixed(3)}`,
    ),
  ];
  if (layer2.length) {
    lines.push(
      `Layer 2, one step back from best precursor (${layer1[0]?.smiles[0] ?? ""}):`,
      ...layer2.slice(0, 3).map(
        (s, i) =>
          `  Option ${i + 1}: reactants=[${s.smiles.join(", ")}]  confidence=${s.score.toFixed(3)}`,
      ),
    );
  }
  return lines.join("\n");
}

// Thrown when the model's reply could not be read as routes, so the caller can
// retry with a different model before surfacing an error to the user.
class UnparseableRoutesError extends Error {
  constructor() {
    super("The model returned an unreadable response. Retry, or add OpenRouter credit or pin a stronger model in AI settings for reliable results on this page.");
    this.name = "UnparseableRoutesError";
  }
}

// Pulls the routes array out of the model reply. Accepts the object form
// {"routes":[...]} (what we now ask for, via JSON mode) and a bare [...] array
// (back-compat), and tolerates ```json fences and surrounding prose.
function extractRoutesArray(raw: string): unknown[] | null {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  // Try the object form first.
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart >= 0 && objEnd > objStart) {
    try {
      const obj = JSON.parse(cleaned.slice(objStart, objEnd + 1)) as { routes?: unknown };
      if (Array.isArray(obj?.routes)) return obj.routes;
    } catch {
      // fall through to array form
    }
  }
  // Fall back to a bare array.
  const arrStart = cleaned.indexOf("[");
  const arrEnd = cleaned.lastIndexOf("]");
  if (arrStart >= 0 && arrEnd > arrStart) {
    try {
      const arr = JSON.parse(cleaned.slice(arrStart, arrEnd + 1));
      if (Array.isArray(arr)) return arr;
    } catch {
      return null;
    }
  }
  return null;
}

function parseRoutes(raw: string, source: "askcos+claude" | "claude"): RouteResult[] {
  const arr = extractRoutesArray(raw);
  if (!arr || arr.length === 0) throw new UnparseableRoutesError();
  const parsed = arr as RouteResult[];

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
  preResolved?: PubchemResult,
): Promise<FindRoutesResult> {
  // 0. Cache-aside: a repeat search returns instantly and never hits the API,
  //    which is what keeps the free tier under its rate limit.
  const cacheKey = `routes:${cfg.model}:${query.trim().toLowerCase()}`;
  const cachedResult = cacheGet<FindRoutesResult>(cacheKey);
  if (cachedResult) return cachedResult;

  // 1. Resolve molecule identity. A caller that already resolved it (e.g. the
  //    CDMO feasibility flow, via PubChem/CACTUS/OPSIN) passes it in so we do not
  //    resolve twice, and so the engine still runs when only a name is known.
  const molecule = preResolved ?? (await resolveMolecule(query, signal));
  const targetSmiles = molecule.smiles ?? query;

  // 2. ASKCOS two-layer tree (best-effort). ASKCOS is only reachable through the
  //    dev proxy and its public demo is often down, so each call is hard
  //    time-boxed: without a bound, an unanswered POST (e.g. an SPA fallback that
  //    never replies) would stall the whole route generation. On timeout we just
  //    proceed with an empty tree and let the model assemble the route.
  const layer1Result = await askcosBoxed(targetSmiles, signal);
  const layer1 = layer1Result.precursor_sets;

  let layer2: { smiles: string[]; score: number }[] = [];
  const bestPrecursor = layer1[0]?.smiles[0];
  if (bestPrecursor) {
    const layer2Result = await askcosBoxed(bestPrecursor, signal);
    layer2 = layer2Result.precursor_sets;
  }

  const source: "askcos+claude" | "claude" =
    layer1.length > 0 ? "askcos+claude" : "claude";
  const askcosContext = buildAskcosContext(targetSmiles, layer1, layer2);

  // 3. Claude route assembly, branch persona for inorganic/industrial products,
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
    "  or \"Novel\" (you are proposing it; not known to be in use). Be honest, do not label a",
    "  speculative route Commercial.",
    "- novelty.used_by: name real companies or named processes that run this route when you",
    "  know them (e.g. \"BASF (BHC green process)\"). Leave empty rather than guessing.",
    "- patents: give a realistic freedom-to-operate signal, whether the route is off-patent",
    "  or has active process patents, and likely assignees. Use web search. This is a signal,",
    "  not legal advice.",
    "- Prefer well-established commercial routes as the top-ranked routes; clearly flag any",
    "  genuinely novel route you add.",
    "Return ONLY a JSON object (no prose, no markdown, no code fences) matching this schema exactly:",
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

  const messages = [
    { role: "system" as const, content: systemLines.join("\n") },
    { role: "user" as const, content: userMsg },
  ];

  // Free models are unreliable at strict formatting and sometimes return prose or
  // a moderation-style reply on a 200, which is not caught by the model-fallback
  // (that only triggers on error statuses). So we ask for a JSON object
  // (response_format), and if the reply is still unreadable we retry a couple of
  // times; each call rotates to a different model, so a bad model gets replaced.
  let routes: RouteResult[] | null = null;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3 && !routes; attempt++) {
    const raw = await chatComplete(cfg, messages, signal, { web: true, json: true });
    try {
      routes = parseRoutes(raw, source);
    } catch (e) {
      lastErr = e;
      if (signal?.aborted) throw e;
    }
  }
  if (!routes) throw lastErr instanceof Error ? lastErr : new UnparseableRoutesError();

  const result: FindRoutesResult = { molecule, routes };
  cacheSet(cacheKey, result, DAY);
  return result;
}

// A lean, fast extractor of the VERY SPECIFIC chemistry for the CDMO feasibility
// card: the ordered steps to make the target, each with its exact reaction,
// reagents/catalysts and conditions, plus the commercial starting materials. It
// deliberately does NOT ask for the novelty/patent analysis the admin page needs,
// because that heavy prompt makes a free model slow and unreliable. Strict JSON
// mode keeps the reply parseable. Best-effort: returns null on any failure so the
// caller can fall back to other sources. Vendor-matchable categories are derived
// from the specific reaction names via the shared lexicon.
type LeanStep = { reaction?: string; reactants?: string[]; reagents?: string[]; conditions?: string; explanation?: string };
type LeanRoute = { found?: boolean; steps?: LeanStep[]; starting_materials?: string[] };

const LEAN_SCHEMA = `{
  "found": boolean,                 // false if you do not know a real synthesis
  "steps": [
    {
      "reaction": "specific named reaction, e.g. Fischer esterification",
      "reactants": ["the substrate(s) entering this step"],
      "reagents": ["catalysts / reagents / solvents, e.g. p-TsOH, toluene"],
      "conditions": "e.g. reflux, Dean-Stark, 4 h",
      "explanation": "one short clause on why this step is used"
    }
  ],
  "starting_materials": ["commercially available bulk starting materials"]
}`;

export async function retroSynthesisRoute(
  query: string,
  cfg: AiConfig,
  signal?: AbortSignal,
  preResolved?: PubchemResult,
): Promise<SynthesisRoute | null> {
  const name = preResolved?.name || query;
  const smiles = preResolved?.smiles || "";
  const formula = preResolved?.formula || "";

  const system = [
    "You are an expert synthetic / process chemist. Give the most likely REAL industrial synthesis of the target compound as a short ordered sequence of steps.",
    "Be very specific: for each step give the named reaction, the reactants, the exact reagents/catalysts/solvents, and the conditions. Prefer the established commercial route.",
    "Use real chemistry only. Do NOT invent a route; if you do not know a genuine synthesis, set found=false.",
    "Return ONLY a JSON object (no prose, no markdown, no code fences) matching this schema exactly:",
    LEAN_SCHEMA,
  ].join("\n");
  const user = [
    `Target: ${name}`,
    smiles ? `SMILES: ${smiles}` : "",
    formula ? `Formula: ${formula}` : "",
    "Give its specific synthesis steps.",
  ].filter(Boolean).join("\n");

  let raw: string;
  try {
    raw = await chatComplete(cfg, [
      { role: "system", content: system },
      { role: "user", content: user },
    ], signal, { json: true });
  } catch (e) {
    if (signal?.aborted) throw e;
    return null;
  }

  let obj: LeanRoute;
  try {
    let t = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const s = t.indexOf("{"), en = t.lastIndexOf("}");
    if (s >= 0 && en > s) t = t.slice(s, en + 1);
    obj = JSON.parse(t) as LeanRoute;
  } catch {
    return null;
  }
  if (obj.found === false || !Array.isArray(obj.steps) || obj.steps.length === 0) return null;

  const detail: RouteStepDetail[] = obj.steps
    .map((s) => ({
      reaction: String(s.reaction || "").trim(),
      reactants: (Array.isArray(s.reactants) ? s.reactants : []).map(String).filter(Boolean),
      reagents: (Array.isArray(s.reagents) ? s.reagents : []).map(String).filter(Boolean),
      conditions: String(s.conditions || "").trim(),
      explanation: String(s.explanation || "").trim(),
    }))
    .filter((d) => d.reaction);
  if (detail.length === 0) return null;

  const reactions: string[] = [];
  for (const d of detail) if (!reactions.includes(d.reaction)) reactions.push(d.reaction);
  const categories = requiredCapabilities(reactions).map(capabilityLabel);

  const steps = detail.map((d) => {
    const cond = [d.reagents.join(", "), d.conditions].filter(Boolean).join("; ");
    return `${d.reaction}${cond ? ` (${cond})` : ""}${d.explanation ? `. ${d.explanation}` : ""}`.trim();
  });

  const startingMaterials = (Array.isArray(obj.starting_materials) ? obj.starting_materials : [])
    .map(String).filter(Boolean).slice(0, 8);

  const source = {
    name: "AI retrosynthesis",
    url: preResolved?.cid
      ? `https://pubchem.ncbi.nlm.nih.gov/compound/${preResolved.cid}`
      : `https://www.google.com/search?q=${encodeURIComponent(`${name} synthesis route`)}`,
  };

  return { reactions, categories, steps: steps.slice(0, 6), detail, startingMaterials, source, confirmedByName: false, grounding: "ai" };
}
