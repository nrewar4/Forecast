// Chemical trade figures for the Market Overview. These are real, published
// values, not estimates: exported inorganic (HS 28) plus organic (HS 29)
// chemicals for 2024, from the International Trade Centre (ITC) Trade Map, as
// compiled by World's Top Exports. No free API serves per-country chemical
// trade to the browser (WITS and UN Comtrade are not CORS-enabled and now
// require keys), so the numbers are curated here with their source and year, and
// the live daily dimension is carried by the news feed below the figures.
//
// Source: ITC, Trade Map (2024); HS 28 (inorganic) + HS 29 (organic).
// https://www.worldstopexports.com/chemical-exports-by-country/

export type ChemCountry = {
  code: string;
  name: string;
  flag: string;
  exports: number; // US$, chemical exports (HS 28 + 29), 2024
};

// The six focus markets, chemical exports in US dollars.
export const CHEMICAL_EXPORTS: ChemCountry[] = [
  { code: "CHN", name: "China", flag: "🇨🇳", exports: 109_200_000_000 },
  { code: "USA", name: "United States", flag: "🇺🇸", exports: 66_400_000_000 },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", exports: 31_700_000_000 },
  { code: "IND", name: "India", flag: "🇮🇳", exports: 24_600_000_000 },
  { code: "JPN", name: "Japan", flag: "🇯🇵", exports: 22_100_000_000 },
  { code: "SAU", name: "Saudi Arabia", flag: "🇸🇦", exports: 11_200_000_000 },
];

// Global chemical export context for 2024 (same source and definition).
export const GLOBAL_CHEMICAL = {
  total: 667_200_000_000, // all countries, HS 28 + 29
  organic: 490_300_000_000, // HS 29
  inorganic: 177_000_000_000, // HS 28
  year: 2024,
  source: "ITC Trade Map",
  sourceUrl: "https://www.worldstopexports.com/chemical-exports-by-country/",
} as const;

export const DATA_YEAR = GLOBAL_CHEMICAL.year;
