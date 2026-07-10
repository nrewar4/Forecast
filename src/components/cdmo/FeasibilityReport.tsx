import { ArrowRight, FlaskConical, Factory, ShieldCheck } from "lucide-react";
import type { Feasibility } from "@/lib/chatAssistant";
import { cn } from "@/lib/utils";

// Renders the Path B result: official identity (PubChem), core chemistry, and
// the APAC vendor match as a count only. Used inline in the chat and full-width
// on the CDMO page. Vendor identities are never shown, by design.
export function FeasibilityReport({
  data,
  onContact,
  compact = false,
}: {
  data: Feasibility;
  onContact?: () => void;
  compact?: boolean;
}) {
  const { pubchem, chemistry, match } = data;
  const cid = pubchem?.cid ?? null;
  const structure = cid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=300x300`
    : null;

  return (
    <div className="space-y-3 text-left">
      {/* Identity */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{match.productName}</p>
            <p className="text-[11px] text-muted-foreground">{match.group} · {match.category}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
              cid ? "bg-teal/10 text-teal ring-1 ring-inset ring-teal/25" : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
            )}
          >
            {cid ? "PubChem" : "Catalog"}
          </span>
        </div>

        <div className="flex gap-4 p-4">
          {structure ? (
            <img
              src={structure}
              alt={`2D structure of ${match.productName}`}
              width={96}
              height={96}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
            />
          ) : (
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
              <FlaskConical className="h-6 w-6" />
            </div>
          )}
          <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <Field label="PubChem CID" value={cid ? String(cid) : "Not resolved"} />
            <Field label="Formula" value={pubchem?.formula || "N/A"} mono />
            <Field label="Mol. weight" value={pubchem?.mw ? `${pubchem.mw} g/mol` : "N/A"} mono />
            <Field label="Plant type" value={match.plantType} />
          </dl>
        </div>
      </div>

      {/* Core chemistry */}
      {chemistry ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-primary" /> Core chemistry
          </p>
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
          <p className="mt-3 border-t border-border pt-2 text-[11px] leading-relaxed text-muted-foreground">
            {chemistry.hazardNote}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
          Detailed process chemistry for this molecule is prepared by our process
          chemists during the feasibility assessment.
        </div>
      )}

      {/* Vendor match: count only */}
      <div className="rounded-xl border border-primary/30 bg-accent/40 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none tracking-tight text-ink">
              {match.vendorCount}
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                manufacturers can make this
              </span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              In the APAC network, assessed as capable. Identities are shared after contact.
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
