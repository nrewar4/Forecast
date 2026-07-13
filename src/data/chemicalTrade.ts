// Chemical trade is derived from World Bank merchandise trade (a reliable,
// keyless, CORS-friendly series) multiplied by each country's chemical share of
// merchandise trade from World Bank WITS. Every figure therefore traces to the
// World Bank. A bundled fallback keeps the Market Overview populated when the
// live API cannot be reached.

import type { CountryCode } from "@/lib/worldbank";

export type ChemShare = { exportPct: number; importPct: number };

// Chemicals (SITC Rev.3 Section 5) as a share of merchandise trade, from World
// Bank WITS (latest available reporting, around 2021 to 2022). Chemical value =
// merchandise value x share.
export const CHEM_SHARE: Record<CountryCode, ChemShare> = {
  USA: { exportPct: 13, importPct: 9 },
  CHN: { exportPct: 6, importPct: 8 },
  IND: { exportPct: 12, importPct: 11 },
  JPN: { exportPct: 11, importPct: 10 },
  KOR: { exportPct: 9, importPct: 12 },
  SAU: { exportPct: 10, importPct: 14 },
};

export const CHEM_SHARE_SOURCE =
  "World Bank WITS, chemicals (SITC 5) share of merchandise trade, latest available.";

// Fallback chemical trade (current US$) for the latest reported year, used when
// the live World Bank fetch is unavailable so the page never shows zero. Values
// are World Bank 2022 merchandise trade multiplied by the shares above.
export type ChemFallback = {
  code: CountryCode;
  exports: number;
  imports: number;
  year: number;
};

const B = 1_000_000_000;

export const CHEM_FALLBACK: ChemFallback[] = [
  { code: "USA", exports: 268 * B, imports: 304 * B, year: 2022 },
  { code: "CHN", exports: 216 * B, imports: 217 * B, year: 2022 },
  { code: "IND", exports: 54 * B, imports: 81 * B, year: 2022 },
  { code: "JPN", exports: 82 * B, imports: 90 * B, year: 2022 },
  { code: "KOR", exports: 62 * B, imports: 88 * B, year: 2022 },
  { code: "SAU", exports: 41 * B, imports: 25 * B, year: 2022 },
];
