import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Boxes, Building2, Factory, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, tooltipStyle } from "@/components/ui";
import { KpiCard } from "@/components/Kpi";
import {
  kpis,
  topImportProducts,
  topExportProducts,
  topImporters,
  topExporters,
} from "@/data/dashboard";

const kpiIcons = [Boxes, Boxes, Factory, TrendingUp];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          USD millions
        </span>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const importers = [...topImporters].reverse();
  const exporters = [...topExporters].reverse();

  return (
    <AppShell
      title="Overview"
      subtitle="Real time pulse of import, export, and manufacturer activity across APAC."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <KpiCard
            key={k.label}
            icon={kpiIcons[i] ?? Boxes}
            label={k.label}
            value={k.value}
            sub={k.sub}
            trend={k.trend}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Top Import Products by Value" subtitle="Leading inbound chemicals">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topImportProducts} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {topImportProducts.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Export Products by Value" subtitle="Leading outbound chemicals and APIs">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topExportProducts} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {topExportProducts.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#F47920" : "#F9A663"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Top Importers (Buyers)" subtitle="Indian buyers ranked by inbound value">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={importers} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11, fill: "#1E293B" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                {importers.map((_, i) => (
                  <Cell key={i} fill={i === importers.length - 1 ? "#F47920" : "#F9A663"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Exporters (Manufacturers)" subtitle="Outbound shipment leaders">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exporters} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11, fill: "#1E293B" }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                {exporters.map((_, i) => (
                  <Cell key={i} fill={i === exporters.length - 1 ? "#F47920" : "#F9A663"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5 text-primary" />
        Source: Descartes Datamyne import and export sample, February 2026. Replace with full three
        year history for production forecasts.
      </div>
    </AppShell>
  );
}
