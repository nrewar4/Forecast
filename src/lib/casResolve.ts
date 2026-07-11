// Accurate chemical-identity resolution for the AI Search bar, backed by PubChem
// (free, CORS-enabled, no key). Resolves a CAS Registry Number OR a chemical
// name to a canonical identity, common name, formula, SMILES, PubChem CID, and
// the validated CAS RN(s). This makes a bare CAS like "50-78-2" search as
// "aspirin (C9H8O4)" and shows the authoritative CAS for a name query.
//
// NOTE: CAS's own Common Chemistry API now requires an API key + a server proxy
// (CORS-blocked), so we use PubChem's CAS cross-reference instead.

import { cacheGet, cacheSet, DAY } from "./aiCache";
import { sanitizeText } from "./sanitize";

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound";

export type ChemIdentity = {
  query: string;
  cid: number;
  name: string; // best common/display name
  iupac: string | null;
  formula: string | null;
  mw: string | null; // molecular weight, g/mol
  smiles: string | null;
  primaryCas: string | null; // canonical CAS RN
  casList: string[]; // all CAS-shaped synonyms (registry variants)
  synonyms: string[]; // top synonyms, for query expansion
  source: string; // which database resolved it (pubchem, cactus, opsin, ...)
};

const CAS_RE = /^\d{2,7}-\d{2}-\d$/;

// CAS-shaped query, optionally prefixed with "CAS".
export function looksLikeCas(query: string): boolean {
  return CAS_RE.test(query.trim().replace(/^cas[:\s]*/i, ""));
}

function cleanQuery(query: string): string {
  // Cap length and strip control characters before the value reaches an API path
  // or the cache key. All outbound calls also encodeURIComponent the value.
  return sanitizeText(query, 120).replace(/^cas[:\s]*/i, "").trim();
}

// Database/registry codes that masquerade as synonyms, never use as a name.
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

type PubchemProps = {
  CID?: number;
  MolecularFormula?: string;
  MolecularWeight?: string;
  SMILES?: string;
  ConnectivitySMILES?: string;
  IUPACName?: string;
};

const INCHIKEY_RE = /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/;
const CACTUS = "https://cactus.nci.nih.gov/chemical/structure";

// PubChem synonyms for a CID (best-effort; identity resolves without them).
async function pubchemSynonyms(cid: number, signal?: AbortSignal): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/cid/${cid}/synonyms/JSON`, { signal });
    if (!res.ok) return [];
    const json = (await res.json()) as { InformationList?: { Information?: Array<{ Synonym?: string[] }> } };
    return json?.InformationList?.Information?.[0]?.Synonym ?? [];
  } catch {
    return [];
  }
}

// PubChem lookup by name/CAS or by InChIKey. The InChIKey path lets us enrich a
// hit from another resolver (CACTUS, OPSIN) with PubChem's CID, so the structure
// image and patent landscape still work.
async function pubchemLookup(
  kind: "name" | "inchikey",
  value: string,
  queryLabel: string,
  typedCas: string | null,
  signal?: AbortSignal,
): Promise<ChemIdentity | null> {
  const propUrl = `${BASE}/${kind}/${encodeURIComponent(value)}/property/MolecularFormula,MolecularWeight,SMILES,ConnectivitySMILES,IUPACName/JSON`;
  const res = await fetch(propUrl, { signal });
  if (!res.ok) return null;
  const json = (await res.json()) as { PropertyTable?: { Properties?: PubchemProps[] } };
  const p = json?.PropertyTable?.Properties?.[0];
  if (!p?.CID) return null;
  const synonyms = await pubchemSynonyms(p.CID, signal);
  const casList = Array.from(new Set(synonyms.filter((s) => CAS_RE.test(s))));
  return {
    query: queryLabel,
    cid: p.CID,
    name: pickName(synonyms, p.IUPACName ?? null),
    iupac: p.IUPACName ?? null,
    formula: p.MolecularFormula ?? null,
    mw: p.MolecularWeight ?? null,
    smiles: p.SMILES ?? p.ConnectivitySMILES ?? null,
    primaryCas: typedCas ?? principalCas(casList),
    casList,
    synonyms: synonyms.slice(0, 8),
    source: "pubchem",
  };
}

// Plain-text GET for the keyless resolvers (CACTUS, OPSIN). Returns null on a
// miss or an HTML error page. CORS-friendly; failures degrade gracefully.
async function fetchText(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    if (!text || /<html|<!doctype|page not found/i.test(text)) return null;
    return text.split("\n")[0].trim() || null;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// NCI CACTUS resolver: resolves many names, CAS numbers and salts that PubChem's
// name index misses. We take its InChIKey to fetch a PubChem CID when possible,
// otherwise return the structure and CAS CACTUS provides directly.
async function resolveViaCactus(
  q: string,
  typedCas: string | null,
  signal?: AbortSignal,
): Promise<ChemIdentity | null> {
  const rawKey = await fetchText(`${CACTUS}/${encodeURIComponent(q)}/stdinchikey`, signal);
  const inchikey = rawKey ? rawKey.replace(/^InChIKey=/i, "").trim() : null;
  if (inchikey && INCHIKEY_RE.test(inchikey)) {
    const enriched = await pubchemLookup("inchikey", inchikey, q, typedCas, signal).catch(() => null);
    if (enriched) return { ...enriched, source: "pubchem via cactus" };
  }
  const [smiles, iupac, casText, formula] = await Promise.all([
    fetchText(`${CACTUS}/${encodeURIComponent(q)}/smiles`, signal),
    fetchText(`${CACTUS}/${encodeURIComponent(q)}/iupac_name`, signal),
    fetchText(`${CACTUS}/${encodeURIComponent(q)}/cas`, signal),
    fetchText(`${CACTUS}/${encodeURIComponent(q)}/formula`, signal),
  ]);
  if (!smiles && !casText) return null;
  const casList = Array.from(new Set((casText ?? "").split(/\s+/).filter((c) => CAS_RE.test(c))));
  return {
    query: q,
    cid: 0,
    name: iupac || q,
    iupac: iupac ?? null,
    formula: formula ?? null,
    mw: null,
    smiles: smiles ?? null,
    primaryCas: typedCas ?? principalCas(casList),
    casList,
    synonyms: [],
    source: "cactus",
  };
}

// OPSIN: converts a systematic IUPAC name to a structure, then enriches it via
// PubChem when its InChIKey resolves to a CID.
async function resolveViaOpsin(
  q: string,
  typedCas: string | null,
  signal?: AbortSignal,
): Promise<ChemIdentity | null> {
  try {
    const res = await fetch(`https://opsin.ch.cam.ac.uk/opsin/${encodeURIComponent(q)}.json`, { signal });
    if (!res.ok) return null;
    const j = (await res.json()) as { status?: string; smiles?: string; stdinchikey?: string };
    if (j?.status !== "SUCCESS" || !j.smiles) return null;
    const inchikey = j.stdinchikey?.replace(/^InChIKey=/i, "").trim() || null;
    if (inchikey && INCHIKEY_RE.test(inchikey)) {
      const enriched = await pubchemLookup("inchikey", inchikey, q, typedCas, signal).catch(() => null);
      if (enriched) return { ...enriched, source: "pubchem via opsin" };
    }
    return {
      query: q, cid: 0, name: q, iupac: q, formula: null, mw: null,
      smiles: j.smiles, primaryCas: typedCas, casList: [], synonyms: [], source: "opsin",
    };
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// Resolves a CAS number or chemical name to an identity, trying several public
// databases in turn so many more inputs succeed than PubChem alone would:
// PubChem first, then the NCI CACTUS resolver (catches drugs, salts and CAS that
// PubChem's name index misses), then OPSIN for systematic IUPAC names. Returns
// null only when no database recognises the input.
export async function resolveIdentity(
  query: string,
  signal?: AbortSignal,
): Promise<ChemIdentity | null> {
  const q = cleanQuery(query);
  if (!q) return null;

  const cacheKey = `ident:${q.toLowerCase()}`;
  const hit = cacheGet<ChemIdentity | null>(cacheKey);
  if (hit) return hit;

  const typedCas = looksLikeCas(query) ? q : null;
  try {
    let identity = await pubchemLookup("name", q, q, typedCas, signal);
    if (!identity) identity = await resolveViaCactus(q, typedCas, signal);
    if (!identity) identity = await resolveViaOpsin(q, typedCas, signal);
    if (identity) cacheSet(cacheKey, identity, DAY);
    return identity;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// A short, plain-language description of the compound from PubChem's PUG-View
// description endpoint (an authoritative, citable source). Best-effort and
// cached for a day; returns null when PubChem has no description.
export async function fetchCompoundDescription(
  cid: number,
  signal?: AbortSignal,
): Promise<string | null> {
  const cacheKey = `desc:${cid}`;
  const hit = cacheGet<string | null>(cacheKey);
  if (hit !== null) return hit;
  try {
    const res = await fetch(`${BASE}/cid/${cid}/description/JSON`, { signal });
    if (!res.ok) {
      cacheSet(cacheKey, null, DAY);
      return null;
    }
    const json = (await res.json()) as {
      InformationList?: { Information?: Array<{ Description?: string }> };
    };
    const info = json?.InformationList?.Information ?? [];
    const desc = info.find((i) => i.Description)?.Description ?? null;
    cacheSet(cacheKey, desc, DAY);
    return desc;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}
