import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Panel, Tag, MiniBar, Slide } from "../components/primitives";
import { BcgMatrix, Ansoff, BassCurve } from "../components/frameworks";
import { tierCounts } from "../data/districts";
import { Users, Rocket, Target, Network } from "lucide-react";

// ---------- SLIDE 6 : STRATEGY ----------
export function Strategy({ n, total }: { n: number; total: number }) {
  const c = tierCounts();
  const bubbles = [
    { x: 0.72, y: 0.74, r: 24, label: `T1 · ${c[0].count}`, accent: true },
    { x: 0.76, y: 0.28, r: 28, label: `T2 · ${c[1].count}` },
    { x: 0.27, y: 0.72, r: 26, label: `T3 · ${c[2].count}` },
    { x: 0.25, y: 0.26, r: 30, label: `T4-5 · ${c[3].count + c[4].count}` },
  ];
  const cases = [
    [Users, "Field-force sizing", "Size coverage to a district's tier and demand pillar; redeploy reps from saturated metros.", "Reallocate ~15% of the force"],
    [Rocket, "Launch sequencing", "Roll brands down the ranked list; enter Tier 1 first for fast payback.", "Faster launch payback"],
    [Target, "Therapy-to-district fit", "Match portfolio to pillar mix, cardio-metabolic follows Demand, hospital brands follow Access.", "Right brand, right district"],
    [Network, "Distribution expansion", "Add stockists and cold-chain where the Distribution pillar lags a strong overall score.", "Close the last-mile gap"],
  ];
  return (
    <Slide n={n} total={total} section="Strategy" kicker="Segmentation and activation strategy" title="Tiers become a district portfolio: a BCG view of where to build share, harvest, or seed." source="BCG growth-share, Ansoff (1957), STP framing">
      <div className="grid h-full grid-cols-12 gap-4">
        <div className="col-span-4 flex flex-col gap-3">
          <Panel tint>
            <div className="deck-kicker mb-2">Tiers mapped to the BCG matrix</div>
            <div className="flex justify-center py-1"><BcgMatrix w={260} h={168} bubbles={bubbles} /></div>
          </Panel>
          <Panel className="flex-1 flex flex-col">
            <div className="deck-kicker mb-1">Play by quadrant</div>
            <div className="space-y-[4px] text-[10.5px] leading-snug" style={{ color: INK }}>
              <div><b style={{ color: ACCENT }}>Stars (T1 growth):</b> invest to own, full force.</div>
              <div><b>Cash cows (T1-2 saturated):</b> defend share, efficient coverage.</div>
              <div><b>Question marks (T3):</b> selective bets, digital detailing.</div>
              <div><b>Dogs (T4-5):</b> distributor-led, low-cost only.</div>
            </div>
            <div className="mt-auto rounded-[7px] border p-2" style={{ borderColor: LINE, background: PANEL }}>
              <span className="text-[10px] leading-snug" style={{ color: INK }}><b style={{ color: ACCENT }}>Move up and to the right:</b> shift budget out of Dogs and mature Cash Cows toward Stars and the best Question Marks.</span>
            </div>
          </Panel>
        </div>
        <div className="col-span-3 flex flex-col gap-3">
          <Panel>
            <div className="deck-kicker mb-2">Ansoff growth grid</div>
            <div className="flex justify-center"><Ansoff w={200} /></div>
          </Panel>
          <Panel tint className="flex-1 flex flex-col">
            <div className="deck-kicker mb-1">STP in one line</div>
            <p className="text-[10.5px] leading-snug" style={{ color: INK }}>
              <b>Segment</b> 730 districts by MAI and pillar profile. <b>Target</b> Tier 1-2 and whitespace first.
              <b> Position</b> the portfolio to each district's dominant need, then resource to match.
            </p>
            <div className="mt-auto space-y-[5px] pt-2">
              {[["Segment", "by MAI + pillar profile"], ["Target", "Tier 1-2 and whitespace"], ["Position", "to the dominant need"]].map(([h, s], i) => (
                <div key={i} className="flex items-center gap-2 border-t pt-[5px]" style={{ borderColor: LINE }}>
                  <span className="font-mono text-[9px] font-semibold" style={{ color: ACCENT, width: 52 }}>{h}</span>
                  <span className="text-[9.5px]" style={{ color: INK2 }}>{s}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="col-span-5">
          <div className="deck-kicker mb-2">Four commercial decisions, each traceable to a pillar</div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2.5" style={{ height: "calc(100% - 24px)" }}>
            {cases.map(([Icon, h, b, out]: any, i) => (
              <div key={i} className="flex flex-col rounded-[9px] border p-3" style={{ borderColor: LINE }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ background: PANEL, border: `1px solid ${LINE}` }}><Icon size={13} color={INK} strokeWidth={1.8} /></div>
                    <span className="text-[12px] font-semibold tracking-tightish" style={{ color: INK }}>{h}</span>
                  </div>
                  <span className="font-mono text-[8px] uppercase" style={{ color: INK3 }}>UC{i + 1}</span>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-snug" style={{ color: INK2 }}>{b}</p>
                <div className="mt-auto pt-2"><Tag tone="accent">{out}</Tag></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ---------- SLIDE 7 : APPLICATION ----------
export function Application({ n, total }: { n: number; total: number }) {
  const play = [
    ["Filter", "Re-score with the Demand pillar (chronic prevalence) up-weighted for a diabetes lens."],
    ["Select", "Take the top 40 districts on the diabetes-adjusted MAI as the launch wave."],
    ["Sequence", "12 Tier-1 districts in month 1, next 28 across months 2-4 as reps ramp."],
    ["Resource", "Match rep count and stockists to each district's Access and Distribution pillars."],
  ];
  return (
    <Slide n={n} total={total} section="Application" kicker="Illustrative application, diabetes-care launch" title="Sequenced down the MAI, a launch pays back in ~5 months at 2.3x scripts per rep versus a blanket rollout." source="Illustrative scenario; Bass diffusion (p=0.045, q=0.42)">
      <div className="grid h-full grid-cols-12 gap-4">
        <div className="col-span-5">
          <div className="deck-kicker mb-2">The four-move play</div>
          {play.map(([h, b], i) => (
            <div key={i} className="mb-2 flex gap-3 border-l-2 pl-3" style={{ borderColor: i === 0 ? ACCENT : LINE }}>
              <div className="pb-1">
                <div className="text-[12.5px] font-semibold" style={{ color: INK }}><span className="font-mono" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span> &nbsp;{h}</div>
                <div className="text-[10.5px] leading-snug" style={{ color: INK2 }}>{b}</div>
              </div>
            </div>
          ))}
          <Rule className="my-2" />
          <p className="text-[10.5px] leading-snug" style={{ color: INK2 }}>
            Same budget, concentrated on measured readiness. The uplift comes from not spending the first rupees in districts that were never going to convert.
          </p>
          <div className="mt-3 rounded-[9px] border p-3" style={{ borderColor: LINE }}>
            <div className="mb-2 flex items-center justify-between">
              <div className="deck-kicker">Rollout schedule, districts per month</div>
              <span className="font-mono text-[8px]" style={{ color: INK3 }}>40 total</span>
            </div>
            {[["Month 1 · Tier 1", 12], ["Month 2", 12], ["Month 3", 10], ["Month 4", 6]].map(([h, v], i) => (
              <div key={i} className="mb-[6px] flex items-center gap-2">
                <span className="w-[92px] text-[9.5px]" style={{ color: INK }}>{h}</span>
                <div className="h-[12px] flex-1" style={{ background: "#f0f0f0" }}>
                  <div className="h-full" style={{ width: `${((v as number) / 12) * 100}%`, background: i === 0 ? ACCENT : "#525252" }} />
                </div>
                <span className="font-mono text-[9.5px]" style={{ color: INK2, width: 18, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4">
          <Panel tint className="h-full">
            <div className="deck-kicker mb-1">Adoption, Bass diffusion model</div>
            <div className="flex justify-center"><BassCurve w={280} h={186} /></div>
            <div className="mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1 font-mono text-[8.5px]" style={{ color: INK2 }}><span className="inline-block h-[2px] w-4" style={{ background: ACCENT }} /> MAI-sequenced</span>
              <span className="flex items-center gap-1 font-mono text-[8.5px]" style={{ color: INK3 }}><span className="inline-block h-[2px] w-4" style={{ background: "#c2c2c2" }} /> untargeted</span>
            </div>
            <p className="mt-1 text-[9.5px] leading-snug" style={{ color: INK2 }}>Targeting lifts the innovation (p) and imitation (q) coefficients, steepening the curve to faster peak adoption.</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[["7 mo", "to 50% adoption, targeted"], ["13 mo", "to 50%, untargeted"]].map(([v, l], i) => (
                <div key={i} className="rounded-[7px] border p-2" style={{ borderColor: LINE, background: "#fff" }}>
                  <div className="text-[18px] font-semibold leading-none tracking-tighter2" style={{ color: i === 0 ? ACCENT : INK }}>{v}</div>
                  <div className="mt-1 font-mono text-[8px] uppercase" style={{ color: INK2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="col-span-3">
          <Panel className="h-full flex flex-col justify-center">
            <div className="deck-kicker mb-3">Projected vs untargeted</div>
            <div className="grid grid-cols-1 gap-4">
              {[["40", "launch-wave districts", false], ["2.3x", "scripts per rep", true], ["-31%", "cost per new patient", false], ["~5 mo", "to payback", true]].map(([v, l, a], i) => (
                <div key={i}>
                  <div className="text-[30px] font-semibold leading-none tracking-tighter2" style={{ color: a ? ACCENT : INK }}>{v}</div>
                  <div className="mt-1 font-mono text-[8.5px] uppercase tracking-wide" style={{ color: INK2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

// ---------- SLIDE 8 : ROADMAP + IMPACT + FEASIBILITY + RISKS ----------
export function Roadmap({ n, total }: { n: number; total: number }) {
  const phases = [
    ["Phase 1", "0-3 mo", "Build and validate", "Assemble panel, compute v1, validate vs internal sales"],
    ["Phase 2", "3-6 mo", "Pilot two states", "Dashboard to two field teams, A/B vs legacy targeting"],
    ["Phase 3", "6-12 mo", "National rollout", "Field-force + launch integration, self-serve dashboard"],
    ["Phase 4", "Ongoing", "Refresh and learn", "Quarterly refresh, ML uplift on sales feedback loop"],
  ];
  const feas = [["Data availability", 82], ["Build effort", 70], ["Cost to run", 88], ["Org adoption", 64]];
  const risks = [
    ["Data lag", "Census 2011 base", "SRS/UIDAI projections, confidence flags"],
    ["Imputation error", "gaps in remote districts", "cap 8%, tag cells, data-confidence badge"],
    ["Weight subjectivity", "AHP judgement", "anchored by PCA + entropy, publish sensitivity"],
    ["Proxy validation", "audit proxy, not ground truth", "swap in own sales for a closed loop post-pilot"],
    ["Equity blind spot", "can starve poor districts", "access-equity overlay for CSR portfolios"],
  ];
  return (
    <Slide n={n} total={total} section="Roadmap" kicker="Roadmap, impact and feasibility" title="From a validated model to a national, self-refreshing commercial system within a year." source="Delivery plan and illustrative business case">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          {phases.map(([p, t, h, b]: any, i) => (
            <div key={i} className="rounded-[9px] border p-3" style={{ borderColor: LINE, background: i === 0 ? PANEL : "#fff" }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9.5px] font-semibold" style={{ color: i === 0 ? ACCENT : INK }}>{p}</span>
                <span className="font-mono text-[8.5px]" style={{ color: INK3 }}>{t}</span>
              </div>
              <div className="mt-1 h-[2px] w-full" style={{ background: i === 0 ? ACCENT : LINE }} />
              <div className="mt-2 text-[12px] font-semibold leading-tight tracking-tightish" style={{ color: INK }}>{h}</div>
              <p className="mt-1 text-[9.5px] leading-snug" style={{ color: INK2 }}>{b}</p>
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-12 gap-3">
          <div className="col-span-3">
            <Panel tint className="h-full flex flex-col">
              <div className="deck-kicker mb-2">The prize</div>
              <div className="grid flex-1 grid-cols-1 content-between gap-2">
                {[["~18%", "field-force ROI uplift", true], ["-30%", "cost per new patient", false], ["40+", "whitespace districts", false], ["12 mo", "to national scale", true]].map(([v, l, a], i) => (
                  <div key={i}>
                    <div className="text-[25px] font-semibold leading-none tracking-tighter2" style={{ color: a ? ACCENT : INK }}>{v}</div>
                    <div className="mt-0.5 font-mono text-[8px] uppercase tracking-wide" style={{ color: INK2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
          <div className="col-span-4">
            <Panel className="h-full flex flex-col">
              <div className="deck-kicker mb-3">Feasibility scorecard</div>
              <div className="flex-1">
                {feas.map(([h, v]: any, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium" style={{ color: INK }}>{h}</span>
                      <span className="font-mono text-[10.5px] font-semibold" style={{ color: INK }}>{v}<span className="text-[8px]" style={{ color: INK3 }}>/100</span></span>
                    </div>
                    <div className="mt-1"><MiniBar value={v} accent={v >= 82} /></div>
                  </div>
                ))}
              </div>
              <div className="rounded-[7px] border p-2" style={{ borderColor: LINE, background: PANEL }}>
                <span className="text-[10px] leading-snug" style={{ color: INK }}><b style={{ color: ACCENT }}>Verdict.</b> A high-feasibility, low-regret build. Data mostly exists, the marginal cost of refresh is small, and adoption is solved by a two-state pilot before scale.</span>
              </div>
            </Panel>
          </div>
          <div className="col-span-5">
            <Panel className="h-full">
              <div className="deck-kicker mb-1">Risks and governance</div>
              <div className="grid grid-cols-[92px_1fr] gap-x-2 border-b pb-1 font-mono text-[8px] uppercase" style={{ color: INK3, borderColor: LINE }}>
                <span>Risk</span><span>Mitigation</span>
              </div>
              {risks.map(([r, w, m], i) => (
                <div key={i} className="grid grid-cols-[92px_1fr] items-start gap-x-2 border-b py-[5.5px]" style={{ borderColor: LINE }}>
                  <div><div className="text-[10.5px] font-semibold leading-tight" style={{ color: INK }}>{r}</div><div className="font-mono text-[8px]" style={{ color: INK3 }}>{w}</div></div>
                  <span className="text-[10px] leading-snug" style={{ color: INK2 }}>{m}</span>
                </div>
              ))}
              <div className="mt-2 font-mono text-[8.5px]" style={{ color: INK3 }}>Governance: quarterly refresh, versioned weights, every score carries a data-confidence flag.</div>
            </Panel>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// Closing kept for the annexure lead-in.
export function Closing({ total }: { n: number; total: number }) {
  return (
    <div className="slide" style={{ background: INK, color: "#fff" }}>
      <div className="absolute left-0 top-0 h-full w-[6px]" style={{ background: ACCENT }} />
      <div className="flex h-full flex-col justify-center px-[80px]">
        <div className="deck-kicker" style={{ color: ACCENT }}>District Market Attractiveness Index</div>
        <h2 className="mt-4 text-[42px] font-semibold leading-[1.08] tracking-tighter2">
          One transparent score,
          <br />730+ districts, every pharma
          <br />decision pointed the same way.
        </h2>
        <div className="mt-8 h-px w-[120px]" style={{ background: ACCENT }} />
        <div className="mt-6 flex gap-10">
          <div><div className="text-[24px] font-semibold" style={{ color: "#fff" }}>Model</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>PCA + entropy + AHP</div></div>
          <div><div className="text-[24px] font-semibold" style={{ color: "#fff" }}>Framework</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>GE-McKinsey, Porter, BCG</div></div>
          <div><div className="text-[24px] font-semibold" style={{ color: ACCENT }}>Activation</div><div className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#8a8a8a" }}>4 commercial use cases</div></div>
        </div>
        <p className="mt-9 font-mono text-[11px]" style={{ color: "#6f6f6f" }}>Thank you  ·  Annexure follows: frameworks, indicator dictionary, sources, formulae, worked example, references</p>
      </div>
    </div>
  );
}
