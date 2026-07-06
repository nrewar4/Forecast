import {
  BookText,
  Building2,
  Dna,
  ExternalLink,
  Loader2,
  Pill,
  ShieldCheck,
} from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { PubchemResult } from "@/lib/pubchem";
import type { FdaLookup } from "@/lib/openfda";
import { matchOrangeBook, ORANGE_BOOK_SNAPSHOT_DATE, type OrangeBookEntry } from "@/data/orangeBook";

const OB_URL = "https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm";
const PB_URL = "https://purplebooksearch.fda.gov/";

function appTypeTone(t: string): "green" | "amber" | "softOrange" | "gray" {
  if (t === "BLA") return "softOrange";
  if (t === "NDA") return "green";
  if (t === "ANDA") return "amber";
  return "gray";
}

export function RegulatoryPanel({
  molecule,
  query,
  fda,
  loading,
}: {
  molecule: PubchemResult;
  query: string;
  fda: FdaLookup | null;
  loading: boolean;
}) {
  const name = molecule.name ?? query;
  const ob: OrangeBookEntry | null = matchOrangeBook(name, query);

  const hasFda = !!fda && fda.products.length > 0;
  const isBiologic = !!fda?.isBiologic;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>FDA Regulatory: Orange and Purple Book</CardTitle>
          {isBiologic ? (
            <Badge tone="softOrange">
              <Dna className="h-3 w-3" /> Biologic (Purple Book)
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Live approved-product and applicant data from openFDA, plus a verified Orange Book
          patent-status snapshot. Small molecules → Orange Book; biologics → Purple Book.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Orange Book patent-status snapshot (curated, verified) */}
        {ob ? (
          <section className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookText className="h-4 w-4 text-primary" />
                Orange Book patent status: {ob.ingredient}
              </h3>
              <Badge tone={ob.status.startsWith("Off") ? "green" : "amber"}>
                {ob.status}
              </Badge>
            </div>
            <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
              <p>
                <span className="text-muted-foreground">Originator: </span>
                <span className="font-medium text-foreground">{ob.originator}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Brand: </span>
                <span className="font-medium text-foreground">{ob.brand}</span>
              </p>
              <p>
                <span className="text-muted-foreground">US exclusivity lost: </span>
                <span className="font-medium text-foreground">{ob.usLossOfExclusivity}</span>
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{ob.note}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Snapshot {ORANGE_BOOK_SNAPSHOT_DATE}.{" "}
              <a
                href={OB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-primary hover:underline"
              >
                Check live Orange Book <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </section>
        ) : null}

        {/* Loading */}
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Querying openFDA for approved products…
          </p>
        ) : null}

        {/* Live openFDA approved products */}
        {hasFda ? (
          <section>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Pill className="h-4 w-4 text-primary" />
                Approved products (openFDA, live)
              </h3>
              <span className="text-xs text-muted-foreground">
                {fda!.total} application{fda!.total === 1 ? "" : "s"} on file
              </span>
            </div>

            {/* Originators / generic count */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {fda!.originators.slice(0, 6).map((o) => (
                <Badge key={o} tone="green">
                  <Building2 className="h-3 w-3" /> {o}
                </Badge>
              ))}
              {fda!.genericSponsors.length ? (
                <Badge tone="amber">
                  {fda!.genericSponsors.length} generic filer
                  {fda!.genericSponsors.length === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Brand</th>
                    <th className="px-3 py-2 font-semibold">Sponsor</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Form / route</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fda!.products.slice(0, 12).map((p, i) => (
                    <tr key={`${p.applicationNumber}-${i}`} className="border-t border-border">
                      <td className="px-3 py-2 align-top font-medium text-foreground">
                        {p.brandName || "N/A"}
                      </td>
                      <td className="px-3 py-2 align-top text-muted-foreground">{p.sponsor}</td>
                      <td className="px-3 py-2 align-top">
                        <Badge tone={appTypeTone(p.appType)}>{p.appType}</Badge>
                      </td>
                      <td className="px-3 py-2 align-top text-muted-foreground">
                        {[p.dosageForm, p.route].filter(Boolean).join(" · ") || "N/A"}
                      </td>
                      <td className="px-3 py-2 align-top text-muted-foreground">
                        {p.marketingStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {/* Purple Book note for biologics */}
        {isBiologic ? (
          <section className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
            <Dna className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Biologic: licensed under a BLA (Purple Book)
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Biologics are produced by bioprocess, not chemical synthesis. The CDMO analysis
                below switches to an upstream/downstream bioprocess view.{" "}
                <a
                  href={PB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary hover:underline"
                >
                  Search the Purple Book <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </section>
        ) : null}

        {/* Nothing found */}
        {!loading && !hasFda && !ob ? (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            No FDA-approved drug product found for{" "}
            <span className="font-medium text-foreground">{name}</span>, likely an
            intermediate, reagent, or non-pharma chemical rather than a finished API.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
