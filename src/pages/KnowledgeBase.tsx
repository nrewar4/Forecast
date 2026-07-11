import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ExternalLink, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { tooltipStyle } from "@/components/ui/primitives";
import { cn, slug } from "@/lib/utils";
import { products } from "@/data/products";
import { classifyProduct } from "@/lib/apacCategory";
import { research } from "@/data/research";
import { verifiedFor } from "@/data/verified";
import { AiProductSearch } from "@/components/knowledge/AiProductSearch";
import { AiProductProfile } from "@/components/knowledge/AiProductProfile";
import type { AiProfile } from "@/lib/aiResearch";

// One warm accent plus a neutral ramp, so the charts read as a single system
// rather than a rainbow. Ranked bars fade from full orange to a light warm grey.
const ORANGE = "#F47920";
function rankFill(i: number, n: number): string {
  const t = n <= 1 ? 0 : i / (n - 1);
  return `hsl(24 88% ${52 + t * 28}%)`; // 52% -> 80% lightness
}
const DONUT = ["#F47920", "#F6934A", "#F9B57E", "#CBD5E1", "#94A3B8", "#E2E8F0"];

const researchBySlug = new Map(research.map((r) => [slug(r.name), r]));

export default function KnowledgeBase() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedId, setSelectedId] = useState(slug(products[0].name));
  const [aiProfile, setAiProfile] = useState<AiProfile | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.hsCode.includes(q) ||
        p.cas.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")),
    );
  }, [query]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q === null) return;
    setQuery(q);
    const match = products.find(
      (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.hsCode.includes(q),
    );
    if (match) setSelectedId(slug(match.name));
  }, [searchParams]);

  const product = products.find((p) => slug(p.name) === selectedId) ?? products[0];
  const item = researchBySlug.get(selectedId);
  const ver = verifiedFor(selectedId);
  const category = classifyProduct(product);

  return (
    <AppShell
      title="Product Discovery"
      subtitle="Search 8,900+ products for manufacturing routes, process chemistry, cost drivers and end uses."
    >
      <AiProductSearch
        onPick={(name) => {
          setAiProfile(null);
          setQuery("");
          setSelectedId(slug(name));
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAiProfile={(profile) => {
          setAiProfile(profile);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {aiProfile ? (
        <AiProductProfile profile={aiProfile} onClose={() => setAiProfile(null)} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
          {/* Product list */}
          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search product, HS or CAS"
                    className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <p className="mt-2 px-1 text-[11px] text-muted-foreground">
                  {filtered.length.toLocaleString()} of {products.length.toLocaleString()} products
                </p>
              </div>
              <ul className="max-h-[68vh] overflow-y-auto p-1.5">
                {filtered.map((p) => {
                  const id = slug(p.name);
                  const active = id === selectedId;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => setSelectedId(id)}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-lg border-l-2 px-2.5 py-2 text-left transition",
                          active
                            ? "border-primary bg-accent"
                            : "border-transparent hover:bg-muted",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className={cn("block truncate text-sm", active ? "font-semibold text-ink" : "font-medium text-foreground")}>
                            {p.name}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">HS {p.hsCode}</span>
                        </span>
                        {verifiedFor(id) ? <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : null}
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 ? (
                  <li className="px-3 py-4 text-sm text-muted-foreground">No products match.</li>
                ) : null}
              </ul>
            </div>
          </aside>

          {/* Detail: one flowing panel, sections divided by hairlines */}
          <article key={selectedId} className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card">
            {/* Hero */}
            <div className="p-6 md:p-7">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-muted-foreground">
                <span className="font-mono uppercase tracking-wide text-primary">{category.category}</span>
                <span className="text-border">·</span>
                <span>{category.group}</span>
              </div>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-ink md:text-[28px]">{product.name}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <Meta label="HS" value={product.hsCode} />
                <Meta label="CAS" value={product.cas} />
                <Meta label="Plant" value={`${product.plantType}`} />
                {ver ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> Web-verified routes
                  </span>
                ) : (
                  <span className={cn(
                    "inline-flex items-center rounded-md border px-2 py-1 font-medium",
                    product.verified === false
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-border bg-muted text-muted-foreground",
                  )}>
                    {product.verified === false ? "Chapter reference" : "Verified chemistry"}
                  </span>
                )}
              </div>

              {item?.overview ? (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{item.overview}</p>
              ) : null}

              {!ver && product.verified === false ? (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
                  Price, key manufacturers and HS code are real, from the trade data. The route, cost drivers
                  and end-use split below are HS-chapter reference estimates, not verified for this molecule.
                </p>
              ) : null}

              {item ? (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Global capacity</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{item.globalCapacity}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Key feedstock</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {item.feedstock.map((f) => (
                        <span key={f} className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-foreground shadow-card">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Verified routes */}
            {ver ? (
              <Section eyebrow="Verified from public sources" title="Manufacturing routes">
                <ul className="space-y-2">
                  {ver.routes.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl border border-primary/20 bg-accent/40 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Predominant process, {ver.mainProcess.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">{ver.mainProcess.detail}</p>
                </div>
              </Section>
            ) : null}

            {/* Primary industrial routes */}
            {item ? (
              <Section eyebrow="Share of global output" title="Primary industrial routes">
                <ResponsiveContainer width="100%" height={Math.max(120, item.primaryRoutes.length * 46)}>
                  <BarChart data={item.primaryRoutes} layout="vertical" margin={{ top: 0, right: 36, left: 8, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                    <Bar dataKey="share" radius={[0, 5, 5, 0]} isAnimationActive={false} label={{ position: "right", fontSize: 11, fill: "#64748B", formatter: (v: number) => `${v}%` }}>
                      {item.primaryRoutes.map((_, i) => (
                        <Cell key={i} fill={rankFill(i, item.primaryRoutes.length)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ul className="mt-3 space-y-1.5">
                  {item.primaryRoutes.map((r, i) => (
                    <li key={r.name} className="flex gap-2 text-sm">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: rankFill(i, item.primaryRoutes.length) }} />
                      <span className="leading-snug">
                        <span className="font-medium text-foreground">{r.name}.</span>{" "}
                        <span className="text-muted-foreground">{r.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : (
              <Section title="Manufacturing route">
                <ol className="space-y-3">
                  {product.route.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent font-mono text-[11px] font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-sm leading-snug text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* Full process */}
            {item ? (
              <Section eyebrow="Step by step, with operating conditions" title="Full manufacturing process">
                <ol className="space-y-4">
                  {item.process.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-mono text-[11px] font-semibold text-primary">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-sm font-semibold text-ink">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{step.detail}</p>
                        {step.conditions ? (
                          <p className="mt-1.5 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                            {step.conditions}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            {/* Cost drivers + end use */}
            <Section title="Cost drivers and end use">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Share of variable cost</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={product.costDrivers} dataKey="percent" nameKey="label" innerRadius={52} outerRadius={82} paddingAngle={2} stroke="#ffffff" strokeWidth={2} isAnimationActive={false}>
                        {product.costDrivers.map((_, i) => (
                          <Cell key={i} fill={DONUT[i % DONUT.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [`${v}%`, String(n)]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                    {product.costDrivers.map((c, i) => (
                      <div key={c.label} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: DONUT[i % DONUT.length] }} />
                        <span className="truncate text-muted-foreground">{c.label}</span>
                        <span className="ml-auto font-semibold tabular-nums text-foreground">{c.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Demand share by end use</p>
                  <ResponsiveContainer width="100%" height={Math.max(180, product.industries.length * 40)}>
                    <BarChart data={product.industries} layout="vertical" margin={{ top: 0, right: 32, left: 8, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                      <Bar dataKey="percent" radius={[0, 5, 5, 0]} isAnimationActive={false} label={{ position: "right", fontSize: 11, fill: "#64748B", formatter: (v: number) => `${v}%` }}>
                        {product.industries.map((_, i) => (
                          <Cell key={i} fill={rankFill(i, product.industries.length)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>

            {/* Country method preference */}
            {item ? (
              <Section eyebrow="Where it is made and how" title="Regional method preference">
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-semibold">Country</th>
                        <th className="px-3 py-2 text-right font-semibold">Capacity</th>
                        <th className="px-3 py-2 font-semibold">Preferred method</th>
                        <th className="px-3 py-2 font-semibold">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.countryMethods.map((c) => (
                        <tr key={c.country} className="border-t border-border">
                          <td className="px-3 py-2.5 font-medium text-foreground">{c.country}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{c.share}%</td>
                          <td className="px-3 py-2.5 text-foreground">{c.method}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{c.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            ) : null}

            {/* Specs + hazards */}
            {item ? (
              <Section title="Quality and handling">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Quality specifications</p>
                    <ul className="space-y-1.5">
                      {item.qualitySpecs.map((s) => (
                        <li key={s} className="flex gap-2 text-sm text-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span className="leading-snug">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Handling and hazards</p>
                    <p className="text-sm leading-snug text-foreground">{item.hazards}</p>
                    <p className="mt-2.5 text-xs text-muted-foreground">
                      Verify against the supplier safety data sheet and local transport rules before procurement.
                    </p>
                  </div>
                </div>
              </Section>
            ) : null}

            {/* Manufacturers */}
            <Section title="Major manufacturers" hint={ver ? "Leading producers from web research; links open each company's site." : undefined}>
              {ver ? (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {ver.manufacturers.map((m) => (
                    <li key={m.url + m.name}>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="press group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 transition hover:border-primary/50 hover:bg-muted"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">{m.name}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">{m.url.replace(/^https?:\/\//, "")}</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.producers.map((p) => (
                    <span key={p} className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </Section>

            {/* Pricing */}
            <Section title="Indicative pricing">
              <div className="flex flex-wrap items-end gap-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Range</p>
                  <p className="mt-0.5 text-lg font-semibold text-foreground">{product.priceRange}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Indicative</p>
                  <p className="mt-0.5 text-lg font-semibold text-primary">{product.priceIndicative}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Trade-based median; refine with an ICIS or Platts quotation.
              </p>
            </Section>

            {/* Sources */}
            <Section title="Sources">
              <div className="space-y-3 text-xs text-muted-foreground">
                {ver ? (
                  <div>
                    <p className="font-medium text-foreground">Web research (routes, process and manufacturers)</p>
                    <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                      {ver.sources.map((s) => (
                        <li key={s.url}>
                          <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-primary hover:underline">
                            {s.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p>
                  <span className="font-medium text-foreground">Trade data:</span> product name, HS code and
                  indicative pricing, aggregated from import and export records.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    {ver ? "Web-verified chemistry:" : product.verified === false ? "HS-chapter reference:" : "Verified references:"}
                  </span>{" "}
                  {ver
                    ? "routes, the predominant process and the manufacturers above were verified from the public sources listed here. Confirm a supplier technical data sheet before engagement."
                    : product.verified === false
                      ? "route, cost drivers and end-use industries are typical structures for this HS chapter, not verified for this molecule. Confirm against a supplier data sheet or a market report."
                      : "CAS, route, cost drivers and end-use split are drawn from standard chemical engineering references and public market data."}
                </p>
              </div>
            </Section>
          </article>
        </div>
      )}
    </AppShell>
  );
}

// A small labelled meta chip for the hero row.
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-foreground">
      <span className="text-muted-foreground">{label}</span>
      {value}
    </span>
  );
}

// A content section within the detail panel: a quiet eyebrow, a title, an
// optional hint, divided from the section above by a hairline. This replaces the
// old stack of separate boxed cards for a calmer, more legible flow.
function Section({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border p-6 md:p-7">
      <div className="mb-4">
        {eyebrow ? (
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h3 className="mt-1 text-base font-semibold tracking-tight text-ink">{title}</h3>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}
