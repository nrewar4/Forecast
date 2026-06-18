import { useState } from "react";
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
import { cn, num } from "@/lib/utils";
import { growthRanking, paraxyleneForecast, type Signal } from "@/data/forecast";

const products = [
  { value: "29024300", label: "Paraxylene (HS 29024300)" },
  { value: "28092010", label: "Phosphoric acid (HS 28092010)" },
  { value: "29331999", label: "Heterocyclic compounds (HS 29331999)" },
  { value: "29051100", label: "Methanol (HS 29051100)" },
  { value: "29022000", label: "Benzene (HS 29022000)" },
];

function signalTone(s: Signal): "green" | "gray" | "amber" {
  if (s === "Strong buy" || s === "Buy") return "green";
  if (s === "Watch") return "amber";
  return "gray";
}

export default function DemandForecast() {
  const [product, setProduct] = useState("29024300");
  const [model, setModel] = useState("prophet");
  const selected = products.find((p) => p.value === product)?.label ?? "";
  const shortName = selected.split(" (")[0];

  const selectClass =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell
      title="Demand Forecast"
      subtitle="Predictive demand signals powered by trade history and seasonality."
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <select className={cn(selectClass, "lg:w-[300px]")} value={product} onChange={(e) => setProduct(e.target.value)}>
          {products.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select className={cn(selectClass, "lg:w-[180px]")} value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="prophet">Prophet</option>
          <option value="sarima">SARIMA</option>
          <option value="xgboost">XGBoost</option>
        </select>
        <p className="text-xs text-muted-foreground lg:ml-2">
          Models retrain monthly. Prophet recommended for 36 month history.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiChip icon={Sparkles} label="Products Forecasted" value="612" trend="+24" />
        <KpiChip icon={Gauge} label="Avg Forecast Error" value="8.4%" sub="MAPE" trend="-0.6 pp" />
        <KpiChip icon={ArrowUpRight} label="High Growth Products" value="12" trend="+3" />
        <KpiChip icon={Activity} label="Forecast Horizon" value="12" sub="months" trend="rolling" />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle>Demand Forecast, {shortName} (tonnes per month)</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              12 month actuals, 6 month forecast with confidence band
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
            <ComposedChart data={paraxyleneForecast} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle>Growth Ranking</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Six month forecasted change versus current monthly run rate
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
                {growthRanking.map((r) => (
                  <tr key={r.rank} className="border-t border-border">
                    <td className="px-3 py-2.5 font-semibold text-muted-foreground">{r.rank}</td>
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
            Forecasts shown are illustrative. Connect the full three year Datamyne history for
            production grade accuracy.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
