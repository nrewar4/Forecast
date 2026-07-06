import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Reveal } from "@/components/motion";

const SERVICES = [
  {
    title: "Route scouting",
    body: "ML-assisted retrosynthesis and literature mining find viable routes with freedom-to-operate awareness built in.",
  },
  {
    title: "Process optimization",
    body: "Catalyst recycle, flow chemistry, solvent recovery and telescoping lift yield and cut process mass intensity.",
  },
  {
    title: "Cost and FTO analysis",
    body: "Cost-driver breakdowns and patent-landscape signals before you commit capital.",
  },
  {
    title: "Scale-up",
    body: "Gram to multi-tonne: pilot campaigns, tech transfer, and commercial manufacturing on certified plants.",
  },
];

const SCALES = [
  { stage: "Discovery", detail: "mg to g", note: "Route feasibility and samples" },
  { stage: "Pilot", detail: "kg to 100 kg", note: "Process validation" },
  { stage: "Commercial", detail: "tonne+", note: "Continuous supply" },
];

export default function CustomSynthesis() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="animate-fade-in text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            CDMO services
          </p>
          <h1 className="mt-4 max-w-2xl animate-fade-up text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Custom synthesis, from first route to commercial scale.
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:60ms]">
            A contract development and manufacturing partner that pairs synthetic
            craft with sourcing intelligence, so the molecule you need gets made
            efficiently and economically.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:120ms]">
            <Link
              to="/synthesis/routes"
              className="press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
            >
              Explore synthesis routes <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://apacss.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="press inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              Looking to buy instead?
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">What we do</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            End-to-end development backed by the same intelligence platform our analysts use.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="press h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift">
                <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scale ladder */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Scale with you</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {SCALES.map((s, i) => (
              <Reveal key={s.stage} delay={i * 80}>
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Stage 0{i + 1}
                  </span>
                  <p className="mt-2 text-lg font-semibold text-ink">{s.stage}</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary">{s.detail}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-accent/40 p-5">
              <p className="text-sm text-foreground/90">
                Already know your target molecule? Generate candidate routes and a
                CDMO production analysis in the synthesis workspace.
              </p>
              <Link
                to="/synthesis/routes"
                className="press inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
              >
                Open route explorer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingLayout>
  );
}
