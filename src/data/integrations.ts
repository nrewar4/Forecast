export type Integration = {
  name: string;
  category: string;
  purpose: string;
  status: "Connected" | "Available";
};

export const integrations: Integration[] = [
  { name: "Descartes Datamyne", category: "Trade data", purpose: "Import and export shipment records by HS code", status: "Connected" },
  { name: "PubChem", category: "Chemical reference", purpose: "CAS numbers, synonyms, structures", status: "Available" },
  { name: "ChemSpider", category: "Chemical reference", purpose: "Supplier links and identifiers", status: "Available" },
  { name: "ICIS", category: "Pricing", purpose: "Spot and contract chemical prices", status: "Available" },
  { name: "S&P Global Platts", category: "Pricing", purpose: "Commodity and energy benchmarks", status: "Available" },
  { name: "ISO Certified Clients Directory", category: "Certification", purpose: "Verify ISO 9001 and 14001", status: "Available" },
  { name: "REACH registration list", category: "Certification", purpose: "EU chemical compliance", status: "Available" },
  { name: "US FDA DMF and inspections", category: "Certification", purpose: "GMP status for APIs", status: "Available" },
  { name: "DGFT IEC database", category: "Company data", purpose: "Indian importer and exporter codes", status: "Available" },
  { name: "World Bank and IMF", category: "Macro", purpose: "Exchange rates and production indices", status: "Available" },
  { name: "Energy price feeds", category: "Macro", purpose: "Crude oil and natural gas drivers", status: "Available" },
  { name: "PDF and Excel uploads", category: "Documents", purpose: "Client supplied trade and COA files", status: "Connected" },
];
