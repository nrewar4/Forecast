import { ArrowRight, FlaskConical, Phone, Route, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Reveal } from "@/components/ui/Reveal";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";
import { CONTACT, TECH_DISCLAIMER } from "@/data/contact";

const PATHS = [
  {
    icon: Route,
    tag: "Path A",
    title: "Map my development pathway",
    body: "Describe your situation. A supplier to de-risk, a patent with no plant, a molecule that costs too much. The assistant returns a phased CDMO pathway with what you receive at each milestone and the gate where you can walk away.",
    points: ["Assess, develop, scale, transfer, supply", "Deliverables and walk-away gates", "A plan you can share internally"],
  },
  {
    icon: FlaskConical,
    tag: "Path B",
    title: "Check if a product can be made",
    body: "Name a molecule, CAS number, or structure. We confirm identity from PubChem, outline the core chemistry, and tell you how many manufacturers in the APAC network are relevant. Vendor names stay private until we talk.",
    points: ["Official PubChem identity", "Core chemistry and hazards", "A manufacturer count, never names"],
  },
];

export default function Cdmo() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-24">
          <Reveal>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              APAC CDMO
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl">
              Tell us the problem. We map the path.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              A directory makes you already know what you need. This does the opposite. Describe your
              situation or name a molecule, and get a scoped route to a decision.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#assistant" className="press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600">
                Start with the assistant <ArrowRight className="h-4 w-4" />
              </a>
              <a href={CONTACT.phoneHref} className="press inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <Phone className="h-4 w-4" /> {CONTACT.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Two paths */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {PATHS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.tag} delay={i * 90}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-colors duration-200 hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{p.tag}</p>
                      <h2 className="text-lg font-bold tracking-tight text-ink">{p.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-foreground/85">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Embedded assistant */}
      <section id="assistant" className="border-t border-border bg-muted/40 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">The assistant</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">Ask it anything about making your product</h2>
              <p className="mt-3 text-base text-muted-foreground">
                It works from official and catalog data first, so answers are precise and grounded, never invented.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-card" style={{ height: "min(640px, 80vh)" }}>
              <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <p className="text-sm font-semibold text-ink">APAC Assistant</p>
              </div>
              <div className="h-[calc(100%-49px)]">
                <ChatPanel embedded />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Enquiry / contact */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">Talk to APAC</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">Get your project scoped</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Share a molecule or a situation and our team comes back with identity, route, qualified sources and
                an indicative cost. No obligation.
              </p>
              <div className="mt-6 space-y-3">
                <a href={CONTACT.phoneHref} className="press flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary"><Phone className="h-4 w-4" /></span>
                  {CONTACT.phone}
                </a>
                <a href={CONTACT.emailHref} className="press flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary"><ShieldCheck className="h-4 w-4" /></span>
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-[11px] leading-relaxed text-muted-foreground">
          {TECH_DISCLAIMER}
        </p>
      </section>
    </MarketingLayout>
  );
}
