export type Supplier = {
  company: string;
  country: string;
  type: string;
  certifications: string[];
  capacityNote: string;
};

export type SupplierGroup = { product: string; suppliers: Supplier[] };

export const supplierGroups: SupplierGroup[] = [
  {
    product: "Phosphoric acid (HS 28092010)",
    suppliers: [
      { company: "OCP Group", country: "Morocco", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "World scale phosphate to acid integration" },
      { company: "Industries Chimiques du Senegal", country: "Senegal", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Established merchant supplier" },
      { company: "The Mosaic Company", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large integrated phosphate producer" },
      { company: "PhosAgro", country: "Russia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "High grade phosphoric acid" },
      { company: "Maaden Phosphate Company", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated phosphate complex" },
    ],
  },
  {
    product: "Paraxylene (HS 29024300)",
    suppliers: [
      { company: "ExxonMobil Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Global aromatics producer" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large paraxylene capacity" },
      { company: "S-Oil Corporation", country: "South Korea", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Export grade paraxylene" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Largest single site paraxylene" },
      { company: "Petro Rabigh", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Aramco and Sumitomo joint venture" },
    ],
  },
  {
    product: "Styrene monomer (HS 29025000)",
    suppliers: [
      { company: "INEOS Styrolution", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Global styrenics leader" },
      { company: "LG Chem", country: "South Korea", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Export grade SM" },
      { company: "Trinseo", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Styrene and derivatives" },
      { company: "Shell Chemicals", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated aromatics" },
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Petrochemical scale" },
    ],
  },
  {
    product: "Methanol (HS 29051100)",
    suppliers: [
      { company: "Methanex Corporation", country: "Canada", type: "Manufacturer", certifications: ["ISO 9001", "Responsible Care"], capacityNote: "Largest methanol producer globally" },
      { company: "Proman", country: "Switzerland", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Established merchant supplier" },
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Gulf based methanol" },
      { company: "OCI Global", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Methanol and nitrogen" },
      { company: "Zagros Petrochemical Company", country: "Iran", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large export methanol" },
    ],
  },
  {
    product: "Benzene (HS 29022000)",
    suppliers: [
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Top benzene exporter" },
      { company: "Dow", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated aromatics" },
      { company: "Shell Chemicals", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Refinery integrated benzene" },
      { company: "BASF", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Verbund aromatics" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large benzene capacity" },
    ],
  },
  {
    product: "Heterocyclic compounds and API intermediates (HS 29331999, 29335990)",
    suppliers: [
      { company: "Anthem Biosciences Pvt Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["ISO 9001", "GMP"], capacityNote: "Top exporter" },
      { company: "AMI Organics Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "GMP"], capacityNote: "Advanced intermediates" },
      { company: "Sai Life Sciences Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "Discovery to commercial CDMO" },
      { company: "Divi's Laboratories Ltd", country: "India", type: "Manufacturer", certifications: ["GMP", "ISO 9001", "ISO 14001"], capacityNote: "Large API and intermediate maker" },
      { company: "Laurus Labs Ltd", country: "India", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "APIs and contract synthesis" },
      { company: "Lonza Group", country: "Switzerland", type: "Manufacturer and CDMO", certifications: ["GMP", "ISO 9001"], capacityNote: "Global CDMO for complex molecules" },
    ],
  },
  // Additional supplier groups for newly added products
  {
    product: "Toluene (HS 29023000)",
    suppliers: [
      { company: "ExxonMobil Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Major aromatics and solvents producer" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large toluene capacity" },
      { company: "LyondellBasell", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Integrated aromatics complex" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Largest aromatics site in India" },
      { company: "Chevron Phillips Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Produces aromatics and derivatives" },
    ],
  },
  {
    product: "Acetic acid (HS 29152100)",
    suppliers: [
      { company: "Celanese", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Largest global acetic acid producer" },
      { company: "BP Chemicals", country: "United Kingdom", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Carbonylation technology owner" },
      { company: "Jiangsu Sopo", country: "China", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large Chinese acetic acid plant" },
      { company: "LyondellBasell", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Integrated oxo-alcohols and acetyls" },
      { company: "Jubilant Ingrevia", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "GMP"], capacityNote: "India’s leading acetyls producer" },
    ],
  },
  {
    product: "Caustic soda (HS 28151200)",
    suppliers: [
      { company: "Olin Corporation", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Top chlor-alkali producer" },
      { company: "Dow", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated chlor-alkali and derivatives" },
      { company: "Gujarat Alkalies and Chemicals Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Major Indian caustic soda producer" },
      { company: "Tata Chemicals", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Diverse chemical portfolio" },
      { company: "Occidental Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Chlor-alkali and vinyls producer" },
    ],
  },
  {
    product: "Urea (HS 31021000)",
    suppliers: [
      { company: "Yara International", country: "Norway", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Global fertiliser leader" },
      { company: "Qatar Fertiliser Company (QAFCO)", country: "Qatar", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "World-scale urea exporter" },
      { company: "CF Industries", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large nitrogen fertiliser producer" },
      { company: "PT Pupuk Indonesia", country: "Indonesia", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Major Southeast Asian urea supplier" },
      { company: "Indian Farmers Fertiliser Cooperative (IFFCO)", country: "India", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Integrated fertiliser complex" },
    ],
  },
  {
    product: "Aniline (HS 29214100)",
    suppliers: [
      { company: "BASF", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Integrated nitrobenzene to aniline chain" },
      { company: "Covestro", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Polyurethane precursor producer" },
      { company: "BorsodChem", country: "Hungary", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Aniline and MDI producer" },
      { company: "Gujarat Narmada Valley Fertilizers & Chemicals Ltd (GNFC)", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Largest aniline plant in India" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large nitrobenzene and aniline capacity" },
    ],
  },
  {
    product: "Ethylene glycol (HS 29053100)",
    suppliers: [
      { company: "MEGlobal", country: "United Arab Emirates", type: "Manufacturer", certifications: ["ISO 9001", "Responsible Care"], capacityNote: "World-scale ethylene glycol producer" },
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Integrated glycol and petrochemical producer" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Large Indian glycol facility" },
      { company: "Lotte Chemical", country: "South Korea", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Integrated aromatics and glycol" },
      { company: "Shell Chemicals", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Produces MEG via OMEGA process" },
    ],
  },
  {
    product: "Propylene (HS 29012200)",
    suppliers: [
      { company: "LyondellBasell", country: "Netherlands", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Cracker-derived polymer-grade propylene" },
      { company: "ExxonMobil Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated ethylene and propylene" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Large propylene capacity via steam cracking" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Polypropylene and propylene complex" },
      { company: "Petro Rabigh", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Propylene via integrated refinery" },
    ],
  },
  {
    product: "Nitric acid (HS 28080000)",
    suppliers: [
      { company: "Yara International", country: "Norway", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Major European nitric acid producer" },
      { company: "CF Industries", country: "United States", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Ammonia and nitric acid manufacturer" },
      { company: "Deepak Fertilisers and Petrochemicals Corp Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Indian nitric acid and ammonium nitrate producer" },
      { company: "Orica", country: "Australia", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Explosives-grade nitric acid producer" },
      { company: "BASF", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Nitric acid for internal and merchant use" },
    ],
  },
  {
    product: "Sulphuric acid (HS 28070000)",
    suppliers: [
      { company: "The Mosaic Company", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Fertiliser grade sulphuric acid producer" },
      { company: "Ineos Group", country: "United Kingdom", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Large sulphur chemicals producer" },
      { company: "Aurubis", country: "Germany", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Sulphuric acid from copper smelting" },
      { company: "Hindustan Copper Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "By-product acid from smelting operations" },
      { company: "Vale Fertilizantes", country: "Brazil", type: "Manufacturer", certifications: ["ISO 9001"], capacityNote: "Integrated mining and acid production" },
    ],
  },
  {
    product: "Ethylene (HS 29012100)",
    suppliers: [
      { company: "SABIC", country: "Saudi Arabia", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "World-scale ethylene cracker" },
      { company: "Dow", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Integrated ethylene and derivatives" },
      { company: "ExxonMobil Chemical", country: "United States", type: "Manufacturer", certifications: ["ISO 9001", "REACH"], capacityNote: "Multiple global crackers" },
      { company: "Reliance Industries Ltd", country: "India", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001", "REACH"], capacityNote: "Largest Indian ethylene producer" },
      { company: "Sinopec", country: "China", type: "Manufacturer", certifications: ["ISO 9001", "ISO 14001"], capacityNote: "Numerous ethylene units" },
    ],
  },
];
