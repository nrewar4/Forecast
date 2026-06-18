export type Supplier = {
  company: string;
  country: string;
  type: string;
  certifications: string[];
  capacityNote: string;
  status: "Recommended" | "Active in sample" | "Prospect";
};

export type SupplierGroup = { product: string; suppliers: Supplier[] };

export const supplierGroups: SupplierGroup[] = [
  {
    product: "Phosphoric acid (HS 28092010)",
    suppliers: [
      { company: "OCP Group", country: "Morocco", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "World scale phosphate to acid integration", status: "Recommended" },
      { company: "Industries Chimiques du Senegal", country: "Senegal", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Supplier in the import sample", status: "Active in sample" },
      { company: "The Mosaic Company", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large integrated phosphate producer", status: "Recommended" },
      { company: "PhosAgro", country: "Russia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "High grade phosphoric acid", status: "Prospect" },
      { company: "Maaden Phosphate Company", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated phosphate complex", status: "Prospect" },
    ],
  },
  {
    product: "Paraxylene (HS 29024300)",
    suppliers: [
      { company: "ExxonMobil Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Global aromatics producer", status: "Recommended" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large paraxylene capacity", status: "Prospect" },
      { company: "S-Oil Corporation", country: "South Korea", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Export grade paraxylene", status: "Recommended" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Largest single site paraxylene", status: "Recommended" },
      { company: "Petro Rabigh", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Aramco and Sumitomo joint venture", status: "Prospect" },
    ],
  },
  {
    product: "Styrene monomer (HS 29025000)",
    suppliers: [
      { company: "INEOS Styrolution", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Global styrenics leader", status: "Recommended" },
      { company: "LG Chem", country: "South Korea", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Export grade SM", status: "Recommended" },
      { company: "Trinseo", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Styrene and derivatives", status: "Prospect" },
      { company: "Shell Chemicals", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated aromatics", status: "Prospect" },
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Petrochemical scale", status: "Prospect" },
    ],
  },
  {
    product: "Methanol (HS 29051100)",
    suppliers: [
      { company: "Methanex Corporation", country: "Canada", type: "Manufacturer", certifications: ["ISO 9001", "Responsible Care"], capacityNote: "Largest methanol producer globally", status: "Recommended" },
      { company: "Proman", country: "Switzerland", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Supplier in the import sample", status: "Active in sample" },
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Gulf based methanol", status: "Recommended" },
      { company: "OCI Global", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Methanol and nitrogen", status: "Prospect" },
      { company: "Zagros Petrochemical Company", country: "Iran", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large export methanol", status: "Prospect" },
    ],
  },
  {
    product: "Benzene (HS 29022000)",
    suppliers: [
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Top exporter of benzene in the sample", status: "Active in sample" },
      { company: "Dow", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated aromatics", status: "Recommended" },
      { company: "Shell Chemicals", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Refinery integrated benzene", status: "Prospect" },
      { company: "BASF", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Verbund aromatics", status: "Recommended" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large benzene capacity", status: "Prospect" },
    ],
  },
  {
    product: "Heterocyclic compounds and API intermediates (HS 29331999, 29335990)",
    suppliers: [
      { company: "Anthem Biosciences Pvt Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["ISO 9001", "GMP"], capacityNote: "Top exporter in the sample", status: "Active in sample" },
      { company: "AMI Organics Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "GMP"], capacityNote: "Advanced intermediates", status: "Active in sample" },
      { company: "Sai Life Sciences Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "Discovery to commercial CDMO", status: "Active in sample" },
      { company: "Divi's Laboratories Ltd", country: "India", type: "Manufacturer", certifications: ["GMP", "ISO 9001", "ISO 14001"], capacityNote: "Large API and intermediate maker", status: "Recommended" },
      { company: "Laurus Labs Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "APIs and contract synthesis", status: "Recommended" },
      { company: "Lonza Group", country: "Switzerland", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "Global CDMO for complex molecules", status: "Prospect" },
    ],
  },
];
