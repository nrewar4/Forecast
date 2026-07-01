import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const INK = "#0a0a0a";
export const INK2 = "#666666";
export const INK3 = "#999999";
export const LINE = "#eaeaea";
export const LINE_DARK = "#1f1f1f";
export const ACCENT = "#f47920";
export const PANEL = "#fafafa";

// Grayscale ramp used for charts; accent is reserved for the one highlighted mark.
export const GRAYS = ["#0a0a0a", "#404040", "#737373", "#a3a3a3", "#cfcfcf", "#e5e5e5"];

interface SlideProps {
  n: number;
  total: number;
  section: string;
  kicker?: string;
  title?: ReactNode;
  source?: string;
  dark?: boolean;
  children: ReactNode;
  className?: string;
}

// Standard content slide: mono kicker + bold statement header, hairline footer.
export function Slide({ n, total, section, kicker, title, source, dark, children, className }: SlideProps) {
  const line = dark ? LINE_DARK : LINE;
  return (
    <div className={cn("slide", dark && "dark")} style={{ background: dark ? INK : "#fff", color: dark ? "#fff" : INK }}>
      <div className="flex h-full flex-col px-[56px] py-[40px]">
        <header className="flex items-start justify-between">
          <div className="max-w-[880px]">
            {kicker && <div className="deck-kicker" style={{ color: dark ? "#8a8a8a" : undefined }}>{kicker}</div>}
            {title && (
              <h2 className="mt-2 text-[27px] font-semibold leading-[1.12] tracking-tightish" style={{ color: dark ? "#fff" : INK }}>
                {title}
              </h2>
            )}
          </div>
          <div className="flex flex-col items-end pt-1">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: dark ? "#7a7a7a" : INK3 }}>{section}</span>
            <span className="font-mono text-[10.5px]" style={{ color: dark ? "#7a7a7a" : INK3 }}>
              {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </header>
        <div className={cn("min-h-0 flex-1", title || kicker ? "pt-[22px]" : "")}>{children}</div>
        <footer className="flex items-center justify-between border-t pt-[10px]" style={{ borderColor: line }}>
          <span className="font-mono text-[9.5px]" style={{ color: dark ? "#6f6f6f" : INK3 }}>
            {source ? `Source  ${source}` : ""}
          </span>
          <span className="font-mono text-[9.5px]" style={{ color: dark ? "#6f6f6f" : INK3 }}>
            Bharat Pharma District MAI
          </span>
        </footer>
      </div>
      {!dark && <div className="pointer-events-none absolute left-0 top-0 h-[3px] w-full" style={{ background: ACCENT }} />}
    </div>
  );
}

export function Kicker({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <div className="deck-kicker" style={{ color: dark ? "#8a8a8a" : undefined }}>{children}</div>;
}

export function Rule({ className, dark }: { className?: string; dark?: boolean }) {
  return <div className={cn("w-full", className)} style={{ height: 1, background: dark ? LINE_DARK : LINE }} />;
}

// Big editorial statistic with a mono label beneath.
export function Stat({ value, label, accent, sub, className }: { value: ReactNode; label: string; accent?: boolean; sub?: string; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[46px] font-semibold leading-none tracking-tighter2" style={{ color: accent ? ACCENT : INK }}>
        {value}
      </div>
      <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: INK2 }}>{label}</div>
      {sub && <div className="mt-1 text-[11px] leading-snug" style={{ color: INK3 }}>{sub}</div>}
    </div>
  );
}

// Compact bordered panel (hairline, no shadow) for grouping content.
export function Panel({ children, className, tint }: { children: ReactNode; className?: string; tint?: boolean }) {
  return (
    <div className={cn("rounded-[10px] border p-4", className)} style={{ borderColor: LINE, background: tint ? PANEL : "#fff" }}>
      {children}
    </div>
  );
}

// Small pill used for tiers, tags, method labels.
export function Tag({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "accent" | "muted" }) {
  const map = {
    ink: { c: INK, b: INK, bg: "#fff" },
    accent: { c: ACCENT, b: ACCENT, bg: "#fff" },
    muted: { c: INK2, b: LINE, bg: PANEL },
  }[tone];
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-[2px] font-mono text-[9.5px] uppercase tracking-[0.08em]" style={{ color: map.c, borderColor: map.b, background: map.bg }}>
      {children}
    </span>
  );
}

// Horizontal micro-bar (0..100) with grayscale fill.
export function MiniBar({ value, accent }: { value: number; accent?: boolean }) {
  return (
    <div className="h-[6px] w-full rounded-full" style={{ background: "#efefef" }}>
      <div className="h-full rounded-full" style={{ width: `${Math.max(2, value)}%`, background: accent ? ACCENT : "#0a0a0a" }} />
    </div>
  );
}
