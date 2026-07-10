// The APAC product category taxonomy, grouped as it appears on the APAC portal.
// Each product in the knowledge base is classified into one of these categories
// (see src/lib/apacCategory.ts) and shown in its Applications section.

export type ApacGroup = {
  group: string;
  categories: string[];
};

export const APAC_CATEGORY_GROUPS: ApacGroup[] = [
  {
    group: "Additives and Modifiers",
    categories: [
      "Botanical Extracts",
      "Color Additives",
      "Dispersing Additives",
      "Foaming Agents",
      "Food Additives and Preservatives",
      "Fracturing and Mining Fluids",
      "Lubricant Additives",
      "Polymer Additives",
      "Rheology Modifiers",
      "Silica",
      "Wax Additives",
      "Additional Additives and Modifiers",
      "Inhibitors",
    ],
  },
  {
    group: "Bulk Chemicals",
    categories: [
      "Bulk Petrochemicals",
      "Fertilizers",
      "Industrial Gases",
      "Inorganic Bulk Chemicals",
      "Organic Intermediate",
    ],
  },
  {
    group: "Polymers",
    categories: [
      "Bulk Resins",
      "Commodity Polymer",
      "Engineering Plastic",
      "High Performance Composites",
      "High Performance Polymers",
      "Polymeric Membrane",
      "Polyurethane and Precursors",
      "Synthetic Rubber",
      "Water Soluble Polymer",
    ],
  },
  {
    group: "Additives",
    categories: [
      "Antioxidants",
      "Biocides",
      "Coatings and Adhesive Ingredients: Additives and Pigments",
      "Coatings and Adhesive Ingredients: Resins and Solvents",
      "Commodity Surfactants",
      "Corrosion Inhibitors",
      "Flame Retardants",
      "Inorganic Fillers",
      "Lubricating Oil Additives",
      "Plastic Additives",
      "Specialty Surfactants",
    ],
  },
  {
    group: "Formulation Businesses",
    categories: [
      "Adhesives and Sealants",
      "Coatings",
      "Concrete Admixtures",
      "Explosives and Blasting Agents",
      "Industrial and Institutional Cleaners",
      "Leather Chemicals",
      "Mining Chemicals",
      "Oilfield Chemicals",
      "Paper Chemicals",
      "Printing Inks",
      "Rubber Processing Chemicals",
      "Speciality Coating",
      "Synthetic Dyes",
      "Synthetic Lubricants",
      "Textile Chemicals",
      "Water Management Chemical",
    ],
  },
  {
    group: "Fine Chemicals",
    categories: [
      "Agro Chemicals",
      "Cosmetic Chemicals",
      "Enzymes",
      "Feed Additives",
      "Flavours and Fragrances",
      "Food Ingredients",
      "Pharmaceuticals",
      "Pharmaceutical Excipients",
    ],
  },
  {
    group: "Inorganic Speciality Material",
    categories: [
      "Advance Ceramic Materials",
      "Catalysts",
      "Electronic Chemicals",
      "Inorganic Bulk Pigments",
      "Inorganic Specialities",
      "High Performance Fibers",
      "Rare Earths",
    ],
  },
];

// Flat lookup from a category name to its parent group.
export const CATEGORY_TO_GROUP: Record<string, string> = Object.fromEntries(
  APAC_CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c, g.group])),
);

export type ApacCategory = { group: string; category: string };
