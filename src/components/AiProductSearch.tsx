import { useRef, useState } from "react";
import { ExternalLink, FlaskConical, Globe, KeyRound, Loader2, Search, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn, slug } from "@/lib/utils";
import { products } from "@/data/products";
import { verifiedFor } from "@/data/verified";
import { DEFAULT_MODEL, MODEL_SUGGESTIONS, hasApiKey, loadAiConfig, saveAiConfig, type AiConfig } from "@/lib/aiConfig";
import { chatComplete, type ChatMsg } from "@/lib/openrouter";
import { researchProduct, type AiProfile } from "@/lib/aiResearch";
import { resolveIdentity, type ChemIdentity } from "@/lib/casResolve";

type Result = { name: string; hsCode: string; cas: string; reason: string };

const EXAMPLES = [
  "chelating agent for water treatment",
  "trinitrotoluene",
  "fungicide for downy mildew",
  "API for nylon-6",
  "CAS 64-19-7",
];

// Compact catalog index the model searches over.
const CATALOG_INDEX = products
  .map((p) => `${p.name} | HS ${p.hsCode}${p.cas ? ` | CAS ${p.cas}` : ""}`)
  .join("\n");

const byName = new Map(products.map((p) => [p.name.toLowerCase(), p]));
const byHs = new Map(products.map((p) => [p.hsCode, p]));

export function AiProductSearch({
  onPick,
  onAiProfile,
}: {
  onPick: (productName: string) => void;
  onAiProfile: (profile: AiProfile) => void;
}) {
  const [cfg, setCfg] = useState<AiConfig>(() => loadAiConfig());
  const keySet = hasApiKey(cfg);
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState(cfg.apiKey);
  const [modelInput, setModelInput] = useState(cfg.model);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [identity, setIdentity] = useState<ChemIdentity | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function saveKey() {
    const next: AiConfig = { apiKey: keyInput.trim(), model: (modelInput || DEFAULT_MODEL).trim() };
    saveAiConfig(next);
    setCfg(loadAiConfig());
    setShowKey(false);
    setError(null);
  }

  function resolve(name: string, hs: string) {
    let p = byName.get((name || "").toLowerCase().trim());
    if (!p && hs) p = byHs.get(hs.trim());
    if (!p && name) {
      const q = name.toLowerCase().trim();
      p = products.find((x) => x.name.toLowerCase().includes(q) || q.includes(x.name.toLowerCase()));
    }
    return p;
  }

  async function doResearch(q: string, controller: AbortController) {
    setResearching(true);
    setError(null);
    try {
      const profile = await researchProduct(cfg, q, controller.signal);
      setResults(null);
      onAiProfile(profile);
    } catch (e) {
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Online research failed.");
    } finally {
      setResearching(false);
    }
  }

  async function run(text: string) {
    const q = text.trim();
    if (!q || busy || researching) return;
    if (!keySet) {
      setError("No OpenRouter API key found. Click the key icon to add it, or set VITE_OPENROUTER_API_KEY in .env.");
      setShowKey(true);
      return;
    }
    setError(null);
    setResults(null);
    setIdentity(null);
    setLastQuery(q);
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    // Resolve chemical identity via PubChem first (CAS ↔ name) for accuracy.
    // Skip obvious use-case phrases (many words) to avoid pointless lookups.
    let id: ChemIdentity | null = null;
    if (q.split(/\s+/).length <= 5) {
      id = await resolveIdentity(q, controller.signal).catch(() => null);
      if (controller.signal.aborted) return;
      if (id) setIdentity(id);
    }

    // Feed the canonical identity to the model so a bare CAS resolves correctly.
    const queryHint = id
      ? `${q}\nResolved identity (PubChem): ${id.name}${id.formula ? ` (${id.formula})` : ""}${id.primaryCas ? `, CAS ${id.primaryCas}` : ""}. Match on this compound.`
      : q;

    const messages: ChatMsg[] = [
      {
        role: "system",
        content: [
          "You are a product finder for a chemical sourcing catalog. The user gives a natural-language query — a chemical name, synonym, abbreviation, CAS number, HS code, chemical family, or an application/use-case.",
          "From the CATALOG below, choose the products that best match. Interpret synonyms, trade names, abbreviations, chemical families and end-uses.",
          "When a resolved identity (name/formula/CAS) is provided, trust it as the authoritative compound identification.",
          "Return ONLY a JSON array (no prose, no markdown, no code fences) of up to 6 objects, best match first:",
          '[{"name":"<exact catalog name>","hs":"<exact HS code>","reason":"<short reason it matches>"}]',
          "Rules: name and hs MUST be copied verbatim from the CATALOG. Never invent products. If nothing in the catalog matches, return [].",
          "",
          "CATALOG:",
          CATALOG_INDEX,
        ].join("\n"),
      },
      { role: "user", content: queryHint },
    ];

    try {
      const raw = await chatComplete(cfg, messages, controller.signal);
      const json = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      let parsed: Array<{ name?: string; hs?: string; reason?: string }> = [];
      const start = json.indexOf("[");
      const end = json.lastIndexOf("]");
      if (start >= 0 && end > start) parsed = JSON.parse(json.slice(start, end + 1));

      const seen = new Set<string>();
      const mapped: Result[] = [];
      for (const r of parsed) {
        const p = resolve(r.name ?? "", r.hs ?? "");
        if (!p || seen.has(p.name)) continue;
        seen.add(p.name);
        mapped.push({ name: p.name, hsCode: p.hsCode, cas: p.cas, reason: (r.reason ?? "").trim() });
      }
      setBusy(false);

      if (mapped.length > 0) {
        setResults(mapped);
      } else {
        // Not in catalog → research online. Use the resolved canonical name when
        // available (a CAS number alone researches poorly).
        await doResearch(id?.name ?? q, controller);
      }
    } catch (e) {
      setBusy(false);
      if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      abortRef.current = null;
    }
  }

  const working = busy || researching;

  return (
    <Card className="mb-4 border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(query);
            }}
            className="flex flex-1 items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, CAS, HS code or use-case…"
                className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={working || !query.trim()}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {busy ? "Searching" : researching ? "Researching" : "AI Search"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            title={keySet ? "API key detected — click to change" : "Add your OpenRouter API key"}
            className={cn(
              "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background transition hover:border-primary",
              keySet ? "border-border text-muted-foreground hover:text-foreground" : "border-amber-300 text-amber-600",
            )}
          >
            <KeyRound className="h-4 w-4" />
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-card",
                keySet ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
          </button>
        </div>

        {showKey ? (
          <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">OpenRouter API key</p>
            <input
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-or-v1-…"
              className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-xs outline-none focus:border-primary"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                list="or-models"
                placeholder="openrouter/auto"
                className="h-9 min-w-[200px] flex-1 rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
              <datalist id="or-models">
                {MODEL_SUGGESTIONS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={saveKey}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition hover:opacity-90"
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {keySet ? "A key is currently active." : "No key detected yet."} Stored in this browser only
              (localStorage); a build-time <code className="rounded bg-muted px-1">VITE_OPENROUTER_API_KEY</code> in{" "}
              <code className="rounded bg-muted px-1">.env</code> also works. Get a key at{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
                openrouter.ai/keys
              </a>
              .
            </p>
          </div>
        ) : null}

        {/* Resolved chemical identity (PubChem CAS cross-reference) */}
        {identity ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-xs">
            <FlaskConical className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="font-semibold text-foreground">{identity.name}</span>
            {identity.formula ? (
              <span className="font-mono text-muted-foreground">{identity.formula}</span>
            ) : null}
            {identity.primaryCas ? (
              <span className="font-mono text-emerald-700">CAS {identity.primaryCas}</span>
            ) : null}
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-0.5 text-primary hover:underline"
            >
              CID {identity.cid} <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-muted-foreground">· identity verified via PubChem</span>
          </div>
        ) : null}

        {/* Researching (online) status */}
        {researching ? (
          <p className="mt-3 flex items-center gap-2 rounded-md border border-primary/30 bg-accent/40 px-3 py-2 text-xs text-foreground">
            <Globe className="h-3.5 w-3.5 shrink-0 animate-pulse text-primary" />
            &quot;{lastQuery}&quot; isn&apos;t in the catalog — researching it from verified web sources. This can take ~20–40s.
          </p>
        ) : null}

        {/* Example chips (before first search) */}
        {!results && !working && !error ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-9">
            <span className="text-[11px] text-muted-foreground">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex);
                  run(ex);
                }}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3">
            <p className="flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
            {lastQuery && keySet ? (
              <button
                onClick={() => {
                  const controller = new AbortController();
                  abortRef.current = controller;
                  doResearch(lastQuery, controller);
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary"
              >
                <Globe className="h-3.5 w-3.5 text-primary" /> Research &quot;{lastQuery}&quot; online
              </button>
            ) : null}
          </div>
        ) : null}

        {results && results.length > 0 ? (
          <div className="mt-3 space-y-1.5">
            <p className="pl-9 text-[11px] text-muted-foreground">
              {results.length} catalog match{results.length === 1 ? "" : "es"} — click to open
            </p>
            {results.map((r) => {
              const verified = Boolean(verifiedFor(slug(r.name)));
              return (
                <button
                  key={r.name}
                  onClick={() => onPick(r.name)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-left transition hover:border-primary hover:bg-muted",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
                      {verified ? <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : null}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="font-mono">HS {r.hsCode}</span>
                      {r.cas ? <span className="font-mono">CAS {r.cas}</span> : null}
                      {r.reason ? <span className="text-muted-foreground">· {r.reason}</span> : null}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </button>
              );
            })}
            {/* Force online research even when there is a catalog guess */}
            {lastQuery ? (
              <button
                onClick={() => {
                  const controller = new AbortController();
                  abortRef.current = controller;
                  doResearch(lastQuery, controller);
                }}
                className="ml-9 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
              >
                <Globe className="h-3.5 w-3.5" /> Not it? Research &quot;{lastQuery}&quot; online instead
              </button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
