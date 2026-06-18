import { useMemo, useState } from "react";
import { BadgeCheck, Factory, Globe, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn } from "@/lib/utils";
import { supplierGroups, type Supplier } from "@/data/suppliers";

const allCerts = ["ISO 9001", "ISO 14001", "GMP", "REACH"];

function statusTone(s: Supplier["status"]): "orange" | "softOrange" | "gray" {
  if (s === "Recommended") return "orange";
  if (s === "Active in sample") return "softOrange";
  return "gray";
}

export default function Suppliers() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [cert, setCert] = useState("all");

  const allSuppliers = useMemo(() => supplierGroups.flatMap((g) => g.suppliers), []);
  const countries = useMemo(() => new Set(allSuppliers.map((s) => s.country)).size, [allSuppliers]);
  const recommended = useMemo(() => allSuppliers.filter((s) => s.status === "Recommended").length, [allSuppliers]);

  const group = supplierGroups[groupIdx];
  const suppliers = group.suppliers.filter((s) =>
    cert === "all" ? true : s.certifications.includes(cert),
  );

  return (
    <AppShell
      title="Suppliers (Manufacturers)"
      subtitle="Manufacturers only, no traders. Grouped by product and tagged with certifications."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiChip icon={Factory} label="Tracked Manufacturers" value={String(allSuppliers.length)} trend="+5" />
        <KpiChip icon={Globe} label="Countries" value={String(countries)} />
        <KpiChip icon={BadgeCheck} label="Recommended" value={String(recommended)} sub="vetted producers" />
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {supplierGroups.map((g, i) => (
            <button
              key={g.product}
              onClick={() => setGroupIdx(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                i === groupIdx
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {g.product.split(" (")[0]}
            </button>
          ))}
        </div>
        <select
          className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          value={cert}
          onChange={(e) => setCert(e.target.value)}
        >
          <option value="all">All certifications</option>
          {allCerts.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {group.product}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.company}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                  <Factory className="h-4 w-4" />
                </div>
                <Badge tone={statusTone(s.status)}>{s.status}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{s.company}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {s.country}
                <span className="mx-1 text-border">|</span>
                {s.type}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{s.capacityNote}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.certifications.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    <BadgeCheck className="h-3 w-3 text-primary" />
                    {c}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No manufacturers match this certification filter.</p>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground">
        Verify certifications against ISO, REACH, and FDA directories before engagement.
      </p>
    </AppShell>
  );
}
