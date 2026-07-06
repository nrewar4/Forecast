import { useEffect, useRef, useState } from "react";
import {
  Beaker,
  Bookmark,
  BookmarkCheck,
  FlaskConical,
  Lightbulb,
  Loader2,
  Scale,
  ScrollText,
  Search,
  ShieldAlert,
  Sparkles,
  Workflow,
} from "lucide-react";
import { SynthesisShell } from "@/components/SynthesisShell";
import { trackSearch } from "@/lib/analytics";
import { RouteStepCard } from "@/components/RouteStepCard";
import { CdmoIntelligence } from "@/components/CdmoIntelligence";
import { RegulatoryPanel } from "@/components/RegulatoryPanel";
import { lookupFda, type FdaLookup } from "@/lib/openfda";
import { KpiChip } from "@/components/Kpi";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { loadAiConfig, hasApiKey } from "@/lib/aiConfig";
import {
  findRoutes,
  type FindRoutesResult,
  type RouteResult,
} from "@/lib/retrosynthesis";
import { MoleculeNotFoundError } from "@/lib/pubchem";

const EXAMPLES = ["ibuprofen", "aspirin", "paracetamol", "67-56-1", "CCO"];
const SAVED_KEY = "apac.saved_routes.v1";

// Tone + label for a route's novelty classification.
function noveltyTone(cls: string): "green" | "amber" | "softOrange" | "gray" {
  const c = cls.toLowerCase();
  if (c.includes("commercial")) return "green";
  if (c.includes("novel")) return "softOrange";
  if (c.includes("literature")) return "amber";
  return "gray";
}

type SavedRoute = {
  id: string;
  moleculeName: string;
  savedAt: string;
  route: RouteResult;
};

function loadSaved(): SavedRoute[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]") as SavedRoute[];
  } catch {
    return [];
  }
}

function addSaved(entry: SavedRoute): void {
  const existing = loadSaved().filter((s) => s.id !== entry.id);
  try {
    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify([entry, ...existing].slice(0, 50)),
    );
  } catch {
    // ignore storage failures (private mode, quota exceeded)
  }
}

export default function SynthesisRoutes() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FindRoutesResult | null>(null);
  const [selected, setSelected] = useState<RouteResult | null>(null);
  const [saved, setSaved] = useState<SavedRoute[]>(() => loadSaved());
  const [fda, setFda] = useState<FdaLookup | null>(null);
  const [fdaLoading, setFdaLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  async function run(q: string) {
    const target = q.trim();
    if (!target) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);
    setFda(null);
    trackSearch(target, "synthesis routes");

    const cfg = loadAiConfig();
    if (!hasApiKey(cfg)) {
      setError(
        "No OpenRouter API key found. Add it in Product Knowledge Base → AI Search (key icon).",
      );
      setLoading(false);
      return;
    }

    try {
      const res = await findRoutes(target, cfg, controller.signal);
      setResult(res);
      setSelected(res.routes[0] ?? null);

      // Live FDA regulatory lookup (best-effort, shares this request's signal).
      // Use the typed query, usually the common drug name, which openFDA indexes
      // far better than PubChem's IUPAC name.
      setFdaLoading(true);
      lookupFda(target, controller.signal)
        .then((f) => { if (!controller.signal.aborted) setFda(f); })
        .catch(() => { /* leave null; panel shows no-listing */ })
        .finally(() => { if (abortRef.current === controller) setFdaLoading(false); });
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(
        e instanceof MoleculeNotFoundError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Route generation failed. Retry.",
      );
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSave() {
    if (!result || !selected) return;
    const moleculeName = result.molecule.name ?? query;
    const entry: SavedRoute = {
      id: `${moleculeName}:${selected.id}`,
      moleculeName,
      savedAt: new Date().toISOString(),
      route: selected,
    };
    addSaved(entry);
    setSaved(loadSaved());
  }

  const moleculeName = result?.molecule.name ?? query;
  const selectedSaved =
    !!selected &&
    saved.some((s) => s.id === `${moleculeName}:${selected.id}`);

  return (
    <SynthesisShell
      title="Custom Synthesis Routes"
      subtitle="ML-assisted retrosynthesis powered by ASKCOS and Claude. Enter a chemical name, CAS number, or SMILES."
    >
      {/* Search bar */}
      <Card>
        <CardContent className="p-4">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              run(query).catch((e: unknown) => { if ((e as Error)?.name !== "AbortError") throw e; });
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                placeholder="Enter a chemical name, CAS number, or SMILES"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FlaskConical className="h-4 w-4" />
              )}
              Find routes
            </button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  run(ex).catch((e: unknown) => { if ((e as Error)?.name !== "AbortError") throw e; });
                }}
                className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground transition hover:border-primary"
              >
                {ex}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error ? (
        <Card className="mt-4 border-rose-200 bg-rose-50/60">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-700">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Results */}
      {result ? (
        <>
          {/* Identity KPI row */}
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <KpiChip
              icon={Beaker}
              label="Molecule"
              value={result.molecule.name ?? query}
              sub={result.molecule.formula ?? ""}
            />
            <KpiChip
              icon={Workflow}
              label="Routes Found"
              value={String(result.routes.length)}
              sub={
                result.routes[0]?.source === "askcos+claude"
                  ? "ML-assisted"
                  : "AI-generated"
              }
            />
            <KpiChip
              icon={FlaskConical}
              label="Best Feasibility"
              value={
                result.routes.length
                  ? `${Math.max(...result.routes.map((r) => r.feasibility_score))}`
                  : "N/A"
              }
              sub="0 to 100"
            />
            <KpiChip
              icon={ScrollText}
              label="PubChem CID"
              value={
                result.molecule.cid ? String(result.molecule.cid) : "N/A"
              }
              sub={result.molecule.mw ? `MW ${result.molecule.mw}` : "identity"}
            />
          </div>

          {/* Source badge */}
          <div className="mt-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <Badge
              tone={
                result.routes[0]?.source === "askcos+claude" ? "green" : "gray"
              }
            >
              {result.routes[0]?.source === "askcos+claude"
                ? "ML-assisted (ASKCOS + Claude)"
                : "AI-generated (Claude)"}
            </Badge>
          </div>

          {/* FDA Orange & Purple Book */}
          <RegulatoryPanel
            molecule={result.molecule}
            query={query}
            fda={fda}
            loading={fdaLoading}
          />

          {/* Two-panel layout */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Ranked route list */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Ranked Routes</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Sorted by feasibility. Select a route for detail.
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {result.routes.map((r, i) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(r)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2.5 text-left transition",
                          selected?.id === r.id
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/60",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            Route {i + 1}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {r.feasibility_score}/100
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.steps.length} steps
                          {r.starting_materials.length
                            ? ` · ${r.starting_materials.slice(0, 2).join(", ")}${r.starting_materials.length > 2 ? ` +${r.starting_materials.length - 2}` : ""}`
                            : ""}
                        </p>
                        {r.novelty?.classification ? (
                          <div className="mt-1.5">
                            <Badge tone={noveltyTone(r.novelty.classification)}>
                              {r.novelty.classification}
                            </Badge>
                          </div>
                        ) : null}
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${r.feasibility_score}%` }}
                          />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Route detail */}
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle>Route Detail</CardTitle>
                  {selected ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selected.steps.length} steps · Feasibility{" "}
                      {selected.feasibility_score}/100
                    </p>
                  ) : null}
                </div>
                {selected ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedSaved}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-semibold transition",
                      selectedSaved
                        ? "border border-border bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground hover:opacity-90",
                    )}
                  >
                    {selectedSaved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {selectedSaved ? "Saved" : "Save route"}
                  </button>
                ) : null}
              </CardHeader>
              <CardContent className="pt-2">
                {selected ? (
                  <div className="space-y-4">
                    {selected.summary ? (
                      <p className="text-sm text-muted-foreground">
                        {selected.summary}
                      </p>
                    ) : null}

                    {/* Novelty + patent signal */}
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md border border-border p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Lightbulb className="h-3.5 w-3.5 text-primary" />
                          Novelty
                        </p>
                        <div className="mt-1.5">
                          <Badge tone={noveltyTone(selected.novelty.classification)}>
                            {selected.novelty.classification || "Unclassified"}
                          </Badge>
                        </div>
                        {selected.novelty.rationale ? (
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {selected.novelty.rationale}
                          </p>
                        ) : null}
                        {selected.novelty.used_by.length ? (
                          <p className="mt-1 text-xs text-foreground">
                            <span className="text-muted-foreground">Used by: </span>
                            {selected.novelty.used_by.join(", ")}
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-md border border-border p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Scale className="h-3.5 w-3.5 text-primary" />
                          Patent signal
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-foreground">
                          {selected.patents.status || "Unknown"}
                        </p>
                        {selected.patents.assignees.length ? (
                          <p className="mt-1 text-xs text-foreground">
                            <span className="text-muted-foreground">Assignees: </span>
                            {selected.patents.assignees.join(", ")}
                          </p>
                        ) : null}
                        {selected.patents.note ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {selected.patents.note}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <ol className="space-y-2">
                      {selected.steps.map((s) => (
                        <RouteStepCard key={s.order} step={s} />
                      ))}
                    </ol>

                    {selected.starting_materials.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Starting Materials
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {selected.starting_materials.map((m) => (
                            <Chip key={m}>{m}</Chip>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {selected.feasibility_notes.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Feasibility Notes
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {selected.feasibility_notes.map((n) => (
                            <li key={n} className="text-xs text-muted-foreground">
                              · {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a route to see its steps.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CDMO production intelligence for the selected route */}
          {selected ? (
            <CdmoIntelligence
              molecule={result.molecule}
              route={selected}
              query={query}
              isBiologic={!!fda?.isBiologic}
            />
          ) : null}

          <p className="mt-6 rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            Routes are computational suggestions for a qualified chemist to
            validate, not lab-ready procedures. Patent flags are signals only
            and are not a Freedom-to-Operate opinion. Confirm safety and
            compliance before any laboratory work.
          </p>
        </>
      ) : null}

      {!result && !loading && !error ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter a chemical above to generate candidate manufacturing routes.
        </p>
      ) : null}
    </SynthesisShell>
  );
}
