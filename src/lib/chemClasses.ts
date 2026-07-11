// Reads a molecule's chemistry from its PubChem structure (SMILES + name) and
// returns three things used across the feasibility flow:
//   - chemicalClasses: the broad compound classes it belongs to (Ester, Amine, ...)
//   - processChemistries: the broad process chemistries needed to MAKE it
//     (Halogenation, Nitration, Esterification, ...), which the manufacturer
//     match is then run against
//   - complexityScore: 0..1 difficulty, which scales the development timeline
// Everything derives from the PubChem structure, a verifiable source.

import type { ChemIdentity } from "@/lib/casResolve";

type Detector = { key: string; test: (s: string, n: string) => boolean };

// Functional groups detected from the SMILES (primary) and name (secondary).
// Kekulé aromatic rings are handled so ring double bonds are not read as olefins.
const DETECTORS: Detector[] = [
  { key: "nitro", test: (s, n) => /\[N\+\]\(=O\)\[O-\]|N\(=O\)=O|\[N\+\]\(\[O-\]\)=O/.test(s) || /\bnitro/.test(n) },
  { key: "sulfon", test: (s, n) => /S\(=O\)\(=O\)/.test(s) || /sulfon|sulpho|sulfate|sulphate/.test(n) },
  { key: "phosphor", test: (s, n) => /P\(=O\)|OP\(/.test(s) || /phosph/.test(n) },
  { key: "amide", test: (s, n) => /C\(=O\)N/.test(s) || /NC\(=O\)/.test(s) || /amide\b/.test(n) },
  { key: "ester", test: (s, n) => /C\(=O\)O[C\[c(]/.test(s) || /[cC)\]]OC\(=O\)/.test(s) || /\b\w+yl\s+\w+ate\b|(stearate|palmitate|oleate|laurate|acetate|benzoate|myristate|propionate|butyrate|oate)\b/.test(n) },
  { key: "nitrile", test: (s, n) => /C#N/.test(s) || /nitrile\b|\bcyano/.test(n) },
  { key: "carboxyl", test: (s, n) => /C\(=O\)O(?![A-Za-z0-9=\[(])/.test(s) || /oic acid\b|carboxylic acid\b/.test(n) },
  { key: "ketone", test: (s, n) => /[Cc]C\(=O\)[Cc]/.test(s) || /\bone\b|ketone\b/.test(n) },
  { key: "aldehyde", test: (s, n) => /aldehyde\b/.test(n) || /C=O(?![A-Za-z0-9(\[=])/.test(s) },
  { key: "ether", test: (s, n) => /[Cc]O[Cc]/.test(s) || /\bether\b|alkoxy|methoxy|ethoxy/.test(n) },
  { key: "halide", test: (s, n) => /Cl|Br|(^|[^A-Za-z])F([^a-z]|$)|(^|[^A-Za-z])I([^a-z]|$)/.test(s) || /chloride|bromide|fluoride|iodide|halo/.test(n) },
  { key: "unsat", test: (s, n) => /C#C/.test(s) || /\bene\b|\byne\b|olefin|vinyl|allyl|styren|acryl/.test(n) },
  // Amine only when a nitrogen remains after stripping nitro, nitrile and amide
  // nitrogens, so a nitro group is not misread as an amine.
  { key: "amine", test: (s, n) => /amine\b|\bamino/.test(n) || /N/.test(s.replace(/\[N\+\]\([^)]*\)\[O-\]|\[N\+\]\(\[O-\]\)=O|N\(=O\)=O/g, "").replace(/C#N/g, "").replace(/C\(=O\)N|NC\(=O\)/g, "")) },
  { key: "alcohol", test: (s, n) => /\bol\b|hydroxy|glycol|glyceryl|glycerol|alcohol|sorbitol|mannitol/.test(n) || /\[OH\]/.test(s) },
];

function isAromatic(s: string, n: string): boolean {
  const noRing = s.replace(/\d/g, "");
  return /c1|c2|c3|:cc/.test(s) || /C=CC=C/.test(noRing) || /benz|phenyl|phenol|anilin|toluene|xylene|styren|naphthal|aryl|aromatic/.test(n);
}

function isHeterocycle(s: string, n: string): boolean {
  return /pyridin|furan|thiophen|indol|imidazol|pyrrol|piperidin|piperazin|morpholin|quinolin|pyrimidin|triazol|oxazol|pyran/.test(n) || /[noNO]\d/.test(s);
}

// The set of functional-group keys present, plus ring flags. Shared by the class,
// process-chemistry and complexity readouts so they stay consistent.
function detect(identity: ChemIdentity | null, name: string): Set<string> {
  const s = identity?.smiles ?? "";
  const searchName = [identity?.name || name, name, identity?.iupac ?? "", ...(identity?.synonyms ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const keys = new Set<string>();
  if (!s && !searchName.trim()) return keys;
  for (const d of DETECTORS) if (d.test(s, searchName)) keys.add(d.key);
  if (isHeterocycle(s, searchName)) keys.add("heterocycle");
  else if (isAromatic(s, searchName)) keys.add("aromatic");
  if (/stearate|palmitate|oleate|laurate|myristate|caprate|behenate|glyceryl/.test(searchName)) keys.add("fatty");
  return keys;
}

// key -> broad compound class label (what the molecule IS).
const CLASS_LABEL: Record<string, string> = {
  nitro: "Nitro compound", sulfon: "Sulfonic acid / sulfonate", phosphor: "Organophosphorus",
  amide: "Amide", ester: "Ester", nitrile: "Nitrile", carboxyl: "Carboxylic acid",
  ketone: "Ketone", aldehyde: "Aldehyde", ether: "Ether", halide: "Organohalogen",
  unsat: "Unsaturated (alkene / alkyne)", amine: "Amine", alcohol: "Alcohol / polyol",
  heterocycle: "Heterocycle", aromatic: "Aromatic compound",
};

// key -> broad process chemistry needed to install that group (what it takes to
// MAKE it). These names are matched against manufacturer capability.
const PROCESS_LABEL: Record<string, string> = {
  nitro: "Nitration",
  sulfon: "Sulfonation",
  phosphor: "Phosphorylation",
  amide: "Amide coupling",
  ester: "Esterification",
  nitrile: "Cyanation",
  carboxyl: "Oxidation",
  ketone: "Oxidation",
  aldehyde: "Oxidation",
  ether: "Etherification",
  halide: "Halogenation",
  unsat: "Olefination / elimination",
  amine: "Amination",
  alcohol: "Catalytic hydrogenation",
  heterocycle: "Heterocycle formation",
  aromatic: "Friedel-Crafts / aromatic substitution",
};

// Priority so the most defining / specialised chemistries lead the list.
const PROCESS_ORDER = [
  "nitro", "sulfon", "halide", "nitrile", "phosphor", "amide", "ester",
  "amine", "alcohol", "ketone", "aldehyde", "carboxyl", "ether", "unsat",
  "heterocycle", "aromatic",
];

// The broad compound classes a molecule belongs to.
export function chemicalClasses(identity: ChemIdentity | null, name: string): string[] {
  const keys = detect(identity, name);
  if (keys.size === 0) return ["Organic compound"];
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (l: string) => { if (!seen.has(l)) { seen.add(l); out.push(l); } };
  if (keys.has("ester") && keys.has("fatty")) add("Fatty-acid ester");
  for (const d of DETECTORS) if (keys.has(d.key) && !(d.key === "ester" && keys.has("fatty"))) add(CLASS_LABEL[d.key]);
  if (keys.has("heterocycle")) add("Heterocycle");
  else if (keys.has("aromatic")) add("Aromatic compound");
  return out.slice(0, 5);
}

// The broad process chemistries needed to manufacture the molecule. This is what
// the manufacturer capability match is run against.
export function processChemistries(identity: ChemIdentity | null, name: string): string[] {
  const keys = detect(identity, name);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const key of PROCESS_ORDER) {
    if (!keys.has(key)) continue;
    const label = PROCESS_LABEL[key];
    if (label && !seen.has(label)) { seen.add(label); out.push(label); }
  }
  // Nitro groups are usually installed then reduced to the amine, so surface the
  // hydrogenation step that pairs with a nitro/amine combination.
  if (keys.has("nitro") && keys.has("amine") && !seen.has("Catalytic hydrogenation")) {
    out.push("Catalytic hydrogenation");
  }
  if (out.length === 0) out.push("Multistep organic synthesis");
  return out.slice(0, 5);
}

// A 0..1 molecular-complexity score from PubChem descriptors: number of distinct
// functional groups, molecular weight, ring count and stereocentres. Higher means
// a longer, harder development, which the timeline reflects.
export function complexityScore(identity: ChemIdentity | null, name: string): number {
  const s = identity?.smiles ?? "";
  const mw = identity?.mw ? Number(identity.mw) : NaN;
  const groups = detect(identity, name).size;

  const fg = Math.min(groups, 6) / 6;
  const weight = Number.isFinite(mw) ? Math.min(mw / 700, 1) : 0.4;
  const rings = Math.min((s.match(/\d/g)?.length ?? 0) / 2, 4) / 4;
  const stereo = Math.min((s.match(/@/g)?.length ?? 0), 4) / 4;

  const score = 0.34 * fg + 0.3 * weight + 0.2 * rings + 0.16 * stereo;
  return Math.max(0, Math.min(1, score));
}
