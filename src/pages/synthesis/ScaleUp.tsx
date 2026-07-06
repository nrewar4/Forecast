import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SynthesisShell } from "@/components/SynthesisShell";
import { Card, CardContent } from "@/components/ui";
import { NETWORK } from "@/data/network";
import { num } from "@/lib/utils";

const SCALES = [
  {
    stage: "Discovery",
    range: "mg to g",
    body: "Route feasibility runs and reference samples for analytical and biological work.",
  },
  {
    stage: "Pilot",
    range: "kg to 100 kg",
    body: "Process validation campaigns on pilot trains, generating the data needed for commercial commitment.",
  },
  {
    stage: "Commercial",
    range: "tonne and above",
    body: "Continuous supply on qualified plant capacity, with export handled end to end.",
  },
];

const ASSURANCES = [
  {
    title: "Certified plant capacity",
    body: `Production runs on existing certified capacity across our ${num(NETWORK.divisions[1].manufacturers)}-manufacturer pharmaceutical network, so projects scale without waiting for new plants.`,
  },
  {
    title: "cGMP compliant output",
    body: "Manufacturing partners are audited for cGMP compliance, with documentation packages prepared for the destination market.",
  },
  {
    title: "Export and delivery",
    body: "Shipments from Asia to the USA, EU and Canada with regulatory paperwork, logistics and customs managed for you.",
  },
];

export default function SynthesisScaleUp() {
  return (
    <SynthesisShell
      title="Scale-up & Manufacturing"
      subtitle="From first grams to reliable commercial supply."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {SCALES.map((s, i) => (
          <Card key={s.stage}>
            <CardContent className="p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Stage 0{i + 1}
              </span>
              <p className="mt-2 text-lg font-semibold text-ink">{s.stage}</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary">{s.range}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight text-ink">Manufacturing you can audit</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ASSURANCES.map((a) => (
          <Card key={a.title}>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-accent/40 p-5">
        <p className="text-sm text-foreground/90">
          Ready to move a molecule toward manufacturing?
        </p>
        <Link
          to="/synthesis/enquiry"
          className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
        >
          Start a project <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SynthesisShell>
  );
}
