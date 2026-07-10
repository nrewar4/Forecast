// The CDMO pathway model, rebuilt for APAC in a concise form. A buyer enters
// with a situation, and we return a path: reusable stage definitions composed
// into archetypes, grouped into five phase milestones. Everything here is
// deterministic and authored, so a pathway renders correctly with no API key.

export type Phase = "assess" | "develop" | "scale" | "transfer" | "supply";

export const PHASE_LABEL: Record<Phase, string> = {
  assess: "Assess",
  develop: "Develop",
  scale: "Scale",
  transfer: "Transfer",
  supply: "Supply",
};

// The mg to multi-tonne ladder. Each stage points at a rung so the pathway spine
// can show scale increasing as the engagement descends.
export const SCALE_LADDER = ["mg", "g", "100 g", "kg", "100 kg", "MT"] as const;

export type Stage = {
  id: string;
  name: string;
  phase: Phase;
  purpose: string; // one sentence, in the customer's language
  weeks: [number, number]; // indicative planning range
  scale: number; // index into SCALE_LADDER
  deliverables: string[]; // what the customer receives
  gate: string; // the criterion for releasing the next milestone
  inputs: string[]; // what we need from the customer
};

// The reusable stage library. Archetypes reference these by id.
export const STAGES: Record<string, Stage> = {
  assess: {
    id: "assess",
    name: "Feasibility assessment",
    phase: "assess",
    purpose: "Confirm the molecule can be made and is worth making with you.",
    weeks: [1, 3],
    scale: 0,
    deliverables: ["Feasibility memo", "Indicative cost band", "Recommended path"],
    gate: "Go or no-go decision agreed with a defined budget for the next phase.",
    inputs: ["Target molecule or CAS", "Target scale and timeline", "Quality expectations"],
  },
  route: {
    id: "route",
    name: "Route scouting",
    phase: "assess",
    purpose: "Find practical, freedom-to-operate-aware ways to make it.",
    weeks: [2, 5],
    scale: 0,
    deliverables: ["Route options with trade-offs", "Patent-sensitivity read", "Preferred route"],
    gate: "A preferred route selected with the risks written down.",
    inputs: ["Any known chemistry", "Regulatory market", "IP constraints"],
  },
  labdev: {
    id: "labdev",
    name: "Lab process development",
    phase: "develop",
    purpose: "Turn the chosen route into a repeatable lab process.",
    weeks: [4, 10],
    scale: 1,
    deliverables: ["Reproducible lab procedure", "Reference samples", "Preliminary yield"],
    gate: "Process reproduced across independent runs at target purity.",
    inputs: ["Approved route", "Reference standard if available"],
  },
  procopt: {
    id: "procopt",
    name: "Process optimisation",
    phase: "develop",
    purpose: "Lift yield and cut cost, solvent and cycle time.",
    weeks: [4, 12],
    scale: 2,
    deliverables: ["Optimised process", "Cost-down analysis", "Robustness data"],
    gate: "Target yield and cost achieved and shown to be robust.",
    inputs: ["Current process if any", "Cost target"],
  },
  analyt: {
    id: "analyt",
    name: "Analytical methods",
    phase: "develop",
    purpose: "Prove what you are shipping and to what spec.",
    weeks: [3, 8],
    scale: 2,
    deliverables: ["Validated analytical methods", "Specification sheet"],
    gate: "Methods validated and specification agreed.",
    inputs: ["Target specification", "Regulatory market"],
  },
  impurity: {
    id: "impurity",
    name: "Impurity and quality profiling",
    phase: "develop",
    purpose: "Identify and control impurities before they become a problem at scale.",
    weeks: [3, 8],
    scale: 2,
    deliverables: ["Impurity profile", "Control strategy"],
    gate: "Impurities identified and a control strategy in place.",
    inputs: ["Quality expectations"],
  },
  kilo: {
    id: "kilo",
    name: "Kilo-lab campaign",
    phase: "scale",
    purpose: "Make the first meaningful quantity and expose scale issues early.",
    weeks: [4, 10],
    scale: 3,
    deliverables: ["Kilo-scale batches", "Scale-up observations", "Updated costing"],
    gate: "Kilo batches meet spec with scale risks understood.",
    inputs: ["Approved process", "Quantity needed"],
  },
  pilot: {
    id: "pilot",
    name: "Pilot scale-up",
    phase: "scale",
    purpose: "Prove the process on plant-representative equipment.",
    weeks: [6, 14],
    scale: 4,
    deliverables: ["Pilot batches", "Process description", "Mass and energy balance"],
    gate: "Pilot batches consistent and ready for transfer.",
    inputs: ["Kilo results", "Volume forecast"],
  },
  valid: {
    id: "valid",
    name: "Validation batches",
    phase: "scale",
    purpose: "Run the registered batches a regulated filing requires.",
    weeks: [8, 16],
    scale: 4,
    deliverables: ["Validation batches", "Batch records", "Stability start"],
    gate: "Validation batches pass and stability is on programme.",
    inputs: ["Regulatory requirement", "Approved process"],
  },
  techtx: {
    id: "techtx",
    name: "Technology transfer",
    phase: "transfer",
    purpose: "Move the process into the selected manufacturing plant cleanly.",
    weeks: [4, 10],
    scale: 5,
    deliverables: ["Transfer package", "Plant trial batch", "Signed process"],
    gate: "Plant reproduces the process to specification.",
    inputs: ["Finalised process", "Plant selection"],
  },
  second: {
    id: "second",
    name: "Second-source qualification",
    phase: "transfer",
    purpose: "Qualify an alternate plant so one supplier is never a single point of failure.",
    weeks: [6, 14],
    scale: 5,
    deliverables: ["Qualified alternate source", "Comparability data"],
    gate: "Alternate source produces comparable material to specification.",
    inputs: ["Current specification", "Volumes to dual-source"],
  },
  reg: {
    id: "reg",
    name: "Regulatory support",
    phase: "supply",
    purpose: "Provide the documentation your filing or customer audit needs.",
    weeks: [6, 20],
    scale: 5,
    deliverables: ["DMF or dossier support", "Audit-ready documentation"],
    gate: "Documentation accepted by your regulatory or customer team.",
    inputs: ["Target market", "Filing type"],
  },
  comm: {
    id: "comm",
    name: "Commercial manufacturing",
    phase: "supply",
    purpose: "Produce at commercial scale to an agreed quality and cadence.",
    weeks: [8, 20],
    scale: 5,
    deliverables: ["Commercial batches", "Certificates of analysis"],
    gate: "Commercial batches delivered to specification on schedule.",
    inputs: ["Purchase forecast", "Delivery terms"],
  },
  supply: {
    id: "supply",
    name: "Ongoing supply",
    phase: "supply",
    purpose: "Keep material flowing reliably with continuity built in.",
    weeks: [0, 0],
    scale: 5,
    deliverables: ["Supply agreement", "Continuity and reliability plan"],
    gate: "Reliable supply against forecast with a continuity plan in place.",
    inputs: ["Annual volume", "Service expectations"],
  },
};

export type Archetype = {
  id: string;
  title: string;
  situation: string; // the buyer's problem, in their words
  stageIds: string[];
  keywords: string[]; // for the deterministic intent matcher
};

// Common CDMO situations, each composed from the stage library.
export const ARCHETYPES: Archetype[] = [
  {
    id: "derisk",
    title: "De-risk an existing supply",
    situation: "Our supplier is concentrated in one country and the board wants that de-risked.",
    stageIds: ["assess", "second", "techtx", "comm", "supply"],
    keywords: ["china", "de-risk", "derisk", "single source", "second source", "dual source", "supplier risk", "concentration", "tariff", "diversify"],
  },
  {
    id: "patent",
    title: "You hold a patent, no plant",
    situation: "We own the molecule or process but have no manufacturing of our own.",
    stageIds: ["assess", "labdev", "procopt", "analyt", "kilo", "pilot", "techtx", "comm", "supply"],
    keywords: ["patent", "own the molecule", "no plant", "no manufacturing", "license", "innovator", "our process"],
  },
  {
    id: "cost",
    title: "Bring the cost down",
    situation: "This molecule costs too much to make and we need it cheaper.",
    stageIds: ["assess", "procopt", "impurity", "kilo", "techtx", "supply"],
    keywords: ["cost", "too expensive", "cheaper", "margin", "cost down", "reduce cost", "yield"],
  },
  {
    id: "make",
    title: "Get a molecule made",
    situation: "We need this molecule made and do not have a route or a maker.",
    stageIds: ["assess", "route", "labdev", "procopt", "analyt", "impurity", "kilo", "pilot", "techtx", "comm", "supply"],
    keywords: ["make", "manufacture", "produce", "synthesise", "synthesize", "custom synthesis", "need it made", "from scratch", "new molecule"],
  },
  {
    id: "generic",
    title: "Generic API development",
    situation: "We want a generic API developed and filed for a regulated market.",
    stageIds: ["assess", "route", "labdev", "procopt", "analyt", "impurity", "kilo", "pilot", "valid", "reg", "techtx", "comm", "supply"],
    keywords: ["generic", "api", "dmf", "regulated", "filing", "usfda", "us fda", "ema", "dossier", "pharmaceutical"],
  },
  {
    id: "scaleup",
    title: "Scale up a lab process",
    situation: "We have a working lab process and need it scaled to commercial supply.",
    stageIds: ["assess", "kilo", "pilot", "techtx", "comm", "supply"],
    keywords: ["scale", "scale up", "scale-up", "lab process", "kilo", "pilot", "commercial", "tonne", "tonnage"],
  },
];

export const DEFAULT_ARCHETYPE = ARCHETYPES.find((a) => a.id === "make")!;

// Deterministic intent matcher: scores each archetype by keyword hits. Falls
// back to the "make a molecule" path when nothing matches.
export function matchArchetype(text: string): Archetype {
  const t = text.toLowerCase();
  let best = DEFAULT_ARCHETYPE;
  let bestScore = 0;
  for (const a of ARCHETYPES) {
    const score = a.keywords.reduce((n, kw) => (t.includes(kw) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

export type Milestone = {
  phase: Phase;
  label: string;
  weeks: [number, number];
  deliverables: string[];
  gate: string;
};

export type Pathway = {
  archetype: Archetype;
  stages: Stage[];
  milestones: Milestone[];
  weeks: [number, number];
  // Set when the pathway was tailored through the refine questions.
  refinements?: PathwayRefinements;
  product?: string;
};

// Derives phase milestones from an ordered stage list.
function deriveMilestones(stages: Stage[]): Milestone[] {
  const order: Phase[] = ["assess", "develop", "scale", "transfer", "supply"];
  const milestones: Milestone[] = [];
  for (const phase of order) {
    const inPhase = stages.filter((s) => s.phase === phase);
    if (inPhase.length === 0) continue;
    const low = inPhase.reduce((n, s) => n + s.weeks[0], 0);
    const high = inPhase.reduce((n, s) => n + s.weeks[1], 0);
    const deliverables = Array.from(new Set(inPhase.flatMap((s) => s.deliverables)));
    milestones.push({
      phase,
      label: PHASE_LABEL[phase],
      weeks: [low, high],
      deliverables,
      gate: inPhase[inPhase.length - 1].gate,
    });
  }
  return milestones;
}

function totalWeeks(milestones: Milestone[]): [number, number] {
  return [
    milestones.reduce((n, m) => n + m.weeks[0], 0),
    milestones.reduce((n, m) => n + m.weeks[1], 0),
  ];
}

// Composes an archetype into an ordered stage list and derived phase milestones.
export function buildPathway(archetype: Archetype): Pathway {
  const stages = archetype.stageIds.map((id) => STAGES[id]).filter(Boolean);
  const milestones = deriveMilestones(stages);
  return { archetype, stages, milestones, weeks: totalWeeks(milestones) };
}

// ---------------------------------------------------------------------------
// Refinements: the answers to the assistant's questions. Each one materially
// changes the pathway rather than decorating it. Stages the customer skips
// matter as much as the ones they run.
// ---------------------------------------------------------------------------

export type StartPoint = "idea" | "lab" | "validated" | "second";
export type EndPoint = "samples" | "commercial" | "regulated";
export type SpeedPref = "fast" | "balanced" | "certain";

export type PathwayRefinements = {
  start: StartPoint;
  goal: EndPoint;
  speed: SpeedPref;
};

// Stages already completed at each entry point.
const SKIP_BY_START: Record<StartPoint, Set<string>> = {
  idea: new Set(),
  lab: new Set(["route", "labdev"]),
  validated: new Set(["route", "labdev", "procopt", "impurity"]),
  second: new Set(["route", "labdev", "procopt", "impurity", "analyt", "kilo", "pilot", "valid"]),
};

// Stage order for inserting required stages in the right place.
const CANONICAL_ORDER = [
  "assess", "route", "labdev", "procopt", "analyt", "impurity",
  "kilo", "pilot", "valid", "techtx", "second", "reg", "comm", "supply",
];

// Speed preference scales the planning ranges: fast compresses through
// parallel work, certainty extends for extra confirmation runs.
const SPEED_FACTOR: Record<SpeedPref, number> = { fast: 0.75, balanced: 1, certain: 1.25 };

// Tailors an archetype's stages to the customer's answers, then rebuilds the
// milestones and timeline. Deterministic, so it works with no API key.
export function tailorPathway(
  archetype: Archetype,
  refinements: PathwayRefinements,
  product?: string,
): Pathway {
  let ids = [...archetype.stageIds];

  // Where you are today: remove work already done (never the assessment).
  ids = ids.filter((id) => id === "assess" || !SKIP_BY_START[refinements.start].has(id));

  // Where you want to finish.
  if (refinements.goal === "samples") {
    // Stop after the first meaningful quantity.
    const keep = new Set(["assess", "route", "labdev", "procopt", "analyt", "impurity", "kilo"]);
    ids = ids.filter((id) => keep.has(id));
    if (!ids.includes("kilo")) ids.push("kilo");
  } else if (refinements.goal === "commercial") {
    ids = ids.filter((id) => id !== "valid" && id !== "reg");
  } else {
    // Regulated filing: validation batches and regulatory support are required.
    for (const req of ["valid", "reg"]) if (!ids.includes(req)) ids.push(req);
  }

  // Restore canonical order and drop unknowns.
  ids = CANONICAL_ORDER.filter((id) => ids.includes(id));

  const factor = SPEED_FACTOR[refinements.speed];
  const stages: Stage[] = ids
    .map((id) => STAGES[id])
    .filter(Boolean)
    .map((s) => ({
      ...s,
      // Scale planning ranges; ongoing stages (0 weeks) stay ongoing.
      weeks: (s.weeks[1] === 0
        ? s.weeks
        : [Math.max(1, Math.round(s.weeks[0] * factor)), Math.max(1, Math.round(s.weeks[1] * factor))]) as [number, number],
    }));

  const milestones = deriveMilestones(stages);
  return { archetype, stages, milestones, weeks: totalWeeks(milestones), refinements, product };
}
