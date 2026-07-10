import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  AlertTriangle,
  Beaker,
  ExternalLink,
  Factory,
  FlaskConical,
  Globe,
  Globe2,
  Layers,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle, Chip, tooltipStyle } from "@/components/ui/primitives";
import { cn, slug } from "@/lib/utils";
import { products } from "@/data/products";
import { classifyProduct } from "@/lib/apacCategory";
import { research } from "@/data/research";
import { verifiedFor } from "@/data/verified";
import { AiProductSearch } from "@/components/knowledge/AiProductSearch";
import { AiProductProfile } from "@/components/knowledge/AiProductProfile";
import type { AiProfile } from "@/lib/aiResearch";
import { searchLiterature, type Paper } from "@/lib/openalex";
import { chatComplete } from "@/lib/openrouter";
import { loadAiConfig, hasApiKey } from "@/lib/aiConfig";

const donutColors = ["#F47920", "#F9A663", "#FBBF24", "#94A3B8", "#CBD5E1", "#E2E8F0"];
const routeColors = ["#F47920", "#F9A663", "#FBBF24", "#94A3B8"];

// Research entries are keyed by product name; index by slug for quick lookup.
const researchBySlug = new Map(research.map((r) => [slug(r.name), r]));

export default function KnowledgeBase() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedId, setSelectedId] = useState(slug(products[0].name));
  const [aiProfile, setAiProfile] = useState<AiProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"product" | "literature">("product");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [litLoading, setLitLoading] = useState(false);
  const [litSummary, setLitSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const litAbortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { litAbortRef.current?.abort(); }, []);

  async function fetchLiterature() {
    litAbortRef.current?.abort();
    const controller = new AbortController();
    litAbortRef.current = controller;

    setLitLoading(true);
    setPapers([]);
    setLitSummary(null);

    let results: Paper[] = [];
    try {
      results = await searchLiterature(product.name, controller.signal);
    } finally {
      if (litAbortRef.current === controller) setLitLoading(false);
    }
    setPapers(results);

    if (results.length === 0) return;

    // Claude summary of the paper abstracts
    const cfg = loadAiConfig();
    if (!hasApiKey(cfg)) return;

    setSummaryLoading(true);
    const abstracts = results
      .map(
        (p, i) =>
          `[${i + 1}] "${p.title}" (${p.year ?? "n/d"})\n${p.abstract.slice(0, 400)}`,
      )
      .join("\n\n");

    try {
      const summary = await chatComplete(
        cfg,
        [
          {
            role: "system",
            content: [
              "You are a chemical process researcher summarising scientific literature.",
              "Given a list of paper titles and abstracts about a chemical, write a plain-text summary (max 150 words, no markdown, no bullet points) covering:",
              "1. The main industrial synthesis approaches mentioned",
              "2. Key precursors or reagents used in recent work",
              "3. Any notable improvements, catalysts, or conditions reported",
              "Be factual and concise. Do not pad or repeat.",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Chemical: ${product.name}\n\nPapers:\n${abstracts}\n\nWrite the summary.`,
          },
        ],
        controller.signal,
      );
      setLitSummary(summary.trim());
    } catch {
      // summary is optional, if it fails just show papers
    } finally {
      if (litAbortRef.current === controller) setSummaryLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.hsCode.includes(q) || p.cas.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")),
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

  return (
    <AppShell
      title="Product Knowledge Base"
      subtitle="Manufacturing routes, process, cost drivers, end use, manufacturers and pricing per product."
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
      <>
        {/* Tab bar */}
        <div className="mb-4 flex gap-1 border-b border-border">
          {(["product", "literature"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition border-b-2 -mb-px",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === "product" ? "Product" : "Literature"}
            </button>
          ))}
        </div>

        {activeTab === "product" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product, HS code or CAS no."
                className="h-9 w-full rounded-md border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-2 text-[11px] text-muted-foreground">{filtered.length} products</p>
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
              {filtered.map((p) => {
                const id = slug(p.name);
                const active = id === selectedId;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setSelectedId(id)}
                      className={cn(
                        "w-full rounded-md border px-3 py-2.5 text-left transition",
                        active ? "border-primary bg-accent" : "border-transparent hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{p.name}</span>
                        {verifiedFor(id) ? <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : null}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-muted-foreground">HS {p.hsCode}</span>
                        <Badge tone="softOrange">{p.priceIndicative.replace("USD ", "")}</Badge>
                      </div>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-muted-foreground">No products match.</li>
              ) : null}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Identity + price header */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Chip>HS {product.hsCode}</Chip>
                    <Chip>CAS {product.cas}</Chip>
                    <Badge tone="softOrange">{classifyProduct(product).category}</Badge>
                    <Badge tone="gray">{product.plantType} plant</Badge>
                    {ver ? (
                      <Badge tone="green">Web-verified routes &amp; makers</Badge>
                    ) : (
                      <Badge tone={product.verified === false ? "amber" : "green"}>
                        {product.verified === false ? "Chapter reference chemistry" : "Verified chemistry"}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge tone="orange" className="text-sm">
                  {product.priceIndicative}
                </Badge>
              </div>
              {item?.overview ? (
                <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{item.overview}</p>
              ) : null}
              {!ver && product.verified === false ? (
                <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Price, key manufacturers and HS code are real, from your Datamyne trade data. The
                  manufacturing route, cost drivers and end use split below are HS chapter level reference
                  estimates, not verified for this specific molecule. See Sources below.
                </p>
              ) : null}
              {item ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Globe2 className="h-3.5 w-3.5 text-primary" /> Global Capacity
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{item.globalCapacity}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Layers className="h-3.5 w-3.5 text-primary" /> Key Feedstock
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {item.feedstock.map((f) => (
                        <span key={f} className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Web-verified routes + predominant process */}
          {ver ? (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified Manufacturing Routes
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Major industrial processes, verified from public sources (June 2026)</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {ver.routes.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <span className="text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Predominant process, {ver.mainProcess.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">{ver.mainProcess.detail}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Route breakdown chart (research) */}
          {item ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Primary Industrial Routes</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Share of global output by route, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={Math.max(120, item.primaryRoutes.length * 52)}>
                  <BarChart data={item.primaryRoutes} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: "#1E293B" }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                    <Bar dataKey="share" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      {item.primaryRoutes.map((_, i) => (
                        <Cell key={i} fill={routeColors[i % routeColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <ul className="mt-3 space-y-2">
                  {item.primaryRoutes.map((r, i) => (
                    <li key={r.name} className="flex gap-2 text-sm">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: routeColors[i % routeColors.length] }} />
                      <span>
                        <span className="font-medium text-foreground">{r.name}.</span>{" "}
                        <span className="text-muted-foreground">{r.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
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
          )}

          {/* Full process steps (research) */}
          {item ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Full Manufacturing Process</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Step by step, with typical operating conditions</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ol className="space-y-4">
                  {item.process.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium text-foreground">{step.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                        {step.conditions ? (
                          <p className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                            <FlaskConical className="h-3 w-3 text-primary" />
                            {step.conditions}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {/* Cost drivers + end use */}
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
                <CardTitle>Applications and End Use</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Demand share, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                {/* APAC category classification for this product */}
                {(() => {
                  const cat = classifyProduct(product);
                  return (
                    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2">
                      <Layers className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        APAC category
                      </span>
                      <span className="text-sm font-semibold text-ink">{cat.category}</span>
                      <span className="text-xs text-muted-foreground">· {cat.group}</span>
                    </div>
                  );
                })()}
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

          {/* Country method preference (research) */}
          {item ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Country by Country Method Preference</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Where it is made, the share of global capacity, and the route each region prefers
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={Math.max(140, item.countryMethods.length * 44)}>
                  <BarChart data={item.countryMethods} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis type="category" dataKey="country" width={120} tick={{ fontSize: 11, fill: "#1E293B" }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Capacity"]} />
                    <Bar dataKey="share" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      {item.countryMethods.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60 text-left text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Country</th>
                        <th className="px-3 py-2 text-right font-medium">Capacity</th>
                        <th className="px-3 py-2 font-medium">Preferred Method</th>
                        <th className="px-3 py-2 font-medium">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.countryMethods.map((c) => (
                        <tr key={c.country} className="border-t border-border">
                          <td className="px-3 py-2.5 font-medium">{c.country}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.share}%</td>
                          <td className="px-3 py-2.5">{c.method}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{c.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Specs + hazards (research) */}
          {item ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quality Specifications</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-2">
                    {item.qualitySpecs.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                        <Beaker className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Handling and Hazards</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="flex items-start gap-2 text-sm text-foreground">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item.hazards}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Verify against the supplier safety data sheet and local transport rules before procurement.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Manufacturers, web-verified hyperlinks when available */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Major Manufacturers</CardTitle>
              {ver ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Leading global producers from web research, links open each company&apos;s official site
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="pt-2">
              {ver ? (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {ver.manufacturers.map((m) => (
                    <li key={m.url + m.name}>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 transition hover:border-primary hover:bg-muted"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-primary">
                          <Factory className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">{m.name}</span>
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
                    <Chip key={p}>
                      <Factory className="h-3 w-3 text-primary" />
                      {p}
                    </Chip>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
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

          {/* Sources */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-xs text-muted-foreground">
              {ver ? (
                <div className="mb-3">
                  <p className="font-medium text-foreground">Web research (routes, process &amp; manufacturers):</p>
                  <ul className="mt-1.5 space-y-1">
                    {ver.sources.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {s.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">From your trade data (Datamyne):</span>{" "}
                  product name, HS code, indicative price and range, aggregated from the uploaded import and
                  export records.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    {ver
                      ? "Web-verified chemistry:"
                      : product.verified === false
                        ? "HS chapter reference templates:"
                        : "Verified chemical references:"}
                  </span>{" "}
                  {ver
                    ? "manufacturing routes, the predominant-process explanation and the major manufacturers above were verified from the public web sources listed here (June 2026). Confirm a manufacturer's current status and a supplier technical data sheet before engagement."
                    : product.verified === false
                      ? "manufacturing route, cost drivers and end use industries are typical structures for this HS chapter, not verified for this molecule. Confirm against a supplier technical data sheet or a market report such as ICIS, Nexant or Wood Mackenzie."
                      : "CAS number, manufacturing route, cost drivers and end use split are authored from standard chemical engineering references and public market data."}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        </div>
        ) : (
          /* Literature tab */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { fetchLiterature().catch((e: unknown) => { if ((e as Error)?.name !== "AbortError") throw e; }); }}
                disabled={litLoading}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {litLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                {litLoading ? "Searching OpenAlex…" : papers.length ? "Refresh" : "Fetch Literature"}
              </button>
              {papers.length > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {papers.length} papers for <strong>{product.name}</strong>
                </span>
              ) : null}
            </div>

            {!litLoading && papers.length === 0 && !litSummary ? (
              <p className="text-sm text-muted-foreground">
                No literature found for <strong>{product.name}</strong>, try the AI Search above for a broader research profile.
              </p>
            ) : null}

            {/* AI synthesis summary */}
            {(litSummary || summaryLoading) ? (
              <Card className="border-primary/30">
                <CardContent className="p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Literature Summary
                  </p>
                  {summaryLoading ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Synthesising insights…
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-foreground">{litSummary}</p>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Paper cards */}
            {papers.map((paper) => (
              <Card key={paper.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {paper.doi ? (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group inline-flex items-start gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          {paper.title}
                          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{paper.title}</p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {paper.authors.join(", ")}
                        {paper.year ? ` · ${paper.year}` : ""}
                        {paper.journal ? ` · ${paper.journal}` : ""}
                      </p>
                    </div>
                  </div>
                  {paper.abstract ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {paper.abstract}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </>
      )}
    </AppShell>
  );
}
