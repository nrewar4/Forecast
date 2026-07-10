import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
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
import {
  ArrowDown,
  ArrowUp,
  Boxes,
  ChevronRight,
  ExternalLink,
  Factory,
  Globe2,
  Layers,
  Package,
  Scale,
  Search,
  ShieldCheck,
  Tag,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle, Chip, tooltipStyle } from "@/components/ui/primitives";
import { KpiChip } from "@/components/ui/Kpi";
import { cn, compact, num, slug } from "@/lib/utils";
import { type Mode, type Shipment } from "@/data/trade";
import { products as catalogProducts } from "@/data/products";
import { verifiedFor } from "@/data/verified";
import { useTradeData } from "@/context/TradeData";
import { useCurrency } from "@/context/Currency";

const sectorColors = [
  "#F47920", "#F9A663", "#FBBF24", "#34D399", "#60A5FA",
  "#A78BFA", "#F472B6", "#94A3B8", "#CBD5E1", "#E2E8F0",
];

type Metric = "value" | "volume";

type ProductRow = {
  product: string;
  hsCode: string;
  sector: string;
  value: number; // USD
  volume: number; // tonnes
  shipments: number;
  countries: number;
  estimated: boolean;
};

export default function TradeAnalytics() {
  const { shipments } = useTradeData();
  const { money, convert, symbol, currency } = useCurrency();

  const [mode, setMode] = useState<Mode>("Imports");
  const [metric, setMetric] = useState<Metric>("value");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string | null>(null);

  const isValue = metric === "value";

  // Formatters. Value series stay in USD and only labels convert, so switching
  // currency never changes the proportions of a bar.
  const fmtAxis = (n: number) => (isValue ? compact(convert(n)) : compact(n));
  const fmtTip = (n: number) => (isValue ? symbol + compact(convert(n)) : num(Math.round(n)) + " t");
  const fmtMetric = (n: number) => (isValue ? money(n) : `${num(Math.round(n))} t`);

  const inMode = useMemo(() => shipments.filter((s) => s.mode === mode), [shipments, mode]);
  const sectorOptions = useMemo(
    () => Array.from(new Set(inMode.map((s) => s.sector))).sort(),
    [inMode],
  );
  const countryOptions = useMemo(
    () => Array.from(new Set(inMode.map((s) => s.origin))).sort(),
    [inMode],
  );

  // Rows after the structural filters (mode/sector/country), drives KPIs & charts.
  const filtered = useMemo(() => {
    let rows = inMode;
    if (sector !== "all") rows = rows.filter((r) => r.sector === sector);
    if (country !== "all") rows = rows.filter((r) => r.origin === country);
    return rows;
  }, [inMode, sector, country]);

  // Aggregate shipments into one row per product: total volume and value.
  const products = useMemo<ProductRow[]>(() => {
    const map = new Map<string, ProductRow & { _c: Set<string> }>();
    for (const r of filtered) {
      const key = r.product + "|" + r.hsCode;
      let e = map.get(key);
      if (!e) {
        e = {
          product: r.product,
          hsCode: r.hsCode,
          sector: r.sector,
          value: 0,
          volume: 0,
          shipments: 0,
          countries: 0,
          estimated: false,
          _c: new Set<string>(),
        };
        map.set(key, e);
      }
      e.value += r.totalValue;
      e.volume += r.quantityT;
      e.shipments += 1;
      e._c.add(r.origin);
      if (r.estimated) e.estimated = true;
    }
    return Array.from(map.values()).map(({ _c, ...rest }) => ({ ...rest, countries: _c.size }));
  }, [filtered]);

  const metricOf = (p: { value: number; volume: number }) => (isValue ? p.value : p.volume);

  const totalValue = filtered.reduce((s, r) => s + r.totalValue, 0);
  const totalVolume = filtered.reduce((s, r) => s + r.quantityT, 0);
  const avgUnit = totalVolume ? Math.round(totalValue / totalVolume) : 0;
  const metricTotal = isValue ? totalValue : totalVolume;
  const estimatedCount = filtered.filter((r) => r.estimated).length;

  // Product list for the table: search-filtered and sorted by the active metric.
  const tableRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = products;
    if (q) {
      rows = rows.filter(
        (p) => p.product.toLowerCase().includes(q) || p.hsCode.includes(q),
      );
    }
    return rows
      .slice()
      .sort((a, b) => (sortDir === "asc" ? metricOf(a) - metricOf(b) : metricOf(b) - metricOf(a)));
  }, [products, query, sortDir, metric]);

  // Top 12 products by the active metric for the headline chart.
  const topProducts = useMemo(
    () =>
      products
        .slice()
        .sort((a, b) => metricOf(b) - metricOf(a))
        .slice(0, 12)
        .map((p) => ({
          name: p.product.length > 26 ? p.product.slice(0, 25) + "…" : p.product,
          full: p.product,
          metric: metricOf(p),
        })),
    [products, metric],
  );

  // Sector split by the active metric.
  const sectorSplit = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.sector, (map.get(p.sector) ?? 0) + metricOf(p)));
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    return Array.from(map, ([name, val]) => ({ name, val, pct: Math.round((val / total) * 100) }))
      .sort((a, b) => b.val - a.val);
  }, [products, metric]);

  // Country split by the active metric.
  const countrySplit = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => map.set(r.origin, (map.get(r.origin) ?? 0) + (isValue ? r.totalValue : r.quantityT)));
    return Array.from(map, ([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 10);
  }, [filtered, metric]);

  const selectedRows: Shipment[] = useMemo(
    () => (selected ? filtered.filter((r) => r.product === selected) : []),
    [filtered, selected],
  );

  // Catalog/verified knowledge for the selected product, if we have it.
  const selCatalog = useMemo(() => (selected ? catalogProducts.find((p) => p.name === selected) : undefined), [selected]);
  const selVer = useMemo(() => (selected ? verifiedFor(slug(selected)) : undefined), [selected]);
  const selStats = useMemo(() => {
    const v = selectedRows.reduce((s, r) => s + r.totalValue, 0);
    const q = selectedRows.reduce((s, r) => s + r.quantityT, 0);
    const origins = new Set(selectedRows.map((r) => r.origin).filter((x) => x && x !== "Unknown"));
    const buyers = new Set(selectedRows.map((r) => r.importer).filter((x) => x && x !== "Unknown"));
    const suppliers = new Set(selectedRows.map((r) => r.supplier).filter((x) => x && x !== "Unknown"));
    return { v, q, avg: q ? Math.round(v / q) : 0, origins: origins.size, buyers: buyers.size, suppliers: suppliers.size };
  }, [selectedRows]);

  // When a product is selected, bring its detail panel into view.
  const detailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  function resetFilters() {
    setSector("all");
    setCountry("all");
    setQuery("");
    setSelected(null);
  }

  const selectClass =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[150px]";

  return (
    <AppShell
      title="Trade Analytics"
      subtitle="How much of each product is traded, by volume and value."
    >
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-card">
            {(["Imports", "Exports"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  resetFilters();
                }}
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

          <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-card">
            {([
              ["value", "By Value"],
              ["volume", "By Volume"],
            ] as [Metric, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition",
                  metric === m
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="all">All Sectors</option>
            {sectorOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select className={selectClass} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All {mode === "Imports" ? "Origins" : "Destinations"}</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiChip
          icon={Wallet}
          label="Total Trade Value"
          value={money(totalValue)}
          sub={`${mode.toLowerCase()}${estimatedCount ? `, incl. ${num(estimatedCount)} assumed` : ""}`}
        />
        <KpiChip icon={Scale} label="Total Volume" value={`${num(Math.round(totalVolume))} t`} sub={`${mode.toLowerCase()} tonnage`} />
        <KpiChip icon={Package} label="Products Traded" value={num(products.length)} sub={`${num(filtered.length)} shipment rows`} />
        <KpiChip icon={Tag} label="Avg Unit Price" value={money(avgUnit)} sub="per tonne, weighted" />
      </div>

      {/* Headline: top products by chosen metric */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle>Top Products by {isValue ? "Value" : "Volume"}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Largest {mode.toLowerCase()} products, {isValue ? `total value (${currency})` : "total quantity (tonnes)"}
            </p>
          </div>
          <Badge tone="softOrange">{metric === "value" ? "USD" : "Tonnes"}</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          {topProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No records match the filters.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(220, topProducts.length * 30)}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 4, right: 64, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={fmtAxis} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={200}
                  tick={{ fontSize: 11, fill: "#1E293B" }}
                  interval={0}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#F8FAFC" }}
                  formatter={(v: number) => [fmtTip(v), isValue ? "Value" : "Volume"]}
                  labelFormatter={(_, p) => (p && p[0] ? (p[0].payload as { full: string }).full : "")}
                />
                <Bar dataKey="metric" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {topProducts.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Sector + country split */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trade by Sector</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Share of {isValue ? "value" : "volume"} by product sector
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {sectorSplit.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No records match.</p>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <ResponsiveContainer width="100%" height={210} className="max-w-[230px]">
                  <PieChart>
                    <Pie
                      data={sectorSplit}
                      dataKey="val"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={2}
                      stroke="#ffffff"
                      strokeWidth={2}
                      isAnimationActive={false}
                    >
                      {sectorSplit.map((_, i) => (
                        <Cell key={i} fill={sectorColors[i % sectorColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtTip(v), isValue ? "Value" : "Volume"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid w-full grid-cols-1 gap-1.5 text-xs">
                  {sectorSplit.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: sectorColors[i % sectorColors.length] }} />
                      <span className="truncate text-muted-foreground">{s.name}</span>
                      <span className="ml-auto font-semibold text-foreground">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trade by {mode === "Imports" ? "Origin" : "Destination"}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Top countries by {isValue ? `value (${currency})` : "volume (tonnes)"}
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {countrySplit.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No records match.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(210, countrySplit.length * 26)}>
                <BarChart data={countrySplit} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={fmtAxis} />
                  <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11, fill: "#1E293B" }} interval={0} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [fmtTip(v), isValue ? "Value" : "Volume"]} />
                  <Bar dataKey="val" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                    {countrySplit.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Core: product-by-product volume & value table */}
      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Product Trade Breakdown</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {num(tableRows.length)} products · click a row for its shipments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product or HS code"
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
              />
            </div>
            <button
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="inline-flex shrink-0 items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
              title={`Sort by ${metric}`}
            >
              {isValue ? "Value" : "Volume"}
              {sortDir === "asc" ? <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5" />}
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="max-h-[560px] overflow-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Sector</th>
                  <th className="px-3 py-2 text-right font-medium">Volume (t)</th>
                  <th className="px-3 py-2 text-right font-medium">Value ({currency})</th>
                  <th className="px-3 py-2 text-right font-medium">Avg {symbol}/t</th>
                  <th className="px-3 py-2 text-right font-medium">Share</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((p, i) => {
                  const share = metricTotal ? (metricOf(p) * 100) / metricTotal : 0;
                  const active = selected === p.product;
                  const avg = p.volume ? Math.round(p.value / p.volume) : 0;
                  return (
                    <tr
                      key={p.product + p.hsCode}
                      onClick={() => setSelected(active ? null : p.product)}
                      className={cn(
                        "cursor-pointer border-t border-border transition hover:bg-muted/60",
                        active && "bg-accent",
                      )}
                    >
                      <td className="px-3 py-2.5 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-foreground">{p.product}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">HS {p.hsCode}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{p.sector}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{num(Math.round(p.volume))}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                        {money(p.value)}
                        {p.estimated ? (
                          <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-medium text-amber-700">est</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{avg ? money(avg) : ", "}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, share)}%` }} />
                          </div>
                          <span className="tabular-nums text-xs text-muted-foreground">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition", active && "rotate-90 text-primary")} />
                      </td>
                    </tr>
                  );
                })}
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                      No products match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Drill-down: details + shipments for the selected product */}
      {selected ? (
        <div ref={detailRef} className="scroll-mt-4">
        <Card className="mt-4 border-primary/40">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                {selected}
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {num(selectedRows.length)} {mode.toLowerCase()} shipment{selectedRows.length === 1 ? "" : "s"} ·{" "}
                {num(Math.round(selectedRows.reduce((s, r) => s + r.quantityT, 0)))} t ·{" "}
                {money(selectedRows.reduce((s, r) => s + r.totalValue, 0))}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/knowledge-base?q=${encodeURIComponent(selected)}`}
                className="hidden items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted sm:inline-flex"
              >
                <Layers className="h-3.5 w-3.5 text-primary" /> Knowledge Base
              </Link>
              <button
                onClick={() => setSelected(null)}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { icon: Wallet, label: "Trade value", value: money(selStats.v) },
                { icon: Scale, label: "Volume", value: `${num(Math.round(selStats.q))} t` },
                { icon: Tag, label: `Avg ${symbol}/t`, value: selStats.avg ? money(selStats.avg) : ", " },
                { icon: Boxes, label: "Shipments", value: num(selectedRows.length) },
                { icon: Globe2, label: mode === "Imports" ? "Origins" : "Destinations", value: num(selStats.origins) },
                { icon: Users, label: mode === "Imports" ? "Buyers" : "Suppliers", value: num(mode === "Imports" ? selStats.buyers : selStats.suppliers) },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    <s.icon className="h-3 w-3 text-primary" />
                    {s.label}
                  </div>
                  <p className="mt-1 text-base font-semibold tabular-nums text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Product knowledge profile */}
            {selVer || selCatalog ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Product profile
                  </p>
                  <Link
                    to={`/knowledge-base?q=${encodeURIComponent(selected)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Full Knowledge Base <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                {selCatalog ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Chip>HS {selCatalog.hsCode}</Chip>
                    {selCatalog.cas ? <Chip>CAS {selCatalog.cas}</Chip> : null}
                    <Badge tone="gray">{selCatalog.plantType} plant</Badge>
                    <Badge tone="orange">{selCatalog.priceIndicative}</Badge>
                  </div>
                ) : null}
                {selVer?.routes?.length || selCatalog?.route?.length ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Manufacturing routes</p>
                    <ul className="mt-1 space-y-1">
                      {(selVer?.routes ?? selCatalog?.route ?? []).slice(0, 3).map((r, i) => (
                        <li key={i} className="flex gap-2 text-xs text-foreground">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {selVer?.manufacturers?.length ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Major manufacturers</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {selVer.manufacturers.slice(0, 6).map((m) => (
                        <a
                          key={m.url + m.name}
                          href={m.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground transition hover:border-primary"
                        >
                          <Factory className="h-3 w-3 text-primary" />
                          {m.name}
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : selCatalog?.producers?.length ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Key producers</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {selCatalog.producers.map((pr) => (
                        <Chip key={pr}>
                          <Factory className="h-3 w-3 text-primary" />
                          {pr}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}
                {selCatalog?.industries?.length ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">End-use industries</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {selCatalog.industries.slice(0, 6).map((ind) => (
                        <span key={ind.label} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                          {ind.label} {ind.percent}%
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Shipment records */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Shipment records</p>
              <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 text-left text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">{mode === "Imports" ? "Importer" : "Buyer"}</th>
                    <th className="px-3 py-2 font-medium">Supplier</th>
                    <th className="px-3 py-2 font-medium">{mode === "Imports" ? "Origin" : "Destination"}</th>
                    <th className="px-3 py-2 font-medium">Transport</th>
                    <th className="px-3 py-2 text-right font-medium">Qty (t)</th>
                    <th className="px-3 py-2 text-right font-medium">Unit {symbol}/t</th>
                    <th className="px-3 py-2 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRows
                    .slice()
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .map((s, i) => (
                      <tr key={s.date + s.importer + i} className="border-t border-border">
                        <td className="whitespace-nowrap px-3 py-2.5 font-medium">{s.date}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{s.importer}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{s.supplier}</td>
                        <td className="px-3 py-2.5">{s.origin}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{s.transport}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{num(Math.round(s.quantityT))}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{money(s.unitPrice)}</td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                          {money(s.totalValue)}
                          {s.estimated ? (
                            <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-medium text-amber-700">est</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
