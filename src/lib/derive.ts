import type { Mode, Shipment } from "@/data/trade";

export type Ranked = { name: string; value: number; qty: number; count: number };

function topBy(
  rows: Shipment[],
  keyFn: (s: Shipment) => string,
  n: number,
): Ranked[] {
  const map = new Map<string, Ranked>();
  for (const s of rows) {
    const name = keyFn(s).trim() || "Unknown";
    if (name === "Unknown") continue;
    const cur = map.get(name) ?? { name, value: 0, qty: 0, count: 0 };
    cur.value += s.totalValue;
    cur.qty += s.quantityT;
    cur.count += 1;
    map.set(name, cur);
  }
  return Array.from(map.values())
    .sort((a, b) => b.value - a.value || b.qty - a.qty)
    .slice(0, n);
}

export function topProducts(shipments: Shipment[], mode: Mode, n = 5): Ranked[] {
  return topBy(shipments.filter((s) => s.mode === mode), (s) => s.product, n);
}

export function topImporters(shipments: Shipment[], n = 5): Ranked[] {
  return topBy(shipments.filter((s) => s.mode === "Imports"), (s) => s.importer, n);
}

export function topExporters(shipments: Shipment[], n = 5): Ranked[] {
  return topBy(shipments.filter((s) => s.mode === "Exports"), (s) => s.supplier, n);
}

export function uniqueCount(shipments: Shipment[], keyFn: (s: Shipment) => string): number {
  const set = new Set<string>();
  for (const s of shipments) set.add(keyFn(s).trim());
  set.delete("");
  return set.size;
}

export function sumValue(shipments: Shipment[]): number {
  return shipments.reduce((a, s) => a + s.totalValue, 0);
}

// Short label for charts so long HS descriptions do not overflow.
export function shortLabel(s: string, max = 16): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "..." : t;
}

function mostCommon(values: string[]): string {
  const map = new Map<string, number>();
  for (const v of values) {
    const t = v.trim();
    if (!t || t === "Unknown") continue;
    map.set(t, (map.get(t) ?? 0) + 1);
  }
  let best = "";
  let bestN = 0;
  for (const [k, n] of map) {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best || "Unknown";
}

export type Party = {
  company: string;
  value: number;
  qty: number;
  shipments: number;
  products: string[];
  hsCodes: string[];
  topCountry: string;
};

function aggregateParty(
  rows: Shipment[],
  nameFn: (s: Shipment) => string,
  countryFn: (s: Shipment) => string,
): Party[] {
  const map = new Map<string, { p: Party; countries: string[] }>();
  for (const s of rows) {
    const company = nameFn(s).trim() || "Unknown";
    if (company === "Unknown") continue;
    let entry = map.get(company);
    if (!entry) {
      entry = { p: { company, value: 0, qty: 0, shipments: 0, products: [], hsCodes: [], topCountry: "" }, countries: [] };
      map.set(company, entry);
    }
    entry.p.value += s.totalValue;
    entry.p.qty += s.quantityT;
    entry.p.shipments += 1;
    if (s.product && !entry.p.products.includes(s.product)) entry.p.products.push(s.product);
    if (s.hsCode && !entry.p.hsCodes.includes(s.hsCode)) entry.p.hsCodes.push(s.hsCode);
    entry.countries.push(countryFn(s));
  }
  return Array.from(map.values())
    .map(({ p, countries }) => ({ ...p, topCountry: mostCommon(countries) }))
    .sort((a, b) => b.value - a.value || b.qty - a.qty);
}

// Buyers come from import shipments, keyed by importer.
export function deriveBuyers(shipments: Shipment[]): Party[] {
  return aggregateParty(
    shipments.filter((s) => s.mode === "Imports"),
    (s) => s.importer,
    (s) => s.origin,
  );
}

// Manufacturers come from every shipment, keyed by supplier.
export function deriveSuppliers(shipments: Shipment[]): Party[] {
  return aggregateParty(shipments, (s) => s.supplier, (s) => s.origin);
}

// A unified trade counterparty: a single company seen as a buyer (importer on
// import shipments), a supplier (on any shipment), or both. This merges the old
// Clients and Suppliers views into one network of partners, so each company
// appears once with its full two-sided footprint.
export type PartnerRole = "Buyer" | "Supplier" | "Both";

export type Partner = {
  company: string;
  role: PartnerRole;
  buyValue: number;
  buyShipments: number;
  sellValue: number;
  sellShipments: number;
  value: number; // buy + sell, total trade footprint
  qty: number;
  shipments: number;
  products: string[];
  hsCodes: string[];
  topCountry: string;
  countries: number;
  counterparties: number;
};

export function derivePartners(shipments: Shipment[]): Partner[] {
  type Acc = {
    company: string;
    buyValue: number;
    buyQty: number;
    buyShipments: number;
    sellValue: number;
    sellQty: number;
    sellShipments: number;
    products: Set<string>;
    hsCodes: Set<string>;
    countries: string[];
    counterparties: Set<string>;
  };
  const map = new Map<string, Acc>();
  const get = (name: string): Acc | null => {
    const c = name.trim();
    if (!c || c === "Unknown") return null;
    let a = map.get(c);
    if (!a) {
      a = {
        company: c,
        buyValue: 0, buyQty: 0, buyShipments: 0,
        sellValue: 0, sellQty: 0, sellShipments: 0,
        products: new Set(), hsCodes: new Set(), countries: [], counterparties: new Set(),
      };
      map.set(c, a);
    }
    return a;
  };

  for (const s of shipments) {
    // Buyer side: the importer named on an import shipment.
    if (s.mode === "Imports") {
      const b = get(s.importer);
      if (b) {
        b.buyValue += s.totalValue;
        b.buyQty += s.quantityT;
        b.buyShipments += 1;
        if (s.product) b.products.add(s.product);
        if (s.hsCode) b.hsCodes.add(s.hsCode);
        b.countries.push(s.origin);
        if (s.supplier && s.supplier.trim() !== "Unknown") b.counterparties.add(s.supplier.trim());
      }
    }
    // Supplier side: the supplier named on any shipment.
    const sup = get(s.supplier);
    if (sup) {
      sup.sellValue += s.totalValue;
      sup.sellQty += s.quantityT;
      sup.sellShipments += 1;
      if (s.product) sup.products.add(s.product);
      if (s.hsCode) sup.hsCodes.add(s.hsCode);
      sup.countries.push(s.origin);
      if (s.importer && s.importer.trim() !== "Unknown") sup.counterparties.add(s.importer.trim());
    }
  }

  return Array.from(map.values())
    .map((a) => {
      const role: PartnerRole =
        a.buyShipments > 0 && a.sellShipments > 0 ? "Both" : a.buyShipments > 0 ? "Buyer" : "Supplier";
      return {
        company: a.company,
        role,
        buyValue: a.buyValue,
        buyShipments: a.buyShipments,
        sellValue: a.sellValue,
        sellShipments: a.sellShipments,
        value: a.buyValue + a.sellValue,
        qty: a.buyQty + a.sellQty,
        shipments: a.buyShipments + a.sellShipments,
        products: Array.from(a.products),
        hsCodes: Array.from(a.hsCodes),
        topCountry: mostCommon(a.countries),
        countries: new Set(a.countries.filter((c) => c && c !== "Unknown")).size,
        counterparties: a.counterparties.size,
      };
    })
    .sort((x, y) => y.value - x.value || y.qty - x.qty);
}

// Demand growth ranking and forecasting now live in src/lib/forecast.ts, where
// each model is a real algorithm fitted to the product demand series.
