import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Factory,
  Gauge,
  Layers,
  Loader2,
  PiggyBank,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
} from "@/components/ui";
import { loadAiConfig, hasApiKey } from "@/lib/aiConfig";
import type { PubchemResult } from "@/lib/pubchem";
import type { RouteResult } from "@/lib/retrosynthesis";
import { analyzeCdmo, type CdmoAnalysis } from "@/lib/cdmoIntelligence";

const COST_TONE: Record<string, "green" | "amber" | "softOrange" | "gray"> = {
  "raw material": "amber",
  "solvent & process": "softOrange",
  "energy & labor": "gray",
  "yield & throughput": "green",
};

function costTone(category: string): "green" | "amber" | "softOrange" | "gray" {
  return COST_TONE[category.toLowerCase()] ?? "gray";
}

function maturityTone(maturity: string): "green" | "amber" | "gray" {
  const m = maturity.toLowerCase();
  if (m.includes("proven")) return "green";
  if (m.includes("pilot")) return "gray";
  return "amber";
}

export function CdmoIntelligence({
  molecule,
  route,
  query,
  isBiologic = false,
}: {
  molecule: PubchemResult;
  route: RouteResult;
  query: string;
  isBiologic?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CdmoAnalysis | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset when the selected route changes.
  useEffect(() => {
    abortRef.current?.abort();
    setData(null);
    setError(null);
    setLoading(false);
  }, [route.id, molecule.cid]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function run() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const cfg = loadAiConfig();
    if (!hasApiKey(cfg)) {
      setError(
        "No OpenRouter API key found. Add it in Product Knowledge Base → AI Search (key icon).",
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await analyzeCdmo(molecule, route, query, cfg, controller.signal, isBiologic);
      if (controller.signal.aborted) return;
      setData(res);
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : "CDMO analysis failed — retry");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>CDMO Production Intelligence</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            How this molecule is made at scale, and where you can win as a CDMO —
            grounded in verified product data, vetted suppliers, literature, and live web.
          </p>
        </div>
        {!data ? (
          <button
            type="button"
            onClick={() => void run()}
            disabled={loading}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Analyzing…" : "Generate CDMO analysis"}
          </button>
        ) : null}
      </CardHeader>

      <CardContent className="pt-2">
        {error ? (
          <div className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50/60 p-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        ) : null}

        {!data && !loading && !error ? (
          <p className="text-sm text-muted-foreground">
            Generate a manufacturer, optimization, and cost-reduction breakdown for{" "}
            <span className="font-medium text-foreground">
              {molecule.name ?? query}
            </span>
            .
          </p>
        ) : null}

        {loading && !data ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Pulling literature + real supplier data, then analyzing…
          </p>
        ) : null}

        {data ? (
          <div className="space-y-4">
            {/* Grounding chips */}
            {data.groundedFrom.length ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Grounded in:
                </span>
                {data.groundedFrom.map((g) => (
                  <Badge key={g} tone="softOrange">
                    {g}
                  </Badge>
                ))}
              </div>
            ) : null}

            {/* 1. Major manufacturer processes */}
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Factory className="h-4 w-4 text-primary" />
                {isBiologic
                  ? "Major Manufacturers & Bioprocess Platforms"
                  : "Major Manufacturer Processes"}
              </h3>
              {data.manufacturerProcesses.length ? (
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/60 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Producer</th>
                        <th className="px-3 py-2 font-semibold">Route / technology</th>
                        <th className="px-3 py-2 font-semibold">Scale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.manufacturerProcesses.map((m, i) => (
                        <tr key={`${m.company}-${i}`} className="border-t border-border">
                          <td className="px-3 py-2 align-top">
                            <p className="font-semibold text-foreground">{m.company}</p>
                            <p className="text-muted-foreground">{m.country}</p>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <p className="text-foreground">{m.route}</p>
                            {m.technology ? (
                              <p className="text-muted-foreground">{m.technology}</p>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 align-top text-muted-foreground">
                            {m.scaleNote}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No producer data returned.</p>
              )}
            </section>

            {/* 2. CDMO opportunity */}
            <section className="rounded-lg border border-border bg-muted/30 p-3">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Target className="h-4 w-4 text-primary" />
                Your CDMO Opportunity
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Building2 className="mr-1 inline h-3 w-3" />
                    Positioning
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {data.cdmoOpportunity.positioning || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Capacity / supply gap
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {data.cdmoOpportunity.capacityGap || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Target segment
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {data.cdmoOpportunity.targetSegment || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Differentiation
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {data.cdmoOpportunity.differentiation.length ? (
                      data.cdmoOpportunity.differentiation.map((d) => (
                        <Chip key={d}>{d}</Chip>
                      ))
                    ) : (
                      <span className="text-sm text-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Process optimization */}
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Gauge className="h-4 w-4 text-primary" />
                Process Optimization
              </h3>
              {data.processOptimization.length ? (
                <ul className="space-y-2">
                  {data.processOptimization.map((o, i) => (
                    <li
                      key={`${o.lever}-${i}`}
                      className="rounded-md border border-border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <Layers className="h-3.5 w-3.5 text-primary" />
                          {o.lever}
                        </p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {o.expectedGain ? (
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              {o.expectedGain}
                            </span>
                          ) : null}
                          <Badge tone={maturityTone(o.maturity)}>{o.maturity}</Badge>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{o.technique}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No optimization levers returned.</p>
              )}
            </section>

            {/* 4. Cost reduction */}
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <TrendingDown className="h-4 w-4 text-primary" />
                Cost Reduction Levers
              </h3>
              {data.costReduction.length ? (
                <ul className="space-y-2">
                  {data.costReduction.map((c, i) => (
                    <li
                      key={`${c.category}-${i}`}
                      className="flex items-start gap-3 rounded-md border border-border p-3"
                    >
                      <PiggyBank className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={costTone(c.category)}>{c.category}</Badge>
                          {c.roughImpactPct ? (
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              ~{c.roughImpactPct.replace(/^~/, "")} COGS
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-foreground">{c.action}</p>
                        {c.basis ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Basis: {c.basis}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No cost levers returned.</p>
              )}
            </section>

            {/* Citations */}
            {data.citations.length ? (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Literature cited
                </p>
                <ul className="mt-1.5 space-y-1">
                  {data.citations.map((c) => (
                    <li key={c.title} className="text-xs text-muted-foreground">
                      ·{" "}
                      {c.doi ? (
                        <a
                          href={`https://doi.org/${c.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}{" "}
                      {c.year ? `(${c.year})` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Disclaimer */}
            <p className="rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-800">
              Percentages are AI estimates grounded in the cited literature, vetted supplier
              data, and the app's verified cost-driver splits — not audited figures. Validate
              with a process engineer and your own quotes before any commercial or capital
              decision.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
