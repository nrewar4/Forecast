import { ACCENT, INK3 } from "./primitives";
import { stateAverages } from "../data/districts";

// Hardcoded tile-grid layout of India (row/col, north-to-south, west-to-east).
// A tile map keeps the choropleth fully offline and on-brand.
const TILES: { abbr: string; state: string; r: number; c: number }[] = [
  { abbr: "JK", state: "Jammu & Kashmir", r: 0, c: 2 },
  { abbr: "PB", state: "Punjab", r: 1, c: 2 },
  { abbr: "HP", state: "Himachal Pradesh", r: 1, c: 3 },
  { abbr: "UK", state: "Uttarakhand", r: 1, c: 4 },
  { abbr: "AR", state: "Arunachal Pradesh", r: 1, c: 8 },
  { abbr: "RJ", state: "Rajasthan", r: 2, c: 1 },
  { abbr: "HR", state: "Haryana", r: 2, c: 2 },
  { abbr: "DL", state: "Delhi NCT", r: 2, c: 3 },
  { abbr: "UP", state: "Uttar Pradesh", r: 2, c: 4 },
  { abbr: "BR", state: "Bihar", r: 2, c: 5 },
  { abbr: "AS", state: "Assam", r: 2, c: 7 },
  { abbr: "NL", state: "Nagaland", r: 2, c: 8 },
  { abbr: "GJ", state: "Gujarat", r: 3, c: 0 },
  { abbr: "MP", state: "Madhya Pradesh", r: 3, c: 2 },
  { abbr: "JH", state: "Jharkhand", r: 3, c: 5 },
  { abbr: "WB", state: "West Bengal", r: 3, c: 6 },
  { abbr: "ML", state: "Meghalaya", r: 3, c: 7 },
  { abbr: "MN", state: "Manipur", r: 3, c: 8 },
  { abbr: "MH", state: "Maharashtra", r: 4, c: 2 },
  { abbr: "CG", state: "Chhattisgarh", r: 4, c: 4 },
  { abbr: "OD", state: "Odisha", r: 4, c: 5 },
  { abbr: "TR", state: "Tripura", r: 4, c: 7 },
  { abbr: "TG", state: "Telangana", r: 5, c: 3 },
  { abbr: "GA", state: "Goa", r: 6, c: 1 },
  { abbr: "KA", state: "Karnataka", r: 6, c: 2 },
  { abbr: "AP", state: "Andhra Pradesh", r: 6, c: 4 },
  { abbr: "KL", state: "Kerala", r: 7, c: 2 },
  { abbr: "TN", state: "Tamil Nadu", r: 7, c: 3 },
];

function mix(a: number[], b: number[], t: number) {
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
}

// Neutral-to-accent heatmap: this is the one place colour encodes data.
function heat(mai: number) {
  const t = Math.max(0, Math.min(1, (mai - 39) / (69 - 39)));
  const low = [244, 242, 240];
  const high = [244, 121, 32];
  return { fill: mix(low, high, t), text: t > 0.52 ? "#fff" : "#0a0a0a" };
}

export function IndiaTileMap({ size = 58, gap = 5 }: { size?: number; gap?: number }) {
  const averages = stateAverages();
  const byState = new Map(averages.map((s) => [s.state, s]));
  const topState = averages.reduce((a, b) => (b.mai > a.mai ? b : a)).state;
  return (
    <div className="relative" style={{ width: 9 * (size + gap), height: 8 * (size + gap) }}>
      {TILES.map((t) => {
        const s = byState.get(t.state);
        const mai = s?.mai ?? 45;
        const { fill, text } = heat(mai);
        const top = t.state === topState; // outline the single hottest state
        return (
          <div
            key={t.abbr}
            className="absolute flex flex-col items-center justify-center rounded-[6px]"
            style={{
              left: t.c * (size + gap),
              top: t.r * (size + gap),
              width: size,
              height: size,
              background: fill,
              border: top ? `1.5px solid ${ACCENT}` : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span className="font-mono text-[10px] font-semibold leading-none" style={{ color: text }}>{t.abbr}</span>
            <span className="font-mono text-[11px] font-semibold leading-none mt-[3px]" style={{ color: text }}>{mai.toFixed(0)}</span>
          </div>
        );
      })}
      {/* legend */}
      <div className="absolute" style={{ left: 0, top: 8 * (size + gap) + 2 }}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px]" style={{ color: INK3 }}>LOW</span>
          <div className="h-[8px] w-[150px] rounded-full" style={{ background: "linear-gradient(90deg,#f4f2f0,#f47920)" }} />
          <span className="font-mono text-[9px]" style={{ color: INK3 }}>HIGH  ·  avg MAI by state</span>
        </div>
      </div>
    </div>
  );
}
