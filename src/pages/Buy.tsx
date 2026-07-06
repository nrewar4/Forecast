import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  FileSpreadsheet,
  Globe2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";

const STEPS = [
  {
    icon: Boxes,
    title: "Browse the catalog",
    body: "Search 250+ bulk chemicals and APIs by name, CAS, or HS code with indicative pricing and real producers.",
  },
  {
    icon: ShieldCheck,
    title: "Shortlist vetted makers",
    body: "Every supplier is a verified manufacturer — certifications (GMP, ISO, REACH) and capacity notes included.",
  },
  {
    icon: FileSpreadsheet,
    title: "Request a quote",
    body: "Send a structured RFQ with volume, grade, and delivery terms. Compare responses side by side.",
  },
  {
    icon: Truck,
    title: "Source with confidence",
    body: "Live import/export records and trade analytics back every decision with real shipment data.",
  },
];

const STATS = [
  { value: "250+", label: "Chemicals & APIs" },
  { value: "1,000+", label: "Vetted manufacturers" },
  { value: "40+", label: "Sourcing countries" },
];

export default function Buy() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            Procurement
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Source bulk chemicals from manufacturers you can trust.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Skip the trader markups. Buy direct from certified producers with
            transparent pricing and live trade data behind every quote.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
            >
              Browse the catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/custom-synthesis"
              className="press inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              Need custom synthesis?
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-3xl font-bold tracking-tight text-ink">{s.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">How buying works</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          A straight line from requirement to verified supplier.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="press group rounded-2xl border border-border bg-card p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assurance band */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-8 text-sm text-foreground/80">
          {["Manufacturers only — no traders", "GMP / ISO / REACH verified", "Live shipment data", "Quote in 48h"].map(
            (t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> {t}
              </span>
            ),
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}
