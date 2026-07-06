import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SynthesisShell } from "@/components/SynthesisShell";
import { Card, CardContent } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";

const CONTACT_EMAIL = "info@apacss.com";
const ENQUIRIES_KEY = "apac.synthesis_enquiries.v1";

type Enquiry = {
  name: string;
  company: string;
  email: string;
  molecule: string;
  scale: string;
  brief: string;
  submittedAt: string;
};

function saveEnquiry(entry: Enquiry): void {
  try {
    const existing = JSON.parse(localStorage.getItem(ENQUIRIES_KEY) ?? "[]") as Enquiry[];
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([entry, ...existing].slice(0, 100)));
  } catch {
    // storage unavailable; the mailto path still carries the enquiry
  }
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary";

export default function SynthesisEnquiry() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    molecule: "",
    scale: "Pilot (kg to 100 kg)",
    brief: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    saveEnquiry({ ...form, submittedAt: new Date().toISOString() });
    trackEvent("synthesis_enquiry");

    const subject = `CDMO project enquiry: ${form.molecule || "new molecule"}`;
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `Target molecule / CAS: ${form.molecule}`,
      `Scale: ${form.scale}`,
      "",
      form.brief,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSubmitting(false);
    setDone(true);
  }

  return (
    <SynthesisShell
      title="Start a Project"
      subtitle="Send a confidential brief and we will match it to plant capability."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardContent className="p-6">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center animate-scale-in">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <h2 className="mt-4 text-lg font-semibold text-ink">Brief prepared</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Your email client should have opened with the brief addressed to{" "}
                  <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>. If it
                  did not, write to us directly and we will respond within two business days.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="press mt-6 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  Send another brief
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Your name
                  </label>
                  <input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Company
                  </label>
                  <input id="company" required value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Work email
                  </label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="molecule" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Target molecule or CAS number
                  </label>
                  <input id="molecule" required value={form.molecule} onChange={(e) => set("molecule", e.target.value)} className={inputClass} placeholder="e.g. ibuprofen or 15687-27-1" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="scale" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Target scale
                  </label>
                  <select id="scale" value={form.scale} onChange={(e) => set("scale", e.target.value)} className={inputClass}>
                    <option>Discovery (mg to g)</option>
                    <option>Pilot (kg to 100 kg)</option>
                    <option>Commercial (tonne and above)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="brief" className="mb-1.5 block text-xs font-semibold text-foreground">
                    Project brief
                  </label>
                  <textarea
                    id="brief"
                    rows={5}
                    value={form.brief}
                    onChange={(e) => set("brief", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Timeline, quantities, quality requirements, anything else we should know."
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Send brief
                  </button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Briefs are treated as confidential. We are happy to sign an NDA before any detailed discussion.
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="self-start">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-ink">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                "We review the brief and come back within two business days.",
                "Your molecule is matched to plant capability in the network.",
                "Feasibility review and sampling, under NDA where needed.",
                "Scale-up agreement, production and delivery.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-mono text-xs font-semibold text-primary-600">0{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              Prefer email? Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </SynthesisShell>
  );
}
