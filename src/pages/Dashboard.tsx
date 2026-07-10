import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarDays,
  RefreshCw,
  Scale,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui/primitives";
import { KpiCard } from "@/components/ui/Kpi";
import { EmptyState } from "@/components/ui/EmptyState";
import { MarketNews } from "@/components/knowledge/MarketNews";
import { useCurrency } from "@/context/Currency";
import { compact } from "@/lib/utils";
import { TRADE_QUERIES } from "@/lib/news";
import { loadTradeSnapshot, type CountryTrade, type TradeSnapshot } from "@/lib/worldbank";

const EXPORT_COLOR = "#F47920"; // brand orange
const IMPORT_COLOR = "#475569"; // neutral slate

function formatDate(iso: string | null): string {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return Number.isNaN(+d) ? iso : d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function Dashboard() {
  const { money, convert, symbol, currency } = useCurrency();
  const [snap, setSnap] = useState<TradeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadTradeSnapshot({ force });
      setSnap(data);
    } catch {
      setError("Live trade data could not be loaded right now. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const countries = snap?.countries ?? [];

  const totals = useMemo(() => {
    let exp = 0;
    let imp = 0;
    let year = 0;
    for (const c of countries) {
      if (c.exports) exp += c.exports;
      if (c.imports) imp += c.imports;
      if (c.latestYear && c.latestYear > year) year = c.latestYear;
    }
    return { exp, imp, balance: exp - imp, year };
  }, [countries]);

  // Grouped exports vs imports per country, in the active currency.
  const comparison = useMemo(
    () =>
      countries.map((c) => ({
        name: c.name,
        Exports: convert(c.exports ?? 0),
        Imports: convert(c.imports ?? 0),
      })),
    [countries, convert],
  );

  // Combined chemical trade of all six markets, by year.
  const combined = useMemo(() => {
    const byYear = new Map<number, number>();
    for (const c of countries) {
      for (const p of c.history) byYear.set(p.year, (byYear.get(p.year) ?? 0) + p.value);
    }
    return Array.from(byYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, value]) => ({ year: String(year), value: convert(value) }));
  }, [countries, convert]);

  const axisMoney = (v: number) => symbol + compact(v);

  return (
    <AppShell
      title="Market Overview"
      centerHeader
      subtitle="Chemical trade for the United States, China, India, Japan, South Korea and Saudi Arabia. Verified figures from the World Bank."
    >
      {/* Source + refresh bar */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs text-muted-foreground">
        <span>World Bank merchandise trade and WITS chemical share</span>
        {snap ? (
          <>
            <span className="text-border">·</span>
            <span>Source updated {formatDate(snap.sourceUpdated)}</span>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="press inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={"h-3.5 w-3.5" + (loading ? " animate-spin" : "")} />
          Refresh
        </button>
      </div>

      {error && !snap ? (
        <EmptyState
          icon={AlertTriangle}
          title="Trade data unavailable"
          hint={error}
          action={
            <button
              type="button"
              onClick={() => load(true)}
              className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          }
        />
      ) : loading && !snap ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Aggregate KPIs */}
          <div className="grid animate-fade-up grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard icon={ArrowUpFromLine} label="Chemical Exports" value={money(totals.exp)} sub="six focus markets" />
            <KpiCard icon={ArrowDownToLine} label="Chemical Imports" value={money(totals.imp)} sub="six focus markets" />
            <KpiCard
              icon={Scale}
              label="Net Balance"
              value={(totals.balance < 0 ? "−" : "+") + money(Math.abs(totals.balance))}
              sub={totals.balance < 0 ? "net import deficit" : "net export surplus"}
            />
            <KpiCard icon={CalendarDays} label="Latest Data Year" value={totals.year ? String(totals.year) : "N/A"} sub="most recent reported" />
          </div>

          {/* Comparison + news */}
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Exports vs Imports by Country</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Chemical trade ({currency}), latest reported year per country
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={comparison} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barGap={2}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#334155" }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={axisMoney} width={54} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: "#F8FAFC" }}
                      formatter={(v: number, name) => [symbol + compact(v), name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="Exports" fill={EXPORT_COLOR} radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false} />
                    <Bar dataKey="Imports" fill={IMPORT_COLOR} radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <MarketNews title="Trade Headlines" queries={TRADE_QUERIES} />
          </div>

          {/* Combined trend */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle>Combined Chemical Trade Over Time</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Total exports plus imports across all six markets ({currency}), by year
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              {combined.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">No history available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={combined} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="combinedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={EXPORT_COLOR} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={EXPORT_COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={axisMoney} width={54} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [symbol + compact(v), "Total trade"]} />
                    <Area type="monotone" dataKey="value" stroke={EXPORT_COLOR} strokeWidth={2} fill="url(#combinedFill)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Per-country cards */}
          <h2 className="mt-8 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            By Country
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {countries.map((c) => (
              <CountryCard key={c.code} country={c} money={money} convert={convert} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Chemical trade is estimated as World Bank merchandise trade (current US$) multiplied by each
            country's chemical share of merchandise trade from World Bank WITS. Trade is published annually,
            so figures show each country's latest reported year.
          </p>
        </>
      )}
    </AppShell>
  );
}

function CountryCard({
  country: c,
  money,
  convert,
}: {
  country: CountryTrade;
  money: (usd: number) => string;
  convert: (usd: number) => number;
}) {
  const spark = c.history.map((p) => ({ year: p.year, value: convert(p.value) }));
  const balancePositive = (c.balance ?? 0) >= 0;
  return (
    <Card className="transition-colors duration-200 hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="text-2xl leading-none">{c.flag}</span>
            <span className="text-base font-semibold text-ink">{c.name}</span>
          </div>
          {c.latestYear ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {c.latestYear}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Exports" value={c.exports != null ? money(c.exports) : "N/A"} />
          <Stat label="Imports" value={c.imports != null ? money(c.imports) : "N/A"} />
          <Stat
            label="Balance"
            value={c.balance != null ? (balancePositive ? "+" : "−") + money(Math.abs(c.balance)) : "N/A"}
            tone={c.balance == null ? "muted" : balancePositive ? "up" : "down"}
          />
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Trade / GDP</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {c.tradeGdp != null ? `${c.tradeGdp.toFixed(0)}%` : "N/A"}
            </p>
          </div>
          {spark.length > 1 ? (
            <div className="h-12 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${c.code}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={EXPORT_COLOR} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={EXPORT_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={EXPORT_COLOR} strokeWidth={1.5} fill={`url(#spark-${c.code})`} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "up" | "down" | "muted" }) {
  const color =
    tone === "up" ? "text-emerald-600" : tone === "down" ? "text-rose-600" : tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-2.5 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={"mt-0.5 text-sm font-semibold tabular-nums " + color}>{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <div className="h-96 rounded-xl border border-border bg-card" />
        <div className="h-96 rounded-xl border border-border bg-card" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl border border-border bg-card" />
        ))}
      </div>
    </div>
  );
}
