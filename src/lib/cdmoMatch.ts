// Deterministic vendor-count logic for the CDMO feasibility answer. It returns
// how many manufacturers in the APAC network are relevant to a product, as a
// COUNT only. Vendor identities are never returned or exposed.
//
// No fabricated numbers: the on-record count is the distinct real producers and
// suppliers we actually hold for that product, and the network figure is APAC's
// real division manufacturer count (chemical 3,003, pharmaceutical 238). When we
// have no specific records, we say so honestly rather than inventing a count.

import { products, type Product } from "@/data/products";
import { supplierGroups } from "@/data/suppliers";
import { classifyByName, classifyProduct } from "@/lib/apacCategory";
import type { ApacCategory } from "@/data/apacCategories";
import { slug } from "@/lib/utils";

// Real APAC network manufacturer counts by division (from the APAC portal).
const NETWORK = {
  chemical: 3003,
  pharmaceutical: 238,
} as const;

export type VendorMatch = {
  productName: string;
  category: ApacCategory;
  division: "chemical" | "pharmaceutical";
  networkCount: number; // real division-level manufacturer count
  onRecordCount: number; // distinct real producers + suppliers we hold for this product
  inCatalog: boolean;
};

const PHARMA_GROUPS = new Set(["Fine Chemicals"]);
function divisionFor(cat: ApacCategory): "chemical" | "pharmaceutical" {
  if (cat.category === "Pharmaceuticals" || cat.category === "Pharmaceutical Excipients") return "pharmaceutical";
  if (PHARMA_GROUPS.has(cat.group) && (cat.category.includes("Pharma") || cat.category === "Enzymes")) {
    return "pharmaceutical";
  }
  return "chemical";
}

// Loose token overlap so "paraxylene" matches the "Paraxylene (HS ...)" group.
function looseMatch(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

// Finds the catalog product for a query, if any.
export function findCatalogProduct(query: string): Product | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const qCas = q.replace(/\s+/g, "");
  return (
    products.find((p) => slug(p.name) === slug(query)) ??
    products.find(
      (p) =>
        p.name.toLowerCase() === q ||
        p.cas.replace(/\s+/g, "") === qCas ||
        p.hsCode === q,
    ) ??
    products.find((p) => p.name.toLowerCase().includes(q) && q.length >= 4)
  );
}

export function matchVendors(query: string, product?: Product): VendorMatch {
  const catalogProduct = product ?? findCatalogProduct(query);
  const productName = catalogProduct?.name ?? query.trim();
  const category = catalogProduct ? classifyProduct(catalogProduct) : classifyByName(productName);
  const division = divisionFor(category);

  // Distinct real makers we actually hold: catalog producers plus suppliers whose
  // group name matches the product. Names are collected only to de-duplicate the
  // count; they are never returned.
  const names = new Set<string>();
  if (catalogProduct) {
    for (const p of catalogProduct.producers) names.add(p.trim().toLowerCase());
  }
  for (const group of supplierGroups) {
    if (looseMatch(group.product, productName)) {
      for (const s of group.suppliers) names.add(s.company.trim().toLowerCase());
    }
  }

  return {
    productName,
    category,
    division,
    networkCount: NETWORK[division],
    onRecordCount: names.size,
    inCatalog: !!catalogProduct,
  };
}
