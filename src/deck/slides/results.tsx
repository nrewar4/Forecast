import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Stat, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { IndiaTileMap } from "../components/IndiaTileMap";
import { topDistricts, DISTRICTS, tierCounts } from "../data/districts";
import { PILLARS } from "../data/framework";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LabelList,
} from "recharts";
import { Search, ArrowUpRight } from "lucide-react";

export function National({ n, total }: { n: number; total: number }) {
  const counts = tierCounts();
  return (
    <Slide n={n} total={total} section="Results" kicker="The national picture" title="Attractiveness is a district story, not a state one, hot districts sit inside average states." source="Model output (illustrative scores); state averages">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-7 flex items-center justify-center">
          <IndiaTileMap size={54} gap={5} />
        </div>
        <div className="col-span-5 flex flex-col justify-center gap-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Stat value={counts[0].count} label="Tier 1 priority districts" accent />
            <Stat value={counts[1].count + counts[2].count} label="Tier 2-3 to build" />
          </div>
          <Rule />
          <div>
            <div className="deck-kicker mb-2">Read the map</div>
            <ul className="space-y-2 text-[12px] leading-snug" style={{ color: INK }}>
              <li className="flex gap-2"><span style={{ color: ACCENT }}>&bull;</span> Metros anchor the top, but Tier 1 districts appear across Maharashtra, the south and the NCR belt.</li>
              <li className="flex gap-2"><span style={{ color: ACCENT }}>&bull;</span> Large states like UP and MP are internally split, strong urban districts beside weak rural ones.</li>
              <li className="flex gap-2"><span style={{ color: ACCENT }}>&bull;</span> The index makes those splits visible and rankable for the first time.</li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  );
}

export function Leaderboard({ n, total }: { n: number; total: number }) {
  const top = topDistricts(11);
  // whitespace quadrant sample: attractiveness (MAI) vs saturation
  const sample = DISTRICTS.filter((_, i) => i % 7 === 0).slice(0, 90);
  return (
    <Slide n={n} total={total} section="Results" kicker="Leaderboard and whitespace" title="The model ranks districts and, crucially, finds high-demand districts that are still under-served." source="Model output (illustrative)">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-6">
          <div className="deck-kicker mb-2">Top districts by MAI</div>
          <div className="grid grid-cols-[18px_1fr_74px_44px] items-center gap-x-2 border-b pb-1 font-mono text-[9px] uppercase" style={{ color: INK3, borderColor: INK }}>
            <span>#</span><span>District</span><span>Pillars</span><span className="text-right">MAI</span>
          </div>
          {top.map((d, i) => (
            <div key={d.id} className="grid grid-cols-[18px_1fr_74px_44px] items-center gap-x-2 border-b py-[4.5px]" style={{ borderColor: LINE }}>
              <span className="font-mono text-[10px]" style={{ color: INK3 }}>{i + 1}</span>
              <div className="min-w-0">
                <div className="truncate text-[11.5px] font-medium leading-tight" style={{ color: INK }}>{d.name}</div>
                <div className="font-mono text-[8.5px]" style={{ color: INK3 }}>{d.state}</div>
              </div>
              <div className="flex gap-[2px]">
                {PILLARS.map((p) => (
                  <div key={p.id} className="w-[10px] rounded-sm" style={{ height: 16, background: "#f0f0f0" }}>
                    <div className="w-full rounded-sm" style={{ height: `${d.pillars[p.id]}%`, background: i === 0 ? ACCENT : "#525252", marginTop: `${16 - (d.pillars[p.id] / 100) * 16}px` }} />
                  </div>
                ))}
              </div>
              <span className="text-right font-mono text-[13px] font-semibold" style={{ color: i === 0 ? ACCENT : INK }}>{d.mai.toFixed(1)}</span>
            </div>
          ))}
        </div>
        <div className="col-span-6 flex flex-col">
          <div className="deck-kicker mb-1">Attractiveness vs existing saturation</div>
          <ScatterChart width={520} height={300} margin={{ top: 12, right: 16, bottom: 26, left: 4 }}>
            <XAxis type="number" dataKey="mai" name="MAI" domain={[20, 90]} tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} label={{ value: "MAI  (attractiveness)", position: "insideBottom", offset: -14, style: { fontSize: 10, fontFamily: "ui-monospace", fill: INK2 } }} />
            <YAxis type="number" dataKey="saturation" name="Saturation" domain={[20, 90]} tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} label={{ value: "Saturation", angle: -90, position: "insideLeft", style: { fontSize: 10, fontFamily: "ui-monospace", fill: INK2 } }} />
            <ZAxis range={[26, 26]} />
            <ReferenceLine x={62} stroke={LINE} />
            <ReferenceLine y={55} stroke={LINE} />
            <Scatter data={sample}>
              {sample.map((d) => {
                const white = d.mai >= 62 && d.saturation < 55;
                return <Cell key={d.id} fill={white ? ACCENT : "#c9c9c9"} />;
              })}
            </Scatter>
          </ScatterChart>
          <div className="mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono text-[9.5px]" style={{ color: INK2 }}><span className="inline-block h-2 w-2 rounded-full" style={{ background: ACCENT }} /> Whitespace: high demand, low saturation</span>
            <span className="flex items-center gap-1 font-mono text-[9.5px]" style={{ color: INK3 }}><span className="inline-block h-2 w-2 rounded-full" style={{ background: "#c9c9c9" }} /> Rest of field</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

export function Validation({ n, total }: { n: number; total: number }) {
  // proxy sales correlated with MAI + noise (illustrative construct validity)
  const rand = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
  const pts = DISTRICTS.filter((_, i) => i % 6 === 0).slice(0, 110).map((d, i) => ({
    mai: d.mai,
    sales: Math.max(8, Math.min(96, d.mai * 0.92 + (rand(d.id * 3.1) - 0.5) * 22)),
  }));
  const shifts = [
    ["Drop Growth pillar", "96%"], ["Equal weights", "91%"], ["Arithmetic mean", "88%"], ["+/-20% on each weight", "94%"],
  ];
  return (
    <Slide n={n} total={total} section="Results" kicker="Validation and sensitivity" title="The index tracks real sales, and its ranking barely moves when we stress the assumptions." source="Construct validity vs retail-audit proxy (illustrative); Monte-Carlo re-weighting">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-6">
          <div className="deck-kicker mb-1">MAI vs independent sales proxy</div>
          <ScatterChart width={500} height={280} margin={{ top: 10, right: 14, bottom: 24, left: 0 }}>
            <XAxis type="number" dataKey="mai" domain={[20, 90]} tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} label={{ value: "MAI score", position: "insideBottom", offset: -12, style: { fontSize: 10, fontFamily: "ui-monospace", fill: INK2 } }} />
            <YAxis type="number" dataKey="sales" domain={[0, 100]} tick={{ fontSize: 9, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} label={{ value: "Retail sales index", angle: -90, position: "insideLeft", style: { fontSize: 10, fontFamily: "ui-monospace", fill: INK2 } }} />
            <ZAxis range={[22, 22]} />
            <ReferenceLine segment={[{ x: 24, y: 20 }, { x: 88, y: 82 }]} stroke={ACCENT} strokeWidth={1.5} />
            <Scatter data={pts} fill="#bdbdbd" />
          </ScatterChart>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-[22px] font-semibold" style={{ color: ACCENT }}>r = 0.79</span>
            <span className="text-[11px] leading-snug" style={{ color: INK2 }}>Strong correlation with a sales signal the model never saw. Attractiveness is measuring the right thing.</span>
          </div>
        </div>
        <div className="col-span-6 flex flex-col justify-center gap-4">
          <Panel tint>
            <div className="deck-kicker">Rank stability under stress</div>
            <p className="mt-2 text-[12px] leading-snug" style={{ color: INK }}>
              We re-ran the model under alternative weighting choices and Monte-Carlo perturbations.
              Reported figures are the share of Tier 1 districts that stay Tier 1.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {shifts.map(([h, v], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex-1 text-[11.5px]" style={{ color: INK }}>{h}</span>
                  <div className="w-[120px]"><MiniBar value={parseInt(v)} accent={i === 0} /></div>
                  <span className="font-mono text-[12px] font-semibold" style={{ color: INK, width: 40, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid grid-cols-3 gap-3">
            <Stat value={<>0.79</>} label="sales correlation" />
            <Stat value={<>94<span style={{ fontSize: 18 }}>%</span></>} label="tier-1 stability" accent />
            <Stat value={<>&lt;3</>} label="median rank shift" />
          </div>
        </div>
      </div>
    </Slide>
  );
}

export function Dashboard({ n, total }: { n: number; total: number }) {
  const d = topDistricts(4)[1]; // a recognisable district for the mock
  const radar = PILLARS.map((p) => ({ pillar: p.short, v: d.pillars[p.id], peer: Math.max(20, d.pillars[p.id] - 12 + (p.no % 2 ? 6 : -4)) }));
  return (
    <Slide n={n} total={total} section="Results" kicker="The delivery layer" title="Scores ship as an interactive dashboard, so a manager can act on a district in seconds." source="Product concept; scores illustrative">
      <div className="grid h-full grid-cols-12 gap-5">
        {/* left: search + list */}
        <div className="col-span-3 flex flex-col rounded-[10px] border" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: LINE }}>
            <Search size={13} color={INK3} />
            <span className="text-[11px]" style={{ color: INK3 }}>Search districts...</span>
          </div>
          {topDistricts(9).map((x, i) => (
            <div key={x.id} className="flex items-center justify-between border-b px-3 py-[7px]" style={{ borderColor: LINE, background: i === 1 ? PANEL : "#fff" }}>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium" style={{ color: INK }}>{x.name}</div>
                <div className="font-mono text-[8px]" style={{ color: INK3 }}>{x.state}</div>
              </div>
              <span className="font-mono text-[11px] font-semibold" style={{ color: i === 1 ? ACCENT : INK }}>{x.mai.toFixed(0)}</span>
            </div>
          ))}
        </div>
        {/* centre: profile card */}
        <div className="col-span-5 flex flex-col rounded-[10px] border p-4" style={{ borderColor: LINE }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] font-semibold tracking-tightish" style={{ color: INK }}>{d.name}</div>
              <div className="font-mono text-[10px]" style={{ color: INK3 }}>{d.state} · pop {d.pop}M</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[38px] font-semibold leading-none" style={{ color: ACCENT }}>{d.mai.toFixed(0)}</div>
              <Tag tone="accent">Tier {d.tier} · Priority</Tag>
            </div>
          </div>
          <Rule className="my-3" />
          <div className="deck-kicker mb-1">Pillar profile vs peer median</div>
          <div className="flex justify-center">
            <RadarChart width={320} height={200} data={radar} outerRadius={72} margin={{ top: 6, bottom: 6 }}>
              <PolarGrid stroke="#e8e8e8" />
              <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 8.5, fontFamily: "ui-monospace", fill: INK2 }} />
              <Radar dataKey="peer" stroke="#c2c2c2" fill="#c2c2c2" fillOpacity={0.18} />
              <Radar dataKey="v" stroke={ACCENT} fill={ACCENT} fillOpacity={0.16} strokeWidth={1.6} />
            </RadarChart>
          </div>
        </div>
        {/* right: recommended action */}
        <div className="col-span-4 flex flex-col gap-3">
          <Panel tint className="flex-1">
            <div className="deck-kicker" style={{ color: ACCENT }}>Recommended play</div>
            <div className="mt-2 text-[13px] font-semibold" style={{ color: INK }}>Deploy full field force, launch first</div>
            <ul className="mt-2 space-y-1.5 text-[11.5px]" style={{ color: INK2 }}>
              <li className="flex gap-1.5"><ArrowUpRight size={13} color={ACCENT} /> 6-8 reps, 2 specialists lines</li>
              <li className="flex gap-1.5"><ArrowUpRight size={13} color={ACCENT} /> Cardio-metabolic portfolio fit</li>
              <li className="flex gap-1.5"><ArrowUpRight size={13} color={ACCENT} /> 3 new stockists, e-pharmacy live</li>
            </ul>
          </Panel>
          <Panel>
            <div className="deck-kicker">Peer benchmark</div>
            <div className="mt-2 space-y-1.5">
              {topDistricts(4).filter((x) => x.id !== d.id).slice(0, 3).map((x) => (
                <div key={x.id} className="flex items-center justify-between text-[11px]"><span style={{ color: INK }}>{x.name}</span><span className="font-mono" style={{ color: INK2 }}>{x.mai.toFixed(0)}</span></div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}
