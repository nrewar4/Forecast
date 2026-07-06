// Headline network figures from the APACSS admin portal. These describe the
// full APAC Supply Chain sourcing network (the storefront catalog), which is
// larger than the sample dataset bundled with this workspace.

export const NETWORK = {
  products: 8927,
  manufacturers: 3241,
  countries: 30, // rendered as "30+"
  categories: 27,
  divisions: [
    { name: "Chemical", products: 6946, manufacturers: 3003 },
    { name: "Pharmaceuticals", products: 1981, manufacturers: 238 },
  ],
  topCountries: [
    { name: "India", manufacturers: 1306 },
    { name: "China", manufacturers: 506 },
    { name: "Taiwan", manufacturers: 406 },
    { name: "South Korea", manufacturers: 306 },
    { name: "Indonesia", manufacturers: 129 },
  ],
  moreCountries: 25,
  topCategories: [
    { name: "Pharma, APIs and intermediates", products: 2381 },
    { name: "Resins and polymers", products: 548 },
    { name: "Agrochemicals", products: 547 },
    { name: "Coatings and adhesives", products: 455 },
  ],
} as const;
