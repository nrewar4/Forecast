// The exact, verified synthesis chemistry for a specific molecule, from online
// sources rather than a functional-group guess:
//   - PubChem PUG-View "Methods of Manufacturing" (HSDB-sourced, cited), and
//   - Wikipedia's "Production" / "Synthesis" section.
// From that verified prose we extract the SPECIFIC named reactions (e.g. "Methanol
// carbonylation", "Friedel-Crafts acylation") and the broad categories they map
// to (used to match vendors). The IUPAC name is used as a second confirmation of
// the functional groups involved. Every route is cited back to its source.

import type { ChemIdentity } from "@/lib/casResolve";
import { cacheGet, cacheSet, DAY } from "./aiCache";

const REST_VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound";
const WIKI = "https://en.wikipedia.org/w/api.php";

export type SynthesisRoute = {
  reactions: string[]; // specific named reactions, for display
  categories: string[]; // broad categories, for vendor matching
  steps: string[]; // 1 to 3 cited sentences describing the route
  source: { name: string; url: string };
  confirmedByName: boolean; // whether the IUPAC name reinforced the chemistry
  /** how the route was obtained: "verified" = extracted from a primary database
   *  (PubChem Methods of Manufacturing / Wikipedia); "ai" = AI web/knowledge
   *  research that must be verified against its cited source */
  grounding: "verified" | "ai";
};

export type ConsultLink = { name: string; url: string };

// Verified chemistry references a user can open to look up the real synthesis
// when we could not extract a documented route. These are the sources the
// business asked us to use (LibreTexts, the Organic Chemistry Portal) plus the
// primary databases, each deep-linked to a search for the named compound so the
// answer comes from the literature, never from a structural guess.
export function chemistryConsultLinks(name: string, cid?: number): ConsultLink[] {
  const q = encodeURIComponent(name);
  const links: ConsultLink[] = [
    { name: "LibreTexts Chemistry", url: `https://chem.libretexts.org/Special:Search?query=${q}%20synthesis` },
    { name: "Organic Chemistry Portal", url: `https://www.organic-chemistry.org/search.aspx?q=${q}` },
    { name: "PubChem, Methods of Manufacturing", url: cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=Methods-of-Manufacturing` : `https://pubchem.ncbi.nlm.nih.gov/#query=${q}` },
    { name: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, "_"))}` },
    { name: "Google Scholar", url: `https://scholar.google.com/scholar?q=${encodeURIComponent(`${name} synthesis route`)}` },
  ];
  return links;
}

type Rx = { re: RegExp; name: string; category?: string };

// Specific reactions found in industrial-route prose. `category` is the broad
// vendor-matchable class; reactions with no category (carbonylation, fermentation)
// are shown but do not drive matching. Order = display priority.
const ROUTE_REACTIONS: Rx[] = [
  { re: /methanol carbonylation/, name: "Methanol carbonylation" },
  { re: /carbonylation/, name: "Carbonylation" },
  { re: /hydroformylation|oxo process/, name: "Hydroformylation", category: "Oxidation" },
  { re: /ammoxidation/, name: "Ammoxidation", category: "Oxidation" },
  { re: /nitration/, name: "Nitration", category: "Nitration" },
  { re: /chlorination/, name: "Chlorination", category: "Halogenation" },
  { re: /bromination/, name: "Bromination", category: "Halogenation" },
  { re: /fluorination/, name: "Fluorination", category: "Halogenation" },
  { re: /\bhalogenation\b/, name: "Halogenation", category: "Halogenation" },
  { re: /sulfonation|sulphonation/, name: "Sulfonation", category: "Sulfonation" },
  { re: /catalytic hydrogenation/, name: "Catalytic hydrogenation", category: "Catalytic hydrogenation" },
  { re: /hydrogenation/, name: "Hydrogenation", category: "Catalytic hydrogenation" },
  { re: /\boxidation\b|oxidative/, name: "Oxidation", category: "Oxidation" },
  { re: /transesterification/, name: "Transesterification", category: "Esterification" },
  { re: /esterification/, name: "Esterification", category: "Esterification" },
  { re: /reductive amination/, name: "Reductive amination", category: "Amination" },
  { re: /buchwald|hartwig/, name: "Buchwald-Hartwig amination", category: "Amination" },
  { re: /amidation/, name: "Amidation", category: "Amide coupling" },
  { re: /acylation/, name: "Acylation", category: "Amide coupling" },
  { re: /\bamination\b/, name: "Amination", category: "Amination" },
  { re: /hydrocyanation|cyanation/, name: "Cyanation", category: "Cyanation" },
  { re: /friedel[- ]crafts/, name: "Friedel-Crafts", category: "Friedel-Crafts / aromatic substitution" },
  { re: /grignard/, name: "Grignard reaction", category: "Grignard / organometallic" },
  { re: /organolithium/, name: "Organolithium", category: "Grignard / organometallic" },
  { re: /suzuki/, name: "Suzuki coupling", category: "Cross-coupling" },
  { re: /\bheck\b/, name: "Heck reaction", category: "Cross-coupling" },
  { re: /sonogashira/, name: "Sonogashira coupling", category: "Cross-coupling" },
  { re: /cross[- ]coupling/, name: "Cross-coupling", category: "Cross-coupling" },
  { re: /sandmeyer/, name: "Sandmeyer reaction", category: "Diazotization" },
  { re: /diazoti[sz]ation/, name: "Diazotization", category: "Diazotization" },
  { re: /wittig/, name: "Wittig reaction", category: "Olefination / elimination" },
  { re: /dehydrohalogenation|dehydration|\belimination\b/, name: "Elimination", category: "Olefination / elimination" },
  { re: /aldol|claisen|knoevenagel|mannich|condensation/, name: "Condensation", category: "Condensation" },
  { re: /cycli[sz]ation|annulation/, name: "Cyclization", category: "Heterocycle formation" },
  { re: /williamson|etherification|alkoxylation|ethoxylation/, name: "Etherification", category: "Etherification" },
  { re: /o-methylation|n-methylation|\bmethylation\b|\balkylation\b/, name: "Alkylation", category: "Etherification" },
  { re: /hydrolysis/, name: "Hydrolysis", category: "Hydrolysis" },
  { re: /phosphoryl/, name: "Phosphorylation", category: "Phosphorylation" },
  { re: /asymmetric|enantioselective|chiral resolution/, name: "Asymmetric / chiral step", category: "Chiral / asymmetric synthesis" },
  { re: /fermentation|biocataly|enzymatic/, name: "Biocatalysis / fermentation" },
];

// Functional-group cues in the IUPAC name, used to confirm the chemistry class.
const IUPAC_HINTS: Rx[] = [
  { re: /nitro/, name: "Nitration", category: "Nitration" },
  { re: /chloro|bromo|fluoro|iodo/, name: "Halogenation", category: "Halogenation" },
  { re: /sulfo|sulfonyl|sulfonic/, name: "Sulfonation", category: "Sulfonation" },
  { re: /amino/, name: "Amination", category: "Amination" },
  { re: /carbonitrile|nitrile|cyano/, name: "Cyanation", category: "Cyanation" },
  { re: /phospha|phosphor/, name: "Phosphorylation", category: "Phosphorylation" },
];

function clampSentence(s: string): string {
  return s.replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();
}

// --- PubChem "Methods of Manufacturing" (PUG-View) ------------------------
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

// --- Wikipedia Production / Synthesis section -----------------------------
async function wikipediaProduction(name: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const url = `${WIKI}?action=query&prop=extracts&explaintext=1&redirects=1&format=json&origin=*&titles=${encodeURIComponent(name)}`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { query?: { pages?: Record<string, { extract?: string }> } };
    const page = Object.values(json?.query?.pages ?? {})[0];
    const extract = page?.extract;
    if (!extract) return null;
    // find a Production / Synthesis / Preparation section
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

// Extracts specific reactions + broad categories from route prose, reinforced by
// the IUPAC name. Reactions are ordered by the rule list; categories drive
// vendor matching and are capped so a multi-route description does not explode.
function extract(text: string, iupac: string | null): { reactions: string[]; categories: string[]; byName: boolean } {
  const t = text.toLowerCase();
  const reactions: string[] = [];
  const categories = new Set<string>();
  for (const r of ROUTE_REACTIONS) {
    if (r.re.test(t)) {
      if (!reactions.includes(r.name)) reactions.push(r.name);
      if (r.category) categories.add(r.category);
    }
  }
  // The IUPAC name is used ONLY to CONFIRM chemistry already found in the
  // documented prose, never to add a category. Adding a category from the name
  // would be a structural guess (a group in the product does not tell you the
  // reaction used to make it), and it would then leak into the manufacturer
  // match. So byName is true only when a name cue agrees with a category the
  // prose already established; the category set itself is unchanged.
  let byName = false;
  if (iupac) {
    const n = iupac.toLowerCase();
    for (const h of IUPAC_HINTS) {
      if (h.re.test(n) && h.category && categories.has(h.category)) {
        byName = true;
        break;
      }
    }
  }
  // Drop a generic reaction when a more specific one already covers it, e.g.
  // "Carbonylation" when "Methanol carbonylation" matched, or "Hydrogenation"
  // when "Catalytic hydrogenation" did.
  const specific = reactions.filter(
    (r) => !reactions.some((s) => s !== r && s.toLowerCase().endsWith(" " + r.toLowerCase())),
  );
  return { reactions: specific.slice(0, 8), categories: [...categories].slice(0, 6), byName };
}

// Resolves the verified, molecule-specific synthesis route. Best-effort and
// time-boxed per source; returns null when neither source yields a route (the
// caller then falls back to the structural classification).
export async function fetchSynthesisRoute(identity: ChemIdentity, signal?: AbortSignal): Promise<SynthesisRoute | null> {
  const key = `route:${identity.cid || identity.query.toLowerCase()}`;
  const hit = cacheGet<SynthesisRoute | null>(key);
  if (hit) return hit;

  const name = identity.name || identity.query;
  const [pcText, wikiText] = await Promise.all([
    identity.cid ? perSource((s) => pubchemMethods(identity.cid, s), signal) : Promise.resolve(null),
    perSource((s) => wikipediaProduction(name, s), signal),
  ]);

  const primary = pcText || wikiText;
  if (!primary) return null;

  const combined = [pcText, wikiText].filter(Boolean).join(" ");
  const { reactions, categories, byName } = extract(combined, identity.iupac);
  if (reactions.length === 0 && categories.length === 0) return null;

  // A couple of cited sentences from the source describing the actual route.
  const steps = clampSentence(primary)
    .split(/(?<=[.;])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30)
    .slice(0, 3);

  const source = pcText
    ? { name: "PubChem, Methods of Manufacturing (HSDB)", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${identity.cid}#section=Methods-of-Manufacturing` }
    : { name: `Wikipedia: ${name}`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, "_"))}` };

  const route: SynthesisRoute = { reactions, categories, steps, source, confirmedByName: byName, grounding: "verified" };
  cacheSet(key, route, DAY);
  return route;
}
