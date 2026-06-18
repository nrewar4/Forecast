export type Client = {
  company: string;
  country: string;
  primaryProducts: string[];
  hsCodes: string[];
  sector: string;
  importValue: number;
  status: "Active in sample" | "Prospect";
};

export const clients: Client[] = [
  { company: "Indian Farmers Fertiliser Cooperative Ltd", country: "India", primaryProducts: ["Phosphoric acid"], hsCodes: ["28092010"], sector: "Fertilisers", importValue: 21000000, status: "Active in sample" },
  { company: "MCPI Private Limited", country: "India", primaryProducts: ["Paraxylene", "PTA"], hsCodes: ["29024300"], sector: "Petrochemicals", importValue: 8400000, status: "Active in sample" },
  { company: "UMICORE Autocat India Pvt Ltd", country: "India", primaryProducts: ["Benzene", "Catalyst feedstock"], hsCodes: ["29022000"], sector: "Catalysts and automotive", importValue: 5200000, status: "Active in sample" },
  { company: "Supreme Petrochem Ltd", country: "India", primaryProducts: ["Styrene monomer"], hsCodes: ["29025000"], sector: "Petrochemicals", importValue: 4100000, status: "Active in sample" },
  { company: "Coromandel International Ltd", country: "India", primaryProducts: ["Phosphoric acid", "Methanol"], hsCodes: ["28092010", "29051100"], sector: "Fertilisers and agrochemicals", importValue: 3000000, status: "Active in sample" },
  { company: "Paradeep Phosphates Ltd", country: "India", primaryProducts: ["Phosphoric acid"], hsCodes: ["28092010"], sector: "Fertilisers", importValue: 2600000, status: "Prospect" },
  { company: "Deepak Fertilisers and Petrochemicals", country: "India", primaryProducts: ["Methanol", "Ammonia"], hsCodes: ["29051100"], sector: "Fertilisers and petrochemicals", importValue: 2300000, status: "Prospect" },
  { company: "Gujarat Narmada Valley Fert. and Chem.", country: "India", primaryProducts: ["Methanol"], hsCodes: ["29051100"], sector: "Fertilisers and chemicals", importValue: 1900000, status: "Prospect" },
  { company: "Aarti Industries Ltd", country: "India", primaryProducts: ["Benzene derivatives"], hsCodes: ["29022000"], sector: "Speciality chemicals", importValue: 1700000, status: "Prospect" },
  { company: "SRF Ltd", country: "India", primaryProducts: ["Speciality intermediates"], hsCodes: ["29331999"], sector: "Speciality and agro intermediates", importValue: 1500000, status: "Prospect" },
];
