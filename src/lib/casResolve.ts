// Accurate chemical-identity resolution for the AI Search bar, backed by PubChem
// (free, CORS-enabled, no key). Resolves a CAS Registry Number OR a chemical
// name to a canonical identity — common name, formula, SMILES, PubChem CID, and
// the validated CAS RN(s). This makes a bare CAS like "50-78-2" search as
// "aspirin (C9H8O4)" and shows the authoritative CAS for a name query.
//
// NOTE: CAS's own Common Chemistry API now requires an API key + a server proxy
// (CORS-blocked), so we use PubChem's CAS cross-reference instead.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound";

export type ChemIdentity = {
  query: string;
  cid: number;
  name: string; // best common/display name
  iupac: string | null;
  formula: string | null;
  smiles: string | null;
  primaryCas: string | null; // canonical CAS RN
  casList: string[]; // all CAS-shaped synonyms (registry variants)
  synonyms: string[]; // top synonyms, for query expansion
  source: "pubchem";
};

const CAS_RE = /^\d{2,7}-\d{2}-\d$/;

// CAS-shaped query, optionally prefixed with "CAS".
export function looksLikeCas(query: string): boolean {
  return CAS_RE.test(query.trim().replace(/^cas[:\s]*/i, ""));
}

function cleanQuery(query: string): string {
  return query.trim().replace(/^cas[:\s]*/i, "").trim();
}

// Database/registry codes that masquerade as synonyms — never use as a name.
const CODE_RE =
  /(:|SCHEMBL|CHEMBL|DTXSID|DTXCID|AKOS|MFCD|EINECS|UNII|RefChem|^NSC\d|^DB\d|^CID\b|^EC\s|Tox21|BDBM|STK\d|ZINC)/i;

// Pick a friendly display name. First pass prefers a clean word-only synonym
// (no digits, commas, or stereo descriptors like "(+-)-"); second pass relaxes
// to any non-code synonym; finally fall back to IUPAC / raw first.
function pickName(synonyms: string[], iupac: string | null): string {
  const clean = synonyms.find(
    (s) => /^[A-Za-z][A-Za-z\s'-]+$/.test(s) && !CODE_RE.test(s) && s.length <= 40,
  );
  if (clean) return clean;
  const ok = synonyms.find(
    (s) =>
      /[A-Za-z]/.test(s) &&
      !CAS_RE.test(s) &&
      !CODE_RE.test(s) &&
      s.length <= 40 &&
      (s.match(/\d/g)?.length ?? 0) <= 2,
  );
  return ok ?? iupac ?? synonyms[0] ?? "";
}

// The principal CAS RN is the earliest assigned, i.e. the smallest registry
// number. PubChem lists registry variants in no reliable order, so pick by value.
function principalCas(casList: string[]): string | null {
  if (!casList.length) return null;
  const val = (c: string) => Number(c.replace(/-/g, ""));
  return [...casList].sort((a, b) => val(a) - val(b))[0];
}

// Resolve a CAS number or chemical name to a verified identity. Returns null when
// PubChem has no match (e.g. a use-case phrase like "fungicide for downy mildew").
export async function resolveIdentity(
  query: string,
  signal?: AbortSignal,
): Promise<ChemIdentity | null> {
  const q = cleanQuery(query);
  if (!q) return null;

  const cacheKey = `ident:${q.toLowerCase()}`;
  const hit = cacheGet<ChemIdentity | null>(cacheKey);
  if (hit !== null) return hit;

  try {
    // 1. Resolve to a CID + core properties (name lookup also matches CAS).
    const propUrl = `${BASE}/name/${encodeURIComponent(q)}/property/MolecularFormula,SMILES,ConnectivitySMILES,IUPACName/JSON`;
    const propRes = await fetch(propUrl, { signal });
    if (!propRes.ok) {
      cacheSet(cacheKey, null, DAY);
      return null;
    }
    const propJson = (await propRes.json()) as {
      PropertyTable?: {
        Properties?: Array<{
          CID?: number;
          MolecularFormula?: string;
          SMILES?: string;
          ConnectivitySMILES?: string;
          IUPACName?: string;
        }>;
      };
    };
    const p = propJson?.PropertyTable?.Properties?.[0];
    if (!p?.CID) {
      cacheSet(cacheKey, null, DAY);
      return null;
    }

    // 2. Synonyms → common name + CAS cross-reference (best-effort).
    let synonyms: string[] = [];
    try {
      const synRes = await fetch(`${BASE}/cid/${p.CID}/synonyms/JSON`, { signal });
      if (synRes.ok) {
        const synJson = (await synRes.json()) as {
          InformationList?: { Information?: Array<{ Synonym?: string[] }> };
        };
        synonyms = synJson?.InformationList?.Information?.[0]?.Synonym ?? [];
      }
    } catch {
      // synonyms are optional — identity still resolves without them
    }

    const casList = Array.from(new Set(synonyms.filter((s) => CAS_RE.test(s))));
    // If the user typed a CAS, honour it as primary; else pick the principal one.
    const typedCas = looksLikeCas(query) ? q : null;
    const identity: ChemIdentity = {
      query: q,
      cid: p.CID,
      name: pickName(synonyms, p.IUPACName ?? null),
      iupac: p.IUPACName ?? null,
      formula: p.MolecularFormula ?? null,
      smiles: p.SMILES ?? p.ConnectivitySMILES ?? null,
      primaryCas: typedCas ?? principalCas(casList),
      casList,
      synonyms: synonyms.slice(0, 8),
      source: "pubchem",
    };
    cacheSet(cacheKey, identity, DAY);
    return identity;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}
