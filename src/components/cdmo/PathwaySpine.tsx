import { ArrowRight, Check, Flag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PHASE_LABEL, SCALE_LADDER, type Pathway } from "@/data/cdmoPathway";

// The signature element: the engagement drawn as a downward spine of numbered
// stage nodes, phase by phase, with the scale rung shown in the right gutter and
// the walk-away gate named on every stage. Deterministic, so it always renders.
export function PathwaySpine({ pathway, compact = false }: { pathway: Pathway; compact?: boolean }) {
  const weeks = pathway.weeks;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            Your pathway
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{pathway.archetype.title}</h3>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Indicative {weeks[0]} to {weeks[1]} weeks
        </p>
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

      {/* Milestone strip */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {pathway.milestones.map((m) => (
          <div key={m.phase} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
              {m.weeks[0]}
              {m.weeks[1] !== m.weeks[0] ? ` to ${m.weeks[1]}` : ""} wk
            </p>
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
