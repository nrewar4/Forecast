// Matches a molecule against APAC's real India CDMO vendor network and returns a
// RANKED, per-chemistry shortlist of manufacturers, the way a technical buyer
// would screen suppliers: each candidate is scored on how much of the product's
// specific required chemistry it demonstrably runs, with the vendor's OWN listed
// chemistry shown as the evidence, plus the gaps to raise in an RFQ.
//
// Grounding rules (honest by construction):
//   - The only capability signal is each vendor's listed chemistry in the uploaded
//     data. Nothing is invented: no DMF numbers, no capabilities not in the file.
//   - Vendor identities (name, website) are withheld and revealed only after the
//     customer contacts APAC; the public shortlist is anonymized.
//   - When no vendor covers enough of the required chemistry the shortlist is
//     empty, honestly.

import { products, type Product } from "@/data/products";
import { classifyProduct } from "@/lib/apacCategory";
import { CDMO_VENDORS } from "@/data/cdmoVendors";
import { requiredCapabilities, tagPhrases, capabilityLabel } from "@/lib/chemLexicon";

export type VendorTier = "A" | "B" | "C";

// One covered requirement and the vendor's verbatim phrases that evidence it.
export type VendorEvidence = { capability: string; phrases: string[] };

export type VendorMatch = {
  rank: number;
  /** anonymized public label; the real name is shared only after contact */
  label: string;
  country: string;
  tier: VendorTier;
  confidence: "High" | "Medium" | "Limited";
  /** fraction of the product's required chemistries this vendor demonstrably runs */
  coverage: number;
  covered: number;
  required: number;
  score: number;
  /** covered chemistries with the vendor's own listed phrases as proof */
  evidence: VendorEvidence[];
  /** required chemistries this vendor does not list, to confirm in an RFQ */
  gaps: string[];
};

export type CdmoMatch = {
  known: boolean;
  productName: string;
  category: string;
  group: string;
  isPharma: boolean;
  plantType: "Batch" | "Continuous" | "Mixed";
  /** the specific chemistries the product needs, as capability labels */
  requiredCapabilities: string[];
  /** how many network vendors carry listed chemistry and were screened */
  assessed: number;
  /** total vendors that cleared the shortlist threshold (may exceed shortlist.length) */
  matchedCount: number;
  /** ranked, anonymized top candidates (best first), capped for display */
  shortlist: VendorMatch[];
  /** back-compat: required capability labels */
  capabilities: string[];
  /** back-compat: headline count == matchedCount */
  vendorCount: number;
};

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findProduct(query: string): Product | null {
  const q = normalize(query);
  const qCas = q.replace(/\s+/g, "");
  if (!q) return null;
  return (
    products.find(
      (p) => normalize(p.name) === q || p.cas.replace(/\s+/g, "") === qCas || p.hsCode === qCas,
    ) ||
    products.find(
      (p) =>
        normalize(p.name).includes(q) ||
        (q.length >= 4 && p.name.toLowerCase().includes(q)) ||
        p.cas.replace(/\s+/g, "").includes(qCas),
    ) ||
    null
  );
}

// A, B, ... Z, AA, AB ... for anonymized vendor labels.
function maskLabel(i: number): string {
  let n = i;
  let s = "";
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `Manufacturer ${s}`;
}

function tierFor(coverage: number): VendorTier | null {
  if (coverage >= 0.85) return "A";
  if (coverage >= 0.6) return "B";
  if (coverage >= 0.4) return "C";
  return null;
}

function confidenceFor(coverage: number, covered: number): VendorMatch["confidence"] {
  if (coverage >= 0.85 && covered >= 2) return "High";
  if (coverage >= 0.6) return "Medium";
  return "Limited";
}

// Scores every vendor with listed chemistry against the product's required
// capabilities and returns the ranked shortlist plus screening counts.
function screen(requirements: string[], productName: string): {
  reqLabels: string[];
  assessed: number;
  matchedCount: number;
  matched: VendorMatch[];
} {
  const reqIds = requiredCapabilities(requirements);
  const reqLabels = reqIds.map(capabilityLabel);
  const withChem = CDMO_VENDORS.filter((v) => v.chem.length > 0);
  if (reqIds.length === 0) return { reqLabels, assessed: withChem.length, matchedCount: 0, matched: [] };

  const productKey = normalize(productName);

  type Scored = Omit<VendorMatch, "rank" | "label">;
  const scored: Scored[] = [];

  for (const v of withChem) {
    const caps = tagPhrases(v.chem); // capId -> verbatim phrases
    const coveredIds = reqIds.filter((id) => caps.has(id));
    const coverage = coveredIds.length / reqIds.length;
    const tier = tierFor(coverage);
    if (!tier) continue;

    const evidence: VendorEvidence[] = coveredIds.map((id) => ({
      capability: capabilityLabel(id),
      phrases: (caps.get(id) ?? []).slice(0, 3),
    }));
    const gaps = reqIds.filter((id) => !caps.has(id)).map(capabilityLabel);

    // The product name appearing in a vendor's listed chemistry is the strongest
    // possible signal (they say they make it); rare, but honoured when present.
    const mention =
      productKey.length >= 5 && v.chem.some((p) => p.toLowerCase().includes(productKey));

    const depth = caps.size; // breadth of the vendor, a mild tiebreaker
    const score = coverage * 100 + Math.min(depth, 20) * 0.4 + (mention ? 60 : 0);

    scored.push({
      country: v.country || "India",
      tier,
      confidence: mention ? "High" : confidenceFor(coverage, coveredIds.length),
      coverage,
      covered: coveredIds.length,
      required: reqIds.length,
      score,
      evidence,
      gaps,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const matched: VendorMatch[] = scored
    .slice(0, 12)
    .map((s, i) => ({ rank: i + 1, label: maskLabel(i), ...s }));
  return { reqLabels, assessed: withChem.length, matchedCount: scored.length, matched };
}

// Builds the manufacturer match for a resolved-or-named product. `requirements`
// are the SPECIFIC chemistries the molecule needs (from the verified route, else
// the structural derivation); the shortlist ranks vendors on how much of that
// exact chemistry they demonstrably run.
export function matchVendors(query: string, displayName?: string, requirements?: string[]): CdmoMatch {
  const product = findProduct(query);
  const name = displayName || product?.name || query.trim();

  const probe: Product =
    product ??
    ({
      name,
      hsCode: "",
      cas: "",
      plantType: "Batch",
      priceRange: "",
      priceIndicative: "",
      route: [],
      costDrivers: [],
      industries: [],
      producers: [],
    } as Product);
  const { group, category } = classifyProduct(probe);
  const isPharma = group === "Pharmaceuticals";
  const plantType: CdmoMatch["plantType"] = product?.plantType ?? (isPharma ? "Batch" : "Mixed");

  const reqs = (requirements ?? []).filter((c) => c && c !== "Multistep organic synthesis");
  const { reqLabels, assessed, matchedCount, matched } = screen(reqs, name);

  return {
    known: Boolean(product),
    productName: name,
    category,
    group,
    isPharma,
    plantType,
    requiredCapabilities: reqLabels,
    assessed,
    matchedCount,
    shortlist: matched,
    capabilities: reqLabels,
    vendorCount: matchedCount,
  };
}
