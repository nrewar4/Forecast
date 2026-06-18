import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, Flame, Scale, Tag, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn, num, usd } from "@/lib/utils";
import { monthlyTradeValue, shipments, tradeByCountry, transportMethod } from "@/data/trade";

const donutColors = ["#F47920", "#F9A663", "#94A3B8", "#CBD5E1"];

type Mode = "Imports" | "Exports";

export default function TradeAnalytics() {
  const [mode, setMode] = useState<Mode>("Imports");
  const [country, setCountry] = useState("all");
  const [hs, setHs] = useState("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let rows = shipments.slice();
    if (country !== "all") rows = rows.filter((r) => r.origin === country);
    if (hs !== "all") rows = rows.filter((r) => r.hsCode === hs);
    rows.sort((a, b) =>
      sortDir === "asc" ? a.totalValue - b.totalValue : b.totalValue - a.totalValue,
    );
    return rows;
  }, [country, hs, sortDir]);

  const selectClass =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[160px]";

  return (
    <AppShell
      title="Trade Analytics"
      subtitle="Explore shipments, country flows, and transport mix across HS codes."
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-card">
          {(["Imports", "Exports"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
          <select className={selectClass} value={hs} onChange={(e) => setHs(e.target.value)}>
            <option value="all">All HS Codes</option>
            {shipments.map((s) => (
              <option key={s.hsCode} value={s.hsCode}>
                {s.hsCode}
              </option>
            ))}
          </select>
          <select className={selectClass} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All Countries</option>
            {Array.from(new Set(shipments.map((s) => s.origin))).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select className={selectClass} defaultValue="all">
            <option value="all">All Sectors</option>
            <option>Fertiliser</option>
            <option>Petrochemicals</option>
            <option>APIs</option>
            <option>Solvents</option>
          </select>
          <select className={selectClass} defaultValue="all">
            <option value="all">All Transport</option>
            <option>Sea</option>
            <option>ICD</option>
            <option>Road</option>
            <option>Air</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiChip icon={Wallet} label="Total Trade Value" value="USD 56.5M" trend="+9.4%" />
        <KpiChip icon={Tag} label="Avg Unit Price" value="USD 842" sub="per tonne" trend="+2.1%" />
        <KpiChip icon={Scale} label="Trade Balance" value="USD +2.3M" sub="surplus" trend="+0.4M" />
        <KpiChip icon={Flame} label="Fastest Rising HS" value="29331999" sub="heterocyclic compounds" trend="+18%" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle>Monthly Trade Value</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Last 12 months, USD millions</p>
            </div>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
              {mode}
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTradeValue} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="tradeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F47920" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F47920" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`USD ${v}M`, "Value"]} />
                <Area type="monotone" dataKey="value" stroke="#F47920" strokeWidth={2} fill="url(#tradeFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transport Method</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Share by mode, percent</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={transportMethod}
                  dataKey="value"
                  nameKey="method"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {transportMethod.map((_, i) => (
                    <Cell key={i} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {transportMethod.map((t, i) => (
                <div key={t.method} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: donutColors[i % donutColors.length] }} />
                  <span className="text-muted-foreground">{t.method}</span>
                  <span className="ml-auto font-semibold text-foreground">{t.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Trade by Country of Origin</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">USD millions</p>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tradeByCountry} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`USD ${v}M`, "Value"]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {tradeByCountry.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div>
            <CardTitle>Shipment Records</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{filtered.length} records, sorted by value</p>
          </div>
          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Sort by value
            {sortDir === "asc" ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">HS Code</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Importer</th>
                  <th className="px-3 py-2 font-medium">Supplier</th>
                  <th className="px-3 py-2 font-medium">Origin</th>
                  <th className="px-3 py-2 text-right font-medium">Quantity (t)</th>
                  <th className="px-3 py-2 text-right font-medium">Unit Price (USD/t)</th>
                  <th className="px-3 py-2 text-right font-medium">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.date + s.hsCode + s.importer} className="border-t border-border">
                    <td className="whitespace-nowrap px-3 py-2.5 font-medium">{s.date}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{s.hsCode}</td>
                    <td className="px-3 py-2.5">{s.product}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{s.importer}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{s.supplier}</td>
                    <td className="px-3 py-2.5">{s.origin}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{num(s.quantityT)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{usd(s.unitPrice)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{usd(s.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Sample shows February 2026 records. Connect the full Datamyne extract for three year
            monthly history.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
