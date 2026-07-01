import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { DISTRICT_COUNT, topDistricts, tierCounts } from "../data/districts";
import { PILLARS, ALL_INDICATORS } from "../data/framework";
import { ArrowRight } from "lucide-react";

export function Cover({ total }: { n: number; total: number }) {
  return (
    <div className="slide" style={{ background: INK, color: "#fff" }}>
      <div className="absolute left-0 top-0 h-full w-[6px]" style={{ background: ACCENT }} />
      <div className="flex h-full flex-col justify-between px-[64px] py-[50px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "#8a8a8a" }}>Case Competition Solution  ·  Indian Pharmaceutical Industry</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "#8a8a8a" }}>8 core slides + 6-part annexure</span>
        </div>
        <div>
          <div className="deck-kicker" style={{ color: ACCENT }}>District Market Attractiveness Index</div>
          <h1 className="mt-4 text-[58px] font-semibold leading-[1.03] tracking-tighter2">
            Ranking every Indian district,
            <br />so every pharma rupee lands
            <br />where it grows fastest.
          </h1>
          <p className="mt-6 max-w-[820px] text-[15.5px] leading-relaxed" style={{ color: "#b8b8b8" }}>
            A statistical model that makes the <span style={{ color: "#fff" }}>GE-McKinsey market-attractiveness axis computable</span> for
            {" "}{DISTRICT_COUNT}+ districts, one 0 to 100 index from six demand and access pillars, ready to drive field-force,
            launch, and distribution decisions.
          </p>
        </div>
        <div>
          <div className="mb-4 h-px w-full" style={{ background: "#1f1f1f" }} />
          <div className="flex items-end justify-between">
            <div className="flex gap-10">
              {[[`${DISTRICT_COUNT}+`, "districts scored"], ["6", "pillars"], [`${ALL_INDICATORS.length}`, "indicators"], ["5", "action tiers"]].map(([v, l], i) => (
                <div key={i}>
                  <div className="text-[30px] font-semibold tracking-tighter2" style={{ color: i === 0 ? ACCENT : "#fff" }}>{v}</div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: "#8a8a8a" }}>{l}</div>
                </div>
              ))}
            </div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "#8a8a8a" }}>Model, framework and activation <ArrowRight size={13} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExecSummary({ n, total }: { n: number; total: number }) {
  const counts = tierCounts();
  const top3 = topDistricts(5);
  return (
    <Slide n={n} total={total} section="Overview" kicker="Executive summary" title="One index turns fragmented public data into a district-by-district commercial priority map." source="Model output (illustrative); public sources per Annexure A2">
      <div className="grid h-full grid-cols-12 gap-4">
        {/* left: ask / answer / pillars */}
        <div className="col-span-7 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Panel tint>
              <div className="deck-kicker">The ask</div>
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: INK }}>
                Score 700+ districts on how attractive each is for pharma, with a transparent, repeatable statistical model, not gut feel.
              </p>
            </Panel>
            <Panel tint>
              <div className="deck-kicker" style={{ color: ACCENT }}>Our answer</div>
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: INK }}>
                A composite <b>Market Attractiveness Index</b>: 6 pillars, {ALL_INDICATORS.length} indicators, PCA + entropy + AHP weighting, geometric aggregation, 5 tiers.
              </p>
            </Panel>
          </div>
          <div className="rounded-[10px] border p-3" style={{ borderColor: LINE }}>
            <div className="mb-2 flex items-center justify-between">
              <div className="deck-kicker">The six pillars and their reconciled weights</div>
              <span className="font-mono text-[9px]" style={{ color: INK3 }}>&Sigma; W = 100%</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[7px]">
              {PILLARS.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="font-mono text-[9px]" style={{ color: INK3, width: 16 }}>P{p.no}</span>
                  <span className="w-[128px] truncate text-[10.5px]" style={{ color: INK }}>{p.short === p.name ? p.name : p.name}</span>
                  <div className="flex-1"><MiniBar value={p.weight * 100 * 2.4} accent={p.no === 1} /></div>
                  <span className="font-mono text-[10px]" style={{ color: INK2, width: 26, textAlign: "right" }}>{Math.round(p.weight * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <Panel className="flex-1">
            <div className="deck-kicker" style={{ color: ACCENT }}>Headline recommendation</div>
            <p className="mt-1.5 text-[12px] leading-snug" style={{ color: INK }}>
              Reallocate field force from saturated metros to the <b>{counts[0].count} Tier-1 and {counts[1].count} Tier-2 districts</b> the
              index surfaces, sequence launches down the ranked list, and target the <b>whitespace districts</b> where real demand still
              outruns current sales. Expected <b>~18% field-force ROI uplift</b> at low build cost.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[["Reallocate", "field force by tier"], ["Sequence", "launches down the list"], ["Capture", "whitespace districts"]].map(([h, s], i) => (
                <div key={i} className="rounded-[7px] border p-2" style={{ borderColor: LINE }}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-semibold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[10.5px] font-semibold" style={{ color: INK }}>{h}</span>
                  </div>
                  <div className="mt-0.5 text-[9px] leading-snug" style={{ color: INK2 }}>{s}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        {/* right: KPIs + theory + teaser */}
        <div className="col-span-5 flex flex-col gap-3">
          <Panel>
            <div className="deck-kicker mb-2">What it delivers</div>
            <div className="grid grid-cols-2 gap-y-3">
              {[[`${counts[0].count}`, "Tier-1 priority", true], ["r 0.79", "validation vs sales", false], ["~18%", "field-force ROI", true], ["<3", "median rank shift", false]].map(([v, l, a], i) => (
                <div key={i}>
                  <div className="text-[26px] font-semibold leading-none tracking-tighter2" style={{ color: a ? ACCENT : INK }}>{v}</div>
                  <div className="mt-1 font-mono text-[8.5px] uppercase tracking-wide" style={{ color: INK2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel tint>
            <div className="deck-kicker">Theory anchor</div>
            <p className="mt-1.5 text-[11px] leading-snug" style={{ color: INK }}>
              The MAI operationalises the <b>market-attractiveness axis of the GE-McKinsey matrix</b> using
              <b> multi-criteria decision analysis</b> (OECD composite-indicator method). Porter, PESTEL, BCG, Ansoff and Bass diffusion structure the pillars and the activation.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["GE-McKinsey", "Porter 5F", "PESTEL", "AHP", "BCG", "Ansoff", "Bass"].map((t) => (
                <span key={t} className="font-mono text-[8px] rounded border px-1.5 py-[1px]" style={{ color: INK2, borderColor: LINE }}>{t}</span>
              ))}
            </div>
          </Panel>
          <Panel className="flex-1">
            <div className="deck-kicker mb-1.5">Top districts, illustrative</div>
            {top3.map((d, i) => (
              <div key={d.id} className="flex items-center justify-between border-b py-[5px]" style={{ borderColor: LINE }}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]" style={{ color: INK3 }}>{i + 1}</span>
                  <span className="text-[11px]" style={{ color: INK }}>{d.name}</span>
                  <span className="font-mono text-[8px]" style={{ color: INK3 }}>{d.state}</span>
                </div>
                <span className="font-mono text-[12px] font-semibold" style={{ color: i === 0 ? ACCENT : INK }}>{d.mai.toFixed(1)}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Slide>
  );
}
