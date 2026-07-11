import { ArrowRight } from "lucide-react";
import type { Feasibility } from "@/lib/chatAssistant";
import { cn } from "@/lib/utils";

// Path B result: official identity and CAS (PubChem), a short description, the
// core chemistry, the APAC vendor match as a count only, and cited sources.
// Clean typography, no decorative icons. Vendor identities are never shown.
export function FeasibilityReport({
  data,
  onContact,
  compact = false,
}: {
  data: Feasibility;
  onContact?: () => void;
  compact?: boolean;
}) {
  const { identity, description, classes, chemistries, properties, hazards, ip, match, sources } = data;
  const cid = identity?.cid ?? null;
  const cas = identity?.primaryCas ?? null;
  const structure = cid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=320x320`
    : null;

  return (
    <div className="space-y-2.5 text-left">
      {/* Identity */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-ink">{match.productName}</p>
            <p className="text-[11px] text-muted-foreground">{match.group} · {match.category}</p>
          </div>
          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {cid ? "Source: PubChem" : "Indicative"}
          </span>
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
          ) : null}
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
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">About</p>
          <p className="text-xs leading-relaxed text-foreground/90">{clamp(description, 320)}</p>
        </div>
      ) : null}

      {/* Chemical & physical properties, from PubChem */}
      {properties && (properties.physical.length > 0 || properties.computed.length > 0) ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Chemical &amp; physical properties</p>
            {cid ? (
              <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`} target="_blank" rel="noreferrer noopener" className="text-[10px] font-medium text-primary hover:underline">
                PubChem
              </a>
            ) : null}
          </div>
          {properties.physical.length > 0 ? (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {properties.physical.map((r) => (
                <div key={r.label} className="flex flex-col">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.label}</dt>
                  <dd className="text-xs font-medium text-foreground">{r.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {properties.computed.length > 0 ? (
            <div className={properties.physical.length > 0 ? "mt-3 border-t border-border pt-3" : ""}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                {properties.computed.map((r) => (
                  <div key={r.label} className="flex flex-col">
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.label}</dt>
                    <dd className="font-mono text-[11px] font-semibold text-foreground">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* GHS hazard classification, from PubChem */}
      {hazards ? (
        <div
          className={cn(
            "rounded-xl border p-4",
            hazards.status === "hazardous" ? "border-amber-300 bg-amber-50" : "border-border bg-card",
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Hazard classification</p>
            <a href={hazards.sourceUrl} target="_blank" rel="noreferrer noopener" className="text-[10px] font-medium text-primary hover:underline">
              Source: PubChem GHS
            </a>
          </div>
          {hazards.status === "hazardous" ? (
            <>
              <p className="text-sm font-semibold text-amber-900">
                Classified hazardous{hazards.signal ? ` · Signal word: ${hazards.signal}` : ""}
              </p>
              {hazards.classes.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {hazards.classes.map((c) => (
                    <span key={c} className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                      {c}
                    </span>
                  ))}
                </div>
              ) : null}
              {hazards.statements.length ? (
                <ul className="mt-2.5 space-y-1">
                  {hazards.statements.map((s) => (
                    <li key={s} className="text-[11px] leading-snug text-amber-900/90">{s}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : hazards.status === "not-classified" ? (
            <p className="text-sm font-medium text-foreground">Not classified as hazardous under GHS.</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              No GHS hazard classification listed in PubChem. Confirm the safety data sheet before handling.
            </p>
          )}
        </div>
      ) : null}

      {/* Core process chemistry needed to make it, the manufacturer match runs on this */}
      {chemistries.length ? (
        <div className="rounded-xl border border-primary/30 bg-card p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Core chemistry to make it</p>
            <span className="text-[10px] font-medium text-muted-foreground">From structure</span>
          </div>
          <p className="mb-2.5 text-[11px] leading-relaxed text-muted-foreground">
            The broad process chemistries this molecule needs. We match manufacturers who run them.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chemistries.map((c) => (
              <span key={c} className="rounded-lg border border-primary/40 bg-accent/60 px-2.5 py-1 text-xs font-semibold text-ink">
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Broad chemical classes, read from the PubChem structure */}
      {classes.length ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Chemical classes</p>
            {cid ? (
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[10px] font-medium text-primary hover:underline"
              >
                PubChem structure
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {classes.map((c) => (
              <span key={c} className="rounded-full border border-primary/30 bg-accent/40 px-2.5 py-1 text-xs font-medium text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Synthesis routes and patent status, from PubChem cross-references */}
      {ip ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Routes and patent status</p>
            <span className="text-[10px] font-medium text-muted-foreground">Source: PubChem</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={ip.patentUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="press rounded-lg border border-border bg-muted/40 p-3 transition hover:border-primary/50"
            >
              <p className="text-2xl font-bold leading-none tracking-tight text-ink">{ip.patentCount}</p>
              <p className="mt-1 text-[11px] font-medium text-foreground">Patented routes</p>
              <p className="text-[10px] text-muted-foreground">Patent-literature filings</p>
            </a>
            <a
              href={ip.literatureUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="press rounded-lg border border-border bg-muted/40 p-3 transition hover:border-primary/50"
            >
              <p className="text-2xl font-bold leading-none tracking-tight text-ink">{ip.literatureCount}</p>
              <p className="mt-1 text-[11px] font-medium text-foreground">Non-patented routes</p>
              <p className="text-[10px] text-muted-foreground">Open scientific literature</p>
            </a>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{ip.status}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Verify in</span>
            {[
              { name: "Google Patents", url: ip.googlePatentsUrl },
              { name: "WIPO", url: ip.wipoUrl },
              { name: "Espacenet", url: ip.espacenetUrl },
            ].map((l) => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* Vendor match: count only */}
      <div className="rounded-xl border border-primary/30 bg-accent/40 p-4">
        <p className="text-2xl font-bold leading-none tracking-tight text-ink">
          {match.vendorCount}
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">capable manufacturers</span>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {chemistries.length
            ? `In the APAC network, assessed as capable of the ${chemistries.join(", ").toLowerCase()} chemistry this needs. Identities are shared after contact.`
            : "In the APAC network, assessed as able to make this. Identities are shared after contact."}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.capabilities.map((c) => (
            <span key={c} className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>

      {data.aiSummary ? (
        <p className="rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-foreground/90">
          {data.aiSummary}
        </p>
      ) : null}

      {/* Sources */}
      {sources.length ? (
        <div className="rounded-xl border border-border bg-card p-3.5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sources</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
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
