import { useMemo, useState } from "react";
import { Building2, Layers, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn, usd } from "@/lib/utils";
import { clients } from "@/data/clients";

export default function Clients() {
  const [sector, setSector] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const sectors = useMemo(() => Array.from(new Set(clients.map((c) => c.sector))), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients
      .filter((c) => (sector === "all" ? true : c.sector === sector))
      .filter((c) => (status === "all" ? true : c.status === status))
      .filter((c) => (q ? c.company.toLowerCase().includes(q) : true))
      .sort((a, b) => b.importValue - a.importValue);
  }, [sector, status, query]);

  const total = clients.reduce((s, c) => s + c.importValue, 0);
  const selectClass =
    "h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell
      title="Clients (Buyers)"
      subtitle="Indian importers and consumers, drawn from trade activity and qualified as prospects."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiChip icon={Users} label="Tracked Buyers" value={String(clients.length)} trend="+3" />
        <KpiChip icon={Building2} label="Total Buy Value" value={usd(total)} sub="annualised sample" />
        <KpiChip icon={Layers} label="Top Sector" value="Fertilisers" sub="by value" />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Buyer Directory</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{rows.length} companies</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company"
              className={cn(selectClass, "w-full sm:w-44")}
            />
            <select className={selectClass} value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="all">All sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All status</option>
              <option value="Active in sample">Active in sample</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium">Country</th>
                  <th className="px-3 py-2 font-medium">Primary Products</th>
                  <th className="px-3 py-2 font-medium">HS Codes</th>
                  <th className="px-3 py-2 font-medium">Sector</th>
                  <th className="px-3 py-2 text-right font-medium">Import Value</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.company} className="border-t border-border">
                    <td className="px-3 py-2.5 font-medium">{c.company}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.country}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.primaryProducts.join(", ")}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{c.hsCodes.join(", ")}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.sector}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{usd(c.importValue)}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={c.status === "Active in sample" ? "softOrange" : "gray"}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Buyers come from the Datamyne import sample and can be enriched with DGFT IEC company data.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
