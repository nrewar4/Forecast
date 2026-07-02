import db from "../../data/cdmo_capabilities.json";

// The CDMO competitor capability database is authored as portable JSON in
// /data so it can move into a real database without rework. The app imports it
// here and layers on light types for rendering.

export type CapabilityItem = {
  name: string;
  maturity?: string;
  note?: string;
  oebLevels?: string[];
};

export type Company = {
  id: string;
  name: string;
  aka?: string[];
  tickers?: Record<string, string>;
  headquarters: string;
  founded: string;
  listed?: string;
  ownership?: string;
  positioning: string;
  businessModel: string;
  mergerNote?: string;
  metrics: Record<string, any>;
  segments: { name: string; note?: string }[];
  sites: Record<string, any>[];
  regulatory: Record<string, any>;
  capabilities: Record<string, CapabilityItem[]>;
  products: Record<string, any>;
  therapeuticFocus: string[];
  sourcingAngle: string;
  sources: string[];
};

export type CapabilityDomain = { id: string; name: string; note: string };

export type ComparisonRow = {
  dimension: string;
  divis: string;
  sailife: string;
  cohance: string;
};

export const capabilityDomains = db.capabilityDomains as CapabilityDomain[];
export const companies = db.companies as unknown as Company[];
export const comparison = db.comparison as {
  note: string;
  dimensions: ComparisonRow[];
};
export const taxonomy = db.taxonomy as {
  levels: { level: number; name: string; note: string }[];
};
export const meta = {
  title: db.title as string,
  description: db.description as string,
  lastUpdated: db.lastUpdated as string,
  methodology: db.methodology as string,
};
