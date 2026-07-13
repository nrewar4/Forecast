// The exact, documented synthesis chemistry for a specific molecule, determined
// by searching online rather than guessing from the molecular structure. In
// order of trust:
//   1. A web-grounded LLM lookup (OpenRouter web-search plugin) that returns the
//      real, documented industrial/literature route for THIS molecule, cited.
//   2. If no web plugin (e.g. a free model), the LLM reads authoritative source
//      text we fetch (PubChem "Methods of Manufacturing" + Wikipedia synthesis)
//      and extracts the actual named reactions strictly from it.
//   3. With no API key at all, a conservative keyword read of that same fetched
//      authoritative prose.
// The structure/IUPAC name is never used to invent a route; if nothing documented
// is found, we return null and say so honestly.

import type { ChemIdentity } from "@/lib/casResolve";
import type { AiConfig } from "@/lib/aiConfig";
import { hasApiKey } from "@/lib/aiConfig";
import { chatComplete, type ChatMsg } from "@/lib/openrouter";
import { tagPhrase, capabilityLabel } from "@/lib/chemLexicon";
import { cacheGet, cacheSet, DAY } from "./aiCache";

const REST_VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound";
const WIKI = "https://en.wikipedia.org/w/api.php";

export type SynthesisRoute = {
  reactions: string[]; // specific named reactions, in order, for display
  categories: string[]; // broad categories (from the lexicon), for vendor matching
  steps: string[]; // 1 to 3 sentences describing the route
  startingMaterials: string[]; // key starting materials, when known
  source: { name: string; url: string };
  grounding: "web" | "pubchem" | "wikipedia" | "text"; // how it was established
};

// Maps a list of specific reaction names to the broad, vendor-matchable
// categories, using the shared chemistry lexicon (one source of truth).
function categoriesFor(reactions: string[]): string[] {
  const set = new Set<string>();
  for (const r of reactions) for (const id of tagPhrase(r)) set.add(capabilityLabel(id));
  return [...set];
}

function clampSentence(s: string): string {
  return s.replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();
}

// --- Authoritative source text ------------------------------------------
type ViewSection = { TOCHeading?: string; Section?: ViewSection[]; Information?: Array<{ Value?: { StringWithMarkup?: Array<{ String?: string }> } }> };

function collectText(sections: ViewSection[] | undefined, heading: RegExp, out: string[]): void {
  for (const s of sections ?? []) {
    if (s.TOCHeading && heading.test(s.TOCHeading)) {
      for (const info of s.Information ?? []) {
        for (const swm of info?.Value?.StringWithMarkup ?? []) {
          if (swm.String) out.push(String(swm.String));
        }
      }
    }
    if (s.Section) collectText(s.Section, heading, out);
  }
}

async function pubchemMethods(cid: number, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(`${REST_VIEW}/${cid}/JSON?heading=Methods+of+Manufacturing`, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { Record?: { Section?: ViewSection[] } };
    const out: string[] = [];
    collectText(json?.Record?.Section, /Methods of Manufacturing/i, out);
    return out.length ? out.join(" ") : null;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

async function wikipediaProduction(name: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const url = `${WIKI}?action=query&prop=extracts&explaintext=1&redirects=1&format=json&origin=*&titles=${encodeURIComponent(name)}`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { query?: { pages?: Record<string, { extract?: string }> } };
    const page = Object.values(json?.query?.pages ?? {})[0];
    const extract = page?.extract;
    if (!extract) return null;
    const re = /\n=+\s*([^=\n]+?)\s*=+\s*\n/g;
    const heads: { title: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(extract)) !== null) heads.push({ title: m[1].trim(), start: m.index, end: re.lastIndex });
    for (let i = 0; i < heads.length; i++) {
      if (!/production|synthes|preparation|manufactur/i.test(heads[i].title)) continue;
      const body = extract.slice(heads[i].end, i + 1 < heads.length ? heads[i + 1].start : extract.length).trim();
      if (body.length > 40) return body;
    }
    return null;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}

function perSource<T>(fn: (s: AbortSignal) => Promise<T>, parent?: AbortSignal, ms = 6000): Promise<T | null> {
  return new Promise((resolve) => {
    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    parent?.addEventListener("abort", onAbort, { once: true });
    const done = (v: T | null) => { clearTimeout(t); parent?.removeEventListener("abort", onAbort); resolve(v); };
    const t = setTimeout(() => { ctrl.abort(); done(null); }, ms);
    fn(ctrl.signal).then(done).catch(() => done(null));
  });
}

// --- Conservative keyword read (no-key fallback only) --------------------
// Specific named reactions that appear in real route prose. Negated mentions
// ("resistant to oxidation") are excluded by a short look-behind.
const ROUTE_TERMS: { re: RegExp; name: string }[] = [
  { re: /methanol carbonylation/, name: "Methanol carbonylation" },
  { re: /carbonylation/, name: "Carbonylation" },
  { re: /hydroformylation|oxo process/, name: "Hydroformylation" },
  { re: /ammoxidation/, name: "Ammoxidation" },
  { re: /nitration/, name: "Nitration" },
  { re: /chlorination/, name: "Chlorination" },
  { re: /bromination/, name: "Bromination" },
  { re: /fluorination/, name: "Fluorination" },
  { re: /sulfonation|sulphonation/, name: "Sulfonation" },
  { re: /catalytic hydrogenation/, name: "Catalytic hydrogenation" },
  { re: /hydrogenation/, name: "Hydrogenation" },
  { re: /\boxidation\b/, name: "Oxidation" },
  { re: /transesterification/, name: "Transesterification" },
  { re: /esterification/, name: "Esterification" },
  { re: /reductive amination/, name: "Reductive amination" },
  { re: /buchwald|hartwig/, name: "Buchwald-Hartwig amination" },
  { re: /amidation/, name: "Amidation" },
  { re: /friedel[- ]crafts/, name: "Friedel-Crafts" },
  { re: /acylation/, name: "Acylation" },
  { re: /hydrocyanation|cyanation/, name: "Cyanation" },
  { re: /grignard/, name: "Grignard reaction" },
  { re: /suzuki/, name: "Suzuki coupling" },
  { re: /sonogashira/, name: "Sonogashira coupling" },
  { re: /\bheck reaction\b/, name: "Heck reaction" },
  { re: /cross[- ]coupling/, name: "Cross-coupling" },
  { re: /sandmeyer/, name: "Sandmeyer reaction" },
  { re: /diazoti[sz]ation/, name: "Diazotization" },
  { re: /wittig/, name: "Wittig reaction" },
  { re: /aldol|knoevenagel|claisen condensation|mannich|condensation/, name: "Condensation" },
  { re: /cycli[sz]ation|annulation/, name: "Cyclization" },
  { re: /etherification|williamson|ethoxylation/, name: "Etherification" },
  { re: /hydrolysis/, name: "Hydrolysis" },
  { re: /asymmetric|enantioselective|chiral resolution/, name: "Asymmetric / chiral step" },
  { re: /fermentation|biocataly|enzymatic/, name: "Biocatalysis / fermentation" },
];

const NEGATION = /(resist(ant)?|stable|prevent|inhibit|avoid|protect against|without|no|non-|anti-?)\s+(to\s+)?$/i;

function keywordRead(text: string): string[] {
  const t = text.toLowerCase();
  const found: string[] = [];
  for (const term of ROUTE_TERMS) {
    const m = term.re.exec(t);
    if (!m) continue;
    const before = t.slice(Math.max(0, m.index - 16), m.index);
    if (NEGATION.test(before)) continue;
    if (!found.includes(term.name)) found.push(term.name);
  }
  // Drop a generic reaction when a more specific one covers it.
  return found.filter((r) => !found.some((s) => s !== r && s.toLowerCase().endsWith(" " + r.toLowerCase())));
}

// --- LLM extraction (web-grounded, or from fetched authoritative text) ---
type LlmRoute = { summary?: string; reactions?: string[]; startingMaterials?: string[]; sourceName?: string; sourceUrl?: string };

async function llmRoute(
  identity: ChemIdentity,
  reference: string | null,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<LlmRoute | null> {
  const name = identity.name || identity.query;
  const facts = [
    `Compound: ${name}`,
    identity.primaryCas ? `CAS: ${identity.primaryCas}` : "",
    identity.formula ? `Formula: ${identity.formula}` : "",
    identity.iupac ? `IUPAC name: ${identity.iupac}` : "",
  ].filter(Boolean).join("\n");

  const sys =
    "You are an industrial process chemist. State the ACTUAL documented synthesis route used to manufacture the named compound, as found in the chemical literature and industry sources. Search the web and cite a real source. Base the answer on the known, documented route for THIS specific compound; do NOT infer a route from its molecular structure or functional groups, and do not guess. If you cannot find a documented route, return an empty reactions array. Reply with ONLY a JSON object, no prose, no code fences. Shape: {\"summary\":\"1-2 sentence description of the real route\",\"reactions\":[\"specific named reactions in order, e.g. Friedel-Crafts acylation, catalytic hydrogenation\"],\"startingMaterials\":[\"key starting materials\"],\"sourceName\":\"the source you used\",\"sourceUrl\":\"https url of that source\"}. Never use an em dash.";

  const user = reference
    ? `${facts}\n\nAuthoritative reference text (from PubChem / Wikipedia) describing how it is made:\n"""${reference.slice(0, 3500)}"""\n\nExtract the real route from this text (and verify online). Return the JSON.`
    : `${facts}\n\nFind and return the real documented industrial synthesis route as JSON.`;

  const messages: ChatMsg[] = [
    { role: "system", content: sys },
    { role: "user", content: user },
  ];
  try {
    const raw = await chatComplete(cfg, messages, signal, { web: true });
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]) as LlmRoute;
  } catch {
    return null;
  }
}

function isHttpUrl(u: unknown): u is string {
  return typeof u === "string" && /^https?:\/\/\S+$/i.test(u);
}

// Resolves the documented, molecule-specific synthesis route. Best-effort and
// time-boxed; returns null when nothing documented is found online (the caller
// then shows an honest "not verified" state rather than a structural guess).
export async function fetchSynthesisRoute(
  identity: ChemIdentity,
  cfg: AiConfig,
  signal?: AbortSignal,
): Promise<SynthesisRoute | null> {
  const key = `route2:${identity.cid || identity.query.toLowerCase()}`;
  const hit = cacheGet<SynthesisRoute | null>(key);
  if (hit) return hit;

  const name = identity.name || identity.query;

  // Fetch authoritative reference text (used to ground extraction and to cite).
  const [pcText, wikiText] = await Promise.all([
    identity.cid ? perSource((s) => pubchemMethods(identity.cid, s), signal, 6000) : Promise.resolve(null),
    perSource((s) => wikipediaProduction(name, s), signal, 6000),
  ]);
  const reference = [pcText, wikiText].filter(Boolean).join("\n\n") || null;

  const fetchedSource = pcText
    ? { name: "PubChem, Methods of Manufacturing (HSDB)", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}#section=Methods-of-Manufacturing`, grounding: "pubchem" as const }
    : wikiText
      ? { name: `Wikipedia: ${name}`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, "_"))}`, grounding: "wikipedia" as const }
      : null;

  let route: SynthesisRoute | null = null;

  // 1 + 2: LLM (web-grounded, or reading the fetched reference text).
  if (hasApiKey(cfg)) {
    const llm = await llmRoute(identity, reference, cfg, signal);
    const reactions = (llm?.reactions ?? []).map((r) => clampSentence(r)).filter((r) => r.length > 2).slice(0, 8);
    if (reactions.length) {
      const steps = llm?.summary
        ? clampSentence(llm.summary).split(/(?<=[.;])\s+(?=[A-Z0-9])/).filter((s) => s.length > 20).slice(0, 3)
        : [];
      // Prefer a real fetched source; else the model's cited URL; else a PubChem link.
      const source = fetchedSource
        ? { name: fetchedSource.name, url: fetchedSource.url }
        : isHttpUrl(llm?.sourceUrl)
          ? { name: llm?.sourceName || "Cited source", url: llm!.sourceUrl! }
          : { name: `PubChem: ${name}`, url: identity.cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}` : `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(name)}` };
      const grounding: SynthesisRoute["grounding"] = fetchedSource ? fetchedSource.grounding : "web";
      route = {
        reactions,
        categories: categoriesFor(reactions),
        steps,
        startingMaterials: (llm?.startingMaterials ?? []).map((s) => clampSentence(s)).filter(Boolean).slice(0, 6),
        source,
        grounding,
      };
    }
  }

  // 3: no key (or the LLM found nothing) -> conservative read of fetched prose.
  if (!route && reference && fetchedSource) {
    const reactions = keywordRead(reference).slice(0, 8);
    if (reactions.length) {
      const steps = clampSentence(reference)
        .split(/(?<=[.;])\s+(?=[A-Z0-9])/)
        .map((s) => s.trim())
        .filter((s) => s.length > 30)
        .slice(0, 3);
      route = {
        reactions,
        categories: categoriesFor(reactions),
        steps,
        startingMaterials: [],
        source: { name: fetchedSource.name, url: fetchedSource.url },
        grounding: fetchedSource.grounding,
      };
    }
  }

  if (route) cacheSet(key, route, DAY);
  return route;
}
