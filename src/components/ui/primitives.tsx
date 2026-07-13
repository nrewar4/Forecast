import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pt-5", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "orange",
  className,
}: {
  children: ReactNode;
  tone?: "orange" | "softOrange" | "gray" | "green" | "amber" | "rose";
  className?: string;
}) {
  const tones: Record<string, string> = {
    orange: "bg-primary text-primary-foreground",
    softOrange: "bg-accent text-accent-foreground",
    gray: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 12,
  padding: "6px 10px",
  boxShadow: "0 4px 12px -2px rgba(15,23,42,0.10)",
} as const;
