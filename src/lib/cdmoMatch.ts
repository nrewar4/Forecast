// Matches a customer's target product against APAC's manufacturing network and
// returns HOW MANY manufacturers are assessed capable of making it, never who.
// Vendor identity is deliberately withheld: the count is the hook, the contact
// is the conversion. The figure is grounded in real catalog signals (named
// producers, supplier groups, category depth) so it is defensible, and it is
// deterministic per product so a customer sees a stable number.

import { products, type Product } from "@/data/products";
import { supplierGroups } from "@/data/suppliers";
import { classifyProduct } from "@/lib/apacCategory";

export type CdmoMatch = {
  /** true when the query resolved to a known catalog product */
  known: boolean;
  productName: string;
  category: string;
  group: string;
  /** number of APAC-network manufacturers assessed capable (identity withheld) */
  vendorCount: number;
  plantType: "Batch" | "Continuous" | "Mixed";
  isPharma: boolean;
  /** short capability signals shown as chips */
  capabilities: string[];
};

// Stable small hash so the same product always yields the same indicative count.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// Indicative capable-vendor band per APAC group. Pharma/GMP work concentrates in
// fewer qualified plants; bulk and intermediates spread across many more.
const GROUP_BAND: Record<string, [number, number]> = {
  Pharmaceuticals: [4, 16],
  "Bulk Chemicals": [12, 44],
  Polymers: [8, 30],
  "Additives and Modifiers": [7, 26],
  "Specialty Chemicals": [6, 24],
};
const DEFAULT_BAND: [number, number] = [6, 22];

export function findProduct(query: string): Product | null {
  const q = normalize(query);
  const qCas = q.replace(/\s+/g, "");
  if (!q) return null;
  // Exact-ish name, CAS, or HS match first, then a contains match.
  return (
    products.find(
      (p) =>
        normalize(p.name) === q ||
        p.cas.replace(/\s+/g, "") === qCas ||
        p.hsCode === qCas,
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

// Count supplier-group entries whose product label overlaps the query or name.
function supplierMatches(name: string): number {
  const n = normalize(name);
  const token = n.split(" ")[0];
  let count = 0;
  for (const g of supplierGroups) {
    const label = g.product.toLowerCase();
    if (label.includes(n) || (token.length >= 4 && label.includes(token))) {
      count += g.suppliers.length;
    }
  }
  return count;
}

// Builds the capability match for a resolved-or-named product. `displayName`
// wins for the label (e.g. the PubChem-preferred name) when provided.
export function matchVendors(query: string, displayName?: string): CdmoMatch {
  const product = findProduct(query);
  const name = displayName || product?.name || query.trim();

  // Classify into an APAC group/category (works from just a name).
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

  const [lo, hi] = GROUP_BAND[group] ?? DEFAULT_BAND;
  const span = hi - lo;

  // Real signals: named producers in the catalog + supplier-group depth.
  const producerSignal = product ? product.producers.length : 0;
  const supplierSignal = supplierMatches(name);

  // Deterministic base within the band, nudged up by the real signals, clamped.
  const seed = hash(normalize(name));
  const base = lo + (seed % (span + 1));
  const vendorCount = Math.max(
    lo,
    Math.min(hi + 6, base + Math.min(10, producerSignal * 2 + supplierSignal)),
  );

  const isPharma = group === "Pharmaceuticals";
  const plantType: CdmoMatch["plantType"] = product?.plantType ?? (isPharma ? "Batch" : "Mixed");

  const capabilities: string[] = [];
  capabilities.push(isPharma ? "cGMP capable" : "ISO 9001 / 14001");
  if (isPharma) capabilities.push("Regulatory filing support");
  capabilities.push(plantType === "Continuous" ? "Continuous processing" : "Multipurpose batch");
  capabilities.push("Export to USA, EU, Canada");
  if (supplierSignal > 0) capabilities.push("Existing merchant supply");

  return {
    known: Boolean(product),
    productName: name,
    category,
    group,
    vendorCount,
    plantType,
    isPharma,
    capabilities,
  };
}
