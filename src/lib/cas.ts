import { products } from "@/data/products";
import { slug } from "@/lib/utils";

// CAS Registry Numbers live on the product knowledge base. Companies in the
// trade data do not carry a CAS directly, so we resolve one through the HS code
// or product name they trade. These lookups are built once from the catalog.

const normCas = (s: string) => s.toLowerCase().replace(/\s+/g, "");

const casByHs = new Map<string, string[]>();
const casByName = new Map<string, string>();

for (const p of products) {
  if (!p.cas) continue;
  casByName.set(slug(p.name), p.cas);
  const arr = casByHs.get(p.hsCode) ?? [];
  if (!arr.includes(p.cas)) arr.push(p.cas);
  casByHs.set(p.hsCode, arr);
}

export function casForHsCodes(hsCodes: string[]): string[] {
  const out: string[] = [];
  for (const h of hsCodes) {
    for (const c of casByHs.get(h) ?? []) if (!out.includes(c)) out.push(c);
  }
  return out;
}

export function casForProductNames(names: string[]): string[] {
  const out: string[] = [];
  for (const n of names) {
    const c = casByName.get(slug(n));
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

// All CAS numbers a company can be reached by, via its HS codes and products.
export function casForCompany(hsCodes: string[], productNames: string[] = []): string[] {
  const out = casForHsCodes(hsCodes);
  for (const c of casForProductNames(productNames)) if (!out.includes(c)) out.push(c);
  return out;
}

// True when the query (a full or partial CAS number) matches any CAS linked to
// the given HS codes or product names.
export function matchesCas(query: string, hsCodes: string[], productNames: string[] = []): boolean {
  const q = normCas(query);
  if (!q) return false;
  return casForCompany(hsCodes, productNames).some((c) => normCas(c).includes(q));
}

// Heuristic for a CAS-shaped query, e.g. "64-19-7" or a leading fragment.
export function looksLikeCas(query: string): boolean {
  return /^\d{2,7}-\d{0,2}-?\d?$/.test(query.trim());
}
