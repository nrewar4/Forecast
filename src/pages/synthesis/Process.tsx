import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SynthesisShell } from "@/components/SynthesisShell";
import { Card, CardContent } from "@/components/ui";

const CAPABILITIES = [
  {
    title: "Route scouting",
    body: "ML-assisted retrosynthesis and literature mining surface viable routes early, with freedom-to-operate signals before capital is committed.",
  },
  {
    title: "Process optimization",
    body: "Catalyst recycle, flow chemistry, solvent recovery and step telescoping lift yield and cut process mass intensity.",
  },
  {
    title: "Cost and FTO analysis",
    body: "Cost-driver breakdowns and patent-landscape checks quantify what a route will really cost to run at scale.",
  },
  {
    title: "Analytical development",
    body: "Method development and validation grow alongside the chemistry so quality data is ready when the process is.",
  },
];

const STAGES = [
  {
    step: "01",
    title: "Feasibility",
    body: "We review the molecule brief, run route generation, and return a feasibility read with cost drivers and risks.",
  },
  {
    step: "02",
    title: "Lab demonstration",
    body: "The chosen route is demonstrated at gram scale and the process parameters that matter are locked down.",
  },
  {
    step: "03",
    title: "Optimization",
    body: "Yield, purity, cycle time and solvent load are tuned against the target cost of goods.",
  },
  {
    step: "04",
    title: "Tech transfer",
    body: "A complete process package moves to the matched plant, with our chemists supporting the first campaigns.",
  },
];

export default function SynthesisProcess() {
  return (
    <SynthesisShell
      title="Process Development"
      subtitle="How a candidate route becomes a manufacturing process."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {CAPABILITIES.map((c, i) => (
          <Card key={c.title} className="animate-fade-up" >
            <CardContent className="p-5" >
              <h3 className="text-base font-semibold text-ink">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight text-ink">
        From brief to transferred process
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((s) => (
          <Card key={s.step}>
            <CardContent className="p-5">
              <span className="font-mono text-xs font-semibold text-primary-600">{s.step}</span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-accent/40 p-5">
        <p className="text-sm text-foreground/90">
          Have a target molecule? Generate candidate routes and a production analysis first.
        </p>
        <Link
          to="/synthesis/routes"
          className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
        >
          Open route explorer <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SynthesisShell>
  );
}
