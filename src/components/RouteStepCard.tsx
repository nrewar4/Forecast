import { FlaskConical } from "lucide-react";
import type { RouteStep } from "@/lib/retrosynthesis";

export function RouteStepCard({ step }: { step: RouteStep }) {
  return (
    <div className="flex gap-3 rounded-md border border-border p-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
        {step.order}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-sm font-semibold text-foreground">
          {step.reaction_name}
        </p>
        {step.explanation ? (
          <p className="text-sm text-muted-foreground">{step.explanation}</p>
        ) : null}
        {step.reagents.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {step.reagents.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-foreground"
              >
                <FlaskConical className="h-3 w-3 text-primary" />
                {r}
              </span>
            ))}
          </div>
        ) : null}
        {step.reactants.length > 0 ? (
          <p className="break-all font-mono text-[11px] text-muted-foreground">
            {step.reactants.join(" + ")}
          </p>
        ) : null}
        {step.conditions ? (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
            {step.conditions}
          </span>
        ) : null}
      </div>
    </div>
  );
}
