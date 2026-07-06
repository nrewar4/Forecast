import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { subscribe } from "@/lib/publications/store";
import { PUBLICATION_LABELS, type PublicationSlug } from "@/lib/publications/types";
import { cn } from "@/lib/utils";

const ALL_PUBS: PublicationSlug[] = ["asia-source", "insight"];

// Public subscribe form used on the Landing page and the Publications index.
// Stores the email in Supabase when configured, otherwise on the device.
export function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [pubs, setPubs] = useState<PublicationSlug[]>(ALL_PUBS);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function togglePub(p: PublicationSlug) {
    setPubs((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    if (pubs.length === 0) {
      setStatus("error");
      setMessage("Choose at least one publication.");
      return;
    }
    setStatus("loading");
    try {
      const res = await subscribe(email, pubs);
      setStatus("done");
      setMessage(res.message);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm text-accent-foreground",
          className,
        )}
        role="status"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" />
        </span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@company.com"
            aria-label="Email address"
            className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="press inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Send me:</span>
        {ALL_PUBS.map((p) => {
          const on = pubs.includes(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => togglePub(p)}
              aria-pressed={on}
              className={cn(
                "press inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                on
                  ? "border-primary/40 bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {on ? <Check className="h-3 w-3" /> : null}
              {PUBLICATION_LABELS[p]}
            </button>
          );
        })}
      </div>

      {status === "error" ? (
        <p className="text-xs font-medium text-rose-600" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
