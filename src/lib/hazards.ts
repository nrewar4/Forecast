// GHS hazard classification from PubChem's PUG-View "GHS Classification" section.
// Reports whether a compound is classified hazardous and, if so, the signal word
// (Danger / Warning), the pictogram hazard classes (Corrosive, Flammable,
// Irritant, Health hazard, ...) and the H-code hazard statements. Sourced from
// PubChem (which aggregates the ECHA/GHS data), so it is verifiable and cited.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound";

export type HazardInfo = {
  // true = classified hazardous; false = explicitly not classified; null = no
  // GHS data found in PubChem (unknown, not a safety assurance).
  status: "hazardous" | "not-classified" | "unknown";
  signal: string | null; // "Danger" | "Warning"
  classes: string[]; // pictogram hazard classes, e.g. "Corrosive", "Irritant"
  statements: string[]; // "H302: Harmful if swallowed"
  sourceUrl: string;
};

type Markup = { Extra?: string };
type Info = {
  Name?: string;
  Value?: { StringWithMarkup?: Array<{ String?: string; Markup?: Markup[] }> };
};
type Section = { TOCHeading?: string; Section?: Section[]; Information?: Info[] };

function findSection(sections: Section[] | undefined, heading: string): Section | null {
  for (const s of sections ?? []) {
    if (s.TOCHeading === heading) return s;
    const nested = findSection(s.Section, heading);
    if (nested) return nested;
  }
  return null;
}

function infoByName(section: Section, name: string): Info | undefined {
  return section.Information?.find((i) => i.Name === name);
}

// "H302 (95%): Harmful if swallowed [Warning Acute toxicity, oral - Cat 4]"
// -> "H302: Harmful if swallowed"
function cleanStatement(s: string): string {
  return s
    .replace(/\s*\([^)]*%\)/g, "") // drop the "(95%)" prevalence
    .replace(/\s*\[[^\]]*\]\s*$/g, "") // drop the trailing "[...]" class tag
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchHazards(cid: number, signal?: AbortSignal): Promise<HazardInfo> {
  const key = `hazard:${cid}`;
  const hit = cacheGet<HazardInfo | null>(key);
  if (hit) return hit;

  const sourceUrl = `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Safety-and-Hazards`;
  const unknown: HazardInfo = { status: "unknown", signal: null, classes: [], statements: [], sourceUrl };

  try {
    const res = await fetch(`${VIEW}/${cid}/JSON?heading=GHS+Classification`, { signal });
    if (!res.ok) return unknown;
    const json = (await res.json()) as { Record?: { Section?: Section[] } };
    const ghs = findSection(json?.Record?.Section, "GHS Classification");
    if (!ghs) return unknown;

    const signal_ = infoByName(ghs, "Signal")?.Value?.StringWithMarkup?.[0]?.String ?? null;

    const pictoInfo = infoByName(ghs, "Pictogram(s)");
    const classes = Array.from(
      new Set(
        (pictoInfo?.Value?.StringWithMarkup?.[0]?.Markup ?? [])
          .map((m) => (m.Extra ?? "").trim())
          .filter(Boolean),
      ),
    );

    const stmtInfo = infoByName(ghs, "GHS Hazard Statements");
    const statements = (stmtInfo?.Value?.StringWithMarkup ?? [])
      .map((x) => cleanStatement(x.String ?? ""))
      .filter((s) => /^H\d{3}/.test(s))
      .slice(0, 8);

    const hazardous = statements.length > 0 || classes.length > 0 || Boolean(signal_);
    const result: HazardInfo = {
      status: hazardous ? "hazardous" : "not-classified",
      signal: signal_,
      classes,
      statements,
      sourceUrl,
    };
    cacheSet(key, result, DAY);
    return result;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return unknown;
  }
}
