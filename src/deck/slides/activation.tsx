import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Stat, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { Users, Rocket, Target, Network } from "lucide-react";

export function UseCases({ n, total }: { n: number; total: number }) {
  const cases = [
    [Users, "Field-force sizing and territory design", "Allocate reps to MAI, not to legacy territories. Size coverage to a district's tier and demand pillar, redeploy from saturated metros.", "Reallocate ~15% of the force"],
    [Rocket, "New-launch sequencing", "Roll out brands down the ranked list. Enter Tier 1 first for fast payback, then Tier 2 as capacity frees up.", "Cut launch payback time"],
    [Target, "Therapy-to-district fit", "Match a portfolio to the pillar mix. A cardio-metabolic brand follows the demand pillar; a hospital brand follows access.", "Right brand, right district"],
    [Network, "Distributor and e-pharmacy expansion", "Prioritize new stockists and cold-chain where the distribution pillar lags a strong overall score.", "Close the last-mile gap"],
  ];
  return (
    <Slide n={n} total={total} section="Activation" kicker="From score to decision" title="The same index drives four everyday commercial decisions, each traceable back to a pillar." source="Application framework">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
        {cases.map(([Icon, h, b, tag]: any, i) => (
          <div key={i} className="flex flex-col rounded-[10px] border p-4" style={{ borderColor: LINE }}>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <Icon size={16} color={INK} strokeWidth={1.8} />
              </div>
              <span className="font-mono text-[10px]" style={{ color: INK3 }}>USE CASE {i + 1}</span>
            </div>
            <div className="mt-3 text-[15px] font-semibold tracking-tightish" style={{ color: INK }}>{h}</div>
            <p className="mt-1.5 text-[12px] leading-snug" style={{ color: INK2 }}>{b}</p>
            <div className="mt-auto pt-3"><Tag tone="accent">{tag}</Tag></div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function DeepDive({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Activation" kicker="Worked example · diabetes-care launch" title="Sequencing a new anti-diabetic down the MAI list concentrates spend where scripts convert." source="Illustrative scenario built on model output">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-7 flex flex-col justify-center">
          <div className="deck-kicker mb-3">Four-move play</div>
          {[
            ["Filter", "Re-score with the Demand pillar (chronic prevalence) up-weighted for a diabetes lens."],
            ["Select", "Take the top 40 districts on the diabetes-adjusted MAI as the launch wave."],
            ["Sequence", "Enter 12 Tier 1 districts month 1, next 28 across months 2-4 as reps ramp."],
            ["Resource", "Match rep count and stockists to each district's access and distribution pillars."],
          ].map(([h, b], i) => (
            <div key={i} className="flex gap-4 border-l-2 pl-4 pb-4" style={{ borderColor: i === 0 ? ACCENT : LINE }}>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: INK }}><span className="font-mono" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span> &nbsp;{h}</div>
                <div className="text-[12px] leading-snug" style={{ color: INK2 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-5 flex flex-col justify-center gap-4">
          <Panel tint>
            <div className="deck-kicker">Projected vs untargeted rollout</div>
            <div className="mt-4 grid grid-cols-2 gap-y-5">
              <Stat value="40" label="launch-wave districts" />
              <Stat value={<>2.3<span style={{ fontSize: 20 }}>x</span></>} label="scripts per rep" accent />
              <Stat value={<>-31<span style={{ fontSize: 18 }}>%</span></>} label="cost per new patient" />
              <Stat value={<>~5<span style={{ fontSize: 18 }}>mo</span></>} label="to payback" />
            </div>
          </Panel>
          <p className="text-[11.5px] leading-snug" style={{ color: INK2 }}>
            Same budget, concentrated on measured readiness. The uplift comes from not spending the first
            rupees in districts that were never going to convert.
          </p>
        </div>
      </div>
    </Slide>
  );
}

export function Roadmap({ n, total }: { n: number; total: number }) {
  const phases = [
    ["Phase 1", "0-3 months", "Build and validate", ["Assemble the panel from public feeds", "Compute v1 scores for all districts", "Validate against internal sales"]],
    ["Phase 2", "3-6 months", "Pilot in two states", ["Deploy dashboard to two field teams", "A/B test MAI-led vs legacy targeting", "Refine weights with field feedback"]],
    ["Phase 3", "6-12 months", "National rollout", ["Full field-force + launch integration", "Distributor expansion playbook", "Self-serve dashboard for all BUs"]],
    ["Phase 4", "Ongoing", "Refresh and learn", ["Quarterly data refresh", "ML uplift on sales feedback loop", "New pillars: Rx data, weather, events"]],
  ];
  return (
    <Slide n={n} total={total} section="Activation" kicker="Implementation roadmap" title="From a validated model to a national, self-refreshing commercial system within a year." source="Delivery plan">
      <div className="grid h-full grid-cols-4 gap-4">
        {phases.map(([p, t, h, items]: any, i) => (
          <div key={i} className="flex flex-col rounded-[10px] border p-4" style={{ borderColor: LINE, background: i === 0 ? PANEL : "#fff" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold" style={{ color: i === 0 ? ACCENT : INK }}>{p}</span>
              <span className="font-mono text-[9px]" style={{ color: INK3 }}>{t}</span>
            </div>
            <div className="mt-1 h-[2px] w-full" style={{ background: i === 0 ? ACCENT : LINE }} />
            <div className="mt-3 text-[13.5px] font-semibold leading-tight tracking-tightish" style={{ color: INK }}>{h}</div>
            <ul className="mt-3 space-y-2">
              {items.map((it: string, j: number) => (
                <li key={j} className="flex gap-1.5 text-[11px] leading-snug" style={{ color: INK2 }}>
                  <span style={{ color: ACCENT }}>&middot;</span>{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function Impact({ n, total }: { n: number; total: number }) {
  const feas = [
    ["Data availability", 82, "Most feeds are public and district-keyed today"],
    ["Build effort", 70, "One analytics squad, ~10 weeks to v1"],
    ["Cost to run", 88, "Refresh is largely automated, low marginal cost"],
    ["Org adoption", 64, "Needs field trust; solved by pilot proof"],
  ];
  return (
    <Slide n={n} total={total} section="Activation" kicker="Impact and feasibility" title="Meaningful commercial upside from data that already exists, at low cost to build and run." source="Illustrative business case">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-6 flex flex-col justify-center">
          <div className="deck-kicker mb-4">The prize</div>
          <div className="grid grid-cols-2 gap-y-7">
            <Stat value={<>~18<span style={{ fontSize: 24 }}>%</span></>} label="field-force ROI uplift" accent sub="from reallocating to higher-MAI districts" />
            <Stat value={<>-30<span style={{ fontSize: 24 }}>%</span></>} label="cost per new patient" sub="on targeted launches" />
            <Stat value={<>40<span style={{ fontSize: 24 }}>+</span></>} label="whitespace districts" sub="high demand, low current sales" />
            <Stat value={<>1</>} label="shared language" sub="one score across every function" />
          </div>
        </div>
        <div className="col-span-6">
          <Panel className="h-full flex flex-col justify-center">
            <div className="deck-kicker mb-5">Feasibility scorecard</div>
            {feas.map(([h, v, note]: any, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-medium" style={{ color: INK }}>{h}</span>
                  <span className="font-mono text-[12px] font-semibold" style={{ color: INK }}>{v}<span className="text-[9px]" style={{ color: INK3 }}>/100</span></span>
                </div>
                <div className="my-1.5"><MiniBar value={v} accent={v >= 82} /></div>
                <div className="text-[10.5px]" style={{ color: INK3 }}>{note}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

export function Risks({ n, total }: { n: number; total: number }) {
  const rows = [
    ["Data lag", "Census base is 2011; some indicators pre-date today.", "Layer SRS/UIDAI projections; flag confidence per district; refresh quarterly."],
    ["Imputation error", "Gaps in remote districts can bias scores.", "Cap imputation at 8%, tag every filled cell, show a data-confidence badge."],
    ["Weight subjectivity", "AHP brings human judgement into weights.", "Anchor with PCA + entropy; publish sensitivity so choices are transparent."],
    ["Proxy validation", "Retail-audit proxy is not ground truth.", "Swap in the company's own sales for a closed validation loop post-pilot."],
    ["Equity blind spot", "Pure attractiveness can starve poor districts.", "Run an access-equity overlay for public-health and CSR portfolios."],
  ];
  return (
    <Slide n={n} total={total} section="Activation" kicker="Risks, limitations and governance" title="We name the model's limits up front, each has a concrete mitigation." source="Model governance">
      <div className="flex h-full flex-col">
        <p className="mb-4 max-w-[820px] text-[13px] leading-relaxed" style={{ color: INK2 }}>
          A composite index is only as credible as its honesty about what it cannot see. Every limitation below
          ships with a mitigation and is surfaced to users as a data-confidence flag, not hidden.
        </p>
        <div className="grid grid-cols-[160px_1fr_1fr] gap-x-8 border-b pb-2 font-mono text-[9.5px] uppercase" style={{ color: INK3, borderColor: INK }}>
          <span>Risk</span><span>Why it matters</span><span style={{ color: ACCENT }}>Mitigation</span>
        </div>
        <div className="flex flex-1 flex-col justify-around">
          {rows.map(([r, w, m], i) => (
            <div key={i} className="grid grid-cols-[160px_1fr_1fr] items-start gap-x-8 border-b py-[13px]" style={{ borderColor: LINE }}>
              <span className="text-[13px] font-semibold" style={{ color: INK }}>{r}</span>
              <span className="text-[12px] leading-snug" style={{ color: INK2 }}>{w}</span>
              <span className="text-[12px] leading-snug" style={{ color: INK }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

export function Closing({ total }: { n: number; total: number }) {
  return (
    <div className="slide" style={{ background: INK, color: "#fff" }}>
      <div className="absolute left-0 top-0 h-full w-[6px]" style={{ background: ACCENT }} />
      <div className="flex h-full flex-col justify-center px-[80px]">
        <div className="deck-kicker" style={{ color: ACCENT }}>District Market Attractiveness Index</div>
        <h2 className="mt-4 text-[44px] font-semibold leading-[1.08] tracking-tighter2">
          One transparent score,
          <br />730+ districts, every pharma
          <br />decision pointed the same way.
        </h2>
        <div className="mt-8 h-px w-[120px]" style={{ background: ACCENT }} />
        <div className="mt-6 flex gap-10">
          <div><div className="text-[26px] font-semibold" style={{ color: "#fff" }}>Model</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>PCA + entropy + AHP</div></div>
          <div><div className="text-[26px] font-semibold" style={{ color: "#fff" }}>Framework</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>6 pillars, ~28 indicators</div></div>
          <div><div className="text-[26px] font-semibold" style={{ color: ACCENT }}>Activation</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>4 commercial use cases</div></div>
        </div>
        <p className="mt-10 font-mono text-[11px]" style={{ color: "#6f6f6f" }}>Thank you  ·  Annexure follows: indicator dictionary, sources, formulae, references</p>
      </div>
    </div>
  );
}
