import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared empty-state block: a soft icon badge, a title, a short hint, and an
// optional action slot. Used wherever a list or panel can legitimately have no
// content yet (documents, drafts, unpublished issues).
export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-base font-semibold text-ink">{title}</p>
      {hint ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
