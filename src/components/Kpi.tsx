import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "./ui";
import { cn } from "@/lib/utils";

export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {trend ? (
          <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function KpiChip({
  icon: Icon,
  label,
  value,
  sub,
  trend,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {sub ? <p className="text-[11px] text-muted-foreground">{sub}</p> : null}
        </div>
        {trend ? (
          <span className={cn("inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground")}>
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
