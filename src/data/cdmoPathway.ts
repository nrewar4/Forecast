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

// A single reason the timeline is what it is for this molecule, tied to the
// evidence it came from, so the projection is transparent, not a fixed template.
export type TimelineDriver = {
  label: string; // what about the molecule drives it
  effect: string; // what it does to the timeline
  source: string; // where the evidence came from
};

export type Pathway = {
  archetype: Archetype;
  stages: Stage[];
  milestones: Milestone[];
  weeks: [number, number];
  /** the molecule-specific reasons behind the durations, shown to the customer */
  drivers?: TimelineDriver[];
};

export type Urgency = "fast" | "balanced" | "certainty";

// How the customer wants to trade speed against assurance. Fast compresses and
// parallelises; certainty extends and adds the validation work that de-risks a
// regulated launch.
export const URGENCY_META: Record<Urgency, { label: string; factor: number; note: string }> = {
  fast: { label: "Fast", factor: 0.78, note: "Compressed and parallelised to first delivery." },
  balanced: { label: "Balanced", factor: 1, note: "Standard staging of development and scale-up." },
  certainty: { label: "Certainty", factor: 1.22, note: "Extra validation and de-risking for a regulated launch." },
};

export type PathwayOptions = {
  /** phase the customer starts at (earlier phases are trimmed) */
  startPhase?: Phase;
  /** phase the customer exits at (later phases are trimmed) */
  endPhase?: Phase;
  /** a regulated filing is required (keeps validation batches) */
  regulated?: boolean;
  /** speed vs assurance preference; scales the timeline */
  urgency?: Urgency;
  /** 0..1 molecular complexity (from PubChem); scales development duration */
  complexity?: number;
  /** per-phase multipliers (evidence-driven); overrides the flat complexity scale */
  phaseFactors?: Partial<Record<Phase, number>>;
  /** the molecule-specific reasons to attach to the returned pathway */
  drivers?: TimelineDriver[];
};

function phaseIndex(p: Phase): number {
  return PHASE_ORDER.indexOf(p);
}

function scaleWeeks(w: [number, number], factor: number): [number, number] {
  return [Math.max(1, Math.round(w[0] * factor)), Math.max(2, Math.round(w[1] * factor))];
}

// Composes a pathway from an archetype, trimming stages outside the customer's
// start and end phases and dropping validation work when no filing is needed.
export function buildPathway(archetypeId: string, opts: PathwayOptions = {}): Pathway | null {
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId);
  if (!archetype) return null;

  const startIdx = opts.startPhase ? phaseIndex(opts.startPhase) : 0;
  const endIdx = opts.endPhase ? phaseIndex(opts.endPhase) : PHASE_ORDER.length - 1;
  const urgencyFactor = opts.urgency ? URGENCY_META[opts.urgency].factor : 1;
  // Molecular complexity (0..1) scales development duration from about 0.85x for
  // a simple molecule to about 1.35x for a complex, multi-stereocentre one.
  const complexityFactor =
    opts.complexity != null ? 0.85 + Math.max(0, Math.min(1, opts.complexity)) * 0.5 : 1;
  const factor = urgencyFactor * complexityFactor;
  // Certainty implies a regulated, validated launch unless told otherwise.
  const regulated = opts.regulated ?? opts.urgency === "certainty";

  const stages = archetype.stageIds
    .map((id) => STAGES[id])
    .filter((s): s is Stage => Boolean(s))
    .filter((s) => {
      const idx = phaseIndex(s.phase);
      if (idx < startIdx || idx > endIdx) return false;
      if (!regulated && s.id === "valid") return false;
      return true;
    })
    .map((s) => {
      // Per-phase evidence-driven factor when supplied, otherwise the flat factor.
      const perPhase = opts.phaseFactors?.[s.phase];
      const f = perPhase != null ? perPhase : factor;
      return f === 1 ? s : { ...s, weeks: scaleWeeks(s.weeks, f) };
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

  return { archetype, stages, milestones, weeks, drivers: opts.drivers };
}

// The measured facts about a molecule that drive its development timeline. All
// come from data the feasibility step already fetched, so the projection is a
// transparent function of the molecule, not a fixed template.
export type ProductTimelineInputs = {
  isPharma: boolean;
  urgency?: Urgency;
  complexity: number; // 0..1, from PubChem structure
  chemistries: string[]; // process chemistries needed to make it
  hazardous: boolean; // GHS-classified hazardous, or a hazardous chemistry
  hazardClasses: string[]; // GHS pictogram classes
  patentRange: [number, number] | null; // cross-verified patent filing count
  patentSources: number; // how many databases the range was checked against
};

// Genuinely hazardous chemistries that need dedicated containment and add
// scale-up time (nitration, cyanation, etc.). Common steps like catalytic
// hydrogenation need special plant but are not flagged hazardous here.
const HAZARDOUS_CHEM = /nitration|cyanation|sulfonation|halogenation|carbonylation/i;

// Builds a milestone projection for making a specific product. Each development
// phase is scaled by evidence-driven factors, and the reasons are returned as
// drivers so the customer sees why the timeline is what it is. A pharma API
// takes the generic-API archetype (validation matters); everything else takes
// specialty custom synthesis.
export function productPathway(inputs: ProductTimelineInputs): Pathway {
  const { isPharma, urgency = "balanced", chemistries, hazardClasses, patentRange, patentSources } = inputs;
  const u = URGENCY_META[urgency].factor;
  const cx = Math.max(0, Math.min(1, inputs.complexity));

  // Per-phase multipliers, each starting from the urgency factor.
  const f: Record<Phase, number> = { assess: u, develop: u, scale: u, transfer: u, supply: u };
  const drivers: TimelineDriver[] = [];

  // 1. Molecular complexity (PubChem structure) drives development and scale-up.
  f.develop *= 0.8 + cx * 0.6;
  f.scale *= 0.85 + cx * 0.4;
  drivers.push({
    label: `Molecular complexity ${Math.round(cx * 100)} percent (functional groups, mass, rings, stereochemistry)`,
    effect: cx >= 0.5 ? "longer route development and scale-up" : "shorter, simpler development",
    source: "PubChem structure",
  });

  // 2. Number of distinct process chemistries to integrate drives development.
  const nChem = chemistries.length;
  if (nChem > 1) {
    f.develop *= 1 + (nChem - 1) * 0.15;
    drivers.push({
      label: `${nChem} process chemistries to integrate (${chemistries.join(", ").toLowerCase()})`,
      effect: "more route scouting and process development",
      source: "derived from the structure",
    });
  }

  // 3. Hazardous chemistry / GHS classification adds containment and scale-up.
  const hazChem = chemistries.filter((c) => HAZARDOUS_CHEM.test(c));
  if (inputs.hazardous || hazChem.length > 0) {
    f.assess *= 1.1;
    f.develop *= 1.1;
    f.scale *= 1.25;
    const why = [hazChem.join(", ").toLowerCase(), hazardClasses.length ? `GHS ${hazardClasses.join(", ").toLowerCase()}` : ""]
      .filter(Boolean)
      .join("; ");
    drivers.push({
      label: `Hazardous chemistry${why ? ` (${why})` : ""}`,
      effect: "added safety review, containment and scale-up time",
      source: hazardClasses.length ? "PubChem GHS classification" : "required chemistry",
    });
  }

  // 4. Patent landscape (cross-verified) drives freedom-to-operate and route design.
  if (patentRange) {
    const hi = patentRange[1];
    const cite = `cross-verified, ${patentSources} database${patentSources === 1 ? "" : "s"}`;
    if (hi === 0) {
      f.assess *= 0.9;
      drivers.push({ label: "No patents indexed", effect: "public-domain route, faster scouting", source: cite });
    } else if (hi >= 25) {
      f.assess *= 1.3;
      f.develop *= 1.15;
      drivers.push({
        label: `Dense patent landscape (${patentRange[0]} to ${patentRange[1]} filings)`,
        effect: "freedom-to-operate review and a non-infringing route",
        source: cite,
      });
    } else {
      f.assess *= 1.1;
      drivers.push({
        label: `Some patent activity (${patentRange[0]} to ${patentRange[1]} filings)`,
        effect: "a freedom-to-operate check",
        source: cite,
      });
    }
  }

  // 5. Regulated API keeps validation batches and filing support.
  const regulated = isPharma || urgency === "certainty";
  if (isPharma) {
    f.supply *= 1.1;
    drivers.push({ label: "Regulated API", effect: "validation batches and regulatory filing support", source: "APAC classification" });
  }

  const id = isPharma ? "generic-api" : "specialty";
  return buildPathway(id, { urgency, regulated, phaseFactors: f, drivers })!;
}
