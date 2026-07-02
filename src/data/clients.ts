export type Client = {
  company: string;
  country: string;
  primaryProducts: string[];
  hsCodes: string[];
  sector: string;
  importValue: number;
};

export const clients: Client[] = [
  { company: "Indian Farmers Fertiliser Cooperative Ltd", country: "India", primaryProducts: ["Phosphoric acid"], hsCodes: ["28092010"], sector: "Fertilisers", importValue: 21000000 },
  { company: "MCPI Private Limited", country: "India", primaryProducts: ["Paraxylene", "PTA"], hsCodes: ["29024300"], sector: "Petrochemicals", importValue: 8400000 },
  { company: "UMICORE Autocat India Pvt Ltd", country: "India", primaryProducts: ["Benzene", "Catalyst feedstock"], hsCodes: ["29022000"], sector: "Catalysts and automotive", importValue: 5200000 },
  { company: "Supreme Petrochem Ltd", country: "India", primaryProducts: ["Styrene monomer"], hsCodes: ["29025000"], sector: "Petrochemicals", importValue: 4100000 },
  { company: "Coromandel International Ltd", country: "India", primaryProducts: ["Phosphoric acid", "Methanol"], hsCodes: ["28092010", "29051100"], sector: "Fertilisers and agrochemicals", importValue: 3000000 },
  { company: "Paradeep Phosphates Ltd", country: "India", primaryProducts: ["Phosphoric acid"], hsCodes: ["28092010"], sector: "Fertilisers", importValue: 2600000 },
  { company: "Deepak Fertilisers and Petrochemicals", country: "India", primaryProducts: ["Methanol", "Ammonia"], hsCodes: ["29051100"], sector: "Fertilisers and petrochemicals", importValue: 2300000 },
  { company: "Gujarat Narmada Valley Fert. and Chem.", country: "India", primaryProducts: ["Methanol"], hsCodes: ["29051100"], sector: "Fertilisers and chemicals", importValue: 1900000 },
  { company: "Aarti Industries Ltd", country: "India", primaryProducts: ["Benzene derivatives"], hsCodes: ["29022000"], sector: "Speciality chemicals", importValue: 1700000 },
  { company: "SRF Ltd", country: "India", primaryProducts: ["Speciality intermediates"], hsCodes: ["29331999"], sector: "Speciality and agro intermediates", importValue: 1500000 },
  // Added prospective and active Indian buyers for newly introduced products
  { company: "Bharat Petroleum Corporation Ltd", country: "India", primaryProducts: ["Toluene"], hsCodes: ["29023000"], sector: "Petrochemicals", importValue: 3800000 },
  { company: "Jubilant Ingrevia Ltd", country: "India", primaryProducts: ["Acetic acid"], hsCodes: ["29152100"], sector: "Chemicals and pharmaceuticals", importValue: 3200000 },
  { company: "Gujarat Alkalies and Chemicals Ltd", country: "India", primaryProducts: ["Caustic soda"], hsCodes: ["28151200"], sector: "Chlor-alkali", importValue: 2700000 },
  { company: "Chambal Fertilisers and Chemicals Ltd", country: "India", primaryProducts: ["Urea"], hsCodes: ["31021000"], sector: "Fertilisers", importValue: 4500000 },
  { company: "Gujarat Narmada Valley Fertilizers & Chemicals (GNFC)", country: "India", primaryProducts: ["Aniline"], hsCodes: ["29214100"], sector: "Petrochemicals", importValue: 2900000 },
  { company: "Indorama Synthetics (India) Ltd", country: "India", primaryProducts: ["Ethylene glycol"], hsCodes: ["29053100"], sector: "Polyesters and fibres", importValue: 4000000 },
  { company: "Haldia Petrochemicals Ltd", country: "India", primaryProducts: ["Propylene"], hsCodes: ["29012200"], sector: "Petrochemicals", importValue: 3600000 },
  { company: "Rashtriya Chemicals and Fertilizers Ltd", country: "India", primaryProducts: ["Nitric acid"], hsCodes: ["28080000"], sector: "Inorganics and fertilisers", importValue: 2500000 },
  { company: "Hindalco Industries Ltd", country: "India", primaryProducts: ["Sulphuric acid"], hsCodes: ["28070000"], sector: "Metals and fertilisers", importValue: 2200000 },
  { company: "GAIL (India) Ltd", country: "India", primaryProducts: ["Ethylene"], hsCodes: ["29012100"], sector: "Petrochemicals", importValue: 5000000 },
];
