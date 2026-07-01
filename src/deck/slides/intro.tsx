import { ACCENT, INK, Rule, Stat, Panel, Tag, Slide } from "../components/primitives";
import { DISTRICT_COUNT } from "../data/districts";
import { PILLARS } from "../data/framework";
import { ArrowRight } from "lucide-react";

export function Cover({ total }: { n: number; total: number }) {
  return (
    <div className="slide" style={{ background: INK, color: "#fff" }}>
      <div className="absolute left-0 top-0 h-full w-[6px]" style={{ background: ACCENT }} />
      <div className="flex h-full flex-col justify-between px-[64px] py-[52px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "#8a8a8a" }}>
            Case Solution  ·  Indian Pharmaceutical Industry
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "#8a8a8a" }}>
            {total} slides
          </span>
        </div>

        <div>
          <div className="deck-kicker" style={{ color: ACCENT }}>District Market Attractiveness Index</div>
          <h1 className="mt-4 text-[62px] font-semibold leading-[1.02] tracking-tighter2">
            Ranking every Indian district,
            <br />so every pharma rupee lands
            <br />where it grows fastest.
          </h1>
          <p className="mt-6 max-w-[760px] text-[16px] leading-relaxed" style={{ color: "#b8b8b8" }}>
            A transparent statistical model that scores {DISTRICT_COUNT}+ districts on a single 0 to 100
            Market Attractiveness Index, built from six demand and access pillars and ready to drive
            field-force, launch, and distribution decisions.
          </p>
        </div>

        <div>
          <div className="mb-4 h-px w-full" style={{ background: "#1f1f1f" }} />
          <div className="flex items-end justify-between">
            <div className="flex gap-12">
              <div>
                <div className="text-[34px] font-semibold tracking-tighter2" style={{ color: "#fff" }}>{DISTRICT_COUNT}+</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "#8a8a8a" }}>districts scored</div>
              </div>
              <div>
                <div className="text-[34px] font-semibold tracking-tighter2" style={{ color: "#fff" }}>{PILLARS.length}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "#8a8a8a" }}>demand pillars</div>
              </div>
              <div>
                <div className="text-[34px] font-semibold tracking-tighter2" style={{ color: ACCENT }}>0-100</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "#8a8a8a" }}>single index score</div>
              </div>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] flex items-center gap-2" style={{ color: "#8a8a8a" }}>
              Model, framework and activation <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Divider({ index, label, title, sub }: { n: number; total: number; index: string; label: string; title: string; sub: string }) {
  return (
    <div className="slide" style={{ background: INK, color: "#fff" }}>
      <div className="flex h-full flex-col justify-center px-[80px]">
        <div className="deck-kicker" style={{ color: ACCENT }}>{label}</div>
        <div className="mt-4 flex items-baseline gap-6">
          <span className="font-mono text-[40px] font-semibold" style={{ color: "#3a3a3a" }}>{index}</span>
          <h2 className="text-[48px] font-semibold leading-tight tracking-tighter2">{title}</h2>
        </div>
        <p className="mt-5 max-w-[680px] text-[16px] leading-relaxed" style={{ color: "#9a9a9a" }}>{sub}</p>
      </div>
      <div className="absolute bottom-[52px] left-[80px] h-px w-[120px]" style={{ background: ACCENT }} />
    </div>
  );
}

export function ExecSummary({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} kicker="Executive summary" title="One index turns fragmented public data into a district-by-district commercial priority map." section="Context" source="Model output (illustrative); public sources per Annexure A2">
      <div className="grid h-full grid-cols-12 gap-5">
        <div className="col-span-7 flex flex-col gap-4">
          <Panel tint className="flex-1">
            <div className="deck-kicker">The ask</div>
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: INK }}>
              Pharma commercial teams still deploy reps, launches and stock at the <b>state or metro</b> level.
              That misses fast-rising tier 2 and 3 demand and over-invests in saturated cities. India has
              700+ districts and no standard, comparable measure of how attractive each one is.
            </p>
          </Panel>
          <Panel tint className="flex-1">
            <div className="deck-kicker" style={{ color: ACCENT }}>Our answer</div>
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: INK }}>
              A composite <b>Market Attractiveness Index (MAI)</b>: six weighted pillars, ~28 indicators from
              real public datasets, normalized and combined with a <b>PCA + entropy + AHP</b> weighting into a
              single 0 to 100 score, then bucketed into five action tiers and validated against independent sales.
            </p>
          </Panel>
        </div>
        <div className="col-span-5">
          <Panel className="h-full">
            <div className="deck-kicker">What it changes</div>
            <div className="mt-4 grid grid-cols-2 gap-y-6">
              <Stat value={<>730<span style={{ fontSize: 22 }}>+</span></>} label="districts, one scale" />
              <Stat value="5" label="action tiers" accent />
              <Stat value={<>~18<span style={{ fontSize: 22 }}>%</span></>} label="field-force ROI upside" />
              <Stat value={<>r≈0.8</>} label="validation vs sales" />
            </div>
            <Rule className="my-4" />
            <div className="flex flex-wrap gap-2">
              <Tag tone="accent">Field-force sizing</Tag>
              <Tag tone="muted">Launch sequencing</Tag>
              <Tag tone="muted">Therapy-to-district fit</Tag>
              <Tag tone="muted">Distributor expansion</Tag>
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}
