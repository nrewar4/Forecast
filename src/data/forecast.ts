export type ForecastPoint = {
  month: string;
  actual?: number;
  forecast?: number;
  band?: [number, number];
};

export const paraxyleneForecast: ForecastPoint[] = [
  { month: "Mar 25", actual: 12800 },
  { month: "Apr 25", actual: 13100 },
  { month: "May 25", actual: 13600 },
  { month: "Jun 25", actual: 13200 },
  { month: "Jul 25", actual: 14050 },
  { month: "Aug 25", actual: 14600 },
  { month: "Sep 25", actual: 14200 },
  { month: "Oct 25", actual: 15000 },
  { month: "Nov 25", actual: 14800 },
  { month: "Dec 25", actual: 15400 },
  { month: "Jan 26", actual: 15900 },
  { month: "Feb 26", actual: 16300, forecast: 16300, band: [16300, 16300] },
  { month: "Mar 26", forecast: 16700, band: [15800, 17600] },
  { month: "Apr 26", forecast: 17050, band: [16000, 18100] },
  { month: "May 26", forecast: 17500, band: [16200, 18800] },
  { month: "Jun 26", forecast: 17800, band: [16300, 19300] },
  { month: "Jul 26", forecast: 18200, band: [16500, 19900] },
  { month: "Aug 26", forecast: 18600, band: [16600, 20600] },
];

export type Signal = "Strong buy" | "Buy" | "Hold" | "Watch";

export type GrowthRow = {
  rank: number;
  product: string;
  hsCode: string;
  current: number;
  forecast: number;
  growth: number;
  signal: Signal;
};

export const growthRanking: GrowthRow[] = [
  { rank: 1, product: "Heterocyclic compounds", hsCode: "29331999", current: 3200, forecast: 3776, growth: 18, signal: "Strong buy" },
  { rank: 2, product: "Speciality APIs", hsCode: "29335990", current: 2100, forecast: 2415, growth: 15, signal: "Strong buy" },
  { rank: 3, product: "Paraxylene", hsCode: "29024300", current: 16300, forecast: 18093, growth: 11, signal: "Buy" },
  { rank: 4, product: "Phosphoric acid", hsCode: "28092010", current: 16250, forecast: 17225, growth: 6, signal: "Hold" },
  { rank: 5, product: "Methanol", hsCode: "29051100", current: 20300, forecast: 21112, growth: 4, signal: "Hold" },
  { rank: 6, product: "Styrene monomer", hsCode: "29025000", current: 8900, forecast: 8722, growth: -2, signal: "Watch" },
  { rank: 7, product: "Benzene", hsCode: "29022000", current: 7130, forecast: 6917, growth: -3, signal: "Watch" },
];
