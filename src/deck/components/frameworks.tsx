import { ACCENT, INK, INK2, INK3, LINE, PANEL } from "./primitives";
import { LineChart, Line, XAxis, YAxis, ReferenceDot } from "recharts";

// ---- GE-McKinsey nine-box: Market Attractiveness (our MAI) vs Competitive Position ----
export function NineBox({ w = 250, h = 190 }: { w?: number; h?: number }) {
  // shading: invest (dark) top-right, hold (mid) diagonal, harvest (light) bottom-left
  const shade = (r: number, c: number) => {
    const s = (2 - r) + c; // 0..4 ; higher = more attractive+stronger
    return ["#f6f6f6", "#ededed", "#fbe4d2", "#f7c79c", "#f47920"][s];
  };
  const cell = { w: w / 3, h: h / 3 };
  const label = [["Divest", "Harvest", "Selective"], ["Harvest", "Hold", "Build"], ["Selective", "Build", "Invest"]];
  return (
    <div className="relative" style={{ width: w + 22, height: h + 22 }}>
      <div className="absolute left-[22px] top-0" style={{ width: w, height: h }}>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const s = 2 - r + c;
            return (
              <div key={`${r}${c}`} className="absolute flex items-center justify-center" style={{ left: c * cell.w, top: r * cell.h, width: cell.w, height: cell.h, background: shade(r, c), border: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="font-mono text-[7.5px] uppercase tracking-wide" style={{ color: s >= 3 ? "#fff" : INK2 }}>{label[2 - r][c]}</span>
              </div>
            );
          }),
        )}
      </div>
      {/* y axis label */}
      <div className="absolute left-0 top-0 flex items-center" style={{ height: h }}>
        <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] -rotate-90 whitespace-nowrap" style={{ color: INK3 }}>Market attractiveness (MAI)</span>
      </div>
      {/* x axis label */}
      <div className="absolute left-[22px] flex justify-center" style={{ top: h + 6, width: w }}>
        <span className="font-mono text-[7.5px] uppercase tracking-[0.1em]" style={{ color: INK3 }}>Competitive position</span>
      </div>
    </div>
  );
}

// ---- Porter's Five Forces ----
export function FiveForces({ w = 250 }: { w?: number }) {
  const F = ({ label, v }: { label: string; v: string }) => (
    <div className="flex flex-col items-center rounded-[6px] border px-2 py-1 text-center" style={{ borderColor: LINE, background: "#fff", width: 118 }}>
      <span className="text-[9px] font-semibold leading-tight" style={{ color: INK }}>{label}</span>
      <span className="font-mono text-[7.5px]" style={{ color: v === "High" ? ACCENT : INK3 }}>{v}</span>
    </div>
  );
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width: w }}>
      <F label="New entrants" v="Med" />
      <div className="flex items-center justify-center gap-2">
        <F label="Supplier power" v="Low" />
        <div className="flex flex-col items-center justify-center rounded-[6px] px-2 py-1 text-center" style={{ background: ACCENT, width: 118 }}>
          <span className="text-[9px] font-semibold leading-tight text-white">Rivalry = saturation</span>
          <span className="font-mono text-[7.5px] text-white/85">feeds Whitespace</span>
        </div>
        <F label="Buyer power" v="Med" />
      </div>
      <F label="Substitutes (Rx)" v="High" />
    </div>
  );
}

// ---- BCG growth-share style matrix mapped to tiers ----
export function BcgMatrix({ w = 300, h = 200, bubbles }: { w?: number; h?: number; bubbles: { x: number; y: number; r: number; label: string; accent?: boolean }[] }) {
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <div className="absolute inset-0" style={{ border: `1px solid ${LINE}` }} />
      <div className="absolute" style={{ left: w / 2, top: 0, height: h, width: 1, background: LINE }} />
      <div className="absolute" style={{ top: h / 2, left: 0, width: w, height: 1, background: LINE }} />
      {/* quadrant labels */}
      <span className="absolute font-mono text-[8px] uppercase" style={{ left: 6, top: 5, color: INK3 }}>Question marks</span>
      <span className="absolute font-mono text-[8px] uppercase" style={{ right: 6, top: 5, color: ACCENT }}>Stars</span>
      <span className="absolute font-mono text-[8px] uppercase" style={{ left: 6, bottom: 5, color: INK3 }}>Dogs</span>
      <span className="absolute font-mono text-[8px] uppercase" style={{ right: 6, bottom: 5, color: INK2 }}>Cash cows</span>
      {bubbles.map((b, i) => (
        <div key={i} className="absolute flex items-center justify-center rounded-full" style={{ left: b.x * w - b.r, top: (1 - b.y) * h - b.r, width: b.r * 2, height: b.r * 2, background: b.accent ? "rgba(244,121,32,0.85)" : "rgba(64,64,64,0.5)" }}>
          <span className="text-[8px] font-semibold text-white">{b.label}</span>
        </div>
      ))}
      <span className="absolute font-mono text-[7.5px] uppercase" style={{ left: 4, top: -14, color: INK3 }}>High growth &uarr;</span>
      <span className="absolute font-mono text-[7.5px] uppercase" style={{ right: 4, bottom: -14, color: INK3 }}>Current share &rarr;</span>
    </div>
  );
}

// ---- Ansoff 2x2 ----
export function Ansoff({ w = 210 }: { w?: number }) {
  const cells = [
    ["Market penetration", "Tier 1-2, own brands", true],
    ["Product development", "Tier 1, new therapies", false],
    ["Market development", "Tier 3-4 whitespace", false],
    ["Diversification", "Selective, OTC / e-pharm", false],
  ];
  return (
    <div className="grid grid-cols-2" style={{ width: w }}>
      {cells.map(([h, s, hot], i) => (
        <div key={i} className="border p-1.5" style={{ borderColor: LINE, background: hot ? PANEL : "#fff" }}>
          <div className="text-[8.5px] font-semibold leading-tight" style={{ color: hot ? ACCENT : INK }}>{h as string}</div>
          <div className="font-mono text-[7px]" style={{ color: INK3 }}>{s as string}</div>
        </div>
      ))}
    </div>
  );
}

// ---- PESTEL strip ----
export function Pestel() {
  const items = [
    ["P", "Political", "NHM, PMJAY, NPPA price control"],
    ["E", "Economic", "Income growth, insurance depth"],
    ["S", "Social", "Ageing, chronic-disease burden, urbanisation"],
    ["T", "Technological", "e-pharmacy, digital health, telemedicine"],
    ["E", "Environmental", "Disease geography, seasonality"],
    ["L", "Legal", "DPCO, Jan Aushadhi, Rx norms"],
  ];
  return (
    <div className="grid grid-cols-6 gap-2">
      {items.map(([k, h, b], i) => (
        <div key={i} className="rounded-[6px] border p-2" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded font-mono text-[8px] font-semibold" style={{ background: ACCENT, color: "#fff" }}>{k}</span>
            <span className="text-[9.5px] font-semibold" style={{ color: INK }}>{h}</span>
          </div>
          <div className="mt-1 text-[8.5px] leading-snug" style={{ color: INK2 }}>{b}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Bass diffusion adoption curves ----
export function BassCurve({ w = 300, h = 180 }: { w?: number; h?: number }) {
  const bass = (p: number, q: number, months: number) => {
    const out: number[] = [];
    let F = 0;
    for (let t = 0; t <= months; t++) {
      const num = 1 - Math.exp(-(p + q) * t);
      const den = 1 + (q / p) * Math.exp(-(p + q) * t);
      F = num / den;
      out.push(F);
    }
    return out;
  };
  const targeted = bass(0.045, 0.42, 24);
  const untarg = bass(0.02, 0.28, 24);
  const data = targeted.map((v, t) => ({ t, targeted: Math.round(v * 100), untargeted: Math.round(untarg[t] * 100) }));
  return (
    <LineChart width={w} height={h} data={data} margin={{ top: 8, right: 10, bottom: 16, left: -10 }}>
      <XAxis dataKey="t" tick={{ fontSize: 8, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} ticks={[0, 6, 12, 18, 24]} label={{ value: "months", position: "insideBottom", offset: -8, style: { fontSize: 8, fontFamily: "ui-monospace", fill: INK3 } }} />
      <YAxis tick={{ fontSize: 8, fontFamily: "ui-monospace", fill: INK3 }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Line type="monotone" dataKey="targeted" stroke={ACCENT} strokeWidth={2} dot={false} />
      <Line type="monotone" dataKey="untargeted" stroke="#c2c2c2" strokeWidth={1.6} strokeDasharray="4 3" dot={false} />
    </LineChart>
  );
}
