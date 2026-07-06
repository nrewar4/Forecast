import type { Mode, Shipment } from "@/data/trade";

// xlsx is large (~400 kB). Load it lazily so it is only fetched when the user
// actually parses or exports a spreadsheet, not on first page load.

// Maps loose Datamyne column headers to our shipment fields. Aliases are listed
// in priority order, lower cased and stripped of non alphanumerics. The first
// alias that matches a real header wins, so put the preferred name first.
const FIELD_ALIASES: Record<string, string[]> = {
  date: ["date", "shipmentdate", "shippingdate", "arrivaldate", "billdate"],
  hsCode: ["hscode", "hs", "htscode", "tariffcode", "masterhs", "masterharmonized", "harmonizedcode"],
  product: [
    "product",
    "productdescription",
    "commercialdescription",
    "commercialname",
    "hsdescription",
    "goodsdescription",
    "commodity",
    "goods",
    "fullcontainerdescription",
    "containerdescription",
    "cargodescription",
    "shortcontainerdescription",
    "masterdescription",
    "description",
  ],
  sector: ["sector", "industry", "segment"],
  transport: ["transport", "transportmethod", "transportmode", "modeoftransport", "shipmenttype", "mode"],
  importer: ["importer", "foreignbuyer", "buyer", "consigneeunified", "consignee", "consigneedeclared", "importername", "notifyname"],
  supplier: ["supplier", "exporter", "shipperunified", "shipper", "shipperdeclared", "seller", "manufacturer"],
  origin: [
    "countryoforigin",
    "origin",
    "origincountry",
    "countrybyportofdeparture",
    "countryoffinaldestination",
    "countryofdestination",
    "finaldestination",
    "country",
    "destination",
  ],
  quantityT: ["metrictons", "quantityt", "tonnes", "weighttonnes", "netweight", "weight", "quantity", "qty"],
  quantityUnit: ["unit", "uom", "unitofmeasure", "quantityunit", "measure"],
  unitPrice: ["unitprice", "priceperunit", "unitvalueusd", "unitvaluefobusd", "unitvalue", "price"],
  totalValue: ["totalvalueusd", "totalvalue", "fobvalueusd", "cifvalueusd", "valueusd", "value", "cifvalue", "fobvalue", "invoicevalue", "amount"],
};

// Converts a quantity expressed in the file unit to metric tonnes. Datamyne
// structured extracts report Quantity with a separate Unit column that is often
// KILOGRAMS, so without this every weight would be a thousand times too large.
function tonnesFactor(unit: string): number {
  const u = norm(unit);
  if (!u) return 1;
  if (/(kilogram|kgm|kgs|^kg)/.test(u)) return 0.001;
  if (/(milligram|^mg)/.test(u)) return 1e-9;
  if (/(gram|^g$|grams)/.test(u)) return 1e-6;
  if (/(pound|lbs|^lb)/.test(u)) return 0.000453592;
  if (/(metricton|tonne|^mt|^ton|^t$)/.test(u)) return 1;
  return 1; // unknown unit, assume the value is already in tonnes
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Respects alias priority: for each field, the first alias that appears in the
// header row is used.
function buildHeaderMap(headers: string[]): Record<string, number> {
  const normed = headers.map((h) => norm(String(h ?? "")));
  const map: Record<string, number> = {};
  for (const field in FIELD_ALIASES) {
    for (const alias of FIELD_ALIASES[field]) {
      const idx = normed.indexOf(alias);
      if (idx !== -1) {
        map[field] = idx;
        break;
      }
    }
  }
  return map;
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

// Excel stores dates as a serial day count. Convert when we see a plausible one.
function excelSerialToDate(n: number): string {
  const ms = Math.round((n - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function normDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number" && v > 20000 && v < 80000) return excelSerialToDate(v);
  const s = String(v ?? "").trim();
  return s || "2026-02-28";
}

function normTransport(v: unknown): Shipment["transport"] {
  const s = norm(String(v ?? ""));
  if (s.includes("air")) return "Air";
  if (s.includes("road") || s.includes("truck")) return "Road";
  if (s.includes("icd") || s.includes("rail")) return "ICD";
  return "Sea";
}

// HS cells can hold several codes ("290512 380894"). Take the first numeric code.
function firstHsCode(v: unknown): string {
  const m = String(v ?? "").match(/\d{4,}/);
  return m ? m[0] : String(v ?? "").trim();
}

// Some exports have no HS column. The code is embedded in the description text
// under many different labels. Datamyne US export manifests use any of HS CODE,
// HTS, HARMONIZED, SCHEDULE B, or NCM (the Mercosur code), with or without dots,
// for example "HS CODE: 2815200090", "HTS: 2921.22", "NCM 2915.60".
function extractHsFromText(text: string): string {
  const labels = [
    /H\.?\s*S\.?\s*CODE[:\s#]*([\d][\d.\s]{4,14})/i,
    /HTS(?:US)?[:\s#]*([\d][\d.\s]{4,14})/i,
    /HARMONI[SZ]ED(?:\s*CODE)?[:\s#]*([\d][\d.\s]{4,14})/i,
    /SCHEDULE\s*B[:\s#]*([\d][\d.\s]{4,14})/i,
    /\bNCM[:\s#]*([\d][\d.\s]{4,12})/i,
    /\bTARIFF[:\s#]*([\d][\d.\s]{4,14})/i,
  ];
  for (const re of labels) {
    const m = text.match(re);
    if (m) {
      const digits = m[1].replace(/\D/g, "");
      if (digits.length >= 6 && validChapter(digits)) return digits.slice(0, 10);
    }
  }
  // Last resort: a standalone 8 to 10 digit code with a valid HS chapter, so a
  // document or reference number is not mistaken for a tariff code.
  for (const g of text.match(/\b\d{8,10}\b/g) ?? []) {
    if (validChapter(g)) return g.slice(0, 10);
  }
  return "";
}

// HS codes begin with a chapter from 01 to 97. This rejects all zero document
// numbers and other reference codes that happen to be the right length.
function validChapter(digits: string): boolean {
  const ch = parseInt(digits.slice(0, 2), 10);
  return ch >= 1 && ch <= 97;
}

// Common chemicals seen in container descriptions, matched on keywords so the
// product name is clean and groupable instead of a wall of shipping text.
const NAME_KEYWORDS: [RegExp, string][] = [
  [/POTASSIUM\s+HYDROXIDE|\bKOH\b/i, "Potassium hydroxide"],
  [/SODIUM\s+HYDROXIDE|CAUSTIC\s+SODA/i, "Sodium hydroxide"],
  [/HEXAMETHYLENEDIAMINE|\bHMD\b/i, "Hexamethylenediamine"],
  [/ANHYDROUS\s+AMMONIA|AMMONIA,?\s+ANHYDROUS|\bNH3\b/i, "Ammonia anhydrous"],
  [/PHOSPHORIC\s+ACID/i, "Phosphoric acid"],
  [/SULPHURIC\s+ACID|SULFURIC\s+ACID/i, "Sulphuric acid"],
  [/NITRIC\s+ACID/i, "Nitric acid"],
  [/ACETIC\s+ACID/i, "Acetic acid"],
  [/HYDROCHLORIC\s+ACID|MURIATIC/i, "Hydrochloric acid"],
  [/METHANOL|METHYL\s+ALCOHOL/i, "Methanol"],
  [/ETHANOL|ETHYL\s+ALCOHOL/i, "Ethanol"],
  [/ETHYLENE\s+GLYCOL/i, "Ethylene glycol"],
  [/PROPYLENE\s+GLYCOL/i, "Propylene glycol"],
  [/\bTOLUENE\b/i, "Toluene"],
  [/\bXYLENE\b/i, "Xylene"],
  [/\bBENZENE\b/i, "Benzene"],
  [/\bSTYRENE\b/i, "Styrene monomer"],
  [/\bACETONE\b/i, "Acetone"],
  [/\bUREA\b/i, "Urea"],
  [/HYDROGEN\s+PEROXIDE/i, "Hydrogen peroxide"],
  [/SODIUM\s+HYPOCHLORITE/i, "Sodium hypochlorite"],
  [/CALCIUM\s+CHLORIDE/i, "Calcium chloride"],
  [/TITANIUM\s+DIOXIDE/i, "Titanium dioxide"],
  [/EPOXY|EPOXIDE\s+RESIN/i, "Epoxy resin"],
  [/POLYETHYLENE/i, "Polyethylene"],
  [/POLYPROPYLENE/i, "Polypropylene"],
  [/GLYCERINE|GLYCEROL|GLYCERIN/i, "Glycerine"],
  [/PHENOL/i, "Phenol"],
  [/FORMALDEHYDE|FORMALIN/i, "Formaldehyde"],
  [/AMMONIUM\s+NITRATE/i, "Ammonium nitrate"],
  [/MALEIC\s+ANHYDRIDE/i, "Maleic anhydride"],
  [/ACETIC\s+ANHYDRIDE/i, "Acetic anhydride"],
  [/BORIC\s+ACID|OXIDES?\s+OF\s+BORON/i, "Boric acid"],
  [/BAKING\s+SODA|SODIUM\s+BICARBONATE/i, "Sodium bicarbonate"],
  [/SODIUM\s+CARBONATE|SODA\s+ASH/i, "Sodium carbonate"],
  [/POTASSIUM\s+CARBONATE/i, "Potassium carbonate"],
  [/CITRIC\s+ACID/i, "Citric acid"],
  [/PHOSPHORUS\s+TRICHLORIDE/i, "Phosphorus trichloride"],
  [/ETHYL\s+ACETATE/i, "Ethyl acetate"],
  [/BUTYL\s+ACETATE/i, "Butyl acetate"],
  [/ISOPROPYL\s+ALCOHOL|ISOPROPANOL|\bIPA\b/i, "Isopropyl alcohol"],
  [/\bBUTANOL\b|BUTYL\s+ALCOHOL/i, "Butanol"],
  [/AMMONIUM\s+SULPHATE|AMMONIUM\s+SULFATE/i, "Ammonium sulphate"],
  [/POTASSIUM\s+CHLORIDE|\bMURIATE\s+OF\s+POTASH\b/i, "Potassium chloride"],
];

function matchKnownName(text: string): string {
  for (const [re, name] of NAME_KEYWORDS) {
    if (re.test(text)) return name;
  }
  return "";
}

// Pull a readable product name out of a free text container description.
function extractProductName(text: string): string {
  const m = text.match(
    /COMMERCIAL\s*NAME[:\s]*([^\n]+?)(?:\s{2,}|HS\s*CODE|PURCHASE\s*ORDER|SKU|DGS|SCHEDULE\s*B|UN\d|$)/i,
  );
  if (m && m[1].trim()) return m[1].trim();
  return "";
}

// HS descriptions look like "390730 - EPOXIDE RESINS, IN PRIMARY FORMS" and can
// span multiple lines. Take the first line and drop a leading code.
function cleanProduct(v: unknown): string {
  let first = String(v ?? "").split(/[\n\r]/)[0].trim();
  // Drop shipping boilerplate that often trails the real description.
  first = first.split(/\b(?:HS\s*CODE|HTS|SCHEDULE\s*B|PURCHASE\s*ORDER|\bPO[:#]|SHIPPER'?S\s+LOAD|TARE|NET\s+WEIGHT|BATCH|EXPIRY|MFG|DTLS|AS\s+PER\s+INV|UN\d{3,})\b/i)[0].trim();
  const stripped = first.replace(/^\d{4,}\s*[-:]\s*/, "").replace(/^UN\d{3,}[,\s]*/i, "").trim();
  const out = stripped || first;
  return out.length > 60 ? out.slice(0, 60).trim() : out;
}

// Maps an HS chapter (first two digits) to a readable sector so rows from a
// free text manifest still classify even without a sector column.
function sectorFromHs(hsCode: string): string {
  const ch = hsCode.slice(0, 2);
  const map: Record<string, string> = {
    "28": "Inorganic chemicals",
    "29": "Organic chemicals",
    "31": "Fertiliser",
    "32": "Dyes and pigments",
    "33": "Essential oils",
    "34": "Soaps and surfactants",
    "38": "Speciality chemicals",
    "39": "Polymers and resins",
    "27": "Petrochemicals",
  };
  return map[ch] ?? "";
}

export type ParseResult = {
  rows: Shipment[];
  imported: number;
  skipped: number;
  missingColumns: string[];
  valueColumnMissing: boolean;
};

function fail(missingColumns: string[], skipped = 0): ParseResult {
  return { rows: [], imported: 0, skipped, missingColumns, valueColumnMissing: true };
}

export async function parseTradeFile(file: File, mode: Mode): Promise<ParseResult> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  // Prefer a sheet named DATA (Datamyne default), else the first sheet.
  const sheetName = wb.SheetNames.find((n) => norm(n) === "data") ?? wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });

  if (grid.length < 2) return fail(["a header row and at least one data row"]);

  const headers = (grid[0] as unknown[]).map((h) => String(h ?? ""));
  const map = buildHeaderMap(headers);

  // We need at least an HS code or a product to identify a row.
  if (map.hsCode === undefined && map.product === undefined) {
    return fail(["HS Code or Product"], grid.length - 1);
  }

  const valueColumnMissing = map.totalValue === undefined && map.unitPrice === undefined;

  const cell = (row: unknown[], field: string): unknown =>
    map[field] === undefined ? undefined : row[map[field]];

  const rows: Shipment[] = [];
  let skipped = 0;

  for (let i = 1; i < grid.length; i++) {
    const row = grid[i] as unknown[];
    if (!row || row.length === 0) {
      skipped++;
      continue;
    }
    const productText = String(cell(row, "product") ?? "");
    // HS code from a dedicated column, else extracted from the description text.
    let hsCode = firstHsCode(cell(row, "hsCode"));
    if (!hsCode) hsCode = extractHsFromText(productText);
    // Product name: a recognised chemical wins, then a stated commercial name,
    // then the cleaned description text, then an HS fallback.
    const product =
      matchKnownName(productText) ||
      extractProductName(productText) ||
      cleanProduct(productText) ||
      (hsCode ? `HS ${hsCode}` : "");
    if (!hsCode && !product) {
      skipped++;
      continue;
    }

    // Sector from the file if present, else inferred from the HS chapter.
    const sectorCell = String(cell(row, "sector") ?? "").trim();
    const sector = sectorCell || sectorFromHs(hsCode) || "Unclassified";

    // Quantity, converted to tonnes using the file unit when one is present.
    const rawQty = toNumber(cell(row, "quantityT"));
    const factor = tonnesFactor(String(cell(row, "quantityUnit") ?? ""));
    const quantityT = Math.round(rawQty * factor * 1000) / 1000;

    // Value. The declared unit price is per original unit, so derive the total
    // from the raw quantity, then normalise unit price to per tonne.
    let totalValue = toNumber(cell(row, "totalValue"));
    let unitPrice = toNumber(cell(row, "unitPrice"));
    if (!totalValue && unitPrice && rawQty) totalValue = Math.round(unitPrice * rawQty);
    unitPrice = totalValue && quantityT ? Math.round(totalValue / quantityT) : 0;

    rows.push({
      mode,
      date: normDate(cell(row, "date")),
      hsCode: hsCode || "n/a",
      product: product || "Unspecified",
      sector,
      transport: normTransport(cell(row, "transport")),
      importer: String(cell(row, "importer") ?? "Unknown").trim() || "Unknown",
      supplier: String(cell(row, "supplier") ?? "Unknown").trim() || "Unknown",
      origin: String(cell(row, "origin") ?? "Unknown").trim() || "Unknown",
      quantityT,
      unitPrice,
      totalValue,
    });
  }

  return { rows, imported: rows.length, skipped, missingColumns: [], valueColumnMissing };
}

// Builds a small sample workbook users can fill and re-upload.
export async function downloadTemplate() {
  const XLSX = await import("xlsx");
  const headers = [
    "Date", "HS Code", "Product", "Sector", "Transport",
    "Importer", "Supplier", "Origin", "Quantity", "Unit Price", "Total Value",
  ];
  const example = [
    "2026-03-05", "29024300", "Paraxylene", "Petrochemicals", "Sea",
    "MCPI Private Limited", "Tauber Petrochemical", "Saudi Arabia", 15000, 947, 14205000,
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Shipments");
  XLSX.writeFile(wb, "datamyne_template.xlsx");
}
