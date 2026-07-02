import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowUpRight, Gauge, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn, num, slug } from "@/lib/utils";
import { useTradeData } from "@/context/TradeData";
import {
  deriveGrowthRanking,
  forecastProduct,
  modelBlurb,
  modelLabels,
  type ModelKey,
  type Signal,
} from "@/lib/forecast";

const modelOptions: { value: ModelKey; label: string }[] = [
  { value: "prophet", label: "Prophet" },
  { value: "sarima", label: "SARIMA" },
  { value: "xgboost", label: "XGBoost" },
];

function signalTone(s: Signal): "green" | "gray" | "amber" {
  if (s === "Strong buy" || s === "Buy") return "green";
  if (s === "Watch") return "amber";
  return "gray";
}

export default function DemandForecast() {
  const { shipments } = useTradeData();
  const [product, setProduct] = useState("");
  const [model, setModel] = useState<ModelKey>("prophet");

  const ranking = useMemo(() => deriveGrowthRanking(shipments, model), [shipments, model]);
  // Selector lists every product alphabetically; the table below ranks by growth.
  const options = useMemo(
    () =>
      [...ranking]
        .sort((a, b) => a.product.localeCompare(b.product))
        .map((r) => ({ value: slug(r.product), label: `${r.product} (HS ${r.hsCode})` })),
    [ranking],
  );

  const selectedId = product || (ranking[0] ? slug(ranking[0].product) : "");
  const row = ranking.find((r) => slug(r.product) === selectedId) ?? ranking[0];
  const shortName = row ? row.product : "";

  // Fit the selected model to the selected product on the live database.
  const result = useMemo(() => {
    if (!row) return null;
    return forecastProduct(shipments, row.product, row.hsCode, model);
  }, [row, shipments, model]);

  const series = result?.points ?? [];
  const mapeLabel = result && Number.isFinite(result.mapePct) ? `${result.mapePct.toFixed(1)}%` : "n/a";

  // Boundary months so the chart caption reflects the real data window and how
  // far the forecast now runs (extended to reach past today).
  const lastActualMonth = useMemo(
    () => [...series].reverse().find((p) => p.actual != null)?.month,
    [series],
  );
  const lastForecastMonth = series.length ? series[series.length - 1].month : undefined;

  const highGrowthCount = ranking.filter((r) => r.growth >= 10).length;
  const distinctProducts = ranking.length;

  const selectClass =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell
      title="Demand Forecast"
      subtitle="Predictive demand signals, with each model's backtested error."
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <select className={cn(selectClass, "lg:w-[300px]")} value={selectedId} onChange={(e) => setProduct(e.target.value)}>
          {options.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className={cn(selectClass, "lg:w-[180px]")}
          value={model}
          onChange={(e) => setModel(e.target.value as ModelKey)}
        >
          {modelOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground lg:ml-2">
          {modelLabels[model]}. {modelBlurb[model]}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiChip icon={Sparkles} label="Products Forecasted" value={num(distinctProducts)} sub="with real demand history" />
        <KpiChip icon={Gauge} label="Backtested Error" value={mapeLabel} sub={`MAPE, ${modelLabels[model]}`} />
        <KpiChip icon={ArrowUpRight} label="High Growth Products" value={String(highGrowthCount)} sub="double digit" />
        <KpiChip
          icon={Activity}
          label="Six Month Growth"
          value={row ? `${row.growth >= 0 ? "+" : ""}${row.growth}%` : "n/a"}
          sub={shortName}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle>Demand Forecast, {shortName} (tonnes per month)</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Actuals through {lastActualMonth ?? "latest snapshot"}, forecast to{" "}
              {lastForecastMonth ?? "horizon"} with confidence band. The projection runs from the last
              reported trade month up to six months past today.
            </p>
          </div>
          <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 bg-primary" /> Actual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-5"
                style={{ backgroundImage: "repeating-linear-gradient(to right, #F47920 0 4px, transparent 4px 7px)" }}
              />
              Forecast
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-3 rounded-sm" style={{ background: "#F47920", opacity: 0.22 }} /> Band
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F47920" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#F47920" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v: number) => num(v)} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => {
                  if (name === "band" || v == null) return [] as unknown as [string, string];
                  return [num(v as number) + " t", String(name)];
                }}
              />
              <Area type="monotone" dataKey="band" stroke="none" fill="url(#bandFill)" isAnimationActive={false} name="band" />
              <Line type="monotone" dataKey="actual" stroke="#F47920" strokeWidth={2.5} dot={{ r: 3, fill: "#F47920", strokeWidth: 0 }} name="Actual" connectNulls={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="forecast" stroke="#F47920" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3, fill: "#ffffff", stroke: "#F47920", strokeWidth: 2 }} name="Forecast" connectNulls={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
          {row && result ? (
            <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
              {shortName} is forecast to move {row.growth >= 0 ? "up" : "down"} {Math.abs(row.growth)}% over six
              months under {modelLabels[model]}, signal {row.signal}. Backtested error {mapeLabel} MAPE.
              {!result.syntheticHistory
                ? " Fitted on " + result.monthsOfHistory + " months of real per month tonnage."
                : result.monthsOfHistory === 0
                  ? " This product has no trade records yet, so the series is an indicative baseline from its global capacity and sector trend. Upload a Datamyne extract that contains it to forecast on observed trade."
                  : " History is reconstructed from the aggregate monthly trade index because the database holds only " +
                    result.monthsOfHistory +
                    " month of this product. Upload more monthly extracts to forecast on real per month tonnage."}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle>Growth Ranking</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Six month forecasted change versus current monthly run rate, under {modelLabels[model]}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="w-12 px-3 py-2 font-medium">Rank</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">HS Code</th>
                  <th className="px-3 py-2 text-right font-medium">Current (t/mo)</th>
                  <th className="px-3 py-2 text-right font-medium">Forecast +6mo (t/mo)</th>
                  <th className="px-3 py-2 text-right font-medium">Growth</th>
                  <th className="px-3 py-2 font-medium">Signal</th>
                </tr>
              </thead>
              <tbody>
                {ranking.slice(0, 40).map((r, i) => (
                  <tr key={slug(r.product)} className="border-t border-border">
                    <td className="px-3 py-2.5 font-semibold text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium">{r.product}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{r.hsCode}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{num(r.current)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{num(r.forecast)}</td>
                    <td className={cn("px-3 py-2.5 text-right font-semibold tabular-nums", r.growth >= 0 ? "text-emerald-600" : "text-rose-500")}>
                      {r.growth >= 0 ? "+" : ""}
                      {r.growth}%
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={signalTone(r.signal)}>{r.signal}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing the top {Math.min(40, ranking.length)} movers of {ranking.length} products. Only
            products with real trade across two or more months are listed, since a single snapshot month
            cannot produce a genuine forecast. A product appears here once an uploaded extract gives it
            enough monthly history, and models retrain on every upload.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
