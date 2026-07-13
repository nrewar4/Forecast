// Matches a molecule against APAC's real India CDMO vendor network and returns
// HOW MANY manufacturers can make it, never who. The count is grounded ONLY in
// the uploaded vendor capability data (src/data/cdmoVendors.ts): a molecule's
// required broad process chemistries are matched against each vendor's
// capabilities, and the count is the number of vendors that can run all of them.
// When no vendor covers the required chemistry the count is zero, honestly; no
// number is ever invented.

import { products, type Product } from "@/data/products";
import { classifyProduct } from "@/lib/apacCategory";
import { CDMO_VENDORS } from "@/data/cdmoVendors";

export type CdmoMatch = {
  /** true when the query resolved to a known catalog product */
  known: boolean;
  productName: string;
  category: string;
  group: string;
  /** number of network manufacturers whose capabilities cover the chemistry */
  vendorCount: number;
  plantType: "Batch" | "Continuous" | "Mixed";
  isPharma: boolean;
  /** the broad chemistries the count was matched on */
  capabilities: string[];
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

// Counts vendors from the real network whose capabilities cover EVERY required
// broad chemistry. The generic "Multistep organic synthesis" fallback is not a
// specific chemistry, so it never matches; and with no required chemistry, or no
// vendor that covers all of them, the count is a truthful zero.
function countCapableVendors(required: string[]): number {
  if (required.length === 0) return 0;
  return CDMO_VENDORS.filter((v) => required.every((r) => v.c.includes(r))).length;
}

// Builds the manufacturer match for a resolved-or-named product. `chemistries`
// are the broad process chemistries the molecule needs (from processChemistries);
// the count is how many vendors can run all of them.
export function matchVendors(query: string, displayName?: string, chemistries?: string[]): CdmoMatch {
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

  const required = (chemistries ?? []).filter((c) => c !== "Multistep organic synthesis");
  const vendorCount = countCapableVendors(required);

  return {
    known: Boolean(product),
    productName: name,
    category,
    group,
    vendorCount,
    plantType,
    isPharma,
    capabilities: required,
  };
}
