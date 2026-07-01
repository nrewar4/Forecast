import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Stat, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { PILLARS, WEIGHTING_METHODS, TIERS } from "../data/framework";
import { tierCounts } from "../data/districts";
import { BarChart, Bar, Cell, XAxis, YAxis, LabelList } from "recharts";
import { Activity, Wallet, Stethoscope, Truck, Crosshair, TrendingUp } from "lucide-react";

const PILLAR_ICONS: Record<string, any> = {
  demand: Activity, afford: Wallet, access: Stethoscope, distrib: Truck, white: Crosshair, growth: TrendingUp,
};

export function Problem({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Context" kicker="The problem" title="Growth has moved to the districts, but pharma still targets at the state and metro level." source="Industry structure; figures illustrative">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-5 flex flex-col justify-between">
          <p className="text-[14.5px] leading-relaxed" style={{ color: INK }}>
            India runs one of the world's largest pharma markets, yet commercial planning leans on coarse
            geographies. Two districts inside the same state can differ more than two countries on disease
            burden, income and access. Without a comparable district measure, teams over-serve saturated
            metros and miss the fastest-rising tier 2 and 3 pockets.
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Stat value="700+" label="districts, no common yardstick" />
            <Stat value={<>~65<span style={{ fontSize: 20 }}>%</span></>} label="population beyond top metros" accent />
            <Stat value="28" label="states, wildly different profiles" />
            <Stat value="1x-3x" label="intra-state spread in demand" />
          </div>
        </div>
        <div className="col-span-7">
          <Panel tint className="h-full">
            <div className="deck-kicker">Where planning breaks today</div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {[
                ["State-level targeting", "A single Maharashtra or UP plan hides districts that behave nothing alike."],
                ["Field-force misallocation", "Reps concentrate in a few cities while under-served high-need districts get no coverage."],
                ["Launch sequencing by gut", "New brands roll out city-by-city on intuition, not on measured readiness."],
                ["Whitespace stays invisible", "Under-penetrated districts with real demand never surface in the plan."],
              ].map(([h, b], i) => (
                <div key={i} className="flex gap-3 rounded-[8px] border bg-white p-3" style={{ borderColor: LINE }}>
                  <span className="font-mono text-[12px] font-semibold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: INK }}>{h}</div>
                    <div className="text-[12px] leading-snug" style={{ color: INK2 }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

const STEPS = [
  ["01", "Frame", "Define attractiveness for a pharma commercial lens"],
  ["02", "Select", "Choose indicators with theory + data backing"],
  ["03", "Collate", "Assemble 730 x ~28 district panel"],
  ["04", "Impute", "Fill gaps, KNN + regional median"],
  ["05", "Treat", "Winsorize outliers, align direction"],
  ["06", "Normalize", "Rescale every indicator to 0-100"],
  ["07", "Weight", "PCA + entropy + AHP reconciliation"],
  ["08", "Aggregate", "Geometric mean into one MAI"],
  ["09", "Tier", "k-means into five action bands"],
  ["10", "Validate", "Correlate + sensitivity test"],
];

export function Approach({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Methodology" kicker="Approach at a glance" title="A ten-step composite-indicator pipeline, adapted from the OECD and JRC handbook." source="OECD/JRC Handbook on Constructing Composite Indicators (2008)">
      <div className="flex h-full flex-col justify-center">
        <div className="grid grid-cols-5 gap-x-4 gap-y-6">
          {STEPS.map(([no, h, b], i) => (
            <div key={no} className="relative">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold" style={{ color: i >= 6 ? ACCENT : INK }}>{no}</span>
                <span className="text-[15px] font-semibold tracking-tightish" style={{ color: INK }}>{h}</span>
              </div>
              <div className="mt-1 h-px w-full" style={{ background: i >= 6 ? ACCENT : LINE }} />
              <p className="mt-2 text-[11.5px] leading-snug" style={{ color: INK2 }}>{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-6">
          <Tag tone="muted">Steps 01-06  Data foundation</Tag>
          <Tag tone="accent">Steps 07-08  The statistical model</Tag>
          <Tag tone="muted">Steps 09-10  Output + assurance</Tag>
        </div>
      </div>
    </Slide>
  );
}

export function Framework({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Methodology" kicker="The MAI framework" title="Six pillars answer one question: how much profitable demand can we actually serve here?" source="Framework design; weights reconciled per Annexure A3">
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-4">
        {PILLARS.map((p) => {
          const Icon = PILLAR_ICONS[p.id];
          return (
            <div key={p.id} className="flex flex-col rounded-[10px] border p-4" style={{ borderColor: LINE }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                    <Icon size={15} color={INK} strokeWidth={1.8} />
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: INK3 }}>P{p.no}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[19px] font-semibold leading-none" style={{ color: ACCENT }}>{Math.round(p.weight * 100)}<span className="text-[11px]">%</span></div>
                  <div className="font-mono text-[8.5px] uppercase tracking-wide" style={{ color: INK3 }}>weight</div>
                </div>
              </div>
              <div className="mt-3 text-[15px] font-semibold leading-tight tracking-tightish" style={{ color: INK }}>{p.name}</div>
              <p className="mt-1 text-[11px] leading-snug" style={{ color: INK2 }}>{p.question}</p>
              <div className="mt-auto pt-3">
                <div className="mb-1.5"><MiniBar value={p.weight * 100 * 2.2} accent /></div>
                <div className="flex flex-wrap gap-1">
                  {p.indicators.slice(0, 3).map((ind) => (
                    <span key={ind.code} className="font-mono text-[8.5px] rounded border px-1 py-[1px]" style={{ color: INK2, borderColor: LINE }}>{ind.code}</span>
                  ))}
                  <span className="font-mono text-[8.5px]" style={{ color: INK3 }}>{p.indicators.length} indicators</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Slide>
  );
}

export function Indicators({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Methodology" kicker="Indicator architecture" title="Every indicator maps to a named, real, publicly available Indian data source." source="Public datasets, see Annexure A2 for full master list">
      <div className="grid h-full grid-cols-2 gap-x-8 gap-y-2">
        {PILLARS.map((p) => (
          <div key={p.id}>
            <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: INK }}>
              <span className="text-[12.5px] font-semibold" style={{ color: INK }}>P{p.no} · {p.short}</span>
              <span className="font-mono text-[9.5px]" style={{ color: INK3 }}>{p.indicators.length} indicators</span>
            </div>
            {p.indicators.map((ind) => (
              <div key={ind.code} className="flex items-center gap-2 border-b py-[3px]" style={{ borderColor: LINE }}>
                <span className="font-mono text-[9px] w-[18px]" style={{ color: ACCENT }}>{ind.code}</span>
                <span className="flex-1 truncate text-[10.5px]" style={{ color: INK }}>{ind.name}</span>
                <span className="font-mono text-[9px] whitespace-nowrap" style={{ color: INK2 }}>{ind.source}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function DataEngineering({ n, total }: { n: number; total: number }) {
  const steps = [
    ["Collation", "730 districts x ~28 indicators assembled to a common district key (LGD code).", "Panel built"],
    ["Missing values", "KNN imputation on standardized neighbours, fall back to regional median. Flagged, capped at 8% per indicator.", "< 8% imputed"],
    ["Outliers", "Winsorize at 5th / 95th percentile so a single mega-city does not dominate a scale.", "Tails capped"],
    ["Directionality", "Negative indicators (e.g. saturation) inverted so higher always means more attractive.", "Aligned"],
    ["Normalization", "Min-max rescale of every indicator to 0-100 for comparability across units.", "0-100 scale"],
  ];
  return (
    <Slide n={n} total={total} section="Methodology" kicker="Steps 03-06 · Data engineering" title="Raw public data becomes a clean, comparable panel before a single score is computed." source="Model pipeline; treatment thresholds illustrative">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col justify-center gap-2">
          {steps.map(([h, b, tag], i) => (
            <div key={i} className="flex items-center gap-4 rounded-[8px] border p-3" style={{ borderColor: LINE }}>
              <span className="font-mono text-[13px] font-semibold" style={{ color: ACCENT, width: 26 }}>{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <div className="text-[13px] font-semibold" style={{ color: INK }}>{h}</div>
                <div className="text-[11.5px] leading-snug" style={{ color: INK2 }}>{b}</div>
              </div>
              <Tag tone="muted">{tag}</Tag>
            </div>
          ))}
        </div>
        <div className="col-span-4">
          <Panel tint className="h-full flex flex-col justify-center">
            <div className="deck-kicker">Guardrails</div>
            <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: INK }}>
              Normalization is min-max, not z-score, so scores stay bounded and intuitive on 0-100.
              Every imputed cell is tagged, so a district's score always carries a data-confidence flag.
            </p>
            <Rule className="my-4" />
            <div className="font-mono text-[11px] leading-relaxed" style={{ color: INK2 }}>
              x' = 100 x (x - min) / (max - min)
              <br /><span style={{ color: INK3 }}>after winsorizing at [p5, p95]</span>
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

export function StatModel({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Methodology" kicker="Steps 07-08 · The statistical model" title="Weights are earned from the data, sense-checked by experts, then combined so imbalance is penalized." source="PCA + Shannon entropy + AHP; illustrative shares">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            <div className="deck-kicker">Weighting · a reconciled hybrid</div>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK }}>
              No single weighting method is trusted blindly. We blend three, after a correlation and VIF
              screen removes redundant indicators.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {WEIGHTING_METHODS.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="w-[74px] text-[13px] font-semibold" style={{ color: INK }}>{m.name}</span>
                  <div className="flex-1"><MiniBar value={m.share * 100 * 2.4} accent={m.id === "pca"} /></div>
                  <span className="font-mono text-[11px]" style={{ color: INK2, width: 34 }}>{Math.round(m.share * 100)}%</span>
                  <span className="flex-[1.4] text-[11px]" style={{ color: INK2 }}>{m.detail}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-[8px] border p-3" style={{ borderColor: LINE }}>
              <span className="font-mono text-[10px]" style={{ color: ACCENT }}>PRE</span>
              <span className="text-[11.5px] leading-snug" style={{ color: INK2 }}>
                A correlation and VIF screen first drops redundant indicators, so no single theme is double-counted before weights are set.
              </span>
            </div>
          </div>
          <Panel tint>
            <div className="deck-kicker">Aggregation · penalize lopsided districts</div>
            <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: INK }}>
              Within a pillar we take a weighted arithmetic mean. Across pillars we use a weighted
              <b> geometric</b> mean, so a district strong on demand but weak on access cannot hide behind
              one big number. Balance is rewarded.
            </p>
          </Panel>
        </div>
        <div className="col-span-5 flex flex-col gap-4">
          <Panel className="flex-1 flex flex-col justify-center">
            <div className="deck-kicker">Composite formula</div>
            <div className="mt-4 font-mono text-[13px] leading-[2]" style={{ color: INK }}>
              <div><span style={{ color: ACCENT }}>Pillar</span><sub>p</sub> = &Sigma; w<sub>i</sub> &middot; x'<sub>i</sub></div>
              <Rule className="my-3" />
              <div><span style={{ color: ACCENT }}>MAI</span> = &prod;<sub>p</sub> Pillar<sub>p</sub><sup> W<sub>p</sub></sup></div>
              <div className="mt-2 text-[10.5px]" style={{ color: INK3 }}>&Sigma; w<sub>i</sub> = 1 per pillar &nbsp; &middot; &nbsp; &Sigma; W<sub>p</sub> = 1</div>
            </div>
            <Rule className="my-3" />
            <p className="text-[11px] leading-relaxed" style={{ color: INK2 }}>
              Arithmetic within a pillar keeps each theme interpretable. Geometric across pillars means a
              zero on any pillar cannot be bought back by another, balance is required to score well.
            </p>
          </Panel>
          <Panel tint>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="font-mono text-[18px] font-semibold" style={{ color: INK }}>VIF&lt;5</div><div className="font-mono text-[8.5px] uppercase" style={{ color: INK3 }}>collinearity</div></div>
              <div><div className="font-mono text-[18px] font-semibold" style={{ color: INK }}>KMO&gt;0.7</div><div className="font-mono text-[8.5px] uppercase" style={{ color: INK3 }}>PCA fit</div></div>
              <div><div className="font-mono text-[18px] font-semibold" style={{ color: ACCENT }}>geo-mean</div><div className="font-mono text-[8.5px] uppercase" style={{ color: INK3 }}>aggregation</div></div>
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

export function Tiering({ n, total }: { n: number; total: number }) {
  const counts = tierCounts();
  const data = TIERS.map((t) => ({ name: `T${t.id} ${t.name}`, count: counts.find((c) => c.tier === t.id)?.count ?? 0, id: t.id }));
  return (
    <Slide n={n} total={total} section="Methodology" kicker="Steps 09 · Scoring and tiering" title="One 0-100 score becomes five plain-language action tiers a commercial team can execute." source="Model output (illustrative); k-means on composite score">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="deck-kicker mb-2">Districts per tier</div>
          <BarChart width={560} height={250} data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 11, fontFamily: "ui-monospace", fill: INK }} axisLine={false} tickLine={false} />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={26}>
              {data.map((d) => (<Cell key={d.id} fill={d.id === 1 ? ACCENT : ["#0a0a0a", "#525252", "#737373", "#a3a3a3", "#cfcfcf"][d.id - 1]} />))}
              <LabelList dataKey="count" position="right" style={{ fontSize: 12, fontFamily: "ui-monospace", fill: INK }} />
            </Bar>
          </BarChart>
        </div>
        <div className="col-span-5 flex flex-col justify-center gap-2">
          {TIERS.map((t) => (
            <div key={t.id} className="flex items-start gap-3 border-b py-[6px]" style={{ borderColor: LINE }}>
              <span className="mt-[2px] flex h-5 w-8 items-center justify-center rounded font-mono text-[10px] font-semibold" style={{ background: t.id === 1 ? ACCENT : PANEL, color: t.id === 1 ? "#fff" : INK, border: `1px solid ${t.id === 1 ? ACCENT : LINE}` }}>T{t.id}</span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12.5px] font-semibold" style={{ color: INK }}>{t.name}</span>
                  <span className="font-mono text-[9.5px]" style={{ color: INK3 }}>MAI {t.range[0]}-{t.range[1]}</span>
                </div>
                <div className="text-[11px] leading-snug" style={{ color: INK2 }}>{t.play}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}
