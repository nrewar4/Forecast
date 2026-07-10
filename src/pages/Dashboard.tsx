import { useMemo } from "react";
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
import { ArrowUpRight, Beaker, FlaskConical, Globe2, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui/primitives";
import { KpiCard } from "@/components/ui/Kpi";
import { ImpactNews } from "@/components/knowledge/ImpactNews";
import { CHEM_TRADE_QUERIES } from "@/lib/news";
import { compact } from "@/lib/utils";
import { CHEMICAL_EXPORTS, GLOBAL_CHEMICAL, DATA_YEAR } from "@/data/chemicalTrade";

const ORANGE = "#F47920";
const ORANGE_SOFT = "#F9A663";
const INK = "#334155";

const usd = (n: number) => "$" + compact(n);

export default function Dashboard() {
  const ranked = useMemo(() => [...CHEMICAL_EXPORTS].sort((a, b) => b.exports - a.exports), []);
  const combined = ranked.reduce((n, c) => n + c.exports, 0);
  const topExporter = ranked[0];

  const barData = ranked.map((c) => ({
    name: c.name,
    value: c.exports,
    share: (c.exports / GLOBAL_CHEMICAL.total) * 100,
  }));

  const split = [
    { name: "Organic (HS 29)", value: GLOBAL_CHEMICAL.organic },
    { name: "Inorganic (HS 28)", value: GLOBAL_CHEMICAL.inorganic },
  ];

  return (
    <AppShell
      title="Market Overview"
      centerHeader
      subtitle="Chemical exports for the key markets, inorganic (HS 28) and organic (HS 29) combined."
    >
      {/* Source line */}
      <div className="mb-6 text-center text-xs text-muted-foreground">
        Chemical exports, {DATA_YEAR}. Source:{" "}
        <a
          href={GLOBAL_CHEMICAL.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-primary hover:underline"
        >
          {GLOBAL_CHEMICAL.source}
          <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
        </a>
        . Live sector news below.
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={FlaskConical} label="Six-Market Exports" value={usd(combined)} sub={`${DATA_YEAR}, HS 28 and 29`} />
        <KpiCard icon={Globe2} label="Global Chemical Exports" value={usd(GLOBAL_CHEMICAL.total)} sub="all countries" />
        <KpiCard icon={TrendingUp} label="Largest Exporter" value={topExporter.name} sub={usd(topExporter.exports)} />
        <KpiCard icon={Beaker} label="Organic Share" value={`${Math.round((GLOBAL_CHEMICAL.organic / GLOBAL_CHEMICAL.total) * 100)}%`} sub="of world chemical exports" />
      </div>

      {/* Country comparison + global split */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Chemical Exports by Country
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Inorganic and organic chemicals, {DATA_YEAR}</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={usd} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#334155" }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#F8FAFC" }}
                  formatter={(v: number) => [`${usd(v)}  (${((v / GLOBAL_CHEMICAL.total) * 100).toFixed(1)}% of world)`, "Exports"]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? ORANGE : ORANGE_SOFT} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-4 w-4 text-primary" />
              World Split
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Organic vs inorganic, {DATA_YEAR}</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2} stroke="#FFFFFF" strokeWidth={2}>
                  <Cell fill={ORANGE} />
                  <Cell fill={INK} />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => usd(v)} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1.5">
              {split.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-foreground/80">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? ORANGE : INK }} />
                    {s.name}
                  </span>
                  <span className="font-semibold tabular-nums">{usd(s.value)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Per-country cards */}
      <h2 className="mt-8 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        By Market
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ranked.map((c, i) => {
          const share = (c.exports / GLOBAL_CHEMICAL.total) * 100;
          const rel = (c.exports / topExporter.exports) * 100;
          return (
            <Card key={c.code} className="transition-colors duration-200 hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span aria-hidden className="text-2xl leading-none">{c.flag}</span>
                    <span className="text-base font-semibold text-ink">{c.name}</span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    #{i + 1} of six
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold tabular-nums tracking-tight text-primary">{usd(c.exports)}</p>
                <p className="text-xs text-muted-foreground">chemical exports, {DATA_YEAR}</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(6, rel)}%` }} />
                </div>
                <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">
                  {share.toFixed(1)}% of world chemical exports
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent impactful news, live */}
      <ImpactNews queries={CHEM_TRADE_QUERIES} />

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Trade figures are inorganic (HS 28) plus organic (HS 29) chemical exports for {DATA_YEAR}, from ITC Trade
        Map. Datamyne shipment records remain available under Trade Analytics and Documents.
      </p>
    </AppShell>
  );
}
