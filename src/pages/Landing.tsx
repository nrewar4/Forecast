import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { track } from "@/lib/analytics";

// The three ways into the platform: an icon, a micro-caption, and a name.
const OPTIONS: {
  key: string;
  to: string;
  external?: boolean;
  caption: string;
  title: string;
  icon: LucideIcon;
}[] = [
  { key: "buy", to: "https://apacss.com/", external: true, caption: "Storefront", title: "Buy", icon: ShoppingCart },
  { key: "knowledge", to: "/dashboard", caption: "Platform", title: "Knowledge", icon: BookOpen },
  { key: "custom-synthesis", to: "/custom-synthesis", caption: "CDMO", title: "Custom Synthesis", icon: FlaskConical },
];

// Company figures from the APACSS admin portal.
const STATS = [
  { label: "Products", value: 8927 },
  { label: "Manufacturers", value: 3241 },
  { label: "Countries", value: 30, suffix: "+" },
  { label: "Categories", value: 27 },
  { label: "Divisions", value: 2 },
];

const DIVISIONS = [
  { name: "Chemical", products: 6946, manufacturers: 3003 },
  { name: "Pharmaceuticals", products: 1981, manufacturers: 238 },
];

const COUNTRIES = [
  { name: "India", count: 1306 },
  { name: "China", count: 506 },
  { name: "Taiwan", count: 406 },
  { name: "South Korea", count: 306 },
  { name: "Indonesia", count: 129 },
];

const CDMO_STEPS = [
  { title: "Molecule brief", detail: "Confidential target and specs" },
  { title: "Matched capacity", detail: "Certified plants across Asia" },
  { title: "Development", detail: "Route, feasibility, scale-up" },
  { title: "cGMP output", detail: "Compliant manufacturing" },
  { title: "Export", detail: "Delivery to USA, EU, Canada" },
];

// Small uppercase section kicker, Vercel style: quiet, precise.
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="APAC Supply Chain home" className="press inline-block">
            <Logo className="h-8 w-auto" />
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
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,121,32,0.05),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(75%_55%_at_50%_0%,black,transparent_80%)]"
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-up text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-6xl">
                One platform for sourcing,
                <br className="hidden sm:block" />
                <span className="text-primary">knowledge</span> and synthesis.
              </h1>
              <p className="mt-6 animate-fade-up text-lg text-muted-foreground [animation-delay:80ms] md:text-xl">
                <CountUp value={8927} className="font-semibold tabular-nums text-ink" /> products
                across <CountUp value={3241} className="font-semibold tabular-nums text-ink" />{" "}
                manufacturers in{" "}
                <CountUp value={30} suffix="+" className="font-semibold tabular-nums text-ink" />{" "}
                countries.
              </p>
            </div>

            {/* Entry panel: one bordered container, three hairline-divided cells */}
            <div className="mx-auto mt-14 max-w-4xl animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-card [animation-delay:160ms]">
              <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {OPTIONS.map((o) => {
                  const Icon = o.icon;
                  const inner = (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        {o.external ? (
                          <ArrowUpRight className="h-4 w-4 text-border transition-all duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-border transition-all duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-primary" />
                        )}
                      </div>
                      <div className="mt-9">
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {o.caption}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-lg font-semibold tracking-tight text-ink">
                          {o.title}
                        </p>
                      </div>
                      {/* Underline sweep */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
                      />
                    </>
                  );
                  const cls =
                    "group relative flex flex-col p-7 text-left transition-colors duration-200 hover:bg-muted/60 focus-visible:bg-muted/60";
                  return o.external ? (
                    <a
                      key={o.key}
                      href={o.to}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cls}
                      onClick={() => track("landing_option", { option: o.key })}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      key={o.key}
                      to={o.to}
                      className={cls}
                      onClick={() => track("landing_option", { option: o.key })}
                    >
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* About: narrative + route map */}
        <section className="border-t border-border" aria-label="About APAC Supply Chain">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.1fr,1fr]">
            <div>
              <Reveal>
                <Kicker>Asia to USA, EU and Canada</Kicker>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-ink md:text-5xl">
                  <CountUp value={8927} className="tabular-nums" /> products.
                  <br />
                  <CountUp value={3241} className="tabular-nums" /> manufacturers.
                  <br />
                  <span className="text-primary">One network.</span>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                  Chemical and pharmaceutical sourcing across 30+ countries, plus CDMO
                  development on existing certified plant capacity across Asia.
                </p>
              </Reveal>
              <Reveal delay={210}>
                <div className="mt-8 flex flex-wrap gap-3">
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
            </div>

            {/* Route map, light */}
            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <svg
                  width="100%"
                  height="220"
                  viewBox="0 0 320 170"
                  role="img"
                  aria-label="Route map showing manufacturing nodes across Asia connecting to USA, EU and Canada"
                >
                  <g>
                    <circle cx="70" cy="65" r="4.5" fill="#F47920" />
                    <circle cx="95" cy="95" r="3.5" fill="#F47920" />
                    <circle cx="60" cy="108" r="3.5" fill="#F47920" />
                    <text x="40" y="40" fontSize="9" fill="#64748B" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                      ASIA NETWORK
                    </text>
                  </g>
                  <path className="route-flow" d="M75,70 C130,38 190,33 250,42" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <path className="route-flow" d="M90,95 C150,105 200,105 250,90" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <path className="route-flow" d="M65,108 C130,140 190,145 245,132" stroke="#F8AE76" strokeWidth="1.4" fill="none" />
                  <circle cx="252" cy="42" r="4" fill="#0F172A" />
                  <text x="230" y="32" fontSize="9" fill="#64748B" fontFamily="JetBrains Mono, monospace">EU</text>
                  <circle cx="252" cy="90" r="4" fill="#0F172A" />
                  <text x="224" y="80" fontSize="9" fill="#64748B" fontFamily="JetBrains Mono, monospace">USA</text>
                  <circle cx="247" cy="132" r="4" fill="#0F172A" />
                  <text x="203" y="150" fontSize="9" fill="#64748B" fontFamily="JetBrains Mono, monospace">CANADA</text>
                </svg>
              </div>
            </Reveal>
          </div>

          {/* Stat band: hairline grid, orange numbers */}
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
            <div className="grid gap-14 lg:grid-cols-2">
              <div>
                <Reveal>
                  <Kicker>Two divisions</Kicker>
                </Reveal>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {DIVISIONS.map((d, i) => (
                    <Reveal key={d.name} delay={i * 90}>
                      <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-colors duration-200 hover:border-primary/40">
                        <h3 className="text-sm font-semibold text-ink">{d.name}</h3>
                        <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-primary">
                          <CountUp value={d.products} />
                        </p>
                        <p className="text-xs text-muted-foreground">products</p>
                        <p className="mt-3 border-t border-border pt-3 font-mono text-xs tabular-nums text-muted-foreground">
                          <CountUp value={d.manufacturers} /> manufacturers
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <div>
                <Reveal>
                  <Kicker>Manufacturing network by country</Kicker>
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
                        <span className="w-12 shrink-0 text-right font-mono text-sm tabular-nums text-ink">
                          <CountUp value={c.count} />
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
            <Reveal>
              <Kicker>CDMO process</Kicker>
            </Reveal>
            <ol className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {CDMO_STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80} as="li">
                  <div className="border-t-2 border-primary/70 pt-4">
                    <span className="font-mono text-xs font-medium text-primary">
                      0{i + 1}
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* CTA */}
            <Reveal delay={100}>
              <div className="mt-20 overflow-hidden rounded-2xl bg-primary">
                <div className="flex flex-wrap items-center justify-between gap-5 px-8 py-8">
                  <div>
                    <p className="text-xl font-bold tracking-tight text-primary-foreground md:text-2xl">
                      Tell us what you're building
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/85">
                      From a single shipment to a multi-year CDMO program.
                    </p>
                  </div>
                  <a
                    href="https://apacss.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="press inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-transform hover:scale-[1.02]"
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
