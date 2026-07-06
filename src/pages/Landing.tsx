import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { CountUp, Reveal } from "@/components/motion";
import { NETWORK } from "@/data/network";

type Option = {
  key: string;
  to: string;
  external?: boolean; // when true, `to` is an absolute URL opened in a new tab
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  featured?: boolean;
};

const OPTIONS: Option[] = [
  {
    key: "buy",
    to: "https://apacss.com/",
    external: true,
    eyebrow: "Procurement",
    title: "Buy",
    description:
      "Source bulk chemicals and APIs from vetted, certified manufacturers on the APAC Supply Chain storefront. Compare grades, specs and MOQs, then request a quote.",
    cta: "Visit storefront",
  },
  {
    key: "knowledge",
    to: "/dashboard",
    eyebrow: "Workspace",
    title: "Knowledge",
    description:
      "The sourcing intelligence workspace: a product knowledge base with verified chemistry, pricing context and regulatory reference for every molecule we cover.",
    cta: "Enter platform",
    featured: true,
  },
  {
    key: "custom-synthesis",
    to: "/custom-synthesis",
    eyebrow: "CDMO services",
    title: "Custom Synthesis",
    description:
      "Contract development and manufacturing on existing certified plant capacity: route scouting, process optimization, and scale-up from gram to tonne.",
    cta: "Explore",
  },
];

function OptionCard({ option, index }: { option: Option; index: number }) {
  const cardClass = cn(
    "press group relative flex flex-col rounded-2xl border bg-card p-7 text-left shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo",
    "hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1",
    option.featured
      ? "border-primary/40 ring-1 ring-primary/10 hover:border-primary"
      : "border-border hover:border-primary/50",
  );

  const inner = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {option.eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{option.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {option.description}
      </p>
      <span
        className={cn(
          "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
          option.featured ? "text-primary" : "text-foreground",
        )}
      >
        {option.cta}
        {option.external ? (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
        )}
      </span>
    </>
  );

  if (option.external) {
    return (
      <a
        href={option.to}
        target="_blank"
        rel="noreferrer noopener"
        style={{ "--i": index } as CSSProperties}
        aria-label={`${option.title}. ${option.description} (opens apacss.com in a new tab)`}
        className={cardClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      to={option.to}
      style={{ "--i": index } as CSSProperties}
      aria-label={`${option.title}. ${option.description}`}
      className={cardClass}
    >
      {inner}
    </Link>
  );
}

// Animated map: manufacturing nodes across Asia shipping into the EU, USA and
// Canada. Purely decorative motion; described for screen readers via the label.
function RouteMap() {
  return (
    <svg
      viewBox="0 0 340 190"
      role="img"
      aria-label="Manufacturing nodes across Asia connecting to the USA, EU and Canada"
      className="h-auto w-full max-w-md"
    >
      <text x="34" y="42" className="fill-muted-foreground font-mono" fontSize="9" letterSpacing="1.5">
        ASIA NETWORK
      </text>
      <g className="fill-primary">
        <circle cx="72" cy="72" r="5" className="node-pulse" />
        <circle cx="100" cy="102" r="3.5" className="node-pulse" style={{ animationDelay: "0.5s" }} />
        <circle cx="62" cy="118" r="3.5" className="node-pulse" style={{ animationDelay: "1s" }} />
        <circle cx="92" cy="130" r="2.5" className="node-pulse" style={{ animationDelay: "1.4s" }} />
      </g>

      <path d="M78,74 C140,40 200,36 262,48" className="route-line" stroke="#94A3B8" strokeWidth="1.4" fill="none" />
      <path d="M96,102 C160,112 210,112 262,98" className="route-line" stroke="#94A3B8" strokeWidth="1.4" fill="none" style={{ animationDelay: "0.4s" }} />
      <path d="M68,120 C140,156 200,160 256,144" className="route-line" stroke="#94A3B8" strokeWidth="1.4" fill="none" style={{ animationDelay: "0.8s" }} />

      <g className="fill-ink">
        <circle cx="264" cy="48" r="4.5" />
        <circle cx="264" cy="98" r="4.5" />
        <circle cx="258" cy="144" r="4.5" />
      </g>
      <text x="276" y="52" className="fill-muted-foreground font-mono" fontSize="9">EU</text>
      <text x="276" y="102" className="fill-muted-foreground font-mono" fontSize="9">USA</text>
      <text x="270" y="148" className="fill-muted-foreground font-mono" fontSize="9">CANADA</text>
    </svg>
  );
}

const PROCESS = [
  "Molecule brief",
  "Matched plant capacity",
  "Development and scale-up",
  "cGMP compliant output",
  "Export and delivery",
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle warm field, restrained, no gradient blobs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_75%)]"
      />

      {/* Top bar */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" aria-label="APAC Supply Chain | CDMO home">
          <Logo className="h-9 w-auto" />
        </Link>
        <Link
          to="/dashboard"
          className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          Open platform
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex animate-fade-in items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Chemical sourcing, intelligence and custom manufacturing
          </span>
          <h1 className="mt-5 animate-fade-up text-4xl font-bold tracking-tight text-ink md:text-6xl">
            One platform for sourcing,
            <br className="hidden sm:block" />
            <span className="text-primary"> knowledge</span> and synthesis.
          </h1>

          {/* Network headline: the numbers behind the platform. */}
          <p className="mx-auto mt-6 animate-fade-up text-xl font-semibold tracking-tight text-ink [animation-delay:60ms] md:text-2xl">
            <CountUp value={NETWORK.products} className="text-primary" /> products across{" "}
            <CountUp value={NETWORK.manufacturers} className="text-primary" /> manufacturers in{" "}
            <CountUp value={NETWORK.countries} suffix="+" className="text-primary" /> countries.
          </p>
          <p className="mx-auto mt-4 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:120ms]">
            From buying bulk chemicals to route design and CDMO production
            intelligence. Pick where you want to start.
          </p>
        </div>

        {/* Entry options */}
        <div className="stagger mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {OPTIONS.map((o, i) => (
            <OptionCard key={o.key} option={o} index={i} />
          ))}
        </div>

        {/* About us */}
        <section aria-labelledby="about-heading" className="mt-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              About us
            </p>
            <h2 id="about-heading" className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              One network, from plant floor in Asia to your dock.
            </h2>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="text-base leading-relaxed text-muted-foreground">
                APAC Supply Chain connects buyers in the USA, EU and Canada with
                certified chemical and pharmaceutical manufacturers across Asia.
                We vet every plant, negotiate at the source, and manage
                documentation, compliance and logistics so an order lands the way
                it was specified.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The same network powers our CDMO work. When a molecule needs to be
                developed rather than bought, we match it to existing certified
                plant capacity and take it from first route to commercial supply.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex justify-center">
              <RouteMap />
            </Reveal>
          </div>

          {/* Network figures */}
          <Reveal className="mt-14">
            <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:grid-cols-5">
              {[
                { value: NETWORK.products, label: "Products" },
                { value: NETWORK.manufacturers, label: "Manufacturers" },
                { value: NETWORK.countries, suffix: "+", label: "Countries" },
                { value: NETWORK.categories, label: "Categories" },
                { value: 2, label: "Divisions" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "px-4 py-6 text-center",
                    i > 0 && "border-l border-border max-sm:[&:nth-child(odd)]:border-l-0 max-sm:[&:nth-child(n+3)]:border-t",
                  )}
                >
                  <dd className="text-2xl font-bold tabular-nums tracking-tight text-ink md:text-3xl">
                    <CountUp value={s.value} suffix={s.suffix ?? ""} />
                  </dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Divisions */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {NETWORK.divisions.map((d, i) => (
              <Reveal key={d.name} delay={i * 100}>
                <div className="press group rounded-2xl border border-border bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {i === 0 ? "Division 01" : "Division 02"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{d.name}</h3>
                  <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-primary">
                    <CountUp value={d.products} />{" "}
                    <span className="text-sm font-medium text-muted-foreground">products</span>
                  </p>
                  <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                    <CountUp value={d.manufacturers} /> manufacturers
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Manufacturing network by country */}
          <Reveal className="mt-14">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Manufacturing network by country
            </p>
            <div className="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-6">
              {[...NETWORK.topCountries, { name: "More", manufacturers: NETWORK.moreCountries }].map(
                (c, i) => (
                  <div key={c.name} className="text-center">
                    <p className="text-xl font-bold tabular-nums tracking-tight text-ink">
                      {i === NETWORK.topCountries.length ? (
                        <>+{c.manufacturers}</>
                      ) : (
                        <CountUp value={c.manufacturers} />
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {i === NETWORK.topCountries.length ? "more countries" : c.name}
                    </p>
                  </div>
                ),
              )}
            </div>
          </Reveal>

          {/* How a CDMO project runs */}
          <Reveal className="mt-16">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              How a CDMO project runs
            </p>
            <ol className="mt-6 grid gap-6 sm:grid-cols-5">
              {PROCESS.map((step, i) => (
                <li key={step} className="relative text-center sm:text-left">
                  <span className="font-mono text-xs font-semibold text-primary-600">
                    0{i + 1}
                  </span>
                  <p className="mt-1.5 text-sm font-semibold leading-snug text-ink">{step}</p>
                  {i < PROCESS.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute -right-3 top-1 hidden text-border sm:block"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Closing CTA */}
          <Reveal className="mt-16">
            <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-ink px-8 py-8 shadow-lift sm:flex-row">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  Tell us what you're building.
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Briefs are confidential and answered within two business days.
                </p>
              </div>
              <Link
                to="/synthesis/enquiry"
                className="press inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-600"
              >
                Start a confidential enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </section>

        <p className="mt-16 text-center text-xs text-muted-foreground">
          Product, regulatory and trade data drawn from PubChem, openFDA, OpenAlex and shipment records.
        </p>
      </main>
    </div>
  );
}
