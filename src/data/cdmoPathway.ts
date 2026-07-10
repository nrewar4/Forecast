// A compact, APAC-framed rebuild of the "problem in, path out" CDMO model. A
// customer describes their situation; we return a development pathway made of
// reusable stage definitions grouped into five milestone phases. This is a lead
// magnet: it gives a procurement lead a concrete, shareable plan and ends in an
// APAC enquiry. Durations are indicative planning ranges, confirmed at feasibility.

export type Phase = "assess" | "develop" | "scale" | "transfer" | "supply";

export type Stage = {
  id: string;
  title: string;
  phase: Phase;
  /** one line, in the customer's language */
  purpose: string;
  /** indicative planning range in weeks */
  weeks: [number, number];
  /** what the customer receives */
  deliverables: string[];
  /** the written criterion for releasing the next milestone */
  gate: string;
};

// The reusable stage library. Archetypes below compose these by id, so content
// is maintained once.
export const STAGES: Record<string, Stage> = {
  assess: {
    id: "assess",
    title: "Feasibility assessment",
    phase: "assess",
    purpose: "Confirm the molecule can be made economically on our network.",
    weeks: [2, 4],
    deliverables: ["Feasibility memo", "Indicative cost of goods", "Risk and hazard read"],
    gate: "Go / no-go on technical and commercial feasibility.",
  },
  route: {
    id: "route",
    title: "Route scouting",
    phase: "develop",
    purpose: "Find viable, freedom-to-operate-aware routes to the target.",
    weeks: [3, 6],
    deliverables: ["Ranked candidate routes", "Patent-sensitivity read", "Preferred route rationale"],
    gate: "A preferred route selected with the customer.",
  },
  labdev: {
    id: "labdev",
    title: "Lab development",
    phase: "develop",
    purpose: "Demonstrate the chosen route at gram scale.",
    weeks: [4, 8],
    deliverables: ["Reproducible lab procedure", "Reference sample", "Impurity profile"],
    gate: "Target quality met at lab scale.",
  },
  procopt: {
    id: "procopt",
    title: "Process optimization",
    phase: "develop",
    purpose: "Lift yield and cut cost, solvent load and cycle time.",
    weeks: [4, 10],
    deliverables: ["Optimized process", "Cost-of-goods update", "Green-chemistry metrics"],
    gate: "Process meets the target cost and quality.",
  },
  analyt: {
    id: "analyt",
    title: "Analytical method",
    phase: "develop",
    purpose: "Develop and validate the methods that release the product.",
    weeks: [3, 6],
    deliverables: ["Validated analytical methods", "Specification sheet"],
    gate: "Methods validated and specification agreed.",
  },
  kilo: {
    id: "kilo",
    title: "Kilo-lab campaign",
    phase: "scale",
    purpose: "Make the first kilograms and confirm the process holds.",
    weeks: [4, 8],
    deliverables: ["Kilo-scale batches", "Batch records", "Scale-up risk assessment"],
    gate: "Quality reproduced at kilo scale.",
  },
  pilot: {
    id: "pilot",
    title: "Pilot campaign",
    phase: "scale",
    purpose: "Validate the process on pilot plant trains.",
    weeks: [6, 12],
    deliverables: ["Pilot batches", "Process validation data", "Scale-up dossier"],
    gate: "Process validated for commercial transfer.",
  },
  techtx: {
    id: "techtx",
    title: "Tech transfer",
    phase: "transfer",
    purpose: "Move the complete process package to the matched plant.",
    weeks: [4, 8],
    deliverables: ["Tech-transfer package", "Plant fit assessment", "First plant batches"],
    gate: "Receiving plant reproduces the process.",
  },
  valid: {
    id: "valid",
    title: "Validation batches",
    phase: "transfer",
    purpose: "Run the registered batches a regulated filing needs.",
    weeks: [6, 14],
    deliverables: ["Validation batches", "Stability data", "Regulatory support package (DMF/CEP)"],
    gate: "Validation complete and dossier ready.",
  },
  supply: {
    id: "supply",
    title: "Commercial supply",
    phase: "supply",
    purpose: "Reliable, repeatable manufacturing and export.",
    weeks: [4, 8],
    deliverables: ["Supply agreement", "Commercial batches", "Export and logistics handling"],
    gate: "Ongoing supply against the agreed forecast.",
  },
};

export const PHASE_LABEL: Record<Phase, string> = {
  assess: "Assess",
  develop: "Develop",
  scale: "Scale",
  transfer: "Transfer",
  supply: "Supply",
};

const PHASE_ORDER: Phase[] = ["assess", "develop", "scale", "transfer", "supply"];

export type Archetype = {
  id: string;
  title: string;
  /** the situation this pathway answers, in the customer's words */
  situation: string;
  /** composed stage ids, in order */
  stageIds: string[];
  /** how the engagement is typically priced */
  model: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "generic-api",
    title: "Generic API development",
    situation: "The patent has expired and we want a second, reliable source.",
    stageIds: ["assess", "route", "labdev", "procopt", "analyt", "kilo", "pilot", "techtx", "valid", "supply"],
    model: "Milestone-based development, then cost-plus commercial supply.",
  },
  {
    id: "alt-process",
    title: "Alternate non-infringing process",
    situation: "The molecule is protected and we need a different way to make it.",
    stageIds: ["assess", "route", "labdev", "procopt", "analyt", "kilo", "pilot", "techtx", "supply"],
    model: "FTE or milestone development; conversion fee on supply.",
  },
  {
    id: "specialty",
    title: "Specialty custom synthesis",
    situation: "We need a specialty molecule or intermediate made to spec.",
    stageIds: ["assess", "route", "labdev", "procopt", "kilo", "pilot", "supply"],
    model: "Milestone development, then conversion-fee supply.",
  },
  {
    id: "scale-up",
    title: "Scale-up and second source",
    situation: "We already have a working lab process and need it scaled and supplied.",
    stageIds: ["assess", "procopt", "kilo", "pilot", "techtx", "supply"],
    model: "Tech-transfer fee, then cost-plus or tolling supply.",
  },
  {
    id: "de-risk",
    title: "China-plus-one de-risking",
    situation: "Our supply sits in a single region and the board wants it diversified.",
    stageIds: ["assess", "techtx", "valid", "supply"],
    model: "Qualification project, then dual-source supply agreement.",
  },
];

export type Milestone = {
  phase: Phase;
  label: string;
  stages: Stage[];
  weeks: [number, number];
  deliverables: string[];
  gate: string;
};

export type Pathway = {
  archetype: Archetype;
  stages: Stage[];
  milestones: Milestone[];
  weeks: [number, number];
};

export type PathwayOptions = {
  /** phase the customer starts at (earlier phases are trimmed) */
  startPhase?: Phase;
  /** phase the customer exits at (later phases are trimmed) */
  endPhase?: Phase;
  /** a regulated filing is required (keeps validation batches) */
  regulated?: boolean;
};

function phaseIndex(p: Phase): number {
  return PHASE_ORDER.indexOf(p);
}

// Composes a pathway from an archetype, trimming stages outside the customer's
// start and end phases and dropping validation work when no filing is needed.
export function buildPathway(archetypeId: string, opts: PathwayOptions = {}): Pathway | null {
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId);
  if (!archetype) return null;

  const startIdx = opts.startPhase ? phaseIndex(opts.startPhase) : 0;
  const endIdx = opts.endPhase ? phaseIndex(opts.endPhase) : PHASE_ORDER.length - 1;

  const stages = archetype.stageIds
    .map((id) => STAGES[id])
    .filter((s): s is Stage => Boolean(s))
    .filter((s) => {
      const idx = phaseIndex(s.phase);
      if (idx < startIdx || idx > endIdx) return false;
      if (opts.regulated === false && s.id === "valid") return false;
      return true;
    });

  // Group into milestones by phase, in phase order.
  const milestones: Milestone[] = [];
  for (const phase of PHASE_ORDER) {
    const inPhase = stages.filter((s) => s.phase === phase);
    if (inPhase.length === 0) continue;
    const lo = inPhase.reduce((a, s) => a + s.weeks[0], 0);
    const hi = inPhase.reduce((a, s) => a + s.weeks[1], 0);
    const deliverables = Array.from(new Set(inPhase.flatMap((s) => s.deliverables)));
    milestones.push({
      phase,
      label: PHASE_LABEL[phase],
      stages: inPhase,
      weeks: [lo, hi],
      deliverables,
      gate: inPhase[inPhase.length - 1].gate,
    });
  }

  const weeks: [number, number] = [
    milestones.reduce((a, m) => a + m.weeks[0], 0),
    milestones.reduce((a, m) => a + m.weeks[1], 0),
  ];

  return { archetype, stages, milestones, weeks };
}
