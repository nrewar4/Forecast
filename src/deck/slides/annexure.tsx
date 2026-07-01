import { ACCENT, INK, INK2, INK3, LINE, PANEL, Rule, Panel, Slide } from "../components/primitives";
import { PILLARS, ALL_INDICATORS, WEIGHTING_METHODS } from "../data/framework";
import { topDistricts } from "../data/districts";

export function AnnexFrameworks({ n, total }: { n: number; total: number }) {
  const rows = [
    ["GE-McKinsey nine-box", "Strategy", "The MAI is the market-attractiveness axis, computed objectively so districts can be placed in invest / build / harvest / exit boxes."],
    ["Porter's Five Forces", "Strategy", "Rivalry (sales saturation), buyer and supplier power and substitutes shape the Whitespace pillar."],
    ["PESTEL", "Macro scan", "Political, economic, social, technological, environmental and legal drivers define which indicators enter the Demand and Growth pillars."],
    ["MCDA / composite indicators", "Method", "OECD/JRC ten-step method governs selection, normalization, weighting and aggregation into one index."],
    ["AHP (Saaty)", "Weighting", "Expert pairwise judgement sets part of the cross-pillar weights, with a consistency ratio below 0.1."],
    ["PCA + Shannon entropy", "Weighting", "Objective, data-driven weights from variance loadings and information dispersion, reconciled with AHP."],
    ["BCG growth-share", "Portfolio", "Tiers map to Stars, Cash Cows, Question Marks and Dogs to set the play per district group."],
    ["Ansoff matrix", "Growth", "Penetration, market development, product development and diversification guide portfolio moves by tier."],
    ["STP", "Targeting", "Segment districts by MAI and pillar profile, target Tier 1-2 and whitespace, position portfolio to the dominant need."],
    ["Bass diffusion", "Forecasting", "Models adoption of a new launch; MAI targeting raises the innovation (p) and imitation (q) coefficients."],
    ["Pareto principle", "Prioritisation", "Confirms opportunity concentration, the top districts hold a disproportionate share of the prize."],
  ];
  return (
    <Slide n={n} total={total} section="Annexure A1" kicker="Annexure A1 · MBA frameworks applied" title="Every framework used, and exactly where it enters the model." source="Framework mapping">
      <div className="grid grid-cols-[190px_92px_1fr] gap-x-4 border-b pb-1 font-mono text-[9px] uppercase" style={{ color: INK3, borderColor: INK }}>
        <span>Framework</span><span>Role</span><span>How it is used</span>
      </div>
      {rows.map(([f, r, u], i) => (
        <div key={i} className="grid grid-cols-[190px_92px_1fr] items-start gap-x-4 border-b py-[6.5px]" style={{ borderColor: LINE }}>
          <span className="text-[11px] font-semibold" style={{ color: INK }}>{f}</span>
          <span className="font-mono text-[9px]" style={{ color: ACCENT }}>{r}</span>
          <span className="text-[10.5px] leading-snug" style={{ color: INK2 }}>{u}</span>
        </div>
      ))}
    </Slide>
  );
}

export function AnnexIndicators({ n, total }: { n: number; total: number }) {
  const half = Math.ceil(ALL_INDICATORS.length / 2);
  const cols = [ALL_INDICATORS.slice(0, half), ALL_INDICATORS.slice(half)];
  return (
    <Slide n={n} total={total} section="Annexure A2" kicker="Annexure A2 · Indicator dictionary" title="All indicators, direction and within-pillar weight." source="Framework definition">
      <div className="grid h-full grid-cols-2 gap-x-8">
        {cols.map((list, ci) => (
          <div key={ci}>
            <div className="grid grid-cols-[24px_1fr_58px_28px] gap-x-2 border-b pb-1 font-mono text-[8.5px] uppercase" style={{ color: INK3, borderColor: INK }}>
              <span>Code</span><span>Indicator</span><span>Dir</span><span className="text-right">Wt</span>
            </div>
            {list.map((ind) => (
              <div key={ind.code} className="grid grid-cols-[24px_1fr_58px_28px] items-center gap-x-2 border-b py-[3px]" style={{ borderColor: LINE }}>
                <span className="font-mono text-[9px]" style={{ color: ACCENT }}>{ind.code}</span>
                <span className="truncate text-[10px]" style={{ color: INK }}>{ind.name}</span>
                <span className="font-mono text-[8.5px]" style={{ color: ind.direction === "negative" ? ACCENT : INK2 }}>{ind.direction === "negative" ? "inverse" : "+"}</span>
                <span className="text-right font-mono text-[9.5px]" style={{ color: INK2 }}>{ind.weight.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function AnnexSources({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Annexure A3" kicker="Annexure A3 · Data source master" title="Real public datasets behind each pillar, with vintage and granularity." source="Public data catalogue">
      <div className="grid h-full grid-cols-2 gap-x-8 gap-y-1">
        {PILLARS.map((p) => (
          <div key={p.id} className="mb-1">
            <div className="text-[11.5px] font-semibold" style={{ color: INK }}>P{p.no} {p.short}</div>
            {p.indicators.map((ind) => (
              <div key={ind.code} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-b py-[2.5px]" style={{ borderColor: LINE }}>
                <span className="truncate font-mono text-[9.5px]" style={{ color: INK }}>{ind.source}</span>
                <span className="font-mono text-[8.5px] whitespace-nowrap" style={{ color: INK3 }}>{ind.year} · {ind.granularity}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

export function AnnexMethod({ n, total }: { n: number; total: number }) {
  return (
    <Slide n={n} total={total} section="Annexure A4" kicker="Annexure A4 · Methodology detail" title="The formulae behind normalization, weighting and aggregation." source="Composite-indicator methodology">
      <div className="grid h-full grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <Panel tint>
            <div className="deck-kicker">1 · Normalization (min-max)</div>
            <div className="mt-2 font-mono text-[12px]" style={{ color: INK }}>x'<sub>i</sub> = 100 &middot; (x<sub>i</sub> - min<sub>i</sub>) / (max<sub>i</sub> - min<sub>i</sub>)</div>
            <div className="mt-1 text-[10.5px]" style={{ color: INK2 }}>Negative indicators use (max - x) so higher is always better. Bounds set after winsorizing at [p5, p95].</div>
          </Panel>
          <Panel tint>
            <div className="deck-kicker">2 · Entropy weight</div>
            <div className="mt-2 font-mono text-[12px] leading-relaxed" style={{ color: INK }}>
              e<sub>i</sub> = -k &Sigma; p<sub>ij</sub> ln p<sub>ij</sub><br />
              w<sup>ent</sup><sub>i</sub> = (1 - e<sub>i</sub>) / &Sigma;(1 - e)
            </div>
            <div className="mt-1 text-[10.5px]" style={{ color: INK2 }}>Indicators that discriminate more between districts earn more weight.</div>
          </Panel>
        </div>
        <div className="flex flex-col gap-4">
          <Panel tint>
            <div className="deck-kicker">3 · Reconciled weight</div>
            <div className="mt-2 font-mono text-[12px]" style={{ color: INK }}>
              w<sub>i</sub> = {WEIGHTING_METHODS.map((m) => `${m.share} w^${m.id}`).join(" + ")}
            </div>
            <div className="mt-2 flex gap-2">
              {WEIGHTING_METHODS.map((m) => (
                <span key={m.id} className="font-mono text-[9px] rounded border px-1.5 py-[1px]" style={{ color: INK2, borderColor: LINE }}>{m.name} {Math.round(m.share * 100)}%</span>
              ))}
            </div>
          </Panel>
          <Panel tint>
            <div className="deck-kicker">4 · Aggregation</div>
            <div className="mt-2 font-mono text-[12px] leading-relaxed" style={{ color: INK }}>
              Pillar<sub>p</sub> = &Sigma;<sub>i&isin;p</sub> w<sub>i</sub> x'<sub>i</sub><br />
              <span style={{ color: ACCENT }}>MAI</span> = &prod;<sub>p</sub> Pillar<sub>p</sub><sup> W<sub>p</sub></sup>
            </div>
            <div className="mt-1 text-[10.5px]" style={{ color: INK2 }}>Geometric across pillars penalizes imbalance; arithmetic within a pillar keeps it interpretable.</div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

export function AnnexWorked({ n, total }: { n: number; total: number }) {
  const d = topDistricts(2)[0];
  return (
    <Slide n={n} total={total} section="Annexure A5" kicker="Annexure A5 · Worked example" title={`How ${d.name} reaches its composite score.`} source="Model output (illustrative)">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="grid grid-cols-[1fr_60px_50px_60px] gap-x-3 border-b pb-1 font-mono text-[9px] uppercase" style={{ color: INK3, borderColor: INK }}>
            <span>Pillar</span><span className="text-right">Score</span><span className="text-right">W</span><span className="text-right">Contribution</span>
          </div>
          {PILLARS.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_60px_50px_60px] items-center gap-x-3 border-b py-[6px]" style={{ borderColor: LINE }}>
              <span className="text-[11.5px]" style={{ color: INK }}>P{p.no} {p.short}</span>
              <span className="text-right font-mono text-[11px]" style={{ color: INK }}>{d.pillars[p.id].toFixed(1)}</span>
              <span className="text-right font-mono text-[11px]" style={{ color: INK2 }}>{p.weight.toFixed(2)}</span>
              <span className="text-right font-mono text-[11px]" style={{ color: INK2 }}>{(Math.pow(d.pillars[p.id], p.weight)).toFixed(2)}</span>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_60px_50px_60px] items-center gap-x-3 py-[8px]">
            <span className="text-[12px] font-semibold" style={{ color: INK }}>Composite MAI (geometric)</span>
            <span></span><span></span>
            <span className="text-right font-mono text-[16px] font-semibold" style={{ color: ACCENT }}>{d.mai.toFixed(1)}</span>
          </div>
        </div>
        <div className="col-span-5">
          <Panel tint className="h-full flex flex-col justify-center">
            <div className="deck-kicker">Reading it</div>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: INK }}>
              Each pillar score is raised to its cross-pillar weight and the results are multiplied. Because
              the aggregation is geometric, a weak pillar drags the composite down more than a simple average
              would, so only genuinely well-rounded districts reach the top tier.
            </p>
            <Rule className="my-3" />
            <div className="font-mono text-[11px]" style={{ color: INK2 }}>MAI = &prod; Pillar<sub>p</sub><sup>W<sub>p</sub></sup> = <span style={{ color: ACCENT }}>{d.mai.toFixed(1)}</span></div>
          </Panel>
        </div>
      </div>
    </Slide>
  );
}

export function AnnexReferences({ n, total }: { n: number; total: number }) {
  const refs = [
    "OECD / JRC. Handbook on Constructing Composite Indicators: Methodology and User Guide. 2008.",
    "Census of India, Office of the Registrar General. District-level demographic tables, 2011 + SRS projections.",
    "IIPS. National Family Health Survey (NFHS-5), 2019-21. District fact sheets.",
    "MoHFW. Health Management Information System (HMIS) and Rural Health Statistics, 2022-24.",
    "National Health Authority. PM-JAY beneficiary and coverage data, 2023.",
    "MoSPI. Household Consumption Expenditure Survey (HCES), 2022-23; PLFS, 2023-24.",
    "AIOCD-AWACS. Retail pharma audit (used as an illustrative validation proxy).",
    "IDSP / NCDC, NMC registries, CDSCO, and State Directorates of Economics and Statistics.",
    "Diakoulaki et al. Determining objective weights: the CRITIC / entropy method. 1995.",
    "Saaty, T. The Analytic Hierarchy Process. 1980.",
  ];
  return (
    <Slide n={n} total={total} section="Annexure A6" kicker="Annexure A6 · References" title="Methodology and data sources." source="">
      <div className="grid h-full grid-cols-2 gap-x-10">
        <div>
          {refs.slice(0, 5).map((r, i) => (
            <div key={i} className="flex gap-3 border-b py-[9px]" style={{ borderColor: LINE }}>
              <span className="font-mono text-[10px]" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[11.5px] leading-snug" style={{ color: INK }}>{r}</span>
            </div>
          ))}
        </div>
        <div>
          {refs.slice(5).map((r, i) => (
            <div key={i} className="flex gap-3 border-b py-[9px]" style={{ borderColor: LINE }}>
              <span className="font-mono text-[10px]" style={{ color: ACCENT }}>{String(i + 6).padStart(2, "0")}</span>
              <span className="text-[11.5px] leading-snug" style={{ color: INK }}>{r}</span>
            </div>
          ))}
          <div className="mt-6 rounded-[8px] border p-3" style={{ borderColor: LINE, background: PANEL }}>
            <div className="deck-kicker">Note on data</div>
            <p className="mt-1 text-[10.5px] leading-snug" style={{ color: INK2 }}>
              District scores in this deck are illustrative, generated to demonstrate the model's outputs and
              interfaces. The listed sources are real and district-resolvable; production scoring ingests them directly.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}
