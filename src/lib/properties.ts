// Chemical and physical properties from PubChem. Two sources, one call each,
// run in parallel and time-boxed by the caller:
//   - computed physicochemical descriptors from the PUG REST property endpoint
//     (always available for a resolved compound), and
//   - experimental physical properties (appearance, melting/boiling point,
//     density, solubility, ...) from PUG-View, when PubChem has them.
// Everything is sourced from PubChem, so it stays verifiable.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const REST = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid";
const VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound";

export type PropRow = { label: string; value: string };

export type ChemProperties = {
  computed: PropRow[]; // physicochemical descriptors
  physical: PropRow[]; // experimental physical properties
};

function clamp(s: string, n = 160): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "..." : t;
}

// Computed descriptors from the property endpoint. These are physicochemical
// properties PubChem calculates for every compound.
async function fetchComputed(cid: number, signal?: AbortSignal): Promise<PropRow[]> {
  const fields = "XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount,Complexity,Charge,ExactMass";
  try {
    const res = await fetch(`${REST}/${cid}/property/${fields}/JSON`, { signal });
    if (!res.ok) return [];
    const json = (await res.json()) as { PropertyTable?: { Properties?: Array<Record<string, unknown>> } };
    const p = json?.PropertyTable?.Properties?.[0];
    if (!p) return [];
    const rows: PropRow[] = [];
    const add = (label: string, key: string, suffix = "") => {
      const v = p[key];
      if (v !== undefined && v !== null && v !== "") rows.push({ label, value: `${v}${suffix}` });
    };
    add("LogP (lipophilicity)", "XLogP");
    add("Polar surface area", "TPSA", " A^2");
    add("H-bond donors", "HBondDonorCount");
    add("H-bond acceptors", "HBondAcceptorCount");
    add("Rotatable bonds", "RotatableBondCount");
    add("Heavy atoms", "HeavyAtomCount");
    add("Exact mass", "ExactMass", " g/mol");
    add("Formal charge", "Charge");
    add("Complexity", "Complexity");
    return rows;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return [];
  }
}

// Experimental physical-property headings we surface, mapped to display labels.
const PHYS_HEADINGS: Record<string, string> = {
  "Physical Description": "Appearance",
  "Color/Form": "Color / form",
  Odor: "Odor",
  "Melting Point": "Melting point",
  "Boiling Point": "Boiling point",
  Density: "Density",
  Solubility: "Solubility",
  "Vapor Pressure": "Vapor pressure",
  "Flash Point": "Flash point",
};

type ViewSection = {
  TOCHeading?: string;
  Section?: ViewSection[];
  Information?: Array<{ Value?: { StringWithMarkup?: Array<{ String?: string }>; Number?: number[]; Unit?: string } }>;
};

function firstValue(section: ViewSection): string | null {
  for (const it of section.Information ?? []) {
    const s = it?.Value?.StringWithMarkup?.[0]?.String;
    if (s) return String(s);
    const num = it?.Value?.Number?.[0];
    if (num !== undefined) return `${num}${it?.Value?.Unit ? " " + it.Value.Unit : ""}`;
  }
  return null;
}

function walkPhysical(sections: ViewSection[] | undefined, out: PropRow[]): void {
  for (const s of sections ?? []) {
    const label = s.TOCHeading ? PHYS_HEADINGS[s.TOCHeading] : undefined;
    if (label && !out.some((o) => o.label === label)) {
      const v = firstValue(s);
      if (v) out.push({ label, value: clamp(v) });
    }
    if (s.Section) walkPhysical(s.Section, out);
  }
}

async function fetchPhysical(cid: number, signal?: AbortSignal): Promise<PropRow[]> {
  try {
    const res = await fetch(`${VIEW}/${cid}/JSON?heading=Experimental+Properties`, { signal });
    if (!res.ok) return [];
    const json = (await res.json()) as { Record?: { Section?: ViewSection[] } };
    const out: PropRow[] = [];
    walkPhysical(json?.Record?.Section, out);
    return out;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return [];
  }
}

export async function fetchProperties(cid: number, signal?: AbortSignal): Promise<ChemProperties | null> {
  const key = `props:${cid}`;
  const hit = cacheGet<ChemProperties | null>(key);
  if (hit) return hit;
  const [computed, physical] = await Promise.all([fetchComputed(cid, signal), fetchPhysical(cid, signal)]);
  if (computed.length === 0 && physical.length === 0) return null;
  const result: ChemProperties = { computed, physical };
  cacheSet(key, result, DAY);
  return result;
}
