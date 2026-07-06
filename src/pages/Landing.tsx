import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  FlaskConical,
  Newspaper,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { SubscribeForm } from "@/components/SubscribeForm";

type Option = {
  key: string;
  to: string;
  external?: boolean; // when true, `to` is an absolute URL opened in a new tab
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
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
      "Source bulk chemicals and APIs from vetted, certified manufacturers on the APAC Supply Chain storefront.",
    icon: ShoppingCart,
    bullets: ["Vetted manufacturer shortlist", "Catalog and pricing", "Request a quote"],
  },
  {
    key: "knowledge",
    to: "/dashboard",
    eyebrow: "Workspace",
    title: "Knowledge",
    description:
      "Our sourcing intelligence workspace: product knowledge base, trade analytics, demand forecasting, and ML-assisted synthesis routes.",
    icon: BookOpen,
    bullets: ["Synthesis routes and CDMO intelligence", "Trade analytics and forecasts", "FDA Orange and Purple Book"],
    featured: true,
  },
  {
    key: "publications",
    to: "/publications",
    eyebrow: "Fortnightly briefings",
    title: "Publications",
    description:
      "Asia Source and Insight, our fortnightly reads on chemical sourcing. Every issue is source backed and free to follow by email.",
    icon: Newspaper,
    bullets: ["Asia Source sourcing brief", "Insight feature articles", "Free email subscription"],
  },
  {
    key: "custom-synthesis",
    to: "/custom-synthesis",
    eyebrow: "CDMO services",
    title: "Custom Synthesis",
    description:
      "Contract development and manufacturing: route scouting, process optimization, and scale-up from gram to tonne.",
    icon: FlaskConical,
    bullets: ["Route scouting and FTO signals", "Process optimization", "Pilot to commercial scale"],
  },
];

function OptionCard({ option, index }: { option: Option; index: number }) {
  const Icon = option.icon;
  const cardClass = cn(
    "press group relative flex flex-col rounded-2xl border bg-card p-6 text-left shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo",
    "hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1",
    option.featured
      ? "border-primary/40 ring-1 ring-primary/10 hover:border-primary"
      : "border-border hover:border-primary/50",
  );

  const inner = <OptionCardBody option={option} />;

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

function OptionCardBody({ option }: { option: Option }) {
  const Icon = option.icon;
  return (
    <>
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl transition-colors duration-200",
          option.featured
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {option.eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{option.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.description}</p>

      <ul className="mt-4 space-y-1.5">
        {option.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-xs text-foreground/80">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            {b}
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
          option.featured ? "text-primary" : "text-foreground",
        )}
      >
        {option.external ? "Visit storefront" : option.featured ? "Enter platform" : "Explore"}
        {option.external ? (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
        )}
      </span>
    </>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle warm field — restrained, no gradient blobs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_75%)]"
      />

      {/* Top bar */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" aria-label="APAC — Supply Chain | CDMO home">
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
            Chemical sourcing, intelligence & custom manufacturing
          </span>
          <h1 className="mt-5 animate-fade-up text-4xl font-bold tracking-tight text-ink md:text-6xl">
            One platform for sourcing,
            <br className="hidden sm:block" />
            <span className="text-primary"> knowledge</span> and synthesis.
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:60ms]">
            From buying bulk chemicals to ML-assisted route design and CDMO
            production intelligence. Pick where you want to start.
          </p>
        </div>

        {/* Entry options */}
        <div className="stagger mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {OPTIONS.map((o, i) => (
            <OptionCard key={o.key} option={o} index={i} />
          ))}
        </div>

        {/* Subscribe strip */}
        <div className="mx-auto mt-14 max-w-3xl animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Free fortnightly
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Get Asia Source and Insight in your inbox
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              A concise, source-backed read on chemical sourcing every two weeks.
              No spam, unsubscribe anytime.
            </p>
          </div>
          <div className="mx-auto mt-5 max-w-lg">
            <SubscribeForm />
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Trusted by procurement, R&amp;D and CDMO teams. Data from PubChem, openFDA, OpenAlex and trade records.
        </p>
      </main>
    </div>
  );
}
