import { useState } from "react";
import { ArrowRight, ExternalLink, ListOrdered } from "lucide-react";
import type { Feasibility } from "@/lib/chatAssistant";
import type { SourceCount } from "@/lib/patents";
import { cn } from "@/lib/utils";

// Reconciled count across sources: a single number when they agree, else a range.
function rangeLabel(range: [number, number] | null): string {
  if (!range) return "—";
  return range[0] === range[1] ? String(range[0]) : `${range[0]}–${range[1]}`;
}

// Per-source breakdown, each linking to the database the figure came from.
function SourceRows({ rows }: { rows: SourceCount[] }) {
  return (
    <ul className="mt-2 space-y-0.5 border-t border-border pt-2">
      {rows.map((r) => (
        <li key={r.source} className="flex items-center justify-between gap-2 text-[10px]">
          <a href={r.url} target="_blank" rel="noreferrer noopener" className="truncate text-muted-foreground hover:text-primary hover:underline">
            {r.source}
          </a>
          <span className="shrink-0 font-mono font-semibold text-foreground">{r.count === null ? "n/a" : r.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}

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
  const { identity, description, classes, route, consultLinks, properties, hazards, ip, match, sources } = data;
  // Manufacturer ranking is opt-in: by default we show only how many capable
  // vendors were found, and the user asks for the ranked shortlist explicitly.
  const [showRanking, setShowRanking] = useState(false);
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

        {identity?.iupac ? (
          <div className="border-t border-border px-4 py-2.5">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">IUPAC name</dt>
            <dd className="mt-0.5 break-words text-xs font-medium leading-snug text-foreground">{identity.iupac}</dd>
          </div>
        ) : null}
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

      {/* Core process chemistry needed to make it. This is the ACTUAL documented
          route found online (PubChem Methods of Manufacturing, Wikipedia, or a
          web search of verified references), never inferred from the structure.
          When no documented route is found we say so and link the verified
          references for the user to look it up, rather than showing a guess. */}
      {route && route.reactions.length ? (
        <div className="rounded-xl border border-primary/30 bg-card p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Core chemistry to make it</p>
            <a href={route.source.url} target="_blank" rel="noreferrer noopener" className="shrink-0 text-[10px] font-medium text-primary hover:underline">
              {route.grounding === "ai" ? "AI-researched" : "Verified"} · {route.source.name}
            </a>
          </div>
          <p className="mb-2.5 text-[11px] leading-relaxed text-muted-foreground">
            {route.grounding === "ai"
              ? "The reactions its published synthesis uses, researched from chemistry references. Verify against the cited source before relying on it."
              : `The specific reactions its documented synthesis uses${route.confirmedByName ? ", confirmed against the IUPAC name" : ""}.`}
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {route.reactions.map((r) => (
              <span key={r} className="rounded-lg border border-primary/40 bg-accent/60 px-2.5 py-1 text-xs font-semibold text-ink">
                {r}
              </span>
            ))}
          </div>
          {route.steps.length ? (
            <ul className="mb-3 space-y-1 border-l-2 border-primary/30 pl-3">
              {route.steps.map((s) => (
                <li key={s} className="text-[11px] leading-snug text-foreground/80">{s}</li>
              ))}
            </ul>
          ) : null}
          {route.categories.length ? (
            <div className="border-t border-border pt-2.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Broad categories matched to manufacturers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {route.categories.map((c) => (
                  <span key={c} className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Core chemistry to make it</p>
          <p className="mb-2.5 text-[11px] leading-relaxed text-muted-foreground">
            We could not find a documented synthesis route for this molecule in our verified
            sources, so we are not showing one. We do not infer the chemistry from the
            structure. Look up the published route in these references:
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {consultLinks.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                {l.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}

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

      {/* Synthesis routes + patent status, cross-verified across databases */}
      {ip ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Routes and patent status</p>
            <span className="text-[10px] font-medium text-muted-foreground">
              {(() => {
                const n = Math.max(ip.patentSources, ip.literatureSources);
                return n > 0 ? `Cross-verified · ${n} source${n === 1 ? "" : "s"}` : "Search the patent offices";
              })()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-2xl font-bold leading-none tracking-tight text-ink">{rangeLabel(ip.patentRange)}</p>
              <p className="mt-1 text-[11px] font-medium text-foreground">Patented routes</p>
              <SourceRows rows={ip.patents} />
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-2xl font-bold leading-none tracking-tight text-ink">{rangeLabel(ip.literatureRange)}</p>
              <p className="mt-1 text-[11px] font-medium text-foreground">Non-patented routes</p>
              <SourceRows rows={ip.literature} />
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{ip.status}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Verify in</span>
            {ip.links.map((l) => (
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

      {/* Manufacturer match. By default we show only how many network vendors can
          run this chemistry. Ranking them is opt-in: the user chooses to reveal a
          scored shortlist. Names are revealed only after contact. */}
      {match.matchedCount > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-[linear-gradient(135deg,rgba(244,121,32,0.10),transparent_60%)] p-4 shadow-card sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Capable manufacturers</p>
            <span className="text-[10px] font-medium text-muted-foreground">{match.assessed} network vendors screened</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold leading-none tracking-tight text-ink tabular-nums">{match.matchedCount}</span>
            <span className="text-sm font-medium text-muted-foreground">can run this chemistry</span>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            Screened on each vendor&apos;s own listed chemistry against the {match.requiredCapabilities.length} specific {match.requiredCapabilities.length === 1 ? "chemistry" : "chemistries"} this product needs. Identities are shared after you contact APAC.
          </p>

          {/* Opt-in ranking control */}
          <button
            type="button"
            onClick={() => setShowRanking((v) => !v)}
            aria-expanded={showRanking}
            className="press mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-card px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-accent/60"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            {showRanking ? "Hide ranking" : "Rank these manufacturers"}
          </button>

          {showRanking ? (
          <>
          <ol className="mt-3 space-y-2">
            {match.shortlist.map((v) => (
              <li key={v.rank} className="rounded-xl border border-border bg-card/80 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary tabular-nums">{v.rank}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{v.label}</p>
                      <p className="text-[10px] text-muted-foreground">{v.country}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold", tierClass(v.tier))}>Class {v.tier}</span>
                    <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{v.confidence}</span>
                  </div>
                </div>

                {/* Coverage bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/70">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(v.coverage * 100)}%` }} />
                  </div>
                  <span className="shrink-0 font-mono text-[10px] font-semibold text-foreground tabular-nums">{v.covered}/{v.required} chemistries</span>
                </div>

                {/* Evidence: the vendor's own listed chemistry that matched */}
                {v.evidence.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {v.evidence.slice(0, 5).map((e) => (
                      <span
                        key={e.capability}
                        title={e.phrases.join(" · ")}
                        className="rounded border border-primary/30 bg-accent/50 px-1.5 py-0.5 text-[10px] font-medium text-ink"
                      >
                        {e.phrases[0] || e.capability}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Gaps to confirm in an RFQ */}
                {v.gaps.length ? (
                  <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">
                    <span className="font-semibold text-foreground/70">Confirm in RFQ:</span> {v.gaps.join(", ").toLowerCase()}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          {match.matchedCount > match.shortlist.length ? (
            <p className="mt-2 text-[10px] font-medium text-muted-foreground">
              Showing the top {match.shortlist.length} of {match.matchedCount} matched manufacturers.
            </p>
          ) : null}
          </>
          ) : null}
          <p className="mt-3 border-t border-border pt-2 text-[10px] leading-snug text-muted-foreground">
            A chemistry match does not confirm available capacity, willingness, freedom to operate, or GMP status; those are verified during qualification.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Capable manufacturers</p>
          <p className="mt-1.5 text-base font-semibold text-ink">No network vendor lists enough of this chemistry</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {match.requiredCapabilities.length
              ? `Across ${match.assessed} screened vendors, none list enough of the ${match.requiredCapabilities.join(", ").toLowerCase()} this product needs.`
              : "We could not resolve the specific chemistry this product needs to screen the network."}{" "}
            Contact APAC and we will work to source a capable partner.
          </p>
        </div>
      )}

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

function tierClass(tier: "A" | "B" | "C"): string {
  if (tier === "A") return "bg-primary/15 text-primary";
  if (tier === "B") return "bg-emerald-100 text-emerald-800";
  return "bg-muted text-muted-foreground";
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
