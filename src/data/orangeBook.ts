// Curated FDA Orange Book patent/exclusivity SNAPSHOT for the molecules we cover
// in depth. The full Orange Book patent/exclusivity data is only distributed as
// monthly downloadable files (product/patent/exclusivity.txt) — there is no live
// CORS API — so this is a hand-verified snapshot of well-documented public facts
// (originator, US loss-of-exclusivity year, current status). For live, current
// patent listings the UI links out to the FDA Orange Book. We deliberately do NOT
// assert specific patent numbers here to avoid stale/incorrect data.

export type ObStatus = "Off-patent (generic)" | "Patent/exclusivity active" | "Mixed";

export type OrangeBookEntry = {
  /** normalised match keys (lowercase) */
  keys: string[];
  ingredient: string;
  originator: string;        // brand originator / first NDA holder
  brand: string;
  usLossOfExclusivity: string; // year US compound/key patent or exclusivity lapsed
  status: ObStatus;
  note: string;
};

export const ORANGE_BOOK_SNAPSHOT_DATE = "2026-06";

export const orangeBook: OrangeBookEntry[] = [
  {
    keys: ["ibuprofen"],
    ingredient: "Ibuprofen",
    originator: "Boots Company",
    brand: "Motrin / Advil",
    usLossOfExclusivity: "1985",
    status: "Off-patent (generic)",
    note: "Compound long off-patent; Rx and OTC genericised. No unexpired Orange Book substance patents.",
  },
  {
    keys: ["acetaminophen", "paracetamol"],
    ingredient: "Acetaminophen (paracetamol)",
    originator: "McNeil (Johnson & Johnson)",
    brand: "Tylenol",
    usLossOfExclusivity: "Pre-1960s",
    status: "Off-patent (generic)",
    note: "Compound off-patent for decades; brand value is trademark, not patent. Widely genericised.",
  },
  {
    keys: ["aspirin", "acetylsalicylic acid"],
    ingredient: "Acetylsalicylic acid (aspirin)",
    originator: "Bayer",
    brand: "Aspirin / Bayer",
    usLossOfExclusivity: "1917",
    status: "Off-patent (generic)",
    note: "Original patent expired ~1917; fully genericised. Low-dose cardio use is standard generic.",
  },
  {
    keys: ["metformin", "metformin hydrochloride", "metformin hcl"],
    ingredient: "Metformin hydrochloride",
    originator: "Bristol-Myers Squibb",
    brand: "Glucophage",
    usLossOfExclusivity: "2002",
    status: "Off-patent (generic)",
    note: "Glucophage US patent lapsed 2002; immediate-release fully generic. Some XR/FDC formulation patents have existed but the API is off-patent.",
  },
  {
    keys: ["atorvastatin", "atorvastatin calcium"],
    ingredient: "Atorvastatin calcium",
    originator: "Pfizer (Warner-Lambert)",
    brand: "Lipitor",
    usLossOfExclusivity: "2011",
    status: "Off-patent (generic)",
    note: "Lipitor lost US exclusivity Nov 2011; multiple ANDA generics. Crystalline-form/process patents have largely expired.",
  },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchOrangeBook(name: string, query: string): OrangeBookEntry | null {
  const candidates = [name, query].filter(Boolean).map(norm);
  for (const e of orangeBook) {
    if (e.keys.some((k) => candidates.some((c) => c.includes(k)))) return e;
  }
  return null;
}
