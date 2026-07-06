import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpFromLine,
  BadgeCheck,
  Boxes,
  Building2,
  ChevronRight,
  Factory,
  Globe2,
  Handshake,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn, num } from "@/lib/utils";
import { useTradeData } from "@/context/TradeData";
import { useCurrency } from "@/context/Currency";
import { derivePartners, type Partner, type PartnerRole } from "@/lib/derive";
import { casForCompany, matchesCas } from "@/lib/cas";
import { clients } from "@/data/clients";
import { supplierGroups, type Supplier } from "@/data/suppliers";
import type { Shipment } from "@/data/trade";

// Curated overlays keyed by company name (lower-cased).
const buyerMeta = new Map(clients.map((c) => [c.company.toLowerCase(), c]));
const supplierMeta = new Map<string, Supplier>();
for (const g of supplierGroups) for (const s of g.suppliers) supplierMeta.set(s.company.toLowerCase(), s);

type RoleFilter = "all" | "Buyer" | "Supplier" | "Both";
type SortKey = "value" | "shipments" | "products" | "counterparties";

const roleTone: Record<PartnerRole, "orange" | "softOrange" | "green"> = {
  Buyer: "softOrange",
  Supplier: "orange",
  Both: "green",
};

export default function TradePartners() {
  const { shipments, uploadedCount } = useTradeData();
  const { money } = useCurrency();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [role, setRole] = useState<RoleFilter>("all");
  const [country, setCountry] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
      setSelected(null);
    }
  }, [searchParams]);

  const partners = useMemo(() => derivePartners(shipments), [shipments]);

  const buyerCount = partners.filter((p) => p.role !== "Supplier").length;
  const supplierCount = partners.filter((p) => p.role !== "Buyer").length;
  const totalValue = useMemo(() => shipments.reduce((s, r) => s + r.totalValue, 0), [shipments]);
  const countriesCount = useMemo(
    () => new Set(shipments.map((s) => s.origin).filter((c) => c && c !== "Unknown")).size,
    [shipments],
  );

  const countryOptions = useMemo(
    () => Array.from(new Set(partners.map((p) => p.topCountry).filter((c) => c && c !== "Unknown"))).sort(),
    [partners],
  );

  const sortVal = (p: Partner): number =>
    sortKey === "value" ? p.value : sortKey === "shipments" ? p.shipments : sortKey === "products" ? p.products.length : p.counterparties;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners
      .filter((p) => (role === "all" ? true : role === "Both" ? p.role === "Both" : p.role === role || p.role === "Both"))
      .filter((p) => (country === "all" ? true : p.topCountry === country))
      .filter((p) =>
        q
          ? p.company.toLowerCase().includes(q) ||
            p.topCountry.toLowerCase().includes(q) ||
            matchesCas(q, p.hsCodes, p.products)
          : true,
      )
      .slice()
      .sort((a, b) => {
        const d = sortVal(b) - sortVal(a);
        return sortDir === "asc" ? -d : d;
      });
  }, [partners, role, country, query, sortKey, sortDir]);

  const selectedPartner = selected ? partners.find((p) => p.company === selected) ?? null : null;

  // Bring the partner detail panel into view when a partner is selected.
  const detailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  const selectClass =
    "h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  const roleTabs: [RoleFilter, string][] = [
    ["all", "All"],
    ["Buyer", "Buyers"],
    ["Supplier", "Manufacturers"],
  ];

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  const SortHead = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => (
    <th className={cn("px-3 py-2 font-medium", className)}>
      <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        {sortKey === k ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
      </button>
    </th>
  );

  return (
    <AppShell
      title="Trade Partners"
      subtitle="Buyers and manufacturers in your trade data. Click a company for its full footprint."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiChip icon={Handshake} label="Trade Partners" value={num(partners.length)} sub={uploadedCount ? "incl. uploads" : "from records"} />
        <KpiChip icon={Building2} label="Buyers" value={num(buyerCount)} sub="import side" />
        <KpiChip icon={Factory} label="Manufacturers" value={num(supplierCount)} sub="supply side" />
        <KpiChip icon={Globe2} label="Countries" value={num(countriesCount)} sub="trade origins" />
      </div>

      <Card className="mt-5">
        <CardHeader className="flex flex-col gap-3 pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Partner Directory</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {num(rows.length)} companies · {money(totalValue)} total recorded trade
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search company, country or CAS no."
                  className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
                />
              </div>
              <select className={selectClass} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="all">All countries</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-lg border border-border bg-background p-1">
            {roleTabs.map(([r, label]) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition",
                  role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="max-h-[60vh] overflow-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Top Country</th>
                  <SortHead k="products" label="Products" className="text-right" />
                  <SortHead k="counterparties" label="Partners" className="text-right" />
                  <SortHead k="shipments" label="Shipments" className="text-right" />
                  <SortHead k="value" label="Trade Value" className="text-right" />
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 300).map((p) => {
                  const active = selected === p.company;
                  const meta = supplierMeta.get(p.company.toLowerCase());
                  return (
                    <tr
                      key={p.company}
                      onClick={() => setSelected(active ? null : p.company)}
                      className={cn(
                        "cursor-pointer border-t border-border transition hover:bg-muted/60",
                        active && "bg-accent",
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-foreground">{p.company}</div>
                        {meta?.certifications?.length ? (
                          <div className="mt-0.5 text-[10px] text-muted-foreground">{meta.certifications.join(" · ")}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={roleTone[p.role]}>{p.role}</Badge>
                      </td>
                      <td className="px-3 py-2.5">{p.topCountry}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{num(p.products.length)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{num(p.counterparties)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{num(p.shipments)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{money(p.value)}</td>
                      <td className="px-2 py-2.5 text-right">
                        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition", active && "rotate-90 text-primary")} />
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                      No partners match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedPartner ? (
        <div ref={detailRef} className="scroll-mt-4">
          <PartnerDetail
            partner={selectedPartner}
            shipments={shipments}
            money={money}
            onClose={() => setSelected(null)}
          />
        </div>
      ) : null}
    </AppShell>
  );
}

// Full two-sided profile for one company: how much it buys vs supplies, the
// products it trades, who it trades with, and its most recent shipments.
function PartnerDetail({
  partner,
  shipments,
  money,
  onClose,
}: {
  partner: Partner;
  shipments: Shipment[];
  money: (usd: number) => string;
  onClose: () => void;
}) {
  const buyer = buyerMeta.get(partner.company.toLowerCase());
  const supplier = supplierMeta.get(partner.company.toLowerCase());
  const cas = casForCompany(partner.hsCodes, partner.products);

  // Every shipment this company is on (either side).
  const rows = useMemo(
    () => shipments.filter((s) => s.importer === partner.company || s.supplier === partner.company),
    [shipments, partner.company],
  );

  const topProducts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of rows) m.set(s.product, (m.get(s.product) ?? 0) + s.totalValue);
    return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [rows]);

  const topCounterparties = useMemo(() => {
    const m = new Map<string, { value: number; count: number; side: string }>();
    for (const s of rows) {
      const isImporter = s.importer === partner.company;
      const other = (isImporter ? s.supplier : s.importer)?.trim();
      if (!other || other === "Unknown") continue;
      const e = m.get(other) ?? { value: 0, count: 0, side: isImporter ? "supplies to it" : "buys from it" };
      e.value += s.totalValue;
      e.count += 1;
      m.set(other, e);
    }
    return Array.from(m, ([name, v]) => ({ name, ...v })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [rows]);

  const recent = useMemo(
    () => rows.slice().sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).slice(0, 12),
    [rows],
  );

  const maxProd = Math.max(1, ...topProducts.map((p) => p.value));

  const stats = [
    { icon: ArrowDownToLine, label: "Buys (imports)", value: money(partner.buyValue), sub: `${num(partner.buyShipments)} shipments` },
    { icon: ArrowUpFromLine, label: "Supplies (exports)", value: money(partner.sellValue), sub: `${num(partner.sellShipments)} shipments` },
    { icon: Boxes, label: "Products", value: num(partner.products.length), sub: "distinct" },
    { icon: Handshake, label: "Counterparties", value: num(partner.counterparties), sub: "companies" },
  ];

  return (
    <Card className="mt-4 border-primary/40">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            {partner.company}
            <Badge tone={roleTone[partner.role]}>{partner.role}</Badge>
          </CardTitle>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {partner.topCountry}
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <Globe2 className="h-3 w-3" />
              {num(partner.countries)} countries
            </span>
            {supplier?.type ? (
              <>
                <span className="text-border">·</span>
                <span>{supplier.type}</span>
              </>
            ) : null}
            {buyer?.sector ? (
              <>
                <span className="text-border">·</span>
                <span>{buyer.sector}</span>
              </>
            ) : null}
          </p>
          {cas.length ? (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">CAS {cas.slice(0, 4).join(", ")}</p>
          ) : null}
        </div>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <s.icon className="h-3 w-3 text-primary" />
                {s.label}
              </div>
              <p className="mt-1 text-base font-semibold tabular-nums text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {supplier?.certifications?.length ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Certifications</span>
            {supplier.certifications.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                <BadgeCheck className="h-3 w-3 text-primary" />
                {c}
              </span>
            ))}
            {supplier.capacityNote ? <span className="text-[11px] text-muted-foreground">· {supplier.capacityNote}</span> : null}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Top products traded</p>
            <ul className="space-y-1.5">
              {topProducts.map((p) => (
                <li key={p.name} className="text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-foreground" title={p.name}>{p.name}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-foreground">{money(p.value)}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, (p.value / maxProd) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Top counterparties</p>
            <ul className="space-y-1">
              {topCounterparties.length === 0 ? (
                <li className="text-xs text-muted-foreground">No named counterparties on record.</li>
              ) : (
                topCounterparties.map((c) => (
                  <li key={c.name} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs odd:bg-muted/40">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.side} · {num(c.count)} shipments</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-foreground">{money(c.value)}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Recent shipments</p>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Flow</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Counterparty</th>
                  <th className="px-3 py-2 font-medium">Country</th>
                  <th className="px-3 py-2 text-right font-medium">Qty (t)</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s, i) => {
                  const isImporter = s.importer === partner.company;
                  return (
                    <tr key={s.date + i} className="border-t border-border">
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium">{s.date}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex items-center gap-1 text-xs", isImporter ? "text-amber-700" : "text-emerald-700")}>
                          {isImporter ? <ArrowDownToLine className="h-3 w-3" /> : <ArrowUpFromLine className="h-3 w-3" />}
                          {isImporter ? "Buys" : "Supplies"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">{s.product}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{isImporter ? s.supplier : s.importer}</td>
                      <td className="px-3 py-2.5">{s.origin}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{num(Math.round(s.quantityT))}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{money(s.totalValue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
