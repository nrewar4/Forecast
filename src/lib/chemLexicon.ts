// A canonical lexicon of process-chemistry capabilities. It tags any free text
// (a product's required reaction, or a vendor's listed chemistry) with one or
// more capability ids, so a SPECIFIC product requirement can be matched against
// a SPECIFIC vendor capability regardless of wording ("catalytic hydrogenation"
// vs "high-pressure hydrogenation", "Knoevenagel condensation" vs "condensation").
//
// This is intentionally granular, not a handful of broad buckets: the match a
// customer sees names the exact chemistry, and the vendor's own verbatim phrase
// is shown as the evidence for it.

export type Capability = { id: string; label: string; re: RegExp };

// Order matters only for display grouping; matching tests every entry.
export const CAPABILITIES: Capability[] = [
  { id: "hydrogenation", label: "Catalytic hydrogenation", re: /hydrogenation|hydrogenat|nitro[-\s]?reduction/ },
  { id: "reduction", label: "Reduction", re: /\breduction\b|reductive(?!\s+amination)|borohydride|hydride reduction/ },
  { id: "oxidation", label: "Oxidation", re: /oxidation|oxidative|ammoxidation|epoxidation/ },
  { id: "nitration", label: "Nitration", re: /nitration|nitrate/ },
  { id: "halogenation", label: "Halogenation", re: /halogenation|chlorination|bromination|fluorination|iodination|halogen exchange|halex/ },
  { id: "sulfonation", label: "Sulfonation", re: /sulfonation|sulphonation|sulfonyl/ },
  { id: "esterification", label: "Esterification", re: /esterification|transesterification/ },
  { id: "acylation", label: "Friedel-Crafts / acylation", re: /friedel[-\s]?crafts|acylation|acetylation/ },
  { id: "alkylation", label: "Alkylation", re: /alkylation|methylation/ },
  { id: "condensation", label: "Condensation", re: /condensation|aldol|knoevenagel|claisen|mannich|schiff|imide formation|imide[-\s]?forming/ },
  { id: "cyclization", label: "Cyclization / heterocycle", re: /cycli[sz]ation|annulation|heterocycl|heterocycle|ring synthes|glutarimide|phthalimide/ },
  { id: "amidation", label: "Amide coupling", re: /amidation|amide (coupling|bond|formation)|peptide (coupling|synthesis)/ },
  { id: "amination", label: "Amination", re: /amination|buchwald|hartwig|reductive amination/ },
  { id: "cyanation", label: "Cyanation", re: /cyanation|hydrocyanation|cyanide/ },
  { id: "diazotization", label: "Diazotization", re: /diazoti[sz]ation|sandmeyer|diazonium/ },
  { id: "coupling", label: "Cross-coupling", re: /cross[-\s]?coupling|suzuki|miyaura|sonogashira|\bheck\b|negishi|stille|\bcoupling\b/ },
  { id: "grignard", label: "Grignard / organometallic", re: /grignard|organolithium|organometallic|organozinc/ },
  { id: "snar", label: "Nucleophilic (aromatic) substitution", re: /nucleophilic (aromatic )?substitution|\bsnar\b|s\.?n\.?ar/ },
  { id: "etherification", label: "Etherification", re: /etherification|williamson|ethoxylation|alkoxylation|propoxylation/ },
  { id: "hydrolysis", label: "Hydrolysis", re: /hydrolysis|saponification/ },
  { id: "chiral", label: "Chiral / asymmetric", re: /asymmetric|enantioselective|chiral (resolution|synthesis|pool|chemistry)|chiral resolution|chiral separation/ },
  { id: "phosphorus", label: "Phosphorus chemistry", re: /phosphoramidite|phosphoryl|phosphorylation|phosphonate/ },
  { id: "flow", label: "Flow / continuous", re: /flow chemistry|continuous (flow|process)|microreactor/ },
  { id: "cryogenic", label: "Cryogenic / low-temperature", re: /cryogenic|low[-\s]?temperature|-78|lithiation/ },
  { id: "click", label: "Click / azide-alkyne", re: /click chemistry|cuaac|spaac|azide|alkyne|thiol[-\s]?ene|bioconjugat/ },
  { id: "peg", label: "PEG / linker chemistry", re: /\bpeg\b|polyethylene glycol|linker|payload|conjugat/ },
  { id: "protac", label: "Targeted protein degradation / PROTAC", re: /protac|targeted protein degrad|molecular glue|\btpd\b|crbn|degrader/ },
  { id: "fluorine", label: "Fluorine chemistry", re: /fluorination|fluoro|trifluorometh|difluoro/ },
  { id: "protection", label: "Protecting-group chemistry", re: /protection|deprotection|protecting group/ },
  { id: "salt", label: "Salt formation / crystallization", re: /salt formation|crystalli[sz]ation|polymorph|resolution/ },
];

const CAP_BY_ID = new Map(CAPABILITIES.map((c) => [c.id, c]));

export function capabilityLabel(id: string): string {
  return CAP_BY_ID.get(id)?.label ?? id;
}

// Tags a single free-text phrase with the capability ids it expresses.
export function tagPhrase(text: string): string[] {
  const t = text.toLowerCase();
  const ids: string[] = [];
  for (const c of CAPABILITIES) if (c.re.test(t)) ids.push(c.id);
  return ids;
}

// Tags a list of phrases, returning a map of capability id -> the verbatim
// phrases that expressed it (the evidence shown to the customer).
export function tagPhrases(phrases: string[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const p of phrases) {
    for (const id of tagPhrase(p)) {
      const arr = out.get(id) ?? [];
      if (!arr.includes(p)) arr.push(p);
      out.set(id, arr);
    }
  }
  return out;
}

// The set of capability ids a list of requirement strings reduces to.
export function requiredCapabilities(requirements: string[]): string[] {
  const set = new Set<string>();
  for (const r of requirements) for (const id of tagPhrase(r)) set.add(id);
  return [...set];
}
