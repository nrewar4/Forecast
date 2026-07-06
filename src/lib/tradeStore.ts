import type { Shipment } from "@/data/trade";
import { SHIPMENTS_TABLE, isSupabaseConfigured, supabase } from "./supabase";

const STORAGE_KEY = "apac.trade.shipments.v1";

export type Backend = "Supabase" | "Browser";

export const activeBackend: Backend = isSupabaseConfigured ? "Supabase" : "Browser";

// Maps between our camelCase Shipment and the snake_case database columns.
type Row = {
  mode: string;
  date: string;
  hs_code: string;
  product: string;
  sector: string;
  transport: string;
  importer: string;
  supplier: string;
  origin: string;
  quantity_t: number;
  unit_price: number;
  total_value: number;
  created_at?: string;
};

function toRow(s: Shipment): Row {
  return {
    mode: s.mode,
    date: s.date,
    hs_code: s.hsCode,
    product: s.product,
    sector: s.sector,
    transport: s.transport,
    importer: s.importer,
    supplier: s.supplier,
    origin: s.origin,
    quantity_t: s.quantityT,
    unit_price: s.unitPrice,
    total_value: s.totalValue,
  };
}

function fromRow(r: Row): Shipment {
  return {
    mode: (r.mode === "Exports" ? "Exports" : "Imports") as Shipment["mode"],
    date: r.date,
    hsCode: r.hs_code,
    product: r.product,
    sector: r.sector,
    transport: (r.transport as Shipment["transport"]) ?? "Sea",
    importer: r.importer,
    supplier: r.supplier,
    origin: r.origin,
    quantityT: Number(r.quantity_t) || 0,
    unitPrice: Number(r.unit_price) || 0,
    totalValue: Number(r.total_value) || 0,
  };
}

function loadLocal(): Shipment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Shipment[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(rows: Shipment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // storage may be unavailable, ignore
  }
}

// Returns every uploaded shipment, newest first.
export async function loadUploaded(): Promise<Shipment[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from(SHIPMENTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase load failed, falling back to local cache:", error.message);
      return loadLocal();
    }
    return (data as Row[]).map(fromRow);
  }
  return loadLocal();
}

// Persists new rows and returns the full uploaded set, newest first.
export async function addUploaded(rows: Shipment[], current: Shipment[]): Promise<Shipment[]> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from(SHIPMENTS_TABLE).insert(rows.map(toRow));
    if (error) {
      console.warn("Supabase insert failed, falling back to local cache:", error.message);
      const next = [...rows, ...current];
      saveLocal(next);
      return next;
    }
    return loadUploaded();
  }
  const next = [...rows, ...current];
  saveLocal(next);
  return next;
}

// Clears uploaded rows. For Supabase this removes all rows in the table.
export async function clearUploaded(): Promise<Shipment[]> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from(SHIPMENTS_TABLE).delete().neq("product", "__none__");
    if (error) console.warn("Supabase clear failed:", error.message);
    return [];
  }
  saveLocal([]);
  return [];
}
