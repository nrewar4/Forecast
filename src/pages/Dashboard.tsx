import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe2,
  Scale,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui/primitives";
import { KpiCard } from "@/components/ui/Kpi";
import { MarketNews } from "@/components/knowledge/MarketNews";
import { useTradeData } from "@/context/TradeData";
import { useCurrency } from "@/context/Currency";
import type { Shipment } from "@/data/trade";
import { compact, num } from "@/lib/utils";

const US = "United States Of America";

type Ranked = { name: string; value: number };

// Top products in a set of rows, by total declared value.
function topProductsBy(rows: Shipment[], n = 5): Ranked[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = r.product.trim();
    if (!k || k === "Unspecified") continue;
    map.set(k, (map.get(k) ?? 0) + r.totalValue);
  }
  return Array.from(map, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

// Top countries by value, looking at each row's origin (trade partner).
function topCountriesBy(rows: Shipment[], n = 6): Ranked[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = r.origin.trim();
    if (!k || k === "Unknown") continue;
    map.set(k, (map.get(k) ?? 0) + r.totalValue);
  }
  return Array.from(map, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

const sum = (rows: Shipment[]) => rows.reduce((a, r) => a + r.totalValue, 0);

export default function Dashboard() {
  const { shipments } = useTradeData();
  const { convert, money, currency } = useCurrency();

  const axisMoney = (usd: number) => compact(convert(usd));

  const imports = useMemo(() => shipments.filter((s) => s.mode === "Imports"), [shipments]);
  const exports = useMemo(() => shipments.filter((s) => s.mode === "Exports"), [shipments]);

  const importValue = useMemo(() => sum(imports), [imports]);
  const exportValue = useMemo(() => sum(exports), [exports]);
  const balance = exportValue - importValue;

  const partners = useMemo(() => {
    const set = new Set<string>();
    for (const s of shipments) if (s.origin && s.origin !== "Unknown") set.add(s.origin);
    return set.size;
  }, [shipments]);
  const productCount = useMemo(() => new Set(shipments.map((s) => s.product)).size, [shipments]);

  // Monthly momentum: declared value per calendar month, imports vs exports.
  const momentum = useMemo(() => {
    const map = new Map<string, { key: string; imports: number; exports: number }>();
    for (const s of shipments) {
      const key = (s.date ?? "").slice(0, 7); // YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(key)) continue;
      const e = map.get(key) ?? { key, imports: 0, exports: 0 };
      if (s.mode === "Imports") e.imports += s.totalValue;
      else e.exports += s.totalValue;
      map.set(key, e);
    }
    return Array.from(map.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((m) => {
        const [y, mo] = m.key.split("-");
        const label = new Date(+y, +mo - 1, 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
        return { label, imports: m.imports, exports: m.exports };
      });
  }, [shipments]);

  // Top sourcing partners (origins of India's imports) by value.
  const sourcing = useMemo(() => topCountriesBy(imports, 10).reverse(), [imports]);

  // India = the whole dataset (Indian import & export records).
  const india = {
    importValue,
    exportValue,
    balance,
    topImports: topProductsBy(imports, 5),
    topExports: topProductsBy(exports, 5),
    topSources: topCountriesBy(imports, 5),
  };

  // US = the subset of trade with the United States.
  const usImports = useMemo(() => imports.filter((s) => s.origin === US), [imports]);
  const usExports = useMemo(() => exports.filter((s) => s.origin === US), [exports]);
  const us = {
    importValue: sum(usImports),
    exportValue: sum(usExports),
    get balance() {
      return this.exportValue - this.importValue;
    },
    topImports: topProductsBy(usImports, 5),
    topExports: topProductsBy(usExports, 5),
    importShare: importValue ? (sum(usImports) / importValue) * 100 : 0,
  };

  const kpis = [
    {
      icon: ArrowDownToLine,
      label: "Import Value",
      value: money(importValue),
      sub: `${num(imports.length)} inbound records`,
    },
    {
      icon: ArrowUpFromLine,
      label: "Export Value",
      value: money(exportValue),
      sub: `${num(exports.length)} outbound records`,
    },
    {
      icon: Scale,
      label: "Trade Balance",
      value: (balance < 0 ? "−" : "+") + money(Math.abs(balance)),
      sub: balance < 0 ? "net import deficit" : "net export surplus",
    },
    {
      icon: Globe2,
      label: "Trading Partners",
      value: num(partners),
      sub: `${num(productCount)} products tracked`,
    },
  ];

  return (
    <AppShell
      title="Market Overview"
      subtitle="India's chemical trade and its trade with the United States, with current industry news."
    >
      <div className="grid animate-fade-up grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} icon={k.icon} label={k.label} value={k.value} sub={k.sub} />
        ))}
      </div>

      {/* Momentum chart + live news */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trade Momentum
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Monthly trade value ({currency}), imports vs exports across the recorded months
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {momentum.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No dated records yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={momentum} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F47920" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#F47920" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={axisMoney} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number, name) => [money(v), name === "imports" ? "Imports" : "Exports"]}
                  />
                  <Area type="monotone" dataKey="imports" stroke="#F47920" strokeWidth={2} fill="url(#impFill)" isAnimationActive={false} />
                  <Area type="monotone" dataKey="exports" stroke="#10B981" strokeWidth={2} fill="url(#expFill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Imports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Exports
              </span>
            </div>
          </CardContent>
        </Card>

        <MarketNews />
      </div>

      {/* India & US market breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MarketBreakdown
          title="India, Market Breakdown"
          subtitle="The full set of recorded chemical trade"
          flag="🇮🇳"
          importValue={india.importValue}
          exportValue={india.exportValue}
          balance={india.balance}
          topImports={india.topImports}
          topExports={india.topExports}
          extraLabel="Top sourcing countries"
          extra={india.topSources}
          money={money}
        />
        <MarketBreakdown
          title="United States, Trade with India"
          subtitle={`US accounts for ${us.importShare.toFixed(1)}% of India's import value`}
          flag="🇺🇸"
          importValue={us.importValue}
          exportValue={us.exportValue}
          balance={us.balance}
          topImports={us.topImports}
          topExports={us.topExports}
          importLabel="Top products India imports from the US"
          exportLabel="Top products India exports to the US"
          money={money}
        />
      </div>

      {/* Geographic: where India sources from */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            Top Sourcing Partners
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Countries India imports the most chemicals from, by value ({currency})
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          {sourcing.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No import records yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(240, sourcing.length * 30)}>
              <BarChart data={sourcing} layout="vertical" margin={{ top: 4, right: 64, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={axisMoney} />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11, fill: "#1E293B" }} interval={0} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [money(v), "Import value"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {sourcing.map((s, i) => (
                    <Cell key={i} fill={s.name === US ? "#1E293B" : i === sourcing.length - 1 ? "#F47920" : "#F9A663"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

// A compact import/export breakdown for one market: headline values, the net
// balance, and the top products on each side (plus an optional extra list).
function MarketBreakdown({
  title,
  subtitle,
  flag,
  importValue,
  exportValue,
  balance,
  topImports,
  topExports,
  importLabel = "Top imported products",
  exportLabel = "Top exported products",
  extraLabel,
  extra,
  money,
}: {
  title: string;
  subtitle: string;
  flag: string;
  importValue: number;
  exportValue: number;
  balance: number;
  topImports: Ranked[];
  topExports: Ranked[];
  importLabel?: string;
  exportLabel?: string;
  extraLabel?: string;
  extra?: Ranked[];
  money: (usd: number) => string;
}) {
  const maxImp = Math.max(1, ...topImports.map((p) => p.value));
  const maxExp = Math.max(1, ...topExports.map((p) => p.value));

  const Bars = ({ rows, max, label }: { rows: Ranked[]; max: number; label: string }) => (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {rows.length === 0 ? (
        <p className="py-2 text-xs text-muted-foreground">No records.</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((p) => (
            <li key={p.name} className="text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground" title={p.name}>{p.name}</span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">{money(p.value)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, (p.value / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span aria-hidden className="text-lg leading-none">{flag}</span>
          {title}
        </CardTitle>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Imports</p>
            <p className="mt-0.5 text-base font-semibold tabular-nums text-foreground">{money(importValue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Exports</p>
            <p className="mt-0.5 text-base font-semibold tabular-nums text-foreground">{money(exportValue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Balance</p>
            <p className={"mt-0.5 text-base font-semibold tabular-nums " + (balance < 0 ? "text-rose-600" : "text-emerald-600")}>
              {(balance < 0 ? "−" : "+") + money(Math.abs(balance))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Bars rows={topImports} max={maxImp} label={importLabel} />
          <Bars rows={topExports} max={maxExp} label={exportLabel} />
        </div>

        {extra && extraLabel ? (
          <div className="border-t border-border pt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{extraLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {extra.map((c) => (
                <span key={c.name} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
                  {c.name}
                  <span className="font-semibold text-muted-foreground">{money(c.value)}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
