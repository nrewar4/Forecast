import { useState } from "react";
import {
  Beaker,
  Building2,
  FlaskConical,
  Globe,
  Layers,
  MapPin,
  Package,
  ShieldCheck,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn } from "@/lib/utils";
import {
  capabilityDomains,
  companies,
  comparison,
  meta,
  taxonomy,
} from "@/data/cdmo";

const domainIcon: Record<string, typeof Beaker> = {
  "tech-platforms": FlaskConical,
  "chemistry-toolbox": Beaker,
  "containment-hpapi": ShieldCheck,
  "particle-solid-state": Layers,
  modalities: Target,
  "analytical-regulatory": ShieldCheck,
  services: Package,
};

function List({ items }: { items: { name: string; note?: string; maturity?: string; oebLevels?: string[] }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.name} className="text-sm">
          <span className="font-medium text-foreground">{it.name}</span>
          {it.maturity ? (
            <Badge tone="softOrange" className="ml-2 align-middle">
              {it.maturity}
            </Badge>
          ) : null}
          {it.oebLevels ? (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {it.oebLevels.map((o) => (
                <span key={o} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                  {o}
                </span>
              ))}
            </div>
          ) : null}
          {it.note ? <p className="mt-0.5 text-xs text-muted-foreground">{it.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export default function CdmoCapabilities() {
  const [idx, setIdx] = useState(0);
  const c = companies[idx];

  const rev = c.metrics.revenue;
  const revValue = rev ? `${rev.value} cr` : "n/a";

  return (
    <AppShell
      title="CDMO Capability Database"
      subtitle="Technical capabilities, chemistries, products, and metrics for major CDMO players. Categorised broad to narrow: company, segment, capability domain, chemistry, product."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiChip icon={Building2} label="Companies Tracked" value={String(companies.length)} sub="major CDMO players" />
        <KpiChip icon={Layers} label="Capability Domains" value={String(capabilityDomains.length)} sub="broad to narrow" />
        <KpiChip icon={Beaker} label="Taxonomy Levels" value={String(taxonomy.levels.length)} sub="company to product" />
      </div>

      {/* Company selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {companies.map((co, i) => (
          <button
            key={co.id}
            onClick={() => setIdx(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              i === idx
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {co.name}
          </button>
        ))}
      </div>

      {/* Company profile */}
      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">{c.name}</h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.headquarters}</span>
                <span className="text-border">|</span>
                <span>Founded {c.founded}</span>
                {c.tickers ? (
                  <>
                    <span className="text-border">|</span>
                    <span>{Object.entries(c.tickers).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join("  ")}</span>
                  </>
                ) : null}
              </p>
              <p className="mt-3 max-w-3xl text-sm text-foreground">{c.positioning}</p>
              <p className="mt-2 max-w-3xl text-xs text-muted-foreground">{c.businessModel}</p>
              {c.mergerNote ? (
                <p className="mt-2 max-w-3xl text-xs text-muted-foreground">{c.mergerNote}</p>
              ) : null}
            </div>
          </div>

          {/* Headline metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Metric label={`Revenue ${rev?.fy ?? ""}`} value={revValue} sub={rev?.usdApprox} />
            {c.metrics.employees ? <Metric label="Employees" value={c.metrics.employees} /> : null}
            {c.metrics.scientists ? <Metric label="Scientists" value={c.metrics.scientists} /> : null}
            {c.metrics.scientistsAndProfessionals ? <Metric label="Scientists" value={c.metrics.scientistsAndProfessionals} /> : null}
            {c.metrics.phds ? <Metric label="PhDs" value={c.metrics.phds} /> : null}
            {c.metrics.countriesServed ? <Metric label="Countries Served" value={c.metrics.countriesServed} /> : null}
            {c.metrics.combinedReactorVolume ? <Metric label="Reactor Volume" value={c.metrics.combinedReactorVolume} /> : null}
            {c.metrics.reactorCapacityBidar ? <Metric label="Reactor Capacity" value={c.metrics.reactorCapacityBidar} /> : null}
            {c.metrics.dmfsGlobal ? <Metric label="DMFs Filed" value={c.metrics.dmfsGlobal} /> : null}
            {c.metrics.facilities ? <Metric label="Facilities" value={c.metrics.facilities} /> : null}
          </div>
        </CardContent>
      </Card>

      {/* Segments */}
      <SectionTitle icon={Layers}>Business Segments</SectionTitle>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {c.segments.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-foreground">{s.name}</p>
              {s.note ? <p className="mt-1 text-xs text-muted-foreground">{s.note}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Capability domains, broad to narrow */}
      <SectionTitle icon={Beaker}>Technical Capabilities and Chemistries</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {capabilityDomains.map((d) => {
          const items = c.capabilities[d.id];
          if (!items || items.length === 0) return null;
          const Icon = domainIcon[d.id] ?? Beaker;
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-2">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{d.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{d.note}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <List items={items} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Products and intermediates */}
      <SectionTitle icon={Package}>Products and Intermediates</SectionTitle>
      <Card>
        <CardContent className="p-5">
          {c.products.note ? <p className="mb-3 text-xs text-muted-foreground">{c.products.note}</p> : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(c.products)
              .filter(([k]) => k !== "note")
              .map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{prettyKey(key)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(val as any[]).map((p) => {
                      const label = typeof p === "string" ? p : p.name;
                      const note = typeof p === "string" ? undefined : p.note;
                      return (
                        <span
                          key={label}
                          title={note}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground"
                        >
                          <FlaskConical className="h-3 w-3 text-primary" />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Sites and regulatory */}
      <SectionTitle icon={MapPin}>Manufacturing and R&D Footprint</SectionTitle>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {c.sites.map((s: any) => (
          <Card key={s.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                {s.approvals ? <Badge tone="green">{s.approvals}</Badge> : null}
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {s.location}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{s.role}</p>
              {s.reactorCapacity ? (
                <p className="mt-1 text-xs font-medium text-foreground">Reactors: {s.reactorCapacity}</p>
              ) : null}
              {s.note ? <p className="mt-1 text-[11px] text-muted-foreground">{s.note}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sourcing angle */}
      <Card className="mt-6 border-primary/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Sourcing Angle</h3>
          </div>
          <p className="mt-2 text-sm text-foreground">{c.sourcingAngle}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.therapeuticFocus.map((t) => (
              <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison matrix */}
      <SectionTitle icon={Globe}>Head to Head Comparison</SectionTitle>
      <p className="mb-3 text-xs text-muted-foreground">{comparison.note}</p>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">Dimension</th>
                <th className="px-4 py-3 font-semibold text-foreground">Divi's</th>
                <th className="px-4 py-3 font-semibold text-foreground">Sai Life</th>
                <th className="px-4 py-3 font-semibold text-foreground">Cohance</th>
              </tr>
            </thead>
            <tbody>
              {comparison.dimensions.map((row) => (
                <tr key={row.dimension} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.dimension}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.divis}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.sailife}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.cohance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        Last updated {meta.lastUpdated}. {meta.methodology} Sources are listed per company in the underlying database at data/cdmo_capabilities.json.
      </p>
    </AppShell>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      {sub ? <p className="text-[10px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Beaker; children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{children}</h2>
    </div>
  );
}

function prettyKey(k: string) {
  const map: Record<string, string> = {
    genericAPIs: "Generic APIs",
    intermediates: "Intermediates",
    nutraceuticals: "Nutraceuticals",
    programTypes: "Program Types",
    platformProducts: "Platform Products",
    categories: "Product Categories",
  };
  return map[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
