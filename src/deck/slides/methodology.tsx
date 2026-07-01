import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { PILLARS, WEIGHTING_METHODS, ALL_INDICATORS } from "../data/framework";
import { NineBox, FiveForces, Pestel } from "../components/frameworks";
import { DISTRICT_COUNT } from "../data/districts";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine } from "recharts";
import { Activity, Wallet, Stethoscope, Truck, Crosshair, TrendingUp } from "lucide-react";
import { DISTRICTS } from "../data/districts";

const PILLAR_ICONS: Record<string, any> = { demand: Activity, afford: Wallet, access: Stethoscope, distrib: Truck, white: Crosshair, growth: TrendingUp };
const PILLAR_THEORY: Record<string, string> = { demand: "PESTEL · epidemiology", afford: "Purchasing-power theory", access: "Service value chain", distrib: "Route-to-market", white: "Porter 5 Forces", growth: "Ansoff / diffusion" };

// ---------- SLIDE 2 : CONTEXT ----------
export function Context({ n, total }: { n: number; total: number }) {
  const breaks = [
    ["State-level targeting", "One UP or Maharashtra plan hides districts that behave nothing alike."],
    ["Field-force misallocation", "Reps crowd a few metros; high-need districts get zero coverage."],
    ["Launch sequencing by gut", "New brands roll out city-by-city on intuition, not measured readiness."],
    ["Whitespace stays invisible", "Under-penetrated districts with real demand never enter the plan."],
  ];
  return (
    <Slide n={n} total={total} section="Context" kicker="Market context and the problem" title="Growth has moved to the districts, yet a market this large is still planned at the state level." source="IBEF, IQVIA, industry reports (figures illustrative)">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="grid grid-cols-4 gap-3">
              {[["$50B", "IPM by 2030"], ["~10%", "IPM CAGR"], ["~40%", "sales from tier 2-6 towns"], ["700+", "districts, one market"]].map(([v, l], i) => (
                <div key={i}>
                  <div className="text-[27px] font-semibold leading-none tracking-tighter2" style={{ color: i === 2 ? ACCENT : INK }}>{v}</div>
                  <div className="mt-1 font-mono text-[8.5px] uppercase tracking-wide" style={{ color: INK2 }}>{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed" style={{ color: INK }}>
              India runs one of the world's largest pharma markets, but commercial planning leans on coarse geographies.
              Two districts inside the same state can differ more than two countries on disease burden, income and access.
              The fastest growth now sits in tier 2 to 6 towns, exactly where a state-average plan is blindest.
            </p>
            <div className="mt-4 rounded-[9px] border p-3" style={{ borderColor: LINE }}>
              <div className="mb-2 flex items-center justify-between">
                <div className="deck-kicker">Best vs worst district MAI, within one state</div>
                <span className="font-mono text-[8px]" style={{ color: INK3 }}>30 &mdash; 80</span>
              </div>
              {["Maharashtra", "Uttar Pradesh", "Karnataka", "Bihar", "Gujarat"].map((st) => {
                const ds = DISTRICTS.filter((d) => d.state === st).map((d) => d.mai);
                const mn = Math.min(...ds), mx = Math.max(...ds);
                const L = ((mn - 30) / 50) * 100, W = ((mx - mn) / 50) * 100;
                return (
                  <div key={st} className="mb-[6px] flex items-center gap-2">
                    <span className="w-[96px] truncate text-[9.5px]" style={{ color: INK }}>{st}</span>
                    <div className="relative h-[8px] flex-1 rounded-full" style={{ background: "#f0f0f0" }}>
                      <div className="absolute h-full rounded-full" style={{ left: `${L}%`, width: `${W}%`, background: ACCENT }} />
                    </div>
                    <span className="font-mono text-[9px]" style={{ color: INK2, width: 62, textAlign: "right" }}>{mn.toFixed(0)} &rarr; {mx.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-5">
            <Panel tint className="h-full">
              <div className="deck-kicker">Where state-level planning breaks</div>
              <div className="mt-2 space-y-[7px]">
                {breaks.map(([h, b], i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-mono text-[10px] font-semibold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="text-[11px] font-semibold" style={{ color: INK }}>{h}. </span>
                      <span className="text-[10.5px]" style={{ color: INK2 }}>{b}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
        <div className="mt-auto">
          <div className="deck-kicker mb-2">Macro demand drivers, structured with PESTEL, become the raw signal for the index</div>
          <Pestel />
        </div>
      </div>
    </Slide>
  );
}

// ---------- SLIDE 3 : FRAMEWORK ----------
export function Framework({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Framework" kicker="Theoretical foundation and the six pillars" title="Six pillars make the GE-McKinsey market-attractiveness axis computable; Porter's forces feed the competitive pillar." source="Framework design; GE-McKinsey, Porter (1979)">
      <div className="grid h-full grid-cols-12 gap-4">
        <div className="col-span-4 flex flex-col gap-3">
          <Panel tint>
            <div className="deck-kicker mb-1">GE-McKinsey nine-box</div>
            <div className="flex justify-center py-1"><NineBox w={200} h={150} /></div>
            <p className="mt-1 text-[10px] leading-snug" style={{ color: INK2 }}>
              We compute the <b>vertical axis objectively</b> for every district. The MAI says which box a district sits in, and therefore whether to invest, build, harvest or exit.
            </p>
          </Panel>
          <Panel>
            <div className="deck-kicker mb-1">Porter's five forces &rarr; Whitespace pillar</div>
            <div className="flex justify-center py-1"><FiveForces w={220} /></div>
          </Panel>
        </div>
        <div className="col-span-8">
          <div className="grid grid-cols-2 grid-rows-3 gap-2.5 h-full">
            {PILLARS.map((p) => {
              const Icon = PILLAR_ICONS[p.id];
              return (
                <div key={p.id} className="flex flex-col rounded-[9px] border p-3" style={{ borderColor: LINE }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}><Icon size={13} color={INK} strokeWidth={1.8} /></div>
                      <span className="text-[12.5px] font-semibold tracking-tightish" style={{ color: INK }}>P{p.no} {p.name}</span>
                    </div>
                    <span className="font-mono text-[15px] font-semibold" style={{ color: ACCENT }}>{Math.round(p.weight * 100)}<span className="text-[9px]">%</span></span>
                  </div>
                  <p className="mt-1 text-[10px] leading-snug" style={{ color: INK2 }}>{p.question}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1">
                      {p.indicators.slice(0, 4).map((ind) => (
                        <span key={ind.code} className="font-mono text-[8px] rounded border px-1 py-[1px]" style={{ color: INK2, borderColor: LINE }}>{ind.code}</span>
                      ))}
                    </div>
                    <Tag tone="muted">{PILLAR_THEORY[p.id]}</Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ---------- SLIDE 4 : STATISTICAL MODEL + VALIDATION ----------
const STEPS = ["Frame", "Select", "Collate", "Impute", "Winsorize", "Normalize", "Weight", "Aggregate", "Tier", "Validate"];

export function Model({ n, total }: { n: number; total: number }) {
  const pts = DISTRICTS.filter((_, i) => i % 8 === 0).slice(0, 90).map((d) => {
    const r = Math.sin(d.id * 2.7) * 10000; const noise = (r - Math.floor(r) - 0.5) * 22;
    return { mai: d.mai, sales: Math.max(8, Math.min(96, d.mai * 0.9 + noise)) };
  });
  const coverage = PILLARS.map((p, i) => ({ short: p.short, cov: [98, 96, 94, 91, 88, 93][i] }));
  const stress = [["Drop Growth pillar", 96], ["Equal weights", 91], ["Arithmetic mean", 88], ["+/-20% weights", 94]] as [string, number][];
  return (
    <Slide n={n} total={total} section="Model" kicker="The statistical model and its validation" title="Weights are earned from the data, sense-checked by experts, then combined so imbalance is penalised." source="OECD/JRC composite-indicator method; Saaty AHP; illustrative">
      <div className="flex h-full flex-col gap-2.5">
        {/* pipeline */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <span className="font-mono text-[9px] rounded border px-1.5 py-[2px]" style={{ color: i >= 6 ? ACCENT : INK2, borderColor: i >= 6 ? ACCENT : LINE }}>{String(i + 1).padStart(2, "0")} {s}</span>
              {i < STEPS.length - 1 && <span style={{ color: INK3, margin: "0 2px" }}>&rsaquo;</span>}
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-12 gap-3">
          {/* col 1: treatment + coverage */}
          <div className="col-span-4 flex flex-col gap-2.5">
            <Panel tint>
              <div className="deck-kicker">1 · Data treatment</div>
              <div className="mt-1.5 space-y-1 text-[10.5px] leading-snug" style={{ color: INK }}>
                <div><b>Impute</b> gaps via KNN + regional median, capped 8%, every cell flagged.</div>
                <div><b>Winsorize</b> at p5/p95 so one mega-city cannot dominate a scale.</div>
                <div><b>Align</b> direction: inverse indicators (saturation) flipped.</div>
                <div><b>Normalize</b> min-max to 0-100.</div>
              </div>
              <Rule className="my-1.5" />
              <div className="font-mono text-[10px]" style={{ color: INK2 }}>x' = 100 &middot; (x &minus; min) / (max &minus; min)</div>
              <div className="mt-1 font-mono text-[9px]" style={{ color: INK3 }}>{DISTRICT_COUNT} districts &times; {ALL_INDICATORS.length} indicators</div>
            </Panel>
            <Panel className="flex-1">
              <div className="deck-kicker mb-1.5">Data coverage by pillar</div>
              {coverage.map((c) => (
                <div key={c.short} className="mb-[5px] flex items-center gap-2">
                  <span className="w-[74px] text-[9.5px]" style={{ color: INK }}>{c.short}</span>
                  <div className="flex-1"><MiniBar value={c.cov} accent={c.cov >= 96} /></div>
                  <span className="font-mono text-[9px]" style={{ color: INK2, width: 26 }}>{c.cov}%</span>
                </div>
              ))}
            </Panel>
          </div>
          {/* col 2: weighting + aggregation */}
          <div className="col-span-4 flex flex-col gap-2.5">
            <Panel>
              <div className="deck-kicker">2 · Weighting, a reconciled hybrid</div>
              <div className="mt-2 space-y-1.5">
                {WEIGHTING_METHODS.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="w-[52px] text-[10.5px] font-semibold" style={{ color: INK }}>{m.name}</span>
                    <div className="flex-1"><MiniBar value={m.share * 100 * 2.4} accent={m.id === "pca"} /></div>
                    <span className="font-mono text-[9.5px]" style={{ color: INK2, width: 26 }}>{Math.round(m.share * 100)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 font-mono text-[8.5px]" style={{ color: INK3 }}>VIF &lt; 5 screen &middot; PCA KMO &gt; 0.7 &middot; AHP CR &lt; 0.1</div>
            </Panel>
            <Panel tint className="flex-1 flex flex-col justify-center">
              <div className="deck-kicker">3 · Aggregation, geometric</div>
              <div className="mt-1.5 font-mono text-[12px] leading-[2]" style={{ color: INK }}>
                Pillar<sub>p</sub> = &Sigma; w<sub>i</sub> x'<sub>i</sub><br />
                <span style={{ color: ACCENT }}>MAI</span> = &prod;<sub>p</sub> Pillar<sub>p</sub><sup> W<sub>p</sub></sup>
              </div>
              <p className="mt-1.5 text-[10px] leading-snug" style={{ color: INK2 }}>Geometric across pillars means a weak pillar cannot be bought back by another. Balance is required to score, exactly what a commercial team needs.</p>
            </Panel>
          </div>
          {/* col 3: validation + sensitivity */}
          <div className="col-span-4 flex flex-col gap-2.5">
            <Panel>
              <div className="deck-kicker">4 · Construct validity vs sales proxy</div>
              <div className="flex items-center gap-1">
                <ScatterChart width={186} height={132} margin={{ top: 8, right: 6, bottom: 12, left: -14 }}>
                  <XAxis type="number" dataKey="mai" domain={[20, 90]} tick={{ fontSize: 7, fontFamily: "ui-monospace", fill: INK3 }} axisLine={{ stroke: LINE }} tickLine={false} />
                  <YAxis type="number" dataKey="sales" domain={[0, 100]} tick={{ fontSize: 7, fontFamily: "ui-monospace", fill: INK3 }} axisLine={false} tickLine={false} />
                  <ZAxis range={[12, 12]} />
                  <ReferenceLine segment={[{ x: 24, y: 20 }, { x: 88, y: 82 }]} stroke={ACCENT} strokeWidth={1.4} />
                  <Scatter data={pts} fill="#bdbdbd" />
                </ScatterChart>
                <div>
                  <div className="font-mono text-[20px] font-semibold" style={{ color: ACCENT }}>0.79</div>
                  <div className="font-mono text-[8px] uppercase" style={{ color: INK3 }}>Pearson r</div>
                </div>
              </div>
            </Panel>
            <Panel tint className="flex-1">
              <div className="deck-kicker mb-1.5">Sensitivity, Tier-1 stability under stress</div>
              {stress.map(([h, v], i) => (
                <div key={i} className="mb-[5px] flex items-center gap-2">
                  <span className="w-[112px] text-[9.5px]" style={{ color: INK }}>{h}</span>
                  <div className="flex-1"><MiniBar value={v} accent={i === 0} /></div>
                  <span className="font-mono text-[9px]" style={{ color: INK2, width: 26 }}>{v}%</span>
                </div>
              ))}
              <p className="mt-1 text-[9px] leading-snug" style={{ color: INK3 }}>Share of Tier-1 districts that remain Tier-1 under each Monte-Carlo perturbation.</p>
            </Panel>
          </div>
        </div>
      </div>
    </Slide>
  );
}
