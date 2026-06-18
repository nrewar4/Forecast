export type MonthlyValue = { month: string; value: number };

export const monthlyTradeValue: MonthlyValue[] = [
  { month: "Mar 25", value: 3.8 },
  { month: "Apr 25", value: 4.1 },
  { month: "May 25", value: 4.5 },
  { month: "Jun 25", value: 4.2 },
  { month: "Jul 25", value: 4.8 },
  { month: "Aug 25", value: 5.2 },
  { month: "Sep 25", value: 4.9 },
  { month: "Oct 25", value: 5.4 },
  { month: "Nov 25", value: 5.1 },
  { month: "Dec 25", value: 5.6 },
  { month: "Jan 26", value: 5.9 },
  { month: "Feb 26", value: 6.2 },
];

export type CountryValue = { country: string; value: number };

export const tradeByCountry: CountryValue[] = [
  { country: "Senegal", value: 21.0 },
  { country: "China", value: 9.4 },
  { country: "Saudi Arabia", value: 7.8 },
  { country: "South Korea", value: 6.1 },
  { country: "United States", value: 4.9 },
  { country: "Singapore", value: 3.2 },
];

export type TransportSlice = { method: string; value: number };

export const transportMethod: TransportSlice[] = [
  { method: "Sea", value: 62 },
  { method: "ICD", value: 21 },
  { method: "Road", value: 12 },
  { method: "Air", value: 5 },
];

export type Shipment = {
  date: string;
  hsCode: string;
  product: string;
  importer: string;
  supplier: string;
  origin: string;
  quantityT: number;
  unitPrice: number;
  totalValue: number;
};

export const shipments: Shipment[] = [
  {
    date: "2026-02-26",
    hsCode: "28092010",
    product: "Phosphoric acid (fertiliser grade)",
    importer: "Indian Farmers Fertiliser Cooperative Ltd",
    supplier: "Industries Chimiques du Senegal",
    origin: "Senegal",
    quantityT: 16250,
    unitPrice: 1292,
    totalValue: 21000000,
  },
  {
    date: "2026-02-27",
    hsCode: "29024300",
    product: "Paraxylene",
    importer: "MCPI Private Limited",
    supplier: "Tauber Petrochemical",
    origin: "Saudi Arabia",
    quantityT: 15000,
    unitPrice: 947,
    totalValue: 14200000,
  },
  {
    date: "2026-02-27",
    hsCode: "29025000",
    product: "Styrene monomer",
    importer: "Supreme Petrochem Ltd",
    supplier: "Kemper Energy",
    origin: "South Korea",
    quantityT: 8900,
    unitPrice: 1101,
    totalValue: 9800000,
  },
  {
    date: "2026-02-28",
    hsCode: "29051100",
    product: "Methanol",
    importer: "Coromandel International Ltd",
    supplier: "Proman",
    origin: "Singapore",
    quantityT: 20300,
    unitPrice: 315,
    totalValue: 6400000,
  },
  {
    date: "2026-02-28",
    hsCode: "29022000",
    product: "Benzene",
    importer: "UMICORE Autocat India Pvt Ltd",
    supplier: "Shell Chemicals",
    origin: "United States",
    quantityT: 7130,
    unitPrice: 715,
    totalValue: 5100000,
  },
];
