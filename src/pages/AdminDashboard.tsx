import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Boxes,
  Database,
  Eye,
  Factory,
  FlaskConical,
  Mail,
  MessageSquare,
  MousePointerClick,
  Route,
  Trash2,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui/primitives";
import { KpiCard } from "@/components/ui/Kpi";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  clearAnalytics,
  loadEvents,
  loadPageViews,
  type AppEvent,
  type PageView,
} from "@/lib/analytics";
import { products } from "@/data/products";
import { clients } from "@/data/clients";
import { supplierGroups } from "@/data/suppliers";
import { activeBackend, loadUploaded } from "@/lib/tradeStore";

const DAY_MS = 24 * 60 * 60 * 1000;

// Categorical palette for the device split. Validated for lightness, chroma,
// CVD separation and contrast on white (dataviz six checks).
const DEVICE_COLORS: Record<string, string> = {
  desktop: "#DB6412",
  tablet: "#7C3AED",
  mobile: "#0D9488",
};

// Single-hue mark color for magnitude charts, with 3:1 contrast on white.
const MARK = "#DB6412";

function dayKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${d}/${m}`;
}

export default function AdminDashboard() {
  const [views, setViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [shipmentCount, setShipmentCount] = useState<number | null>(null);

  useEffect(() => {
    setViews(loadPageViews());
    setEvents(loadEvents());
    loadUploaded().then((rows) => setShipmentCount(rows.length)).catch(() => setShipmentCount(0));
  }, []);

  const now = Date.now();
  const last7 = views.filter((v) => now - v.t < 7 * DAY_MS);
  const today = views.filter((v) => dayKey(v.t) === dayKey(now));
  const sessions7 = new Set(last7.map((v) => v.session)).size;
  const events7 = events.filter((e) => now - e.t < 7 * DAY_MS);

  // Daily views for the last 14 days, including empty days.
  const daily = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = 13; i >= 0; i--) buckets.set(dayKey(now - i * DAY_MS), 0);
    for (const v of views) {
      const k = dayKey(v.t);
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([k, count]) => ({ day: dayLabel(k), count }));
  }, [views, now]);

  const byPage = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of views) m.set(v.path, (m.get(v.path) ?? 0) + 1);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));
  }, [views]);

  const byDevice = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of views) m.set(v.device, (m.get(v.device) ?? 0) + 1);
    return ["desktop", "tablet", "mobile"]
      .map((d) => ({ name: d, value: m.get(d) ?? 0 }))
      .filter((d) => d.value > 0);
  }, [views]);

  const byReferrer = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of views) {
      let ref = "Direct";
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname;
          if (host && host !== window.location.hostname) ref = host;
        } catch {
          ref = v.referrer;
        }
      }
      m.set(ref, (m.get(ref) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [views]);

  // Assistant and CDMO funnel counts, from the tracked events.
  const leads = useMemo(() => {
    const count = (name: string) => events.filter((e) => e.name === name).length;
    const intents = events.filter((e) => e.name === "chat_intent");
    return {
      chatOpen: count("chat_open"),
      intents: intents.length,
      pathwayIntent: intents.filter((e) => e.data.path === "A").length,
      feasibilityIntent: intents.filter((e) => e.data.path === "B").length,
      pathways: count("cdmo_pathway"),
      feasibilities: count("cdmo_feasibility"),
      enquiries: count("cdmo_enquiry"),
    };
  }, [events]);

  const topEvents = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of events) {
      const label = e.name === "landing_option" ? `Landing: ${e.data.option}` : e.name;
      m.set(label, (m.get(label) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [events]);

  const recent = useMemo(() => [...views].sort((a, b) => b.t - a.t).slice(0, 12), [views]);

  const manufacturerCount = supplierGroups.reduce((n, g) => n + g.suppliers.length, 0);

  function onClear() {
    if (!window.confirm("Clear all recorded analytics on this device?")) return;
    clearAnalytics();
    setViews([]);
    setEvents([]);
  }

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Website traffic and platform data. Traffic is recorded in this browser; a shared analytics store can be added later."
    >
      {/* Traffic KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Eye} label="Views today" value={String(today.length)} sub={`${views.length} all time`} />
        <KpiCard icon={Activity} label="Views, 7 days" value={String(last7.length)} />
        <KpiCard icon={Users} label="Unique visitors, 7 days" value={String(sessions7)} sub="distinct sessions" />
        <KpiCard icon={MousePointerClick} label="Interactions, 7 days" value={String(events7.length)} sub="tracked clicks and actions" />
      </div>

      {views.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={BarChart3}
            title="No traffic recorded yet"
            hint="Analytics start recording as soon as anyone browses the site in this browser. Visit a few pages and come back."
          />
        </div>
      ) : (
        <>
          {/* Traffic charts */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Views, last 14 days</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={daily} margin={{ left: -22, right: 8, top: 4 }}>
                    <defs>
                      <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={MARK} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={MARK} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="count" name="Views" stroke={MARK} strokeWidth={2} fill="url(#viewsFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Views by page</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={byPage} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="path"
                      width={120}
                      tick={{ fontSize: 11, fill: "#334155" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" name="Views" fill={MARK} radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Device split */}
            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                {byDevice.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="55%" height={170}>
                      <PieChart>
                        <Pie
                          data={byDevice}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={42}
                          outerRadius={70}
                          paddingAngle={2}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                        >
                          {byDevice.map((d) => (
                            <Cell key={d.name} fill={DEVICE_COLORS[d.name]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <ul className="flex-1 space-y-2">
                      {byDevice.map((d) => (
                        <li key={d.name} className="flex items-center justify-between gap-2 text-sm">
                          <span className="inline-flex items-center gap-2 capitalize text-foreground/80">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: DEVICE_COLORS[d.name] }} />
                            {d.name}
                          </span>
                          <span className="font-semibold tabular-nums">{d.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referrers */}
            <Card>
              <CardHeader>
                <CardTitle>Top referrers</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ul className="space-y-2.5">
                  {byReferrer.map(([ref, count]) => (
                    <li key={ref} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate text-foreground/80">{ref}</span>
                      <span className="font-semibold tabular-nums">{count}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Top interactions */}
            <Card>
              <CardHeader>
                <CardTitle>Top interactions</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                {topEvents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No interactions tracked yet.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {topEvents.map(([label, count]) => (
                      <li key={label} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-foreground/80">{label}</span>
                        <span className="font-semibold tabular-nums">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent activity */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 pr-4 font-medium">Page</th>
                      <th className="py-2 pr-4 font-medium">Device</th>
                      <th className="py-2 font-medium">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((v, i) => (
                      <tr key={i} className="border-b border-border/60 last:border-0">
                        <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                          {new Date(v.t).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4 font-medium text-foreground">{v.path}</td>
                        <td className="py-2 pr-4 capitalize text-muted-foreground">{v.device}</td>
                        <td className="py-2 font-mono text-xs text-muted-foreground">{v.session}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Assistant and CDMO leads */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Assistant and CDMO leads
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={MessageSquare} label="Assistant Opens" value={String(leads.chatOpen)} sub={`${leads.intents} conversations`} />
        <KpiCard icon={Route} label="Pathways Mapped" value={String(leads.pathways)} sub={`${leads.pathwayIntent} pathway intents`} />
        <KpiCard icon={FlaskConical} label="Feasibility Checks" value={String(leads.feasibilities)} sub={`${leads.feasibilityIntent} product intents`} />
        <KpiCard icon={Mail} label="Enquiries" value={String(leads.enquiries)} sub="captured leads" />
      </div>

      {/* Platform data */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Platform data
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Boxes} label="Products" value={products.length.toLocaleString()} sub="knowledge base entries" />
        <KpiCard icon={Users} label="Buyers" value={clients.length.toLocaleString()} sub="curated directory" />
        <KpiCard icon={Factory} label="Manufacturers" value={manufacturerCount.toLocaleString()} sub="curated directory" />
        <KpiCard
          icon={Database}
          label="Trade records"
          value={shipmentCount === null ? "..." : shipmentCount.toLocaleString()}
          sub={`storage: ${activeBackend}`}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="press inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-rose-300 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
          Clear analytics on this device
        </button>
      </div>
    </AppShell>
  );
}
