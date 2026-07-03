// Junk-product detection for the trade dataset.
//
// The shipment data is built from messy Datamyne manifests. Even after the
// parser's name cleaning, a long tail of rows carry product "names" that are not
// real products at all: invoice/regulatory boilerplate ("Supply Meant For
// Export On Payment"), supplier catalogue codes ("A885695101 Ls-Strip…"),
// generic category labels ("Pharmaceutical Raw Material…"), or physical goods
// that are not chemicals ("ABS Sheet", "Disposable Gloves").
//
// `isJunkProduct` flags those rows so they can be excluded from every derived
// view (Overview KPIs, Trade Analytics product list and charts). It errs toward
// precision: when a real compound is recognisably buried in a dirty string we
// still drop it if the string is dominated by boilerplate, because the name is
// unusable as a clean catalogue entry, there is almost always a clean
// duplicate of the same compound elsewhere in the data.
//
// This was tuned against the full set of ~1,090 distinct product strings in the
// seed data (432 flagged as junk, 659 kept). It also runs on uploaded data so
// future extracts are cleaned the same way.

// Invoice / regulatory / shipping boilerplate, never a product name.
const BOILER: string[] = [
  "as per inv", "as per pkg", "as perinv", "details as per", "as per cust", "asper cust",
  "as per customer", "customer purchase", "intend to claim", "we intend", "claim rewards",
  "claim under", "claimunder", "covered under", "export is covered", "supply meant for export",
  "supporting manufacturer", "tax invoice", "tax date", "gst no", "gstin", " gst ", "gst:",
  "invoice no", "invoice number", "export invoice", "noc no", " noc", "lic no", "lic.", "license",
  "aeo certificate", "certificate no", "valid up", "re imported", "reimported", "made in india",
  "indian origin", "purchase order", "other details", "oth dtl", "oth dtls", "supplier details",
  "supl dtls", "details 25", "cin u", "batch no", "batchno", "expirydate", "expiry date", "retest",
  "mfgdt", "mfg dt", " mfd ", " b no", " b n ", "b nn", "bnf", "gst tax", "tax prism", "as per",
  "details as", "dtls as", " dtl as", "detailsas", "order no", "import auth", "auth no", " permit",
  "at the rateof", "kindof pkg", "consisting of", " moowr ", " w w ", "not for",
];

// Generic category descriptions with no specific compound.
const GENERIC: string[] = [
  "chemicals in bulk", "bulk drug", "auxiliary chemicals", "agro chemical", "misc chemicals",
  "inorganic chemical as per", "fine organic compound", "organic compounds-primary",
  "pharmaceutical raw material", "pharmaceuticals raw material", "pharmacutical", "pharma product",
  "pharmaceutical product raw", "pharmaceutical active pharmaceutical", "pharmaceutical allopathic",
  "active pharmaceutical ingredient", "laboratory chemical", "lab aids chemicals", "lab chem",
  "leather chemicals", "dye intermediate", "dye-intermediate", "dyes intermediate", "dye intermediates",
  "organic dye intermediate", "heterocyclic compound", "heterocyclic compounds", "derivative of",
  "industrial raw material", "chemicals for paper making", "dyeing and finishing chemicals",
  "textile chemicals", "textile finishing chemicals", "screen printing", "printing ink",
  "speciality chemicals surfactants", "metal finishing chemicals", "electroplating chemicals",
  "rubber chemicals", "rubber processing chemicals", "culture media", "prepared driers",
  "prepared glues", "material protection products", "construction chemicals", "finishing agents",
  "raw material", "raw materials", "ro etp stp", "offset processing", "diamond abrasive",
  "synthetic organic dyes", "dyes pigments and chemicals", "reactive dyes colron",
  "optical brightening agent", "surface-active preparations", "odoriferous substances",
  "odorifereous substances", "aroma chemicals", "mixtures of odoriferous", "auxiliaries for",
  "item harmless", "sap harmless", "harmless pharmaceutical", "drug intermediates", "bulk drugs",
  "speciality chemicals surfactant", "chemicals products", "spec", "chemical hs",
  "non-hazardous chemical", "non hazardous", "non hazardous liquid", "substituted ",
  "other heterdcyclic", "other unstrd", "unsaturated acylic", "monocrboxylc",
  "monocarboxylic acids,their", "ketone-phenols", "carbonyl compounds,", "derivatives ketone",
  "product customer", "laboratory equipment", "laboratory chemcial", "ultra pure water",
  "wash solution", "moulding compound", "dyestuffs", "heterdcyclic", "cmpnds with",
];

// Physical (non-chemical) goods.
const GOODS: string[] = [
  "abs sheet", "acrylic sheet", "plastic sheet", "pvc flooring", "pvc foam board", "pvc rigid film",
  "eva foam sheet", "eva for footwear", "cellulose acetate film", "polyester film", "rainbow film",
  "bopa film", "tpu membrane", "upvc profile", "wall panel", "disposable glove", "empty plastic bottle",
  "plastic bottle", "plastic connector", "plastic tube", "flexible hose", "faucet tap", "faucet",
  "caps and closures", "sticker logo", "tool case", "mandrel", "capacitor", "exer equip", "pe bag",
  "pvc tape", "retort pouch", "curl mask", "keratin hair shampoo", "destilled water automobile",
  "electrofusion coupler", "solder resist", "peek tubing", "abrasive cleaners", "spare parts",
  "empty cylinder", "empty tool", "cored wire", "calcium cored wire", "solid surface sheet",
  "nano powder", "activated carbon printing",
];

// Opaque brand fragments / un-identifiable tokens (matched on the whole name).
const OPAQUE = new Set<string>([
  "et", "ocp", "dasa", "dmtc", "hydr", "hydroxid", "helite", "trishul", "lifeline", "mernox",
  "marlon h", "selan mr76", "powerex nd", "pp3155e5", "ppy pf6", "mk -mk", "aquafit", "insoluble ot",
  "delta dc", "delta sp", "sun theic", "ao acid", "yalub natd", "etchinol s", "interlite zp",
  "catalyst kd-3", "cymel lf", "ptsc a-19", "mischmetal", "krytox-gp", "lapox apin-10",
  "kebinder plt-r", "daplien mr1080", "calipharm a", "primagol hsi liquid", "gujmol ms powder",
  "unichem 50f", "mas aqua metallic richpale gold", "sol-ssl 2025exp date",
  "slv claro -25, -25, -25, -25", "sna-t8-ta ta-25", "hld-pivot", "hind set -laf",
  "orspirane 24d117004-13", "dap1004 kap104 spl518 phenolic resin rpl263", "bonded semicon compound",
  "decoating powder", "exotherm cover flux skf", "enamel frit na", "elco drum",
  "cyclone pf for bg link protectiv", "powder coatings", "sealing compound", "sealant",
  "mb rubber material granule", "abex 8018r drum", "bemox ble-65 sample vulcanizing agents for",
  "bermocoll ebm", "bermocoll prime rheology modifier for paint", "catiofast -ap ibc",
  "cg 29- 4- 4,6- phenyl -1,3,5-triazine-2yl", "cp-71 yl gold acrylic resins clear",
  "cs-t- aspirin x1", "ctc liquid industries", "genesys lf blue square carbouys640x25 kg",
  "hanbell pn -15 fomblin ylvac", "liquid mf resin", "lubtex", "m- cal tablet s in a",
  "miranol c2m conc np mb", "pendimeth456cs", "poly an tad", "poly poly 4,5-difluoro-2,2- laborato",
  "rosso halux past b rosso halux", "rustokik-p", "songcat doto pw di octyl tin", "zro2 r dia x12t",
  "aluminium lactate batc no xjkrsl241022", "sodium iodide, 1o0gm ma4m740054 jan-24 dec-28",
]);

// A leading supplier catalogue code, e.g. "A0463", "T6066-", "Phr1009-", "G00500".
function isCodePrefix(name: string): boolean {
  const first = name.split(/\s+/)[0] ?? "";
  if (/^[A-Za-z]{1,4}\d{3,}[A-Za-z0-9-]*$/.test(first)) return true; // A0463, Am9932, Phr1009-
  if (/^[A-Za-z]\d{2,}-/.test(first)) return true; // B5194-, N2780-, S9638-
  if (/^[A-Za-z]\d{4,}/.test(first)) return true; // A885695101, M2147021
  return false;
}

// Returns true when the product name is boilerplate / a code / a non-product
// rather than a real traded chemical.
export function isJunkProduct(name: string): boolean {
  const l = (name ?? "").toLowerCase().trim();
  if (!l) return true;
  if (OPAQUE.has(l)) return true;
  if (/^chemicals /.test(l)) return true;
  if (l.replace(/[^a-z]/g, "").length <= 2) return true; // "Et", "Mk -Mk"
  if (isCodePrefix(name)) return true;
  if (BOILER.some((p) => l.includes(p))) return true;
  if (GOODS.some((p) => l.includes(p))) return true;
  if (GENERIC.some((p) => l.includes(p))) return true;
  return false;
}
