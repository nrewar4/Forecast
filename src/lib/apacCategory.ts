// Classifies a knowledge-base product into one APAC category (see
// src/data/apacCategories.ts). Trade portals tag products by what the chemical
// IS, so the rules match the product name and route first, then fall back to its
// end-use industries. Rules are ordered most specific to least; the first hit
// wins. The result is an inferred best fit, shown in the product's Applications
// section, and can be overridden per product with an explicit `apacCategory`.

import type { Product } from "@/data/products";
import { CATEGORY_TO_GROUP, type ApacCategory } from "@/data/apacCategories";

type Rule = { category: string; any: string[] };

// Ordered rules. Keep the specific end-use and product-type rules above the
// broad "petrochemical" and "inorganic" catch-alls.
const RULES: Rule[] = [
  { category: "Pharmaceutical Excipients", any: ["excipient"] },
  { category: "Pharmaceuticals", any: ["active pharmaceutical", " api", "drug substance", "pharmaceutical grade", "levetiracetam", "paracetamol", "ibuprofen", "aspirin"] },
  { category: "Agro Chemicals", any: ["pesticide", "herbicide", "fungicide", "insecticide", "agrochem", "agro chem", "crop protection"] },
  { category: "Fertilizers", any: ["fertil", "urea", "diammonium", "map fertil", "potash", "ammonium nitrate", "ammonium phosphate"] },
  { category: "Flavours and Fragrances", any: ["fragrance", "flavour", "flavor", "aroma", "perfume", "menthol", "vanillin"] },
  { category: "Cosmetic Chemicals", any: ["cosmetic", "personal care", "sunscreen", "skin care"] },
  { category: "Feed Additives", any: ["feed additive", "animal feed", "lysine", "methionine"] },
  { category: "Food Ingredients", any: ["food ingredient", "sweetener", "citric acid", "sorbitol", "food grade", "food and flavour"] },
  { category: "Enzymes", any: ["enzyme", "amylase", "protease", "lipase"] },
  { category: "Specialty Surfactants", any: ["specialty surfactant", "amphoteric", "betaine"] },
  { category: "Commodity Surfactants", any: ["surfactant", "detergent", "les ", "sles", "linear alkylbenzene", "lab sulphon"] },
  { category: "Inorganic Bulk Pigments", any: ["titanium dioxide", "iron oxide pigment", "carbon black", "inorganic pigment", "tio2"] },
  { category: "Synthetic Dyes", any: ["dye", "colorant", "colourant", "reactive black", "pigment red", "azo "] },
  { category: "Catalysts", any: ["catalyst", "zeolite", "catalytic"] },
  { category: "Synthetic Rubber", any: ["synthetic rubber", "sbr", "butadiene rubber", "nitrile rubber", "epdm"] },
  { category: "Rubber Processing Chemicals", any: ["rubber processing", "vulcaniz", "accelerator rubber"] },
  { category: "Polyurethane and Precursors", any: ["polyurethane", "isocyanate", "mdi", "tdi", "polyol"] },
  { category: "Engineering Plastic", any: ["nylon", "polyamide", "polycarbonate", "pbt", "abs resin", "engineering plastic", "pet resin"] },
  { category: "Bulk Resins", any: ["epoxy", "alkyd", "phenolic resin", "unsaturated polyester", "melamine", " resin"] },
  { category: "Commodity Polymer", any: ["polyethylene", "polypropylene", "pvc", "polystyrene", "polyvinyl", "polymer", "polyolefin", "hdpe", "ldpe", "lldpe", "terephthalate"] },
  { category: "Flame Retardants", any: ["flame retardant", "flame-retardant"] },
  { category: "Antioxidants", any: ["antioxidant"] },
  { category: "Corrosion Inhibitors", any: ["corrosion inhibitor", "corrosion-inhibitor"] },
  { category: "Biocides", any: ["biocide", "disinfectant", "sanitiser", "sanitizer"] },
  { category: "Lubricant Additives", any: ["lubricant additive", "lube oil additive", "viscosity modifier"] },
  { category: "Coatings", any: ["coating", "paint", "varnish", "lacquer"] },
  { category: "Adhesives and Sealants", any: ["adhesive", "sealant"] },
  { category: "Paper Chemicals", any: ["paper chemical", "pulp"] },
  { category: "Leather Chemicals", any: ["leather"] },
  { category: "Textile Chemicals", any: ["textile", "fibre finish", "fiber finish"] },
  { category: "Oilfield Chemicals", any: ["oilfield", "drilling fluid", "well stimulation"] },
  { category: "Mining Chemicals", any: ["mining chemical", "flotation", "frother"] },
  { category: "Explosives and Blasting Agents", any: ["explosive", "blasting", "nitroglycerin"] },
  { category: "Industrial and Institutional Cleaners", any: ["cleaner", "cleaning"] },
  { category: "Concrete Admixtures", any: ["concrete", "cement admixture", "superplasticiz"] },
  { category: "Water Management Chemical", any: ["water treatment", "water management", "coagulant", "flocculant"] },
  { category: "Electronic Chemicals", any: ["electronic", "semiconductor", "photoresist", "electronic grade"] },
  { category: "Advance Ceramic Materials", any: ["ceramic", "alumina ceramic", "silicon carbide"] },
  { category: "Rare Earths", any: ["rare earth", "lanthan", "neodymium", "cerium"] },
  { category: "Industrial Gases", any: ["industrial gas", "oxygen gas", "nitrogen gas", "argon", "carbon dioxide gas"] },
  { category: "Silica", any: ["silica", "silicon dioxide", "precipitated silica"] },
  { category: "Bulk Petrochemicals", any: [
    "benzene", "toluene", "xylene", "paraxylene", "styrene", "ethylene", "propylene", "butadiene",
    "methanol", "naphtha", "phenol", "cumene", "acetone", "ethylene glycol", "acrylate", "acrylic acid",
    "vinyl acetate", "ethyl acetate", "butanol", "butyl acetate", "isopropanol", "terephthalic",
    "isophthalic", "caprolactam", "acrylonitrile",
  ] },
  // Only strong, specific inorganic compound names. Bare ion tokens like
  // "sulphate" or "chloride" are intentionally excluded because many
  // pharmaceutical and specialty salts carry them and would be misclassified.
  { category: "Inorganic Bulk Chemicals", any: [
    "sulphuric acid", "sulfuric acid", "caustic soda", "soda ash", "chlorine", "hydrochloric acid",
    "sodium hydroxide", "sodium carbonate", "sodium chloride", "sodium bicarbonate", "liquid ammonia",
    "anhydrous ammonia", "aqueous ammonia", "nitric acid", "phosphoric acid", "hydrogen peroxide",
    "calcium carbonate", "calcium chloride", "hydrofluoric acid", "potassium hydroxide",
    "potassium carbonate", "zinc oxide", "aluminium hydroxide", "aluminum hydroxide", "sodium sulphate",
    "sodium sulfate", "magnesium oxide", "bleaching powder",
  ] },
];

// Active pharmaceutical ingredients rarely announce themselves by name, but they
// share recognisable stems and suffixes. Matching these keeps antibiotics and
// other APIs out of the inorganic and organic-intermediate buckets.
const PHARMA_PATTERN = new RegExp(
  [
    // antibiotic and antiviral stems
    "cillin", "penicill", "cephalo", "cef[a-z]+", "penem", "ycetin", "mycin", "micin", "cycline",
    "floxacin", "oxacin", "vudine", "udine", "navir", "ovir",
    // common small-molecule suffixes
    "azole", "conazole", "nidazole", "prazole", "sartan", "dipine", "statin", "\\bpril\\b", "olol",
    "tidine", "phylline", "pentin", "bactam", "tinib", "azepam", "profen", "fenac", "racetam", "caine",
    "dronate", "gliptin", "glitazone", "setron", "triptan", "parin",
    // explicit APIs and API intermediates present in the data
    "penicillanic", "aminopenicillanic", "\\bapa\\b", "\\baca\\b", "galantamine", "framycetin",
    "paracetamol", "ibuprofen", "metformin", "azithromycin", "cetirizine", "loratadine", "letrozole",
    "ketoconazole", "metronidazole", "gabapentin", "theophylline", "lamivudine", "thiopental",
    "racecadotril", "sulbactam", "mannitol", "cephal", "docusate", "sugammadex",
  ].join("|"),
  "i",
);

const FALLBACK: ApacCategory = { group: "Bulk Chemicals", category: "Organic Intermediate" };

const cache = new Map<string, ApacCategory>();

function toCategory(category: string): ApacCategory {
  const group = CATEGORY_TO_GROUP[category];
  return group ? { group, category } : FALLBACK;
}

// Classify a bare molecule name (not in the catalog) using the same name rules.
export function classifyByName(name: string): ApacCategory {
  return classifyProduct({
    name,
    route: [],
    industries: [],
    costDrivers: [],
    hsCode: "",
    cas: "",
    plantType: "Batch",
    priceRange: "",
    priceIndicative: "",
    producers: [],
  });
}

export function classifyProduct(product: Product & { apacCategory?: string }): ApacCategory {
  // Explicit override always wins.
  if (product.apacCategory) return toCategory(product.apacCategory);

  const cached = cache.get(product.name);
  if (cached) return cached;

  // Classify on what the chemical IS, from its name. The route is not used
  // because it lists feedstocks (methanol, benzene, chlorine) that would tag a
  // product by its inputs, and end-use industries are not used because they
  // describe where it is sold, not what category it belongs to.
  const name = product.name.toLowerCase();

  let result: ApacCategory = FALLBACK;
  if (PHARMA_PATTERN.test(name)) {
    result = toCategory("Pharmaceuticals");
  } else {
    const hit = RULES.find((r) => r.any.some((kw) => name.includes(kw)));
    if (hit) result = toCategory(hit.category);
  }

  cache.set(product.name, result);
  return result;
}
