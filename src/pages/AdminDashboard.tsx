import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  Database,
  Eye,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui";
import { KpiCard } from "@/components/Kpi";
import {
  clearAnalytics,
  countBy,
  dailySeries,
  hourlyHistogram,
  loadEvents,
  since,
  type AnalyticsEvent,
} from "@/lib/analytics";
import { NETWORK } from "@/data/network";
import { products } from "@/data/products";
import { supplierGroups } from "@/data/suppliers";
import { clients } from "@/data/clients";
import { useTradeData } from "@/context/TradeData";
import { activeBackend } from "@/lib/tradeStore";
import { num } from "@/lib/utils";

// Chart palette, validated for lightness, chroma, CVD separation and contrast
// against the light surface. Single series charts use the brand orange step;
// the two series traffic chart pairs it with blue.
const SERIES_1 = "#DB6412";
const SERIES_2 = "#2A78D6";

const PAGE_NAMES: Record<string, string> = {
  "/": "Homepage",
  "/login": "Admin sign in",
  "/admin": "Site analytics",
  "/custom-synthesis": "Custom synthesis",
  "/dashboard": "Market overview",
  "/knowledge-base": "Knowledge base",
  "/trade-analytics": "Trade analytics",
  "/demand-forecast": "Demand forecast",
  "/partners": "Trade partners",
  "/documents": "Documents",
  "/synthesis/routes": "Synthesis routes",
  "/synthesis/process": "Process development",
  "/synthesis/scale-up": "Scale-up",
  "/synthesis/enquiry": "Project enquiry",
};

function pageName(path: string): string {
  return PAGE_NAMES[path] ?? path;
}

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

// Ranked list rendered as label + proportional bar + value. Values are directly
// labeled, so the bar color can stay in the brand hue.
function RankedBars({ rows, unit }: { rows: { name: string; value: number }[]; unit?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No data recorded yet.</p>;
  }
  // unit is singular ("view", "buyer") and pluralized per row.
  const withUnit = (value: number) =>
    unit ? `${num(value)} ${unit}${value === 1 ? "" : "s"}` : num(value);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.name}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-foreground">{r.name}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {withUnit(r.value)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary-600 transition-[width] duration-500 ease-out-expo"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AdminDashboard() {
  const { shipments } = useTradeData();
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => loadEvents());

  const week = useMemo(() => since(events, 7), [events]);
  const twoWeeks = useMemo(() => since(events, 14), [events]);

  const views7 = week.filter((e) => e.kind === "view").length;
  const visitors7 = new Set(week.filter((e) => e.kind === "view").map((e) => e.sid)).size;
  const searches7 = week.filter((e) => e.kind === "search").length;
  const logins30 = since(events, 30).filter((e) => e.kind === "event" && e.name === "login").length;

  const daily = useMemo(() => dailySeries(events, 14), [events]);
  const hourly = useMemo(() => hourlyHistogram(twoWeeks), [twoWeeks]);

  const topPages = useMemo(
    () =>
      countBy(events.filter((e) => e.kind === "view"), (e) =>
        e.path ? pageName(e.path) : undefined,
      ).slice(0, 8),
    [events],
  );

  const referrers = useMemo(
    () => countBy(events, (e) => e.referrer).slice(0, 5),
    [events],
  );

  const devices = useMemo(() => {
    const rows = countBy(events.filter((e) => e.kind === "view"), (e) => e.device);
    const total = rows.reduce((a, r) => a + r.value, 0) || 1;
    return rows.map((r) => ({ ...r, pct: Math.round((r.value / total) * 100) }));
  }, [events]);

  const recentSearches = useMemo(
    () => events.filter((e) => e.kind === "search").slice(-8).reverse(),
    [events],
  );

  // Workspace dataset coverage (the sample data bundled with this app).
  const manufacturerCompanies = useMemo(() => {
    const set = new Set<string>();
    for (const g of supplierGroups) for (const s of g.suppliers) set.add(s.company);
    return set.size;
  }, []);

  const manufacturersByCountry = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of supplierGroups) {
      for (const s of g.suppliers) map.set(s.country, (map.get(s.country) ?? 0) + 1);
    }
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, []);

  const buyerSectors = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of clients) map.set(c.sector, (map.get(c.sector) ?? 0) + 1);
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, []);

  const oldestEvent = events[0]?.ts;

  function onClear() {
    if (!window.confirm("Delete all locally recorded analytics events?")) return;
    clearAnalytics();
    setEvents([]);
  }

  return (
    <AppShell
      title="Site Analytics"
      subtitle="Traffic, search and catalog analytics for the platform. Usage data is recorded first party in each visitor's browser."
    >
      {/* Usage KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Eye} label="Page views, 7 days" value={num(views7)} sub={`${num(twoWeeks.filter((e) => e.kind === "view").length)} in 14 days`} />
        <KpiCard icon={Users} label="Unique visitors, 7 days" value={num(visitors7)} sub="distinct browser sessions" />
        <KpiCard icon={Search} label="Searches, 7 days" value={num(searches7)} sub="global and knowledge search" />
        <KpiCard icon={Activity} label="Admin sign-ins, 30 days" value={num(logins30)} sub="successful logins" />
      </div>

      {/* Traffic over time + hourly pattern */}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daily traffic, last 14 days</CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: SERIES_1 }} />
                Page views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: SERIES_2 }} />
                Visitors
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={daily} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES_1} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={SERIES_1} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#CBD5E1" }} />
                <Area type="monotone" dataKey="views" name="Page views" stroke={SERIES_1} strokeWidth={2} fill="url(#viewsFill)" />
                <Area type="monotone" dataKey="visitors" name="Visitors" stroke={SERIES_2} strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visits by hour, 14 days</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={hourly} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                <Bar dataKey="views" name="Page views" fill={SERIES_1} radius={[4, 4, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pages, devices, searches, referrers */}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Most visited pages</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RankedBars rows={topPages} unit="view" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent searches</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentSearches.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No searches recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentSearches.map((s, i) => (
                  <li key={s.ts + "-" + i} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="truncate font-medium text-foreground">{s.query}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">{s.name}</span>
                      {timeAgo(s.ts)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {devices.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No data recorded yet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {devices.map((d) => (
                    <li key={d.name} className="flex items-center gap-3 text-sm">
                      <span className="w-16 font-medium capitalize text-foreground">{d.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary-600" style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="w-10 text-right tabular-nums text-muted-foreground">{d.pct}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External referrers</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {referrers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  All visits so far were direct.
                </p>
              ) : (
                <RankedBars rows={referrers} unit="visit" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Catalog analytics */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight text-ink">Catalog analytics</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Network figures from the APACSS portal, plus coverage of the workspace dataset bundled with this app.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Database} label="Network products" value={num(NETWORK.products)} sub={`${NETWORK.categories} categories`} />
        <KpiCard icon={Users} label="Network manufacturers" value={num(NETWORK.manufacturers)} sub={`${NETWORK.countries}+ countries`} />
        <KpiCard icon={Database} label="Knowledge base products" value={num(products.length)} sub={`${num(products.filter((p) => p.verified !== false).length)} with verified chemistry`} />
        <KpiCard icon={Users} label="Workspace partners" value={num(manufacturerCompanies + clients.length)} sub={`${num(manufacturerCompanies)} manufacturers, ${num(clients.length)} buyers`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Network divisions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-4">
              {NETWORK.divisions.map((d) => (
                <li key={d.name} className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold text-ink">{d.name}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-primary-600">
                    {num(d.products)} <span className="text-xs font-medium text-muted-foreground">products</span>
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">{num(d.manufacturers)} manufacturers</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace manufacturers by country</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RankedBars rows={manufacturersByCountry} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyer sectors</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RankedBars rows={buyerSectors} unit="buyer" />
          </CardContent>
        </Card>
      </div>

      {/* Data + admin tools */}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt className="text-xs text-muted-foreground">Trade records loaded</dt>
                <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{num(shipments.length)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Trade data backend</dt>
                <dd className="mt-0.5 font-semibold text-foreground">{activeBackend}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Analytics events stored</dt>
                <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{num(events.length)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Recording since</dt>
                <dd className="mt-0.5 font-semibold text-foreground">
                  {oldestEvent ? new Date(oldestEvent).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No events yet"}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={onClear}
              className="press mt-5 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear analytics data
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin sections</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                { label: "Trade Analytics", to: "/trade-analytics" },
                { label: "Demand Forecast", to: "/demand-forecast" },
                { label: "Trade Partners", to: "/partners" },
                { label: "Documents", to: "/documents" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="press group flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    {l.label}
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              These sections are only visible while signed in as admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
