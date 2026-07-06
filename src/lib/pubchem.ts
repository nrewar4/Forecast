// Resolves a chemical name, CAS number, or SMILES string to PubChem identity.
export type PubchemResult = {
  smiles: string | null;
  formula: string | null;
  cid: number | null;
  mw: string | null;
  name: string | null;
};

export class MoleculeNotFoundError extends Error {
  constructor(query: string) {
    super(`Could not resolve "${query}", try a CAS number or SMILES`);
    this.name = "MoleculeNotFoundError";
  }
}

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound";
// PubChem deprecated CanonicalSMILES/IsomericSMILES. The current property names
// are SMILES (absolute) and ConnectivitySMILES. Request all three so we keep
// working whichever the API returns. (CanonicalSMILES now comes back null.)
const PROPS = "SMILES,ConnectivitySMILES,CanonicalSMILES,MolecularFormula,MolecularWeight,IUPACName";

// Detects a SMILES string by the presence of chemistry-specific characters.
function looksLikeSmiles(query: string): boolean {
  return /[=()/#@\\]/.test(query);
}

export async function resolveMolecule(
  query: string,
  signal?: AbortSignal,
): Promise<PubchemResult> {
  const q = query.trim();
  const encoded = encodeURIComponent(q);
  const segment = looksLikeSmiles(q) ? `smiles/${encoded}` : `name/${encoded}`;
  const url = `${BASE}/${segment}/property/${PROPS}/JSON`;

  const res = await fetch(url, { signal });

  if (res.status === 404) throw new MoleculeNotFoundError(q);
  if (!res.ok) throw new Error(`PubChem error ${res.status}`);

  const json = (await res.json()) as {
    PropertyTable?: {
      Properties?: Array<{
        CID?: number;
        MolecularFormula?: string;
        MolecularWeight?: string;
        SMILES?: string;
        ConnectivitySMILES?: string;
        CanonicalSMILES?: string;
        IUPACName?: string;
      }>;
    };
  };

  const p = json?.PropertyTable?.Properties?.[0];
  if (!p) throw new MoleculeNotFoundError(q);

  return {
    // Prefer the absolute SMILES, then connectivity, then the legacy field.
    smiles: p.SMILES ?? p.ConnectivitySMILES ?? p.CanonicalSMILES ?? null,
    formula: p.MolecularFormula ?? null,
    cid: p.CID ?? null,
    mw: p.MolecularWeight ?? null,
    name: p.IUPACName ?? null,
  };
}
