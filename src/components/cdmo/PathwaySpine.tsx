import { ArrowRight, Check } from "lucide-react";
import type { Pathway } from "@/data/cdmoPathway";
import { cn } from "@/lib/utils";

// The signature element: a development pathway drawn as numbered nodes on a
// vertical spine, milestone by milestone, with the deliverables and the gate at
// which the customer can walk away. Nodes animate in on mount.
export function PathwaySpine({
  pathway,
  onContact,
  compact = false,
}: {
  pathway: Pathway;
  onContact?: () => void;
  compact?: boolean;
}) {
  const { archetype, milestones, weeks } = pathway;

  return (
    <div className="space-y-4 text-left">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Suggested pathway
        </p>
        <p className="mt-1 text-base font-semibold text-ink">{archetype.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{archetype.situation}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            Indicative timeline{" "}
            <span className="font-mono font-semibold text-foreground">
              {weeks[0]} to {weeks[1]} weeks
            </span>
          </span>
          <span>
            Commercial model{" "}
            <span className="font-medium text-foreground">{archetype.model}</span>
          </span>
        </div>
      </div>

      <ol className="relative space-y-3 pl-2">
        {/* the spine line */}
        <span
          aria-hidden
          className="absolute left-[15px] top-2 bottom-6 w-px bg-gradient-to-b from-primary/60 via-border to-border"
        />
        {milestones.map((m, i) => (
          <li
            key={m.phase}
            className="relative animate-slide-up-in pl-9"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-card font-mono text-xs font-semibold text-primary shadow-card">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{m.label}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {m.weeks[0]} to {m.weeks[1]} wk
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {m.stages.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
              {!compact ? (
                <ul className="mt-2.5 space-y-1">
                  {m.deliverables.slice(0, 4).map((d) => (
                    <li key={d} className="flex items-start gap-1.5 text-xs text-foreground/85">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-2.5 flex items-start gap-1.5 border-t border-border pt-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Gate:</span> {m.gate}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {onContact ? (
        <button
          type="button"
          onClick={onContact}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
        >
          Get this scoped by APAC <ArrowRight className="h-4 w-4" />
        </button>
      ) : null}

      {!compact ? (
        <p className={cn("text-[11px] leading-relaxed text-muted-foreground")}>
          Durations are indicative planning ranges, confirmed after a feasibility
          assessment. The stages you skip are as important as the ones you run.
        </p>
      ) : null}
    </div>
  );
}
