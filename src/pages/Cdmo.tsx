import { useEffect } from "react";
import { FlaskConical, Factory, ShieldCheck, GitBranch, Boxes, Handshake } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";
import { track } from "@/lib/analytics";

const PATHS = [
  {
    icon: Factory,
    kicker: "Get a product made",
    title: "Feasibility in minutes",
    body: "Name a molecule and the assistant pulls its identity from PubChem, lays out the core chemistry, and tells you how many manufacturers in our network can make it. Then we connect you.",
  },
  {
    icon: GitBranch,
    kicker: "Plan a project",
    title: "A pathway, not a directory",
    body: "Describe your situation, a supplier to de-risk, a patent with no plant, a molecule that costs too much, and get a stage-by-stage development pathway with what you receive at each milestone.",
  },
];

const DELIVER = [
  { icon: Handshake, title: "Named governance", body: "A named project manager and lead chemist, a weekly technical call, and monthly steering." },
  { icon: ShieldCheck, title: "Stage-gate control", body: "Spend is released milestone by milestone, with a written gate you can stop at." },
  { icon: Boxes, title: "Matched capacity", body: "Development runs on existing certified plant capacity across Asia, not a plant we still have to build." },
  { icon: FlaskConical, title: "Quality by market", body: "cGMP for regulated work, ISO and REACH for industrial, with the documentation your market needs." },
];

export default function Cdmo() {
  // Suppress the global floating assistant while this page hosts its own.
  useEffect(() => {
    document.body.dataset.embeddedChat = "1";
    track("cdmo_view", {});
    return () => {
      delete document.body.dataset.embeddedChat;
    };
  }, []);

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-field [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(244,121,32,0.07),transparent_70%)]" />

        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-6 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
                CDMO and custom manufacturing
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl">
                Tell us what you are building. We show you the path.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Most buyers do not arrive knowing they need process development at kilo
                scale. They arrive with a problem. The assistant turns your problem into
                a plan, and connects you to manufacturers who can deliver it.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { v: 3200, s: "+", l: "Manufacturers" },
                  { v: 8900, s: "+", l: "Products" },
                  { v: 30, s: "+", l: "Countries" },
                ].map((k) => (
                  <div key={k.l} className="rounded-xl border border-border bg-card p-3 text-center shadow-card">
                    <p className="text-xl font-bold tabular-nums tracking-tight text-ink md:text-2xl">
                      <CountUp value={k.v} suffix={k.s} />
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{k.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Embedded assistant */}
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lift">
              <div className="flex items-center gap-2 border-b border-border bg-ink px-4 py-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15">
                  <FlaskConical className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">APAC CDMO Assistant</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal" /> Ask about any product or project
                  </p>
                </div>
              </div>
              <div className="h-[600px]">
                <ChatPanel variant="embedded" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Two paths */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Two ways in</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Both start in the assistant above and end with a scoped conversation with APAC.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {PATHS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="press group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.kicker}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How APAC delivers */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight text-ink">How APAC delivers</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              A directory tells you who exists. We tell you how your problem gets solved, and stand behind it.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVER.map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-card">
                  <d.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="mx-auto mb-6 max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Start a conversation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send the essentials and a specialist comes back with capable manufacturers and next steps.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <EnquiryForm context="cdmo-page" />
        </Reveal>
        <p className="mx-auto mt-6 max-w-xl text-center text-[11px] leading-relaxed text-muted-foreground">
          Route and feasibility information is a preliminary technical evaluation only.
          It is not freedom-to-operate, regulatory, safety, or commercial manufacturing
          advice. Final route selection is reviewed by qualified process chemists and,
          where relevant, IP counsel.
        </p>
      </section>
    </MarketingLayout>
  );
}
