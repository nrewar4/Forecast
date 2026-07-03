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

// The three ways into the platform. Kept deliberately minimal: an icon and a
// name. The About section below carries the detail.
const OPTIONS: { key: string; to: string; external?: boolean; title: string; icon: LucideIcon }[] = [
  { key: "buy", to: "https://apacss.com/", external: true, title: "Buy", icon: ShoppingCart },
  { key: "knowledge", to: "/dashboard", title: "Knowledge", icon: BookOpen },
  { key: "custom-synthesis", to: "/custom-synthesis", title: "Custom Synthesis", icon: FlaskConical },
];

// Company figures from the APACSS admin portal.
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
  "Molecule brief",
  "Matched plant capacity",
  "Development and scale-up",
  "cGMP-compliant output",
  "Export and delivery",
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle warm field behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
      />

      {/* Top bar */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" aria-label="APAC Supply Chain home">
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

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-ink md:text-6xl">
              One platform for sourcing,
              <br className="hidden sm:block" />
              <span className="text-primary"> knowledge</span> and synthesis.
            </h1>

            {/* Impact stat line */}
            <p className="mt-7 animate-fade-up text-xl font-medium leading-snug text-muted-foreground [animation-delay:80ms] md:text-2xl">
              <CountUp value={8927} className="font-bold tabular-nums text-ink" /> products across{" "}
              <CountUp value={3241} className="font-bold tabular-nums text-ink" /> manufacturers in{" "}
              <CountUp value={30} suffix="+" className="font-bold tabular-nums text-ink" /> countries.
            </p>
          </div>

          {/* Three entry tiles: icon + name only */}
          <div className="stagger mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {OPTIONS.map((o, i) => {
              const Icon = o.icon;
              const inner = (
                <>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 whitespace-nowrap text-base font-semibold tracking-tight text-ink sm:text-lg">
                    {o.title}
                    {o.external ? (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-primary" />
                    )}
                  </span>
                </>
              );
              const cls =
                "press group flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-8 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift";
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
                  {inner}
                </a>
              ) : (
                <Link
                  key={o.key}
                  to={o.to}
                  style={{ "--i": i } as React.CSSProperties}
                  className={cls}
                  onClick={() => track("landing_option", { option: o.key })}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* About: dark, animated, data-led */}
        <section className="bg-ink text-white" aria-label="About APAC Supply Chain">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,1fr]">
              <div>
                <Reveal>
                  <p className="font-mono text-xs tracking-[0.2em] text-primary">
                    ASIA TO USA, EU AND CANADA
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                    <CountUp value={8927} className="tabular-nums" /> products.
                    <br />
                    <CountUp value={3241} className="tabular-nums" /> manufacturers.
                    <br />
                    <span className="text-primary">One network.</span>
                  </h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                    Chemical and pharmaceutical sourcing across 30+ countries, plus
                    CDMO development on existing certified plant capacity across Asia.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="mt-7 flex flex-wrap gap-3">
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
                      className="press inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
                    >
                      Start a CDMO project
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Animated route map */}
              <Reveal delay={120}>
                <svg
                  width="100%"
                  height="230"
                  viewBox="0 0 320 170"
                  role="img"
                  aria-label="Route map showing manufacturing nodes across Asia connecting to USA, EU and Canada"
                >
                  <g>
                    <circle cx="70" cy="65" r="4" fill="#F47920" />
                    <circle cx="95" cy="95" r="3" fill="#F47920" />
                    <circle cx="60" cy="108" r="3" fill="#F47920" />
                    <text x="40" y="40" fontSize="9" fill="#94A3B8" className="font-mono">
                      ASIA NETWORK
                    </text>
                  </g>
                  <path className="route-flow" d="M75,70 C130,38 190,33 250,42" stroke="#F69248" strokeWidth="1.2" fill="none" />
                  <path className="route-flow" d="M90,95 C150,105 200,105 250,90" stroke="#F69248" strokeWidth="1.2" fill="none" />
                  <path className="route-flow" d="M65,108 C130,140 190,145 245,132" stroke="#F69248" strokeWidth="1.2" fill="none" />
                  <circle cx="252" cy="42" r="4" fill="#FDE6D3" />
                  <text x="228" y="32" fontSize="9" fill="#94A3B8" className="font-mono">EU</text>
                  <circle cx="252" cy="90" r="4" fill="#FDE6D3" />
                  <text x="222" y="80" fontSize="9" fill="#94A3B8" className="font-mono">USA</text>
                  <circle cx="247" cy="132" r="4" fill="#FDE6D3" />
                  <text x="205" y="150" fontSize="9" fill="#94A3B8" className="font-mono">CANADA</text>
                </svg>
              </Reveal>
            </div>

            {/* Stat band */}
            <Reveal delay={100}>
              <dl className="mt-16 grid grid-cols-2 divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-5 sm:divide-x">
                {[
                  { label: "Products", value: 8927 },
                  { label: "Manufacturers", value: 3241 },
                  { label: "Countries", value: 30, suffix: "+" },
                  { label: "Categories", value: 27 },
                  { label: "Divisions", value: 2 },
                ].map((s) => (
                  <div key={s.label} className="px-4 py-5 text-center">
                    <dt className="order-2 mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                      {s.label}
                    </dt>
                    <dd className="text-2xl font-bold tabular-nums text-white">
                      <CountUp value={s.value} suffix={s.suffix ?? ""} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Two divisions */}
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {DIVISIONS.map((d, i) => (
                <Reveal key={d.name} delay={i * 100}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-primary/50">
                    <h3 className="text-base font-semibold text-white">{d.name}</h3>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
                      <CountUp value={d.products} />{" "}
                      <span className="text-sm font-medium text-white/50">products</span>
                    </p>
                    <p className="mt-1 font-mono text-sm tabular-nums text-white/60">
                      <CountUp value={d.manufacturers} /> manufacturers
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Manufacturing network by country */}
            <Reveal delay={80}>
              <div className="mt-14">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                  Manufacturing network by country
                </h3>
                <div className="mt-5 space-y-3">
                  {COUNTRIES.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-4">
                      <span className="w-28 shrink-0 text-sm text-white/70">{c.name}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out-expo"
                          style={{ width: `${Math.max(6, (c.count / COUNTRIES[0].count) * 100)}%`, transitionDelay: `${i * 120}ms` }}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right font-mono text-sm tabular-nums text-white">
                        <CountUp value={c.count} />
                      </span>
                    </div>
                  ))}
                  <p className="pt-1 text-right font-mono text-xs text-white/50">and 25 more countries</p>
                </div>
              </div>
            </Reveal>

            {/* CDMO process */}
            <div className="mt-14">
              <Reveal>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">CDMO process</h3>
              </Reveal>
              <ol className="mt-5 grid gap-4 sm:grid-cols-5">
                {CDMO_STEPS.map((step, i) => (
                  <Reveal key={step} delay={i * 90} as="li">
                    <div className="h-full rounded-xl border border-white/10 bg-white/5 p-4">
                      <span className="font-mono text-xs text-primary">0{i + 1}</span>
                      <p className="mt-2 text-sm font-medium text-white">{step}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* CTA band */}
            <Reveal delay={60}>
              <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary px-7 py-6">
                <p className="text-lg font-bold text-primary-foreground">
                  Tell us what you're building
                </p>
                <a
                  href="https://apacss.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="press inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  onClick={() => track("cta_inquiry", {})}
                >
                  Start a confidential inquiry
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
            <span>© {new Date().getFullYear()} APAC Supply Chain</span>
            <Link to="/login" className="transition-colors hover:text-primary">
              Admin sign in
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
