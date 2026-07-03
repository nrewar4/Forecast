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
  Globe2,
  Layers,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Chip, tooltipStyle } from "@/components/ui/primitives";
import type { AiProfile } from "@/lib/aiResearch";

const donutColors = ["#F47920", "#F9A663", "#FBBF24", "#94A3B8", "#CBD5E1", "#E2E8F0"];
const routeColors = ["#F47920", "#F9A663", "#FBBF24", "#94A3B8"];

export function AiProductProfile({ profile: p, onClose }: { profile: AiProfile; onClose: () => void }) {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-accent/50 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            <span className="font-semibold">AI-researched profile</span>, not in your catalog. Compiled from the web
            sources listed below; verify before procurement.
          </span>
        </p>
        <button
          onClick={onClose}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" /> Back to catalog
        </button>
      </div>

      {/* Identity */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{p.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {p.hsCode ? <Chip>HS {p.hsCode}</Chip> : null}
                {p.cas ? <Chip>CAS {p.cas}</Chip> : null}
                {p.plantType ? <Badge tone="gray">{p.plantType} plant</Badge> : null}
                <Badge tone="green">Web-researched</Badge>
              </div>
            </div>
            {p.priceIndicative ? (
              <Badge tone="orange" className="text-sm">
                {p.priceIndicative}
              </Badge>
            ) : null}
          </div>
          {p.overview ? <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{p.overview}</p> : null}
          {p.globalCapacity || (p.feedstock && p.feedstock.length) ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {p.globalCapacity ? (
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Globe2 className="h-3.5 w-3.5 text-primary" /> Global Capacity
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">{p.globalCapacity}</p>
                </div>
              ) : null}
              {p.feedstock && p.feedstock.length ? (
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary" /> Key Feedstock
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.feedstock.map((f) => (
                      <span key={f} className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Verified routes + predominant process */}
      {(p.verifiedRoutes && p.verifiedRoutes.length) || p.mainProcess ? (
        <Card className="border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Manufacturing Routes
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Major industrial processes, from web research</p>
          </CardHeader>
          <CardContent className="pt-2">
            {p.verifiedRoutes && p.verifiedRoutes.length ? (
              <ul className="space-y-2">
                {p.verifiedRoutes.map((r, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {p.mainProcess ? (
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Predominant process, {p.mainProcess.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{p.mainProcess.detail}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* Primary industrial routes (chart) */}
      {p.primaryRoutes && p.primaryRoutes.length ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Primary Industrial Routes</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Share of global output by route, percent</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={Math.max(120, p.primaryRoutes.length * 52)}>
              <BarChart data={p.primaryRoutes} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: "#1E293B" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                <Bar dataKey="share" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {p.primaryRoutes.map((_, i) => (
                    <Cell key={i} fill={routeColors[i % routeColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ul className="mt-3 space-y-2">
              {p.primaryRoutes.map((r, i) => (
                <li key={r.name + i} className="flex gap-2 text-sm">
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
      ) : null}

      {/* Full process */}
      {p.process && p.process.length ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Full Manufacturing Process</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Step by step, with typical operating conditions</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ol className="space-y-4">
              {p.process.map((step, i) => (
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
      {(p.costDrivers && p.costDrivers.length) || (p.industries && p.industries.length) ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {p.costDrivers && p.costDrivers.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cost Drivers</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Share of variable cost, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={p.costDrivers} dataKey="percent" nameKey="label" innerRadius={50} outerRadius={82} paddingAngle={2} stroke="#ffffff" strokeWidth={2} isAnimationActive={false}>
                      {p.costDrivers.map((_, i) => (
                        <Cell key={i} fill={donutColors[i % donutColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [`${v}%`, String(n)]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                  {p.costDrivers.map((c, i) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: donutColors[i % donutColors.length] }} />
                      <span className="truncate text-muted-foreground">{c.label}</span>
                      <span className="ml-auto font-semibold text-foreground">{c.percent}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {p.industries && p.industries.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>End Use Industries</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Demand share, percent</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={p.industries} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                    <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: "#1E293B" }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Share"]} />
                    <Bar dataKey="percent" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      {p.industries.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* Country method preference */}
      {p.countryMethods && p.countryMethods.length ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Country by Country Method Preference</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Where it is made, the share of global capacity, and the route each region prefers</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={Math.max(140, p.countryMethods.length * 44)}>
              <BarChart data={p.countryMethods} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis type="category" dataKey="country" width={120} tick={{ fontSize: 11, fill: "#1E293B" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={(v: number) => [`${v}%`, "Capacity"]} />
                <Bar dataKey="share" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {p.countryMethods.map((_, i) => (
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
                  {p.countryMethods.map((c, i) => (
                    <tr key={c.country + i} className="border-t border-border">
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

      {/* Specs + hazards */}
      {(p.qualitySpecs && p.qualitySpecs.length) || p.hazards ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {p.qualitySpecs && p.qualitySpecs.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quality Specifications</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {p.qualitySpecs.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                      <Beaker className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          {p.hazards ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Handling and Hazards</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {p.hazards}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Verify against the supplier safety data sheet and local transport rules before procurement.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* Manufacturers */}
      {p.manufacturers && p.manufacturers.length ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Major Manufacturers</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">Leading global producers from web research, links open each company&apos;s site</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {p.manufacturers.map((m, i) => (
                <li key={(m.url || "") + i}>
                  <a
                    href={m.url || "#"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 transition hover:border-primary hover:bg-muted"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-primary">
                      <Factory className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{m.name}</span>
                      {m.url ? (
                        <span className="block truncate text-[11px] text-muted-foreground">{m.url.replace(/^https?:\/\//, "")}</span>
                      ) : null}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Pricing */}
      {p.priceRange || p.priceIndicative ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-wrap items-center gap-6">
              {p.priceRange ? (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Range</p>
                  <p className="mt-0.5 text-lg font-semibold text-foreground">{p.priceRange}</p>
                </div>
              ) : null}
              {p.priceIndicative ? (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Indicative</p>
                  <p className="mt-0.5 text-lg font-semibold text-primary">{p.priceIndicative}</p>
                </div>
              ) : null}
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <FlaskConical className="h-3.5 w-3.5 text-primary" />
              AI estimate from public sources, confirm with ICIS / Platts quotations.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Sources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 text-xs text-muted-foreground">
          {p.sources && p.sources.length ? (
            <ul className="space-y-1">
              {p.sources.map((s, i) => (
                <li key={(s.url || "") + i}>
                  <a href={s.url || "#"} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-primary hover:underline">
                    {s.name || s.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No explicit sources were returned. Treat figures as indicative and confirm independently.</p>
          )}
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
            This profile was generated by AI from web research and is not part of your verified catalog. Confirm
            routes, manufacturers and pricing against primary sources before commercial decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
