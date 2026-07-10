import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { track } from "@/lib/analytics";

// The three ways into the platform. Text only, no icons, large and centered.
const OPTIONS: {
  key: string;
  to: string;
  external?: boolean;
  title: string;
  featured?: boolean;
}[] = [
  { key: "buy", to: "https://apacss.com/", external: true, title: "Procurement" },
  { key: "knowledge", to: "/knowledge-base", title: "Product Discovery", featured: true },
  { key: "custom-synthesis", to: "/cdmo", title: "CDMO" },
];

// Rounded, impact-friendly figures (real counts are a little higher).
const STATS = [
  { label: "Products", value: 8900, suffix: "+" },
  { label: "Manufacturers", value: 3200, suffix: "+" },
  { label: "Countries", value: 30, suffix: "+" },
  { label: "Categories", value: 27 },
  { label: "Divisions", value: 2 },
];

const DIVISIONS = [
  { name: "Chemical", products: 6900, productsSuffix: "+", manufacturers: 3000, manufacturersSuffix: "+" },
  { name: "Pharmaceuticals", products: 1900, productsSuffix: "+", manufacturers: 230, manufacturersSuffix: "+" },
];

const COUNTRIES = [
  { name: "India", count: 1300, suffix: "+" },
  { name: "China", count: 500, suffix: "+" },
  { name: "Taiwan", count: 400, suffix: "+" },
  { name: "South Korea", count: 300, suffix: "+" },
  { name: "Indonesia", count: 120, suffix: "+" },
];

const CDMO_STEPS = [
  { title: "Molecule brief", detail: "Confidential target and specs" },
  { title: "Matched capacity", detail: "Certified plants across Asia" },
  { title: "Development", detail: "Route, feasibility, scale-up" },
  { title: "cGMP output", detail: "Compliant manufacturing" },
  { title: "Export", detail: "Delivery to USA, EU, Canada" },
];

// Centered section header: quiet mono kicker over a bold title.
function SectionHeader({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={70}>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      </Reveal>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="APAC Supply Chain home" className="press inline-block">
            <Logo className="h-16 w-auto md:h-20" />
          </Link>
          <Link
            to="/dashboard"
            className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Open platform
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 pb-20 pt-20 text-center md:pt-28">
            <h1 className="animate-fade-up text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-6xl">
              One platform for sourcing,
              <br className="hidden sm:block" />
              <span className="text-primary">knowledge</span> and synthesis.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground [animation-delay:80ms] md:text-xl">
              <CountUp value={8900} suffix="+" className="font-semibold tabular-nums text-ink" /> products across{" "}
              <CountUp value={3200} suffix="+" className="font-semibold tabular-nums text-ink" /> manufacturers in{" "}
              <CountUp value={30} suffix="+" className="font-semibold tabular-nums text-ink" /> countries.
            </p>

            {/* Entry buttons: text only, large, centered */}
            <div className="stagger mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-3">
              {OPTIONS.map((o, i) => {
                const featured = o.featured;
                const cls =
                  "press group relative flex min-h-[132px] flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border px-6 py-8 text-center transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out-expo hover:-translate-y-1 " +
                  (featured
                    ? "border-primary bg-primary text-primary-foreground shadow-glow hover:shadow-lift"
                    : "border-border bg-card text-ink shadow-card hover:border-primary/50 hover:shadow-lift");
                const body = (
                  <span className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight md:text-[26px]">
                    {o.title}
                    {o.external ? (
                      <ArrowUpRight className={"h-5 w-5 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 " + (featured ? "text-primary-foreground/80" : "text-muted-foreground")} />
                    ) : (
                      <ArrowRight className={"h-5 w-5 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 " + (featured ? "text-primary-foreground/80" : "text-muted-foreground")} />
                    )}
                  </span>
                );
                return o.external ? (
                  <a
                    key={o.key}
                    href={o.to}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ "--i": i } as React.CSSProperties}
                    className={cls}
                    onClick={() => track("landing_option", { option: o.key })}
                  >
                    {body}
                  </a>
                ) : (
                  <Link
                    key={o.key}
                    to={o.to}
                    style={{ "--i": i } as React.CSSProperties}
                    className={cls}
                    onClick={() => track("landing_option", { option: o.key })}
                  >
                    {body}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="border-t border-border" aria-label="About APAC Supply Chain">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <SectionHeader
              kicker="APAC network to the United States"
              title={
                <>
                  <CountUp value={8900} suffix="+" className="tabular-nums" /> products.{" "}
                  <CountUp value={3200} suffix="+" className="tabular-nums" /> manufacturers.{" "}
                  <span className="text-primary">One network.</span>
                </>
              }
            />
            <Reveal delay={130}>
              <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                Chemical and pharmaceutical sourcing across 30+ countries, plus CDMO development on
                existing certified plant capacity across Asia.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="https://apacss.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
                >
                  Find a product or supplier
                </a>
                <Link
                  to="/custom-synthesis"
                  className="press inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Start a CDMO project
                </Link>
              </div>
            </Reveal>

            {/* Route map */}
            <Reveal delay={120}>
              <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-card">
                <svg
                  width="100%"
                  height="220"
                  viewBox="0 0 320 170"
                  role="img"
                  aria-label="Route map showing APAC manufacturing countries connecting to the United States"
                >
                  <text x="40" y="18" fontSize="9" fill="#64748B" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                    APAC NETWORK
                  </text>

                  {/* Flow lines converging on the US */}
                  <path className="route-flow" d="M96,42 C150,42 205,72 250,88" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <path className="route-flow" d="M96,75 C150,75 205,82 250,89" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <path className="route-flow" d="M96,108 C150,108 205,98 250,91" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <path className="route-flow" d="M96,138 C150,138 205,108 250,92" stroke="#F8AE76" strokeWidth="1.4" fill="none" />

                  {/* APAC source nodes */}
                  {[
                    { y: 42, label: "India" },
                    { y: 75, label: "China" },
                    { y: 108, label: "Japan" },
                    { y: 138, label: "S. Korea" },
                  ].map((n) => (
                    <g key={n.label}>
                      <text x="86" y={n.y + 3} textAnchor="end" fontSize="8.5" fill="#64748B" fontFamily="JetBrains Mono, monospace">
                        {n.label}
                      </text>
                      <circle cx="96" cy={n.y} r="4" fill="#F47920" />
                    </g>
                  ))}

                  {/* US destination node */}
                  <circle cx="253" cy="90" r="5.5" fill="#0F172A" />
                  <circle cx="253" cy="90" r="9" fill="none" stroke="#0F172A" strokeOpacity="0.2" strokeWidth="1" />
                  <text x="266" y="93" fontSize="10" fill="#0F172A" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                    USA
                  </text>
                </svg>
              </div>
            </Reveal>
          </div>

          {/* Stat band */}
          <div className="border-t border-border">
            <Reveal>
              <dl className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-5">
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className={
                      "px-6 py-8 text-center " +
                      (i > 0 ? "border-l border-border max-sm:[&:nth-child(odd)]:border-l-0 " : "") +
                      (i >= 2 ? "max-sm:border-t" : "")
                    }
                  >
                    <dd className="text-3xl font-bold tabular-nums tracking-tight text-primary">
                      <CountUp value={s.value} suffix={s.suffix ?? ""} />
                    </dd>
                    <dt className="mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Divisions + country network */}
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <SectionHeader kicker="The network" title="Two divisions, one global reach" />
            <div className="mt-14 grid gap-14 lg:grid-cols-2">
              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {DIVISIONS.map((d, i) => (
                    <Reveal key={d.name} delay={i * 90}>
                      <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-colors duration-200 hover:border-primary/40">
                        <h3 className="text-sm font-semibold text-ink">{d.name}</h3>
                        <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-primary">
                          <CountUp value={d.products} suffix={d.productsSuffix} />
                        </p>
                        <p className="text-xs text-muted-foreground">products</p>
                        <p className="mt-3 border-t border-border pt-3 font-mono text-xs tabular-nums text-muted-foreground">
                          <CountUp value={d.manufacturers} suffix={d.manufacturersSuffix} /> manufacturers
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <div>
                <Reveal>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Manufacturing network by country
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <div className="mt-6 space-y-4">
                    {COUNTRIES.map((c, i) => (
                      <div key={c.name} className="flex items-center gap-4">
                        <span className="w-28 shrink-0 text-sm text-foreground/80">{c.name}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/70">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out-expo"
                            style={{
                              width: `${Math.max(6, (c.count / COUNTRIES[0].count) * 100)}%`,
                              transitionDelay: `${i * 110}ms`,
                            }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right font-mono text-sm tabular-nums text-ink">
                          <CountUp value={c.count} suffix={c.suffix} />
                        </span>
                      </div>
                    ))}
                    <p className="pt-1 text-right text-xs text-muted-foreground">and 25 more countries</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* CDMO process */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <SectionHeader kicker="How it works" title="The CDMO process" />
            <ol className="mt-14 grid gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {CDMO_STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80} as="li">
                  <div className="border-t-2 border-primary/70 pt-4 text-center sm:text-left">
                    <span className="font-mono text-xs font-medium text-primary">0{i + 1}</span>
                    <p className="mt-1.5 text-sm font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* CTA */}
            <Reveal delay={100}>
              <div className="mt-20 overflow-hidden rounded-2xl bg-primary">
                <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
                      Tell us what you're building
                    </p>
                    <p className="mt-2 text-sm text-primary-foreground/85">
                      From a single shipment to a multi-year CDMO program.
                    </p>
                  </div>
                  <a
                    href="https://apacss.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="press inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-transform hover:scale-[1.02]"
                    onClick={() => track("cta_inquiry", {})}
                  >
                    Start a confidential inquiry
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} APAC Supply Chain</span>
          <Link to="/login" className="transition-colors hover:text-primary">
            Admin sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
