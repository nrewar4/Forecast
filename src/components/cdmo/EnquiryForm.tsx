import { useState } from "react";
import { Check, Loader2, Phone, Send } from "lucide-react";
import { CONTACT } from "@/data/contact";
import { track } from "@/lib/analytics";

// Enquiry capture. There is no backend, so submissions are stored on the device
// and the success state shows APAC's direct contact details. The submit fires
// cdmo_enquiry so the Admin Dashboard can count leads.
const STORE_KEY = "apac.enquiries.v1";

export function EnquiryForm({ context = "", compact = false }: { context?: string; compact?: boolean }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(context);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !name.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const rows = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      rows.push({ name, company, email, message, context, at: new Date().toISOString() });
      localStorage.setItem(STORE_KEY, JSON.stringify(rows.slice(-500)));
    } catch {
      // storage optional; the lead event still fires
    }
    track("cdmo_enquiry", { company: company || "unknown", hasContext: context ? "yes" : "no" });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-primary/30 bg-accent/40 p-5 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">Thank you, we will be in touch.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          For anything urgent, reach us directly.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <a href={CONTACT.phoneHref} className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary">
            <Phone className="h-3.5 w-3.5" /> {CONTACT.phone}
          </a>
          <a href={CONTACT.emailHref} className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary">
            {CONTACT.email}
          </a>
        </div>
      </div>
    );
  }

  const field = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary";

  return (
    <form onSubmit={onSubmit} className="space-y-2.5" noValidate>
      <div className={compact ? "space-y-2.5" : "grid gap-2.5 sm:grid-cols-2"}>
        <input className={field} placeholder="Your name" value={name} onChange={(e) => { setName(e.target.value); if (status === "error") setStatus("idle"); }} aria-label="Your name" />
        <input className={field} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} aria-label="Company" />
      </div>
      <input className={field} type="email" placeholder="Work email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} aria-label="Work email" />
      <textarea
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
        rows={compact ? 2 : 3}
        placeholder="What do you need? A molecule, a situation, a target scale."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Message"
      />
      {status === "error" ? (
        <p className="text-xs font-medium text-rose-600">Please add your name and a valid work email.</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="press inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send enquiry
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Or call {CONTACT.phone} · {CONTACT.email}
      </p>
    </form>
  );
}
