import { ArrowRight, Check, Clock, Flag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PHASE_LABEL, SCALE_LADDER, type Pathway } from "@/data/cdmoPathway";

const months = (w: number) => Math.max(1, Math.round(w / 4.345));

const START_LABEL: Record<string, string> = {
  idea: "starting from the molecule",
  lab: "starting from your lab process",
  validated: "starting from your validated process",
  second: "qualifying a second source",
};
const GOAL_LABEL: Record<string, string> = {
  samples: "through to kilo quantities",
  commercial: "through to commercial supply",
  regulated: "through to a regulated filing and supply",
};
const SPEED_LABEL: Record<string, string> = {
  fast: "compressed for speed",
  balanced: "balanced plan",
  certain: "extended for certainty",
};

// The signature element: the engagement drawn as a downward spine of numbered
// stage nodes, phase by phase, with the scale rung shown in the right gutter and
// the walk-away gate named on every stage. Deterministic, so it always renders.
export function PathwaySpine({ pathway, compact = false }: { pathway: Pathway; compact?: boolean }) {
  const weeks = pathway.weeks;
  const r = pathway.refinements;

  // Cumulative week ranges per milestone, for the timeline strip.
  let cumLow = 0;
  let cumHigh = 0;
  const timeline = pathway.milestones.map((m) => {
    const startLow = cumLow + 1;
    cumLow += m.weeks[0];
    cumHigh += m.weeks[1];
    return { ...m, window: m.weeks[1] === 0 ? "ongoing" : `wk ${startLow} to ${cumHigh}` };
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            {pathway.product ? `Pathway for ${pathway.product}` : "Your pathway"}
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{pathway.archetype.title}</h3>
          {r ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {START_LABEL[r.start]}, {GOAL_LABEL[r.goal]}, {SPEED_LABEL[r.speed]}
            </p>
          ) : null}
        </div>
      </div>

      {/* Timeline summary */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Clock className="h-4 w-4 text-primary" />
          {weeks[0]} to {weeks[1]} weeks
        </span>
        <span className="text-sm text-muted-foreground">
          about {months(weeks[0])} to {months(weeks[1])} months to {pathway.milestones[pathway.milestones.length - 1]?.label.toLowerCase() ?? "finish"}
        </span>
        <span className="w-full text-[11px] text-muted-foreground sm:w-auto">
          Indicative planning range, confirmed after the feasibility assessment.
        </span>
      </div>

      <ol className="relative ml-1 space-y-3 border-l-2 border-border pl-6">
        {pathway.stages.map((stage, i) => (
          <Reveal as="li" key={stage.id} delay={compact ? 0 : i * 60} className="relative">
            {/* Node */}
            <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-background font-mono text-[11px] font-bold text-primary">
              {i + 1}
            </span>

            <div className="rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {PHASE_LABEL[stage.phase]}
                  </span>
                  <h4 className="text-sm font-semibold text-ink">{stage.name}</h4>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {SCALE_LADDER[stage.scale]}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{stage.purpose}</p>

              {!compact ? (
                <>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stage.deliverables.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground"
                      >
                        <Check className="h-3 w-3 text-primary" />
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2.5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <Flag className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold text-foreground/80">Walk-away gate. </span>
                      {stage.gate}
                    </span>
                  </p>
                </>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>

      {/* Milestone strip with cumulative windows */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {timeline.map((m, i) => (
          <div key={m.phase} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              M{i + 1} {m.label}
            </p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
              {m.weeks[1] === 0 ? "ongoing" : `${m.weeks[0]}${m.weeks[1] !== m.weeks[0] ? ` to ${m.weeks[1]}` : ""} wk`}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">{m.window}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowRight className="h-3.5 w-3.5 text-primary" />
        You choose your entry and exit points. The stages you skip matter as much as the ones you run.
      </p>
    </div>
  );
}
