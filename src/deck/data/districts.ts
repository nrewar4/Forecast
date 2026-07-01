// Illustrative district dataset. Deterministic (seeded) so the deck renders the
// same numbers every build. Demonstrates the SHAPE of MAI outputs; real scoring
// plugs in the live feeds named in framework.ts.

import { PILLARS, tierForScore } from "./framework";

export interface District {
  id: number;
  name: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central" | "NE";
  pillars: Record<string, number>; // pillar id -> 0..100
  mai: number; // 0..100 composite
  tier: number;
  saturation: number; // existing pharma sales saturation 0..100 (for whitespace quadrant)
  pop: number; // addressable population, millions
}

// Deterministic PRNG (mulberry32)
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface StateSpec {
  state: string;
  region: District["region"];
  count: number;
  base: number; // baseline attractiveness centre
  spread: number;
}

// 28 states/UTs, district counts summing to 730, with plausible baselines.
const STATE_SPECS: StateSpec[] = [
  { state: "Uttar Pradesh", region: "North", count: 75, base: 49, spread: 15 },
  { state: "Madhya Pradesh", region: "Central", count: 52, base: 47, spread: 13 },
  { state: "Bihar", region: "East", count: 38, base: 44, spread: 12 },
  { state: "Maharashtra", region: "West", count: 36, base: 61, spread: 15 },
  { state: "Rajasthan", region: "North", count: 33, base: 48, spread: 13 },
  { state: "Tamil Nadu", region: "South", count: 38, base: 63, spread: 12 },
  { state: "Karnataka", region: "South", count: 31, base: 60, spread: 14 },
  { state: "Gujarat", region: "West", count: 33, base: 59, spread: 13 },
  { state: "Andhra Pradesh", region: "South", count: 26, base: 56, spread: 12 },
  { state: "Telangana", region: "South", count: 33, base: 57, spread: 13 },
  { state: "West Bengal", region: "East", count: 23, base: 54, spread: 13 },
  { state: "Odisha", region: "East", count: 30, base: 46, spread: 12 },
  { state: "Kerala", region: "South", count: 14, base: 64, spread: 9 },
  { state: "Jharkhand", region: "East", count: 24, base: 45, spread: 12 },
  { state: "Assam", region: "NE", count: 35, base: 43, spread: 11 },
  { state: "Punjab", region: "North", count: 23, base: 58, spread: 10 },
  { state: "Chhattisgarh", region: "Central", count: 33, base: 45, spread: 12 },
  { state: "Haryana", region: "North", count: 22, base: 58, spread: 11 },
  { state: "Uttarakhand", region: "North", count: 13, base: 52, spread: 11 },
  { state: "Himachal Pradesh", region: "North", count: 12, base: 51, spread: 9 },
  { state: "Jammu & Kashmir", region: "North", count: 20, base: 47, spread: 11 },
  { state: "Delhi NCT", region: "North", count: 11, base: 62, spread: 7 },
  { state: "Goa", region: "West", count: 2, base: 64, spread: 6 },
  { state: "Tripura", region: "NE", count: 8, base: 44, spread: 9 },
  { state: "Manipur", region: "NE", count: 16, base: 41, spread: 9 },
  { state: "Meghalaya", region: "NE", count: 12, base: 40, spread: 9 },
  { state: "Nagaland", region: "NE", count: 12, base: 39, spread: 9 },
  { state: "Arunachal Pradesh", region: "NE", count: 26, base: 37, spread: 9 },
];

// Curated real district names for believable leaderboards (assigned to top rows).
const NAMED: Record<string, string[]> = {
  "Delhi NCT": ["New Delhi", "South Delhi", "Central Delhi", "West Delhi"],
  Maharashtra: ["Mumbai Suburban", "Pune", "Thane", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Belagavi", "Dakshina Kannada"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Telangana: ["Hyderabad", "Rangareddy", "Medchal-Malkajgiri", "Warangal"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Kerala: ["Ernakulam", "Thiruvananthapuram", "Thrissur", "Kozhikode"],
  "West Bengal": ["Kolkata", "North 24 Parganas", "Howrah", "Darjeeling"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Uttar Pradesh": ["Gautam Buddha Nagar", "Lucknow", "Ghaziabad", "Kanpur Nagar", "Varanasi", "Agra", "Meerut"],
  "Andhra Pradesh": ["Visakhapatnam", "Guntur", "Krishna", "Nellore"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Karnal"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  Odisha: ["Khordha", "Cuttack", "Ganjam", "Sundargarh"],
  Assam: ["Kamrup Metropolitan", "Dibrugarh", "Cachar", "Jorhat"],
  Jharkhand: ["Ranchi", "Dhanbad", "East Singhbhum", "Bokaro"],
  Chhattisgarh: ["Raipur", "Durg", "Bilaspur", "Korba"],
  Uttarakhand: ["Dehradun", "Haridwar", "Udham Singh Nagar"],
  Goa: ["North Goa", "South Goa"],
};

function clamp(x: number) {
  return Math.max(4, Math.min(97, x));
}

function buildDistricts(): District[] {
  const rand = rng(73007);
  const gauss = () => (rand() + rand() + rand() + rand() - 2) / 2; // approx normal, ~[-1,1]
  const out: District[] = [];
  let id = 1;

  for (const spec of STATE_SPECS) {
    const named = NAMED[spec.state] ?? [];
    // rank within-state draws so named districts land on the strongest scores
    const draws: { core: number }[] = [];
    for (let i = 0; i < spec.count; i++) {
      draws.push({ core: spec.base + gauss() * spec.spread });
    }
    draws.sort((a, b) => b.core - a.core);

    draws.forEach((d, i) => {
      // Flagship uplift: named metro districts (the state's strongest) float to
      // the top of the national board so it reads as real cities, not "District 5".
      const named_here = i < named.length;
      const flagship = named_here ? (named.length - i) * 1.1 + 3 : 0;
      const core = clamp(d.core + flagship);
      // pillar scores centre on the district core with independent noise
      const pillars: Record<string, number> = {};
      for (const p of PILLARS) {
        pillars[p.id] = clamp(core + gauss() * 10);
      }
      // weighted geometric mean across pillars => composite
      let logSum = 0;
      let wSum = 0;
      for (const p of PILLARS) {
        logSum += p.weight * Math.log(pillars[p.id]);
        wSum += p.weight;
      }
      const mai = Math.round((Math.exp(logSum / wSum)) * 10) / 10;
      const name = i < named.length ? named[i] : `${spec.state.split(" ")[0]} District ${i + 1}`;
      // saturation correlates with core but with real whitespace pockets
      const saturation = clamp(core * 0.52 + 20 + gauss() * 24);
      const pop = Math.round((0.4 + rand() * 4.6) * 10) / 10;
      out.push({
        id: id++,
        name,
        state: spec.state,
        region: spec.region,
        pillars,
        mai,
        tier: tierForScore(mai).id,
        saturation: Math.round(saturation * 10) / 10,
        pop,
      });
    });
  }
  return out.sort((a, b) => b.mai - a.mai);
}

export const DISTRICTS: District[] = buildDistricts();
export const DISTRICT_COUNT = DISTRICTS.length;

export function tierCounts(): { tier: number; name: string; count: number }[] {
  const names = ["Priority", "Grow", "Build", "Seed", "Watch"];
  return [1, 2, 3, 4, 5].map((t) => ({
    tier: t,
    name: names[t - 1],
    count: DISTRICTS.filter((d) => d.tier === t).length,
  }));
}

export function topDistricts(n: number): District[] {
  return DISTRICTS.slice(0, n);
}

export function stateAverages(): { state: string; region: District["region"]; mai: number; n: number }[] {
  const map = new Map<string, { sum: number; n: number; region: District["region"] }>();
  for (const d of DISTRICTS) {
    const e = map.get(d.state) ?? { sum: 0, n: 0, region: d.region };
    e.sum += d.mai;
    e.n += 1;
    map.set(d.state, e);
  }
  return [...map.entries()].map(([state, e]) => ({
    state,
    region: e.region,
    mai: Math.round((e.sum / e.n) * 10) / 10,
    n: e.n,
  }));
}
