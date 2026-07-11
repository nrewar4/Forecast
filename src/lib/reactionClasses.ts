// Deterministic "core chemistry" from a molecule's functional groups. When a
// molecule is not in our verified catalog and no LLM key is set, we still want
// the feasibility card to show real, honest chemistry rather than a placeholder.
//
// This reads the functional groups present (from the PubChem SMILES, with the
// chemical name as a strong secondary signal) and maps them to the broad
// industrial reaction classes that install those groups: esterification,
// amidation, nitration, sulfonation, reductive amination, elimination,
// ozonolysis, and so on. It is framed as indicative, not a validated route.

import type { ChemIdentity } from "@/lib/casResolve";
import type { CoreChemistry } from "@/lib/chatAssistant";

type Detected = {
  key: string;
  label: string; // chip shown to the user
  headline: string;
  classes: string[]; // named reaction classes for this group
  steps: string[]; // broad route steps
  inputs: string[]; // typical starting materials
  hazard: string;
  priority: number; // higher = more defining of how the molecule is made
};

// Common ester acid/alcohol halves, inferred from the name of an "-yl -ate"
// ester so the starting materials are specific where we can be specific.
const ACID_FROM_ATE: Record<string, string> = {
  stearate: "stearic acid",
  palmitate: "palmitic acid",
  oleate: "oleic acid",
  laurate: "lauric acid",
  myristate: "myristic acid",
  acetate: "acetic acid",
  propionate: "propionic acid",
  butyrate: "butyric acid",
  benzoate: "benzoic acid",
  salicylate: "salicylic acid",
  citrate: "citric acid",
  lactate: "lactic acid",
  formate: "formic acid",
  adipate: "adipic acid",
  phthalate: "phthalic anhydride",
  gluconate: "gluconic acid",
};
const ALCOHOL_FROM_YL: Record<string, string> = {
  glyceryl: "glycerol",
  methyl: "methanol",
  ethyl: "ethanol",
  propyl: "propanol",
  isopropyl: "isopropanol",
  butyl: "butanol",
  cetyl: "cetyl alcohol",
  stearyl: "stearyl alcohol",
  benzyl: "benzyl alcohol",
  sorbitan: "sorbitol",
  polyglyceryl: "polyglycerol",
};

function esterInputs(name: string): string[] {
  const t = name.toLowerCase();
  const acid = Object.keys(ACID_FROM_ATE).find((k) => t.includes(k));
  const alc = Object.keys(ALCOHOL_FROM_YL).find((k) => t.includes(k));
  const out: string[] = [];
  if (acid) out.push(ACID_FROM_ATE[acid]);
  else out.push("carboxylic acid feedstock");
  if (alc) out.push(ALCOHOL_FROM_YL[alc]);
  else out.push("alcohol / polyol");
  return out;
}

// Reads the functional groups present. SMILES is the primary signal; the name is
// a strong secondary one (e.g. "-ate" ester, "-amine", "nitro-", "-sulfonic").
function detectGroups(smiles: string, name: string, formula: string): Detected[] {
  const s = smiles || "";
  const n = name.toLowerCase();
  const f = formula || "";
  const found: Detected[] = [];

  // Ring-closure digits stripped so a Kekulé benzene (C1=CC=CC=C1) reads as a
  // conjugated C=CC=C pattern for aromatic detection.
  const sNoRing = s.replace(/\d/g, "");
  const aromatic =
    /c1|c2|c3|:cc/.test(s) ||
    /C=CC=C/.test(sNoRing) ||
    /benz|phenyl|phenol|anilin|toluene|xylene|styren|naphthal|pyridin|indol|furan|thiophen|aryl|aromatic/.test(n);

  const esterLinkage = /C\(=O\)O[C\[c(]/.test(s) || /[cC)\]]OC\(=O\)/.test(s);
  const isEsterName = /\b\w+yl\s+\w+ate\b/.test(n) || /(stearate|palmitate|oleate|laurate|acetate|benzoate|myristate|propionate|butyrate|oate)\b/.test(n);
  const amide = /C\(=O\)N/.test(s) || /NC\(=O\)/.test(s) || /amide\b/.test(n);
  const nitrile = /C#N/.test(s) || /nitrile\b|\bcyano/.test(n);
  const nitro = /\[N\+\]\(=O\)\[O-\]/.test(s) || /N\(=O\)=O/.test(s) || /\[N\+\]\(\[O-\]\)=O/.test(s) || /\bnitro/.test(n);
  const sulfonyl = /S\(=O\)\(=O\)/.test(s) || /sulfon|sulpho/.test(n);
  const sulfate = /OS\(=O\)\(=O\)O/.test(s) || /\bsulfate\b|\bsulphate\b/.test(n);
  // Carboxylic acid: a real -C(=O)OH, or an "-oic/-carboxylic acid" name. Do not
  // fire on "sulfonic acid", "phosphoric acid", etc.
  const carboxylic =
    (/C\(=O\)O(?![A-Za-z0-9=\[(])/.test(s) || /oic acid\b|carboxylic acid\b/.test(n)) && !esterLinkage;
  const aldehyde = /aldehyde\b|\banal\b/.test(n) || /C=O(?![A-Za-z0-9(\[=])/.test(s);
  const ketone = (/[Cc]C\(=O\)[Cc]/.test(s) || /\bone\b|ketone\b/.test(n)) && !amide && !carboxylic;
  const alkyne = /C#C/.test(s) || /\byne\b/.test(n);
  // Alkene from name, or a C=C in a molecule with no aromatic ring (so a Kekulé
  // benzene's ring double bonds are not mistaken for an olefin).
  const alkene = /\bene\b|olefin|vinyl|allyl|styren|acrylate|acryl/.test(n) || (/C=C/.test(s) && !aromatic);
  const halide = /Cl|Br|(^|[^A-Za-z])F([^a-z]|$)|(^|[^A-Za-z])I([^a-z]|$)/.test(s) || /chloride|bromide|fluoride|iodide|halo/.test(n);
  const ether = (/[Cc]O[Cc]/.test(s) && !esterLinkage) || /\bether\b|alkoxy|methoxy|ethoxy/.test(n);
  const alcohol = /\bol\b|hydroxy|glycol|glyceryl|glycerol|alcohol|phenol/.test(n) || /\[OH\]/.test(s);
  const amine = (/N/.test(s) && !amide && !nitrile && !nitro) || /amine\b|\bamino/.test(n);

  if (nitro)
    found.push({
      key: "nitro", label: "Nitration", priority: 95,
      headline: "Aromatic nitration",
      classes: ["Electrophilic aromatic substitution", "Nitration"],
      steps: [
        "Nitration of the aromatic feedstock with a mixed acid (HNO3 / H2SO4)",
        "Quench, phase separation and washing to remove spent acid",
        "Isolation and purification of the nitro product",
      ],
      inputs: ["aromatic feedstock", "nitric acid", "sulfuric acid"],
      hazard: "Highly exothermic; nitration and nitro compounds demand strict temperature control and dedicated containment.",
    });
  if (sulfonyl || sulfate)
    found.push({
      key: "sulfon", label: "Sulfonation", priority: 90,
      headline: sulfate ? "Sulfation" : "Sulfonation",
      classes: sulfate ? ["Sulfation"] : ["Sulfonation", "Electrophilic aromatic substitution"],
      steps: [
        `${sulfate ? "Sulfation" : "Sulfonation"} with SO3 / oleum or chlorosulfonic acid`,
        "Neutralization to the corresponding salt",
        "Drying and purification",
      ],
      inputs: ["organic feedstock", "SO3 / oleum or chlorosulfonic acid"],
      hazard: "Strongly acidic and exothermic; corrosion-resistant plant and careful heat management required.",
    });
  if (esterLinkage || isEsterName)
    found.push({
      key: "ester", label: "Esterification", priority: 80,
      headline: "Esterification / transesterification",
      classes: ["Esterification", "Fischer esterification", "Transesterification"],
      steps: [
        "Acid- or base-catalyzed esterification of the carboxylic acid and alcohol",
        "Continuous removal of water (or the displaced alcohol) to drive conversion",
        "Neutralization, washing and drying of the ester",
      ],
      inputs: esterInputs(name),
      hazard: "Multipurpose batch chemistry; confirm catalyst, water removal and containment class at feasibility.",
    });
  if (amide)
    found.push({
      key: "amide", label: "Amidation", priority: 78,
      headline: "Amide bond formation (acylation)",
      classes: ["Amidation", "Schotten-Baumann acylation", "Coupling"],
      steps: [
        "Activation of the carboxylic acid (acid chloride or coupling agent)",
        "Amide coupling with the amine under controlled pH",
        "Work-up and purification of the amide",
      ],
      inputs: ["carboxylic acid or acid chloride", "amine"],
      hazard: "Acyl chlorides and coupling reagents are moisture-sensitive and corrosive; handle under dry conditions.",
    });
  if (nitrile)
    found.push({
      key: "nitrile", label: "Cyanation", priority: 70,
      headline: "Nitrile formation",
      classes: ["Nucleophilic substitution (cyanation)", "Dehydration of amides"],
      steps: [
        "Cyanation via nucleophilic substitution, or dehydration of the corresponding amide",
        "Controlled work-up away from acid to avoid HCN release",
        "Distillation or crystallization of the nitrile",
      ],
      inputs: ["alkyl halide or amide", "cyanide source"],
      hazard: "Cyanide chemistry; dedicated containment and HCN monitoring are mandatory.",
    });
  if (ketone)
    found.push({
      key: "ketone", label: "Acylation / oxidation", priority: 62,
      headline: "Ketone formation",
      classes: ["Friedel-Crafts acylation", "Oxidation of secondary alcohol"],
      steps: [
        "Friedel-Crafts acylation, or selective oxidation of the secondary alcohol",
        "Catalyst removal and neutralization",
        "Purification of the ketone",
      ],
      inputs: ["arene or secondary alcohol", "acylating or oxidizing agent"],
      hazard: "Lewis-acid catalysts and oxidants require corrosion-resistant plant and careful quench.",
    });
  if (aldehyde && !carboxylic)
    found.push({
      key: "aldehyde", label: "Oxidation / ozonolysis", priority: 60,
      headline: "Aldehyde formation",
      classes: ["Selective oxidation", "Hydroformylation", "Ozonolysis"],
      steps: [
        "Selective oxidation of the primary alcohol, hydroformylation, or ozonolysis of an alkene",
        "Reductive or oxidative work-up as the route requires",
        "Distillation of the aldehyde under mild conditions",
      ],
      inputs: ["primary alcohol or alkene feedstock", "oxidant / ozone or syngas"],
      hazard: "Aldehydes are readily oxidized and often volatile; ozonolysis requires specialised ozone plant.",
    });
  if (carboxylic)
    found.push({
      key: "acid", label: "Oxidation / carbonylation", priority: 55,
      headline: "Carboxylic acid formation",
      classes: ["Oxidation", "Carbonylation", "Nitrile / ester hydrolysis"],
      steps: [
        "Oxidation of the alcohol/aldehyde, carbonylation, or hydrolysis of a nitrile or ester",
        "Acidification and phase separation",
        "Crystallization or distillation of the acid",
      ],
      inputs: ["hydrocarbon / alcohol feedstock", "oxidant or CO"],
      hazard: "Oxidation steps are exothermic; corrosive acids call for lined or alloy equipment.",
    });
  if (amine)
    found.push({
      key: "amine", label: "Amination", priority: 52,
      headline: "Amine formation",
      classes: ["Reductive amination", "Nitro reduction", "Nucleophilic substitution"],
      steps: [
        "Reductive amination, reduction of a nitro group, or nucleophilic substitution",
        "Salt formation or free-basing as needed",
        "Purification of the amine",
      ],
      inputs: ["carbonyl or nitro precursor", "amine / ammonia", "reducing agent or H2"],
      hazard: "Hydrogenation and amines need pressure-rated plant and careful handling of pyrophoric catalysts.",
    });
  if (ether)
    found.push({
      key: "ether", label: "Etherification", priority: 45,
      headline: "Ether formation",
      classes: ["Williamson ether synthesis", "Alkoxylation"],
      steps: [
        "Williamson ether synthesis (alkoxide + alkyl halide), or catalytic alkoxylation",
        "Neutralization and salt removal",
        "Distillation of the ether",
      ],
      inputs: ["alcohol / alkoxide", "alkyl halide or alkylene oxide"],
      hazard: "Alkylene oxides are volatile and reactive; alkoxide handling must exclude moisture.",
    });
  if (halide)
    found.push({
      key: "halide", label: "Halogenation", priority: 42,
      headline: "Halogenation",
      classes: ["Electrophilic / radical halogenation", "Nucleophilic substitution"],
      steps: [
        "Halogenation of the feedstock (electrophilic, radical, or via substitution)",
        "Scrubbing of hydrogen halide by-product",
        "Purification of the halide",
      ],
      inputs: ["hydrocarbon / arene feedstock", "Cl2 / Br2 or HX"],
      hazard: "Halogens and hydrogen halides are toxic and corrosive; closed handling with scrubbing required.",
    });
  if (alkene || alkyne)
    found.push({
      key: "unsat", label: alkyne ? "Coupling / elimination" : "Elimination / olefination", priority: 40,
      headline: alkyne ? "Alkyne formation" : "Alkene (olefin) formation",
      classes: alkyne
        ? ["Elimination", "Alkyne coupling"]
        : ["Elimination (dehydration / dehydrohalogenation)", "Olefination", "Cracking"],
      steps: [
        alkyne
          ? "Double elimination or alkyne coupling to install the triple bond"
          : "Elimination (dehydration or dehydrohalogenation) or catalytic olefination",
        "Separation of the unsaturated product from isomers and by-products",
        "Fractional distillation to the required purity",
      ],
      inputs: [alkyne ? "dihalide or activated precursor" : "alcohol or alkyl halide precursor", "acid / base catalyst"],
      hazard: "Unsaturated intermediates can polymerize; inhibitors and temperature control are needed.",
    });
  if (alcohol && !found.some((g) => g.key === "ester"))
    found.push({
      key: "alcohol", label: "Reduction / hydration", priority: 30,
      headline: "Alcohol formation",
      classes: ["Carbonyl reduction", "Hydration", "Hydroformylation / hydrogenation"],
      steps: [
        "Reduction of the corresponding carbonyl, or hydration of an alkene",
        "Catalyst removal and neutralization",
        "Distillation of the alcohol",
      ],
      inputs: ["carbonyl or alkene feedstock", "H2 / reducing agent or water"],
      hazard: "Hydrogenation needs pressure-rated plant; confirm catalyst and containment at feasibility.",
    });

  // Aromatic context, added when the primary chemistry is not already ring-based.
  if (aromatic && !found.some((g) => ["nitro", "sulfon"].includes(g.key))) {
    found.push({
      key: "aromatic", label: "Aromatic substitution", priority: 20,
      headline: "Aromatic ring functionalization",
      classes: ["Electrophilic aromatic substitution", "Friedel-Crafts", "Cross-coupling"],
      steps: [
        "Functionalize the aromatic ring by electrophilic substitution or cross-coupling",
        "Catalyst / spent-acid removal",
        "Isolation of the substituted arene",
      ],
      inputs: ["aromatic feedstock", "electrophile or coupling partner"],
      hazard: "Ring chemistry often uses strong acids or metal catalysts; plan corrosion control and catalyst recovery.",
    });
  }

  // Nothing recognized: give a formula-anchored generic so the card still speaks
  // to the molecule rather than showing a placeholder.
  if (found.length === 0) {
    found.push({
      key: "generic", label: "Multistep synthesis", priority: 1,
      headline: "Multistep organic synthesis",
      classes: ["Condensation", "Substitution", "Redox"],
      steps: [
        `Assemble the ${f || "target"} skeleton through condensation and substitution steps`,
        "Introduce and protect functional groups as the route requires",
        "Purification to the specified quality",
      ],
      inputs: ["commodity organic feedstocks"],
      hazard: "Confirm the specific route, reagents and containment class during the feasibility assessment.",
    });
  }

  return found.sort((a, b) => b.priority - a.priority);
}

// Builds core chemistry from functional groups for any resolvable molecule.
// Combines the dominant (bond-defining) reaction with the other relevant
// reaction classes present, so the card names broad categories like
// esterification, nitration, elimination, or ozonolysis.
export function deriveChemistry(identity: ChemIdentity | null, name: string): CoreChemistry | null {
  const smiles = identity?.smiles ?? "";
  const displayName = identity?.name || name || "";
  const formula = identity?.formula ?? "";
  const searchName = [displayName, name, identity?.iupac ?? "", ...(identity?.synonyms ?? [])]
    .filter(Boolean)
    .join(" ");

  // Need at least a structure or a name to say anything honest.
  if (!smiles && !searchName.trim()) return null;

  const groups = detectGroups(smiles, searchName, formula);
  const primary = groups[0];
  const classes = Array.from(new Set(groups.flatMap((g) => g.classes))).slice(0, 6);

  return {
    headline: primary.headline,
    route: primary.steps,
    startingMaterials: primary.inputs,
    plantType: "Batch",
    hazardNote: primary.hazard,
    source: "derived",
    reactionClasses: classes,
  };
}
