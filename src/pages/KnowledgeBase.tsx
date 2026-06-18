import { useMemo, useState } from "react";
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
import { Factory, FlaskConical, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle, Chip, tooltipStyle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";

const donutColors = ["#F47920", "#F9A663", "#FBBF24", "#94A3B8", "#CBD5E1", "#E2E8F0"];

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [selectedHs, setSelectedHs] = useState(products[0].hsCode);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.hsCode.includes(q),
    );
  }, [query]);

  const product = products.find((p) => p.hsCode === selectedHs) ?? products[0];

  return (
    <AppShell
      title="Product Knowledge Base"
      subtitle="Manufacturing routes, cost drivers, end use industries, and pricing per product."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product or HS code"
                className="h-9 w-full rounded-md border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {filtered.map((p) => {
                const active = p.hsCode === selectedHs;
                return (
                  <li key={p.hsCode}>
                    <button
                      onClick={() => setSelectedHs(p.hsCode)}
                      className={cn(
                        "w-full rounded-md border px-3 py-2.5 text-left transition",
                        active
                          ? "border-primary bg-accent"
                          : "border-transparent hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{p.name}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-muted-foreground">HS {p.hsCode}</span>
                        <Badge tone="softOrange">{p.priceIndicative.replace("USD ", "")}</Badge>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Chip>HS {product.hsCode}</Chip>
                    <Chip>CAS {product.cas}</Chip>
                    <Badge tone="gray">{product.plantType} plant</Badge>
                  </div>
                </div>
                <Badge tone="orange" className="text-sm">
                  {product.priceIndicative}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Manufacturing Route</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="space-y-3">
                {product.route.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cost Drivers</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Share of variable cost, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={product.costDrivers} dataKey="percent" nameKey="label" innerRadius={50} outerRadius={82} paddingAngle={2} stroke="#ffffff" strokeWidth={2} isAnimationActive={false}>
                      {product.costDrivers.map((_, i) => (
                        <Cell key={i} fill={donutColors[i % donutColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [`${v}%`, String(n)]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                  {product.costDrivers.map((c, i) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: donutColors[i % donutColors.length] }} />
                      <span className="truncate text-muted-foreground">{c.label}</span>
                      <span className="ml-auto font-semibold text-foreground">{c.percent}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>End Use Industries</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Demand share, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={product.industries} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: "#1E293B" }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                    <Bar dataKey="percent" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      {product.industries.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Key Manufacturers</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-wrap gap-2">
                {product.producers.map((p) => (
                  <Chip key={p}>
                    <Factory className="h-3 w-3 text-primary" />
                    {p}
                  </Chip>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Range</p>
                  <p className="mt-0.5 text-lg font-semibold text-foreground">{product.priceRange}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Indicative</p>
                  <p className="mt-0.5 text-lg font-semibold text-primary">{product.priceIndicative}</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <FlaskConical className="h-3.5 w-3.5 text-primary" />
                Trade based median from Datamyne, refine with ICIS or Platts quotations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
