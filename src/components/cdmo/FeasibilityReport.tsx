import { AlertTriangle, FlaskConical, Factory, Phone, ShieldCheck } from "lucide-react";
import { CONTACT, TECH_DISCLAIMER } from "@/data/contact";
import type { Feasibility } from "@/lib/chatAssistant";

// Path B output: official identity, grounded core chemistry, an APAC vendor
// COUNT (never names), and a contact call to action. Every field is sourced;
// missing data shows an honest empty state rather than a guess.
export function FeasibilityReport({
  data,
  streaming = false,
  onEnquire,
}: {
  data: Feasibility;
  streaming?: boolean;
  onEnquire: () => void;
}) {
  const { identity, chemistry, vendor } = data;

  return (
    <div className="space-y-3">
      {/* 1. Identity from PubChem */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-ink">{data.resolvedName}</h4>
          <span
            className={
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold " +
              (identity ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")
            }
          >
            <ShieldCheck className="h-3 w-3" />
            {identity ? "PUBCHEM" : "NOT FOUND"}
          </span>
        </div>

        {identity ? (
          <div className="flex gap-4">
            {identity.cid ? (
              <img
                src={data.structureUrl ?? ""}
                alt={`2D structure of ${data.resolvedName}`}
                width={110}
                height={110}
                className="h-[92px] w-[92px] shrink-0 rounded-lg border border-border bg-white object-contain p-1"
                loading="lazy"
              />
            ) : null}
            <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {identity.cid ? (
                <Row label="PubChem CID" value={String(identity.cid)} mono />
              ) : null}
              {identity.formula ? <Row label="Formula" value={identity.formula} mono /> : null}
              {identity.mw ? <Row label="Mol. weight" value={`${identity.mw} g/mol`} mono /> : null}
              {identity.iupac && identity.iupac !== data.resolvedName ? (
                <div className="col-span-2">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">IUPAC name</dt>
                  <dd className="truncate font-mono text-[11px] text-foreground" title={identity.iupac}>
                    {identity.iupac}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            We could not resolve this against PubChem automatically. Send it to our team with a CAS number or
            structure and a process chemist will confirm identity.
          </p>
        )}
      </section>

      {/* 2. Core chemistry */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <FlaskConical className="h-4 w-4 text-primary" />
            Core chemistry required
          </h4>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            {chemistry.source === "catalog" ? "APAC CATALOG" : chemistry.source === "ai" ? "AI PRELIMINARY" : "TO BE SCOPED"}
          </span>
        </div>

        {chemistry.overview ? (
          <p className="text-sm leading-relaxed text-foreground/90">
            {chemistry.overview}
            {streaming ? <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" /> : null}
          </p>
        ) : null}

        {chemistry.routes.length ? (
          <div className="mt-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Key routes</p>
            <ul className="space-y-1">
              {chemistry.routes.slice(0, 4).map((r, i) => (
                <li key={i} className="flex gap-2 text-xs text-foreground/90">
                  <span className="font-mono text-primary">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {chemistry.startingMaterials.length ? (
          <div className="mt-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Typical starting materials
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chemistry.startingMaterials.map((m) => (
                <span key={m} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {chemistry.hazards ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{chemistry.hazards}</span>
          </p>
        ) : null}

        {chemistry.source === "pending" && !chemistry.overview ? (
          <p className="text-xs text-muted-foreground">
            This molecule is outside our curated catalog. We will normalise it, scope a route with our process
            chemists, and come back with a feasibility read. Typical turnaround is a few working days.
          </p>
        ) : null}
      </section>

      {/* 3. APAC vendor match, count only */}
      <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <Factory className="h-4 w-4 text-primary" />
          {vendor.onRecordCount > 0 ? (
            <p className="text-sm text-ink">
              <span className="text-lg font-bold text-primary">{vendor.onRecordCount}</span>{" "}
              manufacturer{vendor.onRecordCount === 1 ? "" : "s"} in the APAC network are on record for this product.
            </p>
          ) : (
            <p className="text-sm text-ink">
              This sits in APAC's{" "}
              <span className="font-semibold">{vendor.division}</span> network of{" "}
              <span className="text-lg font-bold text-primary">{vendor.networkCount.toLocaleString()}</span>{" "}
              manufacturers.
            </p>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Category: {vendor.category.category}. We share exact manufacturer matches after a short qualification
          call. Vendor names are never listed on the site.
        </p>
      </section>

      {/* 4. Contact CTA */}
      <section className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold text-ink">Get specifics from APAC</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          We confirm identity, route, qualified sources and indicative cost on a call.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEnquire}
            className="press inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
          >
            Start an enquiry
          </button>
          <a
            href={CONTACT.phoneHref}
            className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {CONTACT.phone}
          </a>
          <a
            href={CONTACT.emailHref}
            className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {CONTACT.email}
          </a>
        </div>
      </section>

      <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">{TECH_DISCLAIMER}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={"text-foreground " + (mono ? "font-mono text-[11px]" : "text-xs")}>{value}</dd>
    </div>
  );
}
