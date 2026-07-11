import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Mail, Phone } from "lucide-react";
import { CONTACT } from "@/data/contact";
import { track } from "@/lib/analytics";
import { rateLimit, LIMITS, retryHint } from "@/lib/rateLimit";
import { sanitizeText, sanitizeChemQuery, isValidEmail, looksMalicious } from "@/lib/sanitize";

// The conversion surface. Captures an enquiry, records it locally, fires a
// tracked event for the Admin Dashboard, and hands off to email so the lead
// reaches APAC even without a backend. Phone and email are always visible.
const ENQUIRIES_KEY = "apac.cdmo_enquiries.v1";

type Enquiry = {
  name: string;
  company: string;
  email: string;
  product: string;
  message: string;
  context: string;
  submittedAt: string;
};

function saveEnquiry(entry: Enquiry): void {
  try {
    const prev = JSON.parse(localStorage.getItem(ENQUIRIES_KEY) ?? "[]") as Enquiry[];
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([entry, ...prev].slice(0, 200)));
  } catch {
    // storage unavailable; the mailto handoff still carries the enquiry
  }
}

const inputCls =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary";

export function EnquiryForm({
  presetProduct = "",
  context = "cdmo",
  compact = false,
}: {
  presetProduct?: string;
  context?: string;
  compact?: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: presetProduct,
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate and sanitise every field at the boundary. Nothing reaches storage
    // or the mailto (or a future backend) unvalidated. See src/lib/sanitize.ts.
    const clean: Enquiry = {
      name: sanitizeText(form.name, 120),
      company: sanitizeText(form.company, 160),
      email: form.email.trim().slice(0, 254),
      product: sanitizeChemQuery(form.product, 160),
      message: sanitizeText(form.message, 2000),
      context,
      submittedAt: new Date().toISOString(),
    };

    if (!clean.name || !clean.company) return setError("Please add your name and company.");
    if (!isValidEmail(clean.email)) return setError("Please enter a valid work email.");
    if (looksMalicious(clean.message) || looksMalicious(clean.name)) {
      return setError("That submission could not be processed. Please rephrase.");
    }

    const gate = rateLimit("enquiry", LIMITS.enquiry);
    if (!gate.ok) return setError(`Too many submissions. Please wait ${retryHint(gate.retryAfterMs)} and try again.`);

    setBusy(true);
    saveEnquiry(clean);
    track("cdmo_enquiry", { context, product: clean.product || "unspecified" });

    const subject = `CDMO enquiry: ${clean.product || "new project"}`;
    const body = [
      `Name: ${clean.name}`,
      `Company: ${clean.company}`,
      `Email: ${clean.email}`,
      `Product / molecule: ${clean.product}`,
      "",
      clean.message,
    ].join("\n");
    window.location.href = `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center animate-scale-in">
        <CheckCircle2 className="h-9 w-9 text-teal" />
        <p className="mt-3 text-base font-semibold text-ink">Thank you</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your enquiry is on its way to APAC. We respond {CONTACT.responseSla}. If your
          email client did not open, reach us directly below.
        </p>
        <ContactRow className="mt-4" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-ink">Contact APAC about your project</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Tell us the essentials and we will come back {CONTACT.responseSla} with capable
        manufacturers and next steps. Enquiries are treated as confidential.
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input required placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        <input required placeholder="Company" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
        <input required type="email" placeholder="Work email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
        <input placeholder="Product or molecule" value={form.product} onChange={(e) => set("product", e.target.value)} className={inputCls} />
        <textarea
          placeholder="What are you looking to make or de-risk? Quantities, timeline, quality needs."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={compact ? 2 : 3}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary sm:col-span-2"
        />
        {error ? (
          <p className="text-xs font-medium text-red-600 sm:col-span-2" role="alert">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send enquiry
        </button>
      </form>

      <div className="mt-4 border-t border-border pt-4">
        <ContactRow />
      </div>
    </div>
  );
}

export function ContactRow({ className = "" }: { className?: string }) {
  return (
    <div className={"flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm " + className}>
      <a href={CONTACT.phoneHref} className="press inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
        <Phone className="h-4 w-4 text-primary" /> {CONTACT.phoneDisplay}
      </a>
      <a href={CONTACT.emailHref} className="press inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
        <Mail className="h-4 w-4 text-primary" /> {CONTACT.email}
      </a>
    </div>
  );
}
