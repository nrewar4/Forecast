import { ArrowRight, BookOpen, FlaskConical, Factory, Hash, ShieldCheck } from "lucide-react";
import type { Feasibility } from "@/lib/chatAssistant";
import { cn } from "@/lib/utils";

// Renders the Path B result: official identity and CAS (PubChem), a short
// description, the core chemistry, and the APAC vendor match as a count only.
// Used inline in the chat and full-width on the CDMO page. Vendor identities are
// never shown, by design.
export function FeasibilityReport({
  data,
  onContact,
  compact = false,
}: {
  data: Feasibility;
  onContact?: () => void;
  compact?: boolean;
}) {
  const { identity, description, chemistry, match } = data;
  const cid = identity?.cid ?? null;
  const cas = identity?.primaryCas ?? null;
  const structure = cid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=320x320`
    : null;

  return (
    <div className="space-y-2.5 text-left">
      {/* Identity */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-gradient-to-r from-accent/60 to-transparent px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-ink">{match.productName}</p>
            <p className="text-[11px] text-muted-foreground">{match.group} · {match.category}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {cas ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                <Hash className="h-2.5 w-2.5" /> {cas}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
                cid ? "bg-teal/10 text-teal ring-1 ring-inset ring-teal/25" : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
              )}
            >
              {cid ? "PubChem" : "Indicative"}
            </span>
          </div>
        </div>

        <div className="flex gap-4 p-4">
          {structure ? (
            <img
              src={structure}
              alt={`2D structure of ${match.productName}`}
              width={92}
              height={92}
              loading="lazy"
              className="h-[92px] w-[92px] shrink-0 rounded-lg border border-border bg-white object-contain p-1"
            />
          ) : (
            <div className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
              <FlaskConical className="h-6 w-6" />
            </div>
          )}
          <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <Field label="CAS number" value={cas || "Not listed"} mono />
            <Field label="PubChem CID" value={cid ? String(cid) : "Not resolved"} mono />
            <Field label="Formula" value={identity?.formula || "N/A"} mono />
            <Field label="Mol. weight" value={identity?.mw ? `${identity.mw} g/mol` : "N/A"} mono />
          </dl>
        </div>
      </div>

      {/* Description */}
      {description ? (
        <div className="rounded-xl border border-border bg-card p-3.5">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> About
          </p>
          <p className="text-xs leading-relaxed text-foreground/90">{clamp(description, 300)}</p>
          <p className="mt-1.5 text-[10px] text-muted-foreground">Source: PubChem</p>
        </div>
      ) : null}

      {/* Core chemistry */}
      {chemistry ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <FlaskConical className="h-3.5 w-3.5 text-primary" /> Core chemistry
            </p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {chemistry.source === "catalog" ? "Verified route" : "Compiled summary"}
            </span>
          </div>
          <ol className="space-y-1.5">
            {chemistry.route.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground">
                <span className="mt-0.5 font-mono text-[11px] font-semibold text-primary-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>
          {chemistry.startingMaterials.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Key inputs</span>
              {chemistry.startingMaterials.map((m) => (
                <span key={m} className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                  {m}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-3 border-t border-border pt-2 text-[11px] leading-relaxed text-muted-foreground">
            {chemistry.hazardNote}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3.5 text-xs text-muted-foreground">
          Our process chemists compile the detailed route for this molecule during the feasibility assessment.
        </div>
      )}

      {/* Vendor match: count only */}
      <div className="overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-accent/60 to-accent/20 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none tracking-tight text-ink">
              {match.vendorCount}
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">capable manufacturers</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              In the APAC network, assessed as able to make this. Identities are shared after contact.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.capabilities.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-foreground"
            >
              <ShieldCheck className="h-3 w-3 text-teal" /> {c}
            </span>
          ))}
        </div>
      </div>

      {data.aiSummary ? (
        <p className="rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-foreground/90">
          {data.aiSummary}
        </p>
      ) : null}

      {onContact ? (
        <button
          type="button"
          onClick={onContact}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-600"
        >
          Discuss this with APAC <ArrowRight className="h-4 w-4" />
        </button>
      ) : null}

      {!compact ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Preliminary technical evaluation only. Not freedom-to-operate, regulatory,
          safety, or commercial manufacturing advice. Final route selection is
          reviewed by qualified process chemists and, where relevant, IP counsel.
        </p>
      ) : null}
    </div>
  );
}

function clamp(text: string, n: number): string {
  const clean = text.trim();
  return clean.length > n ? clean.slice(0, n).replace(/\s+\S*$/, "") + "…" : clean;
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 font-semibold text-foreground", mono && "font-mono text-[11px]")}>
        {value}
      </dd>
    </div>
  );
}
