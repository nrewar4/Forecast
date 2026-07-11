import { useEffect } from "react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";
import { useChat } from "@/context/Chat";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const PATHS = [
  {
    title: "Get a product made",
    body: "Name a molecule and the assistant returns its verified identity and CAS from PubChem, the core chemistry, and how many manufacturers in our network can make it. Then we connect you.",
  },
  {
    title: "Plan a project",
    body: "Describe your situation, a supplier to de-risk, a patent with no plant, a molecule that costs too much, and get a stage-by-stage development pathway with what you receive at each milestone.",
  },
];

const DELIVER = [
  { title: "Named governance", body: "A named project manager and lead chemist, a weekly technical call, and monthly steering." },
  { title: "Stage-gate control", body: "Spend is released milestone by milestone, with a written gate you can stop at." },
  { title: "Matched capacity", body: "Development runs on existing certified plant capacity across Asia, not a plant we still have to build." },
  { title: "Quality by market", body: "cGMP for regulated work, ISO and REACH for industrial, with the documentation your market needs." },
];

export default function Cdmo() {
  // Grow the embedded assistant once the visitor starts interacting, so it opens
  // compact and expands seamlessly into a working surface as the chat fills.
  const { messages, busy } = useChat();
  const active = busy || messages.some((m) => m.role === "user");

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
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(244,121,32,0.06),transparent_70%)]" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-6 py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:py-20">
          <div>
            <Reveal>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl">
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
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lift transition-shadow duration-500 lg:sticky lg:top-24">
              <div className="border-b border-border bg-ink px-4 py-3">
                <p className="text-sm font-semibold text-white">APAC CDMO Assistant</p>
                <p className="text-[11px] text-slate-300">Ask about any product or project</p>
              </div>
              <div
                className={cn(
                  "transition-[height] duration-500 ease-out-expo motion-reduce:transition-none",
                  active ? "h-[min(86vh,900px)]" : "h-[440px]",
                )}
              >
                <ChatPanel />
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
              <div className="press h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift">
                <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
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
                  <h3 className="text-sm font-semibold text-ink">{d.title}</h3>
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
