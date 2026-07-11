// Patent and literature landscape, cross-verified across several independent,
// free, keyless, CORS-enabled databases rather than a single source:
//   - Patents:     PubChem PatentID xrefs (SureChEMBL) + Europe PMC (SRC:PAT)
//   - Literature:  PubChem PubMedID xrefs + Europe PMC (SRC:MED) + Crossref
// Each source is queried, its count kept per-source, and the results reconciled
// into a range so the card reports what several databases agree on, and links
// each figure back to the source it came from. Coverage differs between
// databases, so a range (not one number) is the honest reconciliation.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const PUBCHEM = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid";
const EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const CROSSREF = "https://api.crossref.org/works";

export type SourceCount = { source: string; count: number | null; url: string };

export type IpLandscape = {
  patents: SourceCount[]; // per-source patent counts
  literature: SourceCount[]; // per-source literature counts
  patentRange: [number, number] | null; // reconciled min..max across sources
  literatureRange: [number, number] | null;
  patentSources: number; // how many patent sources returned a number
  literatureSources: number;
  status: string;
  links: { name: string; url: string }[]; // patent-office search UIs to verify in
};

// --- source queries (each returns a count, or null on failure) -------------

async function pubchemXref(cid: number, kind: "PatentID" | "PubMedID", signal?: AbortSignal): Promise<number | null> {
  try {
    const res = await fetch(`${PUBCHEM}/${cid}/xrefs/${kind}/JSON`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { InformationList?: { Information?: Array<Record<string, unknown>> } };
    const arr = json?.InformationList?.Information?.[0]?.[kind] as unknown[] | undefined;
    return Array.isArray(arr) ? arr.length : 0;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// Europe PMC full-text search hit count. `src` is PAT for patents, MED for
// the biomedical literature. CORS-enabled and keyless.
async function europepmcCount(name: string, src: "PAT" | "MED", signal?: AbortSignal): Promise<number | null> {
  try {
    const query = `"${name}" AND SRC:${src}`;
    const url = `${EPMC}?query=${encodeURIComponent(query)}&format=json&resultType=idlist&pageSize=1`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { hitCount?: number };
    return typeof json?.hitCount === "number" ? json.hitCount : null;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// Crossref works count (published scholarly literature). CORS-enabled, keyless.
async function crossrefCount(name: string, signal?: AbortSignal): Promise<number | null> {
  try {
    const url = `${CROSSREF}?query=${encodeURIComponent(name)}&rows=0`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { message?: { "total-results"?: number } };
    const n = json?.message?.["total-results"];
    return typeof n === "number" ? n : null;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// --- reconciliation --------------------------------------------------------

function reconcile(counts: SourceCount[]): { range: [number, number] | null; sources: number } {
  const nums = counts.map((c) => c.count).filter((n): n is number => typeof n === "number");
  if (nums.length === 0) return { range: null, sources: 0 };
  return { range: [Math.min(...nums), Math.max(...nums)], sources: nums.length };
}

// Honest status line from the reconciled patent range across sources.
function statusLine(range: [number, number] | null, sources: number): string {
  if (!range || sources === 0) return "Patent record could not be read from the databases just now.";
  const hi = range[1];
  const agree = sources > 1 ? `Cross-checked across ${sources} databases. ` : "";
  if (hi === 0) return `${agree}No patents indexed. The base molecule appears to be in the public domain.`;
  if (hi < 25) return `${agree}A small patent footprint. Confirm freedom-to-operate for any specific route.`;
  return `${agree}An active patent landscape. A freedom-to-operate review is advised before a route is fixed.`;
}

// Resolves the cross-verified IP + literature landscape. Every source runs in
// parallel and is time-boxed by the caller, so a slow or missing source never
// blocks the rest; the result reconciles whatever came back.
export async function fetchIpLandscape(cid: number, name: string, signal?: AbortSignal): Promise<IpLandscape | null> {
  const key = `ip2:${cid}`;
  const hit = cacheGet<IpLandscape | null>(key);
  if (hit) return hit;

  const q = encodeURIComponent(name);
  const [pcPat, epmcPat, pcLit, epmcLit, crLit] = await Promise.all([
    pubchemXref(cid, "PatentID", signal),
    europepmcCount(name, "PAT", signal),
    pubchemXref(cid, "PubMedID", signal),
    europepmcCount(name, "MED", signal),
    crossrefCount(name, signal),
  ]);

  const patents: SourceCount[] = [
    { source: "PubChem / SureChEMBL", count: pcPat, url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Patents` },
    { source: "Europe PMC", count: epmcPat, url: `https://europepmc.org/search?query=${q}%20AND%20SRC%3APAT` },
  ];
  const literature: SourceCount[] = [
    { source: "PubChem / PubMed", count: pcLit, url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Literature` },
    { source: "Europe PMC", count: epmcLit, url: `https://europepmc.org/search?query=${q}%20AND%20SRC%3AMED` },
    { source: "Crossref", count: crLit, url: `https://search.crossref.org/?q=${q}` },
  ];

  if (patents.every((s) => s.count === null) && literature.every((s) => s.count === null)) return null;

  const pat = reconcile(patents);
  const lit = reconcile(literature);

  const landscape: IpLandscape = {
    patents,
    literature,
    patentRange: pat.range,
    literatureRange: lit.range,
    patentSources: pat.sources,
    literatureSources: lit.sources,
    status: statusLine(pat.range, pat.sources),
    links: [
      { name: "Google Patents", url: `https://patents.google.com/?q=%22${q}%22` },
      { name: "WIPO PATENTSCOPE", url: `https://patentscope.wipo.int/search/en/result.jsf?query=${q}` },
      { name: "Espacenet (EPO)", url: `https://worldwide.espacenet.com/patent/search?q=${q}` },
    ],
  };
  cacheSet(key, landscape, DAY);
  return landscape;
}
