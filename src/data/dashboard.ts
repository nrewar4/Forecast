export type KpiCard = { label: string; value: string; sub: string; trend: string };

export const kpis: KpiCard[] = [
  { label: "Import Records", value: "5,000", sub: "612 unique HS codes", trend: "+8.2%" },
  { label: "Export Records", value: "5,000", sub: "628 unique HS codes", trend: "+6.5%" },
  { label: "Tracked Manufacturers", value: "48", sub: "across 9 countries", trend: "+4 new" },
  { label: "Growth Leaders", value: "12", sub: "double digit forecast", trend: "+12 YoY" },
];

export type ProductValue = { name: string; hs?: string; value: number };

export const topImportProducts: ProductValue[] = [
  { name: "Phosphoric acid", hs: "28092010", value: 21.0 },
  { name: "Paraxylene", hs: "29024300", value: 14.2 },
  { name: "Styrene monomer", hs: "29025000", value: 9.8 },
  { name: "Methanol", hs: "29051100", value: 6.4 },
  { name: "Benzene", hs: "29022000", value: 5.1 },
];

export const topExportProducts: ProductValue[] = [
  { name: "Heterocyclic cmpd", hs: "29331999", value: 12.5 },
  { name: "Heterocyclic cmpd", hs: "29335990", value: 8.9 },
  { name: "Benzene", hs: "29022000", value: 7.3 },
  { name: "Paracetamol int.", value: 4.6 },
  { name: "Speciality APIs", value: 3.2 },
];

export type CompanyValue = { name: string; value: number };

export const topImporters: CompanyValue[] = [
  { name: "Indian Farmers Fertiliser Coop", value: 21.0 },
  { name: "MCPI Private Limited", value: 8.4 },
  { name: "UMICORE Autocat India", value: 5.2 },
  { name: "Supreme Petrochem Ltd", value: 4.1 },
  { name: "Coromandel International", value: 3.0 },
];

export const topExporters: CompanyValue[] = [
  { name: "Anthem Biosciences Pvt Ltd", value: 12.5 },
  { name: "AMI Organics Ltd", value: 9.1 },
  { name: "Sai Life Sciences Ltd", value: 7.8 },
  { name: "Reliance Industries Ltd", value: 7.3 },
  { name: "Divi's Laboratories Ltd", value: 5.4 },
];
