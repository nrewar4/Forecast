import { ACCENT, INK, INK2, INK3, LINE, PANEL, Panel, MiniBar, Slide } from "../components/primitives";
import { IndiaTileMap } from "../components/IndiaTileMap";
import { topDistricts, DISTRICTS, tierCounts, DISTRICT_COUNT } from "../data/districts";
import { PILLARS, TIERS } from "../data/framework";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, Cell } from "recharts";

export function Results({ n, total }: { n: number; total: number }) {
  const counts = tierCounts();
  const maxC = Math.max(...counts.map((c) => c.count));
  const top = topDistricts(10);
  const sample = DISTRICTS.filter((_, i) => i % 9 === 0).slice(0, 78);
  const whitespace = DISTRICTS.filter((d) => d.mai >= 62 && d.saturation < 55).length;
  // Concentration: what share of districts holds half the population-weighted opportunity
  const opp = (d: typeof DISTRICTS[number]) => d.pop * Math.pow(d.mai / 50, 1.5);
  const sorted = [...DISTRICTS].sort((a, b) => opp(b) - opp(a));
  const totalMass = sorted.reduce((s, d) => s + opp(d), 0);
  let cum = 0, kHalf = 0;
  for (const d of sorted) { cum += opp(d); kHalf++; if (cum >= totalMass * 0.5) break; }
  const halfShare = Math.round((kHalf / DISTRICT_COUNT) * 100);
  const tierColor = ["#0a0a0a", "#525252", "#737373", "#a3a3a3", "#cfcfcf"];

  return (
    <Slide n={n} total={total} section="Results" kicker="National scoring output" title={`${counts[0].count} Tier-1 priority districts, many hiding inside otherwise average states.`} source="Model output (illustrative scores)">
      <div className="flex h-full flex-col gap-3">
        <div className="grid flex-1 grid-cols-12 gap-4">
          {/* map */}
          <div className="col-span-5 flex items-center justify-center">
            <IndiaTileMap size={50} gap={5} />
          </div>
          {/* leaderboard */}
          <div className="col-span-4">
            <div className="deck-kicker mb-1.5">Top districts by MAI</div>
            <div className="grid grid-cols-[16px_1fr_58px_38px] items-center gap-x-1 border-b pb-1 font-mono text-[8px] uppercase" style={{ color: INK3, borderColor: INK }}>
              <span>#</span><span>District</span><span>Pillars</span><span className="text-right">MAI</span>
            </div>
            {top.map((d, i) => (
              <div key={d.id} className="grid grid-cols-[16px_1fr_58px_38px] items-center gap-x-1 border-b py-[3.5px]" style={{ borderColor: LINE }}>
                <span className="font-mono text-[9px]" style={{ color: INK3 }}>{i + 1}</span>
                <div className="min-w-0">
                  <div className="truncate text-[10.5px] font-medium leading-none" style={{ color: INK }}>{d.name}</div>
                  <div className="font-mono text-[7.5px] leading-tight" style={{ color: INK3 }}>{d.state}</div>
                </div>
                <div className="flex gap-[1.5px]">
                  {PILLARS.map((p) => (
                    <div key={p.id} className="w-[8px]" style={{ height: 13, background: "#f0f0f0" }}>
                      <div className="w-full" style={{ height: `${d.pillars[p.id]}%`, background: i === 0 ? ACCENT : "#525252", marginTop: `${13 - (d.pillars[p.id] / 100) * 13}px` }} />
                    </div>
                  ))}
                </div>
                <span className="text-right font-mono text-[11px] font-semibold" style={{ color: i === 0 ? ACCENT : INK }}>{d.mai.toFixed(1)}</span>
              </div>
            ))}
          </div>
          {/* tiers + quadrant */}
          <div className="col-span-3 flex flex-col gap-2">
            <div>
              <div className="deck-kicker mb-1.5">Districts per tier</div>
              {TIERS.map((t) => {
                const c = counts.find((x) => x.tier === t.id)?.count ?? 0;
                return (
                  <div key={t.id} className="mb-[5px] flex items-center gap-2">
                    <span className="font-mono text-[9px] font-semibold" style={{ width: 16, color: t.id === 1 ? ACCENT : INK }}>T{t.id}</span>
                    <div className="h-[13px] flex-1" style={{ background: "#f0f0f0" }}>
                      <div className="h-full" style={{ width: `${(c / maxC) * 100}%`, background: t.id === 1 ? ACCENT : tierColor[t.id - 1] }} />
                    </div>
                    <span className="font-mono text-[9.5px]" style={{ color: INK2, width: 26, textAlign: "right" }}>{c}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-1">
              <div className="deck-kicker mb-1">Attractiveness vs saturation</div>
              <ScatterChart width={210} height={128} margin={{ top: 6, right: 8, bottom: 4, left: -18 }}>
                <XAxis type="number" dataKey="mai" domain={[20, 90]} tick={{ fontSize: 7, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} />
                <YAxis type="number" dataKey="saturation" domain={[20, 90]} tick={{ fontSize: 7, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} />
                <ZAxis range={[14, 14]} />
                <ReferenceLine x={62} stroke={LINE} />
                <ReferenceLine y={55} stroke={LINE} />
                <Scatter data={sample}>
                  {sample.map((d) => <Cell key={d.id} fill={d.mai >= 62 && d.saturation < 55 ? ACCENT : "#cfcfcf"} />)}
                </Scatter>
              </ScatterChart>
            </div>
          </div>
        </div>
        {/* insight strip */}
        <div className="grid grid-cols-3 gap-4 border-t pt-2.5" style={{ borderColor: LINE }}>
          {[[`${halfShare}%`, "hold half the market", `The strongest ${halfShare}% of districts by MAI concentrate 50% of the population-weighted opportunity`], [`${whitespace}`, "whitespace districts", "High MAI but low current saturation, the orange cluster, primed for entry"], ["1x-3x", "intra-state spread", "Best and worst districts inside one large state differ up to threefold"]].map(([v, l, s], i) => (
            <div key={i} className="flex gap-3">
              <div className="text-[26px] font-semibold leading-none tracking-tighter2" style={{ color: i === 1 ? ACCENT : INK, minWidth: 64 }}>{v}</div>
              <div>
                <div className="font-mono text-[8.5px] uppercase tracking-wide" style={{ color: INK2 }}>{l}</div>
                <div className="mt-0.5 text-[10px] leading-snug" style={{ color: INK3 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}
