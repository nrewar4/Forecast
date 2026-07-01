// Single source of truth for the MAI framework: pillars, indicators, weights,
// directionality, and the real public data sources behind each indicator.
// Scores shown in the deck are illustrative; the sources named here are real.

export type Direction = "positive" | "negative";

export interface Indicator {
  code: string;
  name: string;
  pillar: string;
  weight: number; // within-pillar weight (sums to 1 per pillar)
  direction: Direction;
  source: string;
  year: string;
  granularity: string;
}

export interface Pillar {
  id: string;
  no: number;
  name: string;
  short: string;
  weight: number; // cross-pillar weight (sums to 1.00)
  question: string;
  indicators: Indicator[];
}

// Cross-pillar weights derived from PCA + entropy + AHP reconciliation (illustrative).
export const PILLARS: Pillar[] = [
  {
    id: "demand",
    no: 1,
    name: "Disease Burden & Demand",
    short: "Demand",
    weight: 0.24,
    question: "How much therapeutic need exists to be served?",
    indicators: [
      { code: "D1", name: "Chronic disease prevalence (diabetes, CVD, respiratory)", pillar: "demand", weight: 0.30, direction: "positive", source: "NFHS-5", year: "2019-21", granularity: "District" },
      { code: "D2", name: "Population aged 45+ (share)", pillar: "demand", weight: 0.22, direction: "positive", source: "Census / SRS projections", year: "2011 / 2024", granularity: "District" },
      { code: "D3", name: "Inpatient + outpatient load per 1k", pillar: "demand", weight: 0.20, direction: "positive", source: "HMIS (MoHFW)", year: "2023-24", granularity: "District" },
      { code: "D4", name: "Communicable disease incidence", pillar: "demand", weight: 0.15, direction: "positive", source: "IDSP / NCDC", year: "2023", granularity: "District" },
      { code: "D5", name: "Total population (addressable base)", pillar: "demand", weight: 0.13, direction: "positive", source: "Census / UIDAI proj.", year: "2024", granularity: "District" },
    ],
  },
  {
    id: "afford",
    no: 2,
    name: "Purchasing Power & Affordability",
    short: "Affordability",
    weight: 0.21,
    question: "Can the population pay for branded and prescription therapy?",
    indicators: [
      { code: "A1", name: "District domestic product per capita", pillar: "afford", weight: 0.32, direction: "positive", source: "State DES / District GDP", year: "2022-23", granularity: "District" },
      { code: "A2", name: "Health insurance / PMJAY coverage", pillar: "afford", weight: 0.24, direction: "positive", source: "NHA (PMJAY), NFHS-5", year: "2023", granularity: "District" },
      { code: "A3", name: "Monthly per-capita consumption exp.", pillar: "afford", weight: 0.22, direction: "positive", source: "HCES (MoSPI)", year: "2022-23", granularity: "District/NSS region" },
      { code: "A4", name: "Formal-sector employment share", pillar: "afford", weight: 0.12, direction: "positive", source: "EPFO / PLFS", year: "2023-24", granularity: "District/State" },
      { code: "A5", name: "Out-of-pocket health spend capacity", pillar: "afford", weight: 0.10, direction: "positive", source: "NSSO Health Round", year: "2017-18", granularity: "NSS region" },
    ],
  },
  {
    id: "access",
    no: 3,
    name: "Healthcare Access & Infrastructure",
    short: "Access",
    weight: 0.20,
    question: "Can prescribers and facilities convert need into scripts?",
    indicators: [
      { code: "H1", name: "Registered doctors per 10k population", pillar: "access", weight: 0.28, direction: "positive", source: "NMC / State registries", year: "2023", granularity: "District" },
      { code: "H2", name: "Hospital beds per 10k population", pillar: "access", weight: 0.24, direction: "positive", source: "RHS, HMIS, NIN", year: "2023", granularity: "District" },
      { code: "H3", name: "PHC / CHC / sub-centre density", pillar: "access", weight: 0.20, direction: "positive", source: "Rural Health Statistics", year: "2022-23", granularity: "District" },
      { code: "H4", name: "Specialist & super-specialist footprint", pillar: "access", weight: 0.16, direction: "positive", source: "Practo/IMA panels (proxy)", year: "2024", granularity: "District" },
      { code: "H5", name: "Diagnostic-lab density", pillar: "access", weight: 0.12, direction: "positive", source: "NABL directory", year: "2024", granularity: "District" },
    ],
  },
  {
    id: "distrib",
    no: 4,
    name: "Medicine Distribution & Retail",
    short: "Distribution",
    weight: 0.15,
    question: "Can product physically reach the patient?",
    indicators: [
      { code: "R1", name: "Retail pharmacy density per 10k", pillar: "distrib", weight: 0.34, direction: "positive", source: "State Drug Control / AIOCD", year: "2024", granularity: "District" },
      { code: "R2", name: "Stockist & C&F presence", pillar: "distrib", weight: 0.26, direction: "positive", source: "AIOCD-AWACS (proxy)", year: "2024", granularity: "District" },
      { code: "R3", name: "e-Pharmacy serviceability", pillar: "distrib", weight: 0.22, direction: "positive", source: "Platform pincode coverage", year: "2024", granularity: "Pincode -> District" },
      { code: "R4", name: "Cold-chain / logistics reach", pillar: "distrib", weight: 0.18, direction: "positive", source: "CDSCO, logistics indices", year: "2023", granularity: "District" },
    ],
  },
  {
    id: "white",
    no: 5,
    name: "Competitive Whitespace",
    short: "Whitespace",
    weight: 0.12,
    question: "How under-served is the district relative to its potential?",
    indicators: [
      { code: "W1", name: "Existing pharma sales saturation (inverse)", pillar: "white", weight: 0.46, direction: "negative", source: "AIOCD-AWACS retail audit (proxy)", year: "2024", granularity: "District" },
      { code: "W2", name: "Med-rep coverage intensity (inverse)", pillar: "white", weight: 0.30, direction: "negative", source: "Field-force benchmarks", year: "2024", granularity: "District" },
      { code: "W3", name: "Per-capita script gap vs peers", pillar: "white", weight: 0.24, direction: "positive", source: "Derived (demand vs sales)", year: "2024", granularity: "District" },
    ],
  },
  {
    id: "growth",
    no: 6,
    name: "Growth Momentum",
    short: "Growth",
    weight: 0.08,
    question: "How fast is the opportunity compounding?",
    indicators: [
      { code: "G1", name: "Urbanization rate (delta)", pillar: "growth", weight: 0.34, direction: "positive", source: "Census, town projections", year: "2011-24", granularity: "District" },
      { code: "G2", name: "District income CAGR", pillar: "growth", weight: 0.34, direction: "positive", source: "State DES time series", year: "2018-23", granularity: "District" },
      { code: "G3", name: "Population growth rate", pillar: "growth", weight: 0.18, direction: "positive", source: "SRS / projections", year: "2011-24", granularity: "District" },
      { code: "G4", name: "New-facility & construction permits", pillar: "growth", weight: 0.14, direction: "positive", source: "ULB / state records (proxy)", year: "2023", granularity: "District" },
    ],
  },
];

export const ALL_INDICATORS: Indicator[] = PILLARS.flatMap((p) => p.indicators);

export const PILLAR_IDS = PILLARS.map((p) => p.id);

// Tier definitions applied to the 0-100 composite score.
export interface Tier {
  id: number;
  name: string;
  range: [number, number];
  play: string;
}
export const TIERS: Tier[] = [
  { id: 1, name: "Priority", range: [64, 100], play: "Full field force, launch first, own the district" },
  { id: 2, name: "Grow", range: [57, 64], play: "Scale coverage, targeted expansion" },
  { id: 3, name: "Build", range: [50, 57], play: "Selective reps + digital detailing" },
  { id: 4, name: "Seed", range: [43, 50], play: "Distributor-led, low-cost digital only" },
  { id: 5, name: "Watch", range: [0, 43], play: "Monitor, revisit at next refresh" },
];

export function tierForScore(score: number): Tier {
  return TIERS.find((t) => score >= t.range[0]) ?? TIERS[TIERS.length - 1];
}

// Reconciled cross-pillar weighting sources (illustrative shares that blend into final weight).
export const WEIGHTING_METHODS = [
  { id: "pca", name: "PCA", detail: "Objective variance-based loadings", share: 0.4 },
  { id: "entropy", name: "Entropy", detail: "Information dispersion of each indicator", share: 0.3 },
  { id: "ahp", name: "AHP", detail: "Expert pairwise commercial judgement", share: 0.3 },
];
