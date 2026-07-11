// Broad chemical classes and a molecular-complexity score, read from a
// molecule's PubChem structure (SMILES + formula + name). We report the broad
// classes the molecule belongs to (ester, amide, aromatic, organohalogen, ...)
// rather than naming individual reactions, and we score complexity so the
// development timeline reflects the actual molecule rather than a fixed template.
// The structure that drives all of this comes from PubChem, a verifiable source.

import type { ChemIdentity } from "@/lib/casResolve";

type Group = { key: string; label: string; test: (s: string, n: string) => boolean };

// Broad compound classes, most specific first, detected from the SMILES with the
// name as a secondary signal. Kekulé aromatic rings are handled so ring double
// bonds are not read as olefins.
const GROUPS: Group[] = [
  { key: "nitro", label: "Nitro compound", test: (s, n) => /\[N\+\]\(=O\)\[O-\]|N\(=O\)=O|\[N\+\]\(\[O-\]\)=O/.test(s) || /\bnitro/.test(n) },
  { key: "sulfon", label: "Sulfonic acid / sulfonate", test: (s, n) => /S\(=O\)\(=O\)/.test(s) || /sulfon|sulpho|sulfate|sulphate/.test(n) },
  { key: "phosphor", label: "Organophosphorus", test: (s, n) => /P\(=O\)|OP\(/.test(s) || /phosph/.test(n) },
  { key: "amide", label: "Amide", test: (s, n) => /C\(=O\)N/.test(s) || /NC\(=O\)/.test(s) || /amide\b/.test(n) },
  { key: "ester", label: "Ester", test: (s, n) => /C\(=O\)O[C\[c(]/.test(s) || /[cC)\]]OC\(=O\)/.test(s) || /\b\w+yl\s+\w+ate\b|(stearate|palmitate|oleate|laurate|acetate|benzoate|myristate|propionate|butyrate|oate)\b/.test(n) },
  { key: "nitrile", label: "Nitrile", test: (s, n) => /C#N/.test(s) || /nitrile\b|\bcyano/.test(n) },
  { key: "carboxyl", label: "Carboxylic acid", test: (s, n) => /C\(=O\)O(?![A-Za-z0-9=\[(])/.test(s) || /oic acid\b|carboxylic acid\b/.test(n) },
  { key: "ketone", label: "Ketone", test: (s, n) => /[Cc]C\(=O\)[Cc]/.test(s) || /\bone\b|ketone\b/.test(n) },
  { key: "aldehyde", label: "Aldehyde", test: (s, n) => /aldehyde\b/.test(n) || /C=O(?![A-Za-z0-9(\[=])/.test(s) },
  { key: "phenol", label: "Phenol", test: (_s, n) => /phenol|cresol|catechol|resorcinol/.test(n) },
  { key: "ether", label: "Ether", test: (s, n) => /[Cc]O[Cc]/.test(s) || /\bether\b|alkoxy|methoxy|ethoxy/.test(n) },
  { key: "halide", label: "Organohalogen", test: (s, n) => /Cl|Br|(^|[^A-Za-z])F([^a-z]|$)|(^|[^A-Za-z])I([^a-z]|$)/.test(s) || /chloride|bromide|fluoride|iodide|halo/.test(n) },
  { key: "unsat", label: "Unsaturated (alkene / alkyne)", test: (s, n) => /C#C/.test(s) || /\bene\b|\byne\b|olefin|vinyl|allyl|styren|acryl/.test(n) },
  { key: "amine", label: "Amine", test: (s, n) => /amine\b|\bamino/.test(n) || /N/.test(s) },
  { key: "alcohol", label: "Alcohol / polyol", test: (s, n) => /\bol\b|hydroxy|glycol|glyceryl|glycerol|alcohol|sorbitol|mannitol/.test(n) || /\[OH\]/.test(s) },
];

function isAromatic(s: string, n: string): boolean {
  const noRing = s.replace(/\d/g, "");
  return /c1|c2|c3|:cc/.test(s) || /C=CC=C/.test(noRing) || /benz|phenyl|phenol|anilin|toluene|xylene|styren|naphthal|aryl|aromatic/.test(n);
}

function isHeterocycle(s: string, n: string): boolean {
  return /pyridin|furan|thiophen|indol|imidazol|pyrrol|piperidin|piperazin|morpholin|quinolin|pyrimidin|triazol|oxazol|pyran/.test(n) || /[noNO]\d/.test(s);
}

// The broad chemical classes a molecule belongs to. Structure-first, so it works
// for any molecule PubChem resolves, in or out of our catalog.
export function chemicalClasses(identity: ChemIdentity | null, name: string): string[] {
  const s = identity?.smiles ?? "";
  const searchName = [identity?.name || name, name, identity?.iupac ?? "", ...(identity?.synonyms ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (!s && !searchName.trim()) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  const add = (label: string) => {
    if (!seen.has(label)) {
      seen.add(label);
      out.push(label);
    }
  };

  // A long-chain ester of a fatty acid gets the more specific class.
  const fatty = /stearate|palmitate|oleate|laurate|myristate|caprate|behenate|glyceryl/.test(searchName) || /C{10,}/.test(s.replace(/[^C]/g, "C"));

  for (const g of GROUPS) {
    if (g.test(s, searchName)) {
      if (g.key === "ester" && fatty) add("Fatty-acid ester");
      else add(g.label);
    }
    if (out.length >= 4) break;
  }
  if (isHeterocycle(s, searchName)) add("Heterocycle");
  else if (isAromatic(s, searchName)) add("Aromatic compound");

  if (out.length === 0) add("Organic compound");
  return out.slice(0, 5);
}

// A 0..1 molecular-complexity score from PubChem descriptors: number of distinct
// functional-group classes, molecular weight, ring count, and stereocentres.
// Higher means a longer, harder development, which the timeline reflects.
export function complexityScore(identity: ChemIdentity | null, name: string): number {
  const s = identity?.smiles ?? "";
  const mw = identity?.mw ? Number(identity.mw) : NaN;
  const classes = chemicalClasses(identity, name);

  const fg = Math.min(classes.length, 6) / 6; // functional diversity
  const weight = Number.isFinite(mw) ? Math.min(mw / 700, 1) : 0.4; // size
  const rings = Math.min((s.match(/\d/g)?.length ?? 0) / 2, 4) / 4; // ring closures (pairs)
  const stereo = Math.min((s.match(/@/g)?.length ?? 0), 4) / 4; // stereocentres

  const score = 0.34 * fg + 0.3 * weight + 0.2 * rings + 0.16 * stereo;
  return Math.max(0, Math.min(1, score));
}
