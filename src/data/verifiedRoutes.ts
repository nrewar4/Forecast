// Curated, source-cited synthesis routes for high-value molecules whose real
// chemistry the automatic lookups (PubChem "Methods of Manufacturing", Wikipedia)
// do not carry, or carry too thinly to extract. These are hand-authored from
// published literature (patents, Wikipedia, review articles, LibreTexts / the
// Organic Chemistry Portal) and cited, so the app can show correct chemistry with
// NO API key and NO credit. They take priority over the automatic route lookups.
//
// Each entry lists the SPECIFIC named reactions of the documented route; the
// broad vendor-matchable categories are derived from those names by the shared
// lexicon, so the manufacturer match keys off the same core chemistry shown.
//
// To add a molecule: give its match names (and CAS if known), the ordered named
// reactions, 1 to 3 factual step sentences, and a real, openable primary source.

export type CuratedRoute = {
  /** lower-cased names / synonyms this entry matches */
  names: string[];
  /** CAS numbers this entry matches (digits and dashes) */
  cas?: string[];
  /** specific named reactions of the documented route, in order */
  reactions: string[];
  /** 1 to 3 cited sentences describing the actual route */
  steps: string[];
  /** the primary published source the route is taken from */
  source: { name: string; url: string };
};

export const CURATED_ROUTES: CuratedRoute[] = [
  {
    names: ["pomalidomide", "pomalyst", "imnovid", "4-amino-2-(2,6-dioxopiperidin-3-yl)isoindole-1,3-dione", "4-aminothalidomide"],
    cas: ["19171-19-8"],
    reactions: ["Condensation (imide formation)", "Catalytic hydrogenation (nitro reduction)", "Nucleophilic aromatic substitution (SNAr)"],
    steps: [
      "3-Aminopiperidine-2,6-dione (the glutarimide fragment, usually as its hydrochloride) is condensed with 3-nitrophthalic anhydride in a polar aprotic solvent with a mild base to form the 4-nitro-substituted phthalimido-glutarimide.",
      "The aromatic nitro group is then reduced to the 4-amino group by catalytic hydrogenation over palladium on carbon, giving pomalidomide.",
      "For linker/PROTAC derivatives the amine is installed instead by nucleophilic aromatic substitution (SNAr) on 4-fluorothalidomide, displacing fluoride with an amine under mild base.",
    ],
    source: { name: "Wikipedia: Pomalidomide (synthesis) and Celgene patent US5635517", url: "https://en.wikipedia.org/wiki/Pomalidomide" },
  },
  {
    names: ["lenalidomide", "revlimid", "3-(4-amino-1-oxo-1,3-dihydro-2h-isoindol-2-yl)piperidine-2,6-dione"],
    cas: ["191732-72-6"],
    reactions: ["N-alkylation / cyclization (lactam formation)", "Catalytic hydrogenation (nitro reduction)"],
    steps: [
      "3-Aminopiperidine-2,6-dione is N-alkylated and cyclised with methyl 2-(bromomethyl)-3-nitrobenzoate to build the 4-nitro-isoindolinone (1-oxo) ring fused to the glutarimide.",
      "The nitro group is reduced to the 4-amino group by catalytic hydrogenation (H2, Pd/C) to give lenalidomide.",
    ],
    source: { name: "Wikipedia: Lenalidomide (synthesis)", url: "https://en.wikipedia.org/wiki/Lenalidomide" },
  },
  {
    names: ["thalidomide", "contergan", "2-(2,6-dioxopiperidin-3-yl)isoindole-1,3-dione"],
    cas: ["50-35-1"],
    reactions: ["Condensation (N-phthaloylation)", "Cyclization (glutarimide formation)"],
    steps: [
      "L-Glutamine (or L-glutamic acid) is N-phthaloylated by condensation with phthalic anhydride to give N-phthaloyl-L-glutamine.",
      "The glutamine side chain is cyclodehydrated (for example with carbonyldiimidazole or acetic anhydride) to close the glutarimide ring, giving thalidomide.",
    ],
    source: { name: "Wikipedia: Thalidomide (synthesis)", url: "https://en.wikipedia.org/wiki/Thalidomide" },
  },
  {
    names: ["aspirin", "acetylsalicylic acid", "2-acetoxybenzoic acid", "2-(acetyloxy)benzoic acid"],
    cas: ["50-78-2"],
    reactions: ["Esterification (O-acetylation)"],
    steps: [
      "Salicylic acid is O-acetylated with acetic anhydride, usually with a trace acid catalyst (sulfuric or phosphoric acid), esterifying the phenolic hydroxyl to give acetylsalicylic acid and acetic acid as the by-product.",
    ],
    source: { name: "Wikipedia: Aspirin (synthesis)", url: "https://en.wikipedia.org/wiki/Aspirin#Synthesis" },
  },
  {
    names: ["paracetamol", "acetaminophen", "4-acetamidophenol", "n-(4-hydroxyphenyl)acetamide"],
    cas: ["103-90-2"],
    reactions: ["Amidation (N-acetylation)"],
    steps: [
      "4-Aminophenol is N-acetylated with acetic anhydride (or acetic acid) to give paracetamol; the 4-aminophenol is itself made by catalytic hydrogenation of nitrobenzene/4-nitrophenol or nitrophenol reduction upstream.",
    ],
    source: { name: "Wikipedia: Paracetamol (synthesis)", url: "https://en.wikipedia.org/wiki/Paracetamol#Synthesis" },
  },
  {
    names: ["ibuprofen", "2-(4-isobutylphenyl)propanoic acid", "4-isobutyl-alpha-methylphenylacetic acid"],
    cas: ["15687-27-1"],
    reactions: ["Friedel-Crafts acylation", "Catalytic hydrogenation", "Carbonylation"],
    steps: [
      "In the modern BHC (Hoechst) green route, isobutylbenzene is acetylated by Friedel-Crafts acylation with acetic anhydride to 4-isobutylacetophenone.",
      "The ketone is hydrogenated to the corresponding 1-(4-isobutylphenyl)ethanol, then carbonylated with carbon monoxide over a palladium catalyst to install the carboxylic acid, giving ibuprofen in three catalytic steps.",
    ],
    source: { name: "Wikipedia: Ibuprofen (BHC synthesis)", url: "https://en.wikipedia.org/wiki/Ibuprofen#Synthesis" },
  },
];

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function normCas(s: string): string {
  return s.replace(/[^0-9-]/g, "");
}

// Finds a curated route by name, synonym or CAS. Best-effort and fully offline.
export function findCuratedRoute(candidates: (string | null | undefined)[], casList: (string | null | undefined)[] = []): CuratedRoute | null {
  const names = candidates.filter(Boolean).map((c) => norm(c as string));
  const cas = casList.filter(Boolean).map((c) => normCas(c as string));
  for (const entry of CURATED_ROUTES) {
    if (entry.cas && cas.some((c) => c && entry.cas!.some((e) => normCas(e) === c))) return entry;
    const entryNames = entry.names.map(norm);
    if (names.some((n) => n && entryNames.includes(n))) return entry;
  }
  return null;
}
