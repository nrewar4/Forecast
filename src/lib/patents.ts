// Patent and literature landscape from PubChem cross-references. PubChem is a
// free, keyless, CORS-enabled public database that aggregates patent references
// (via SureChEMBL) and the published literature (via PubMed) for a compound.
// These are real, citable counts, so the feasibility card can report how many
// protected (patented) vs open, published routes exist, and every number links
// back to a source the user can verify.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid";

export type IpLandscape = {
  patentCount: number; // documents in the patent literature (SureChEMBL via PubChem)
  literatureCount: number; // documents in the open scientific literature (PubMed)
  status: string; // short, honest patent-status line
  patentUrl: string; // PubChem patents section
  literatureUrl: string; // PubChem literature section
  googlePatentsUrl: string; // secondary verifiable source
};

async function xrefCount(
  cid: number,
  kind: "PatentID" | "PubMedID",
  signal?: AbortSignal,
): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/${cid}/xrefs/${kind}/JSON`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      InformationList?: { Information?: Array<Record<string, unknown>> };
    };
    const info = json?.InformationList?.Information?.[0];
    const arr = info?.[kind] as unknown[] | undefined;
    return Array.isArray(arr) ? arr.length : 0;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

// A short, honest status line from the counts. We do not claim in-force vs
// expired (that needs a legal register); we state what the public record shows.
function statusLine(patents: number): string {
  if (patents === 0) return "No patents indexed. Base molecule appears to be in the public domain.";
  if (patents < 25) return "A small patent footprint. Confirm freedom-to-operate for any specific route.";
  return "An active patent landscape. Freedom-to-operate review is advised before a route is fixed.";
}

// Resolves the IP and literature landscape for a resolved PubChem compound.
// Best-effort and time-boxed by the caller; returns null only when neither
// count can be read, so a partial result still renders.
export async function fetchIpLandscape(
  cid: number,
  name: string,
  signal?: AbortSignal,
): Promise<IpLandscape | null> {
  const key = `ip:${cid}`;
  const hit = cacheGet<IpLandscape | null>(key);
  if (hit !== null) return hit;

  const [patents, literature] = await Promise.all([
    xrefCount(cid, "PatentID", signal),
    xrefCount(cid, "PubMedID", signal),
  ]);
  if (patents === null && literature === null) return null;

  const landscape: IpLandscape = {
    patentCount: patents ?? 0,
    literatureCount: literature ?? 0,
    status: statusLine(patents ?? 0),
    patentUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Patents`,
    literatureUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Literature`,
    googlePatentsUrl: `https://patents.google.com/?q=%22${encodeURIComponent(name)}%22`,
  };
  cacheSet(key, landscape, DAY);
  return landscape;
}
