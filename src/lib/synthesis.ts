// Verified, online-sourced production chemistry from Wikipedia. Wikipedia's API
// is free, keyless and CORS-enabled (origin=*), and its chemical articles carry
// referenced "Production" / "Synthesis" / "Preparation" sections. We pull that
// section as plain text and cite the article, so the feasibility card shows how
// a molecule is actually made from a public source rather than a generic
// classification. Best-effort and cached for a day; returns null on a miss.

import { cacheGet, cacheSet, DAY } from "./aiCache";

const API = "https://en.wikipedia.org/w/api.php";

export type SynthesisInfo = {
  headline: string; // the section title we used (e.g. "Production")
  steps: string[]; // 2 to 4 concise sentences from that section
  sourceName: string; // "Wikipedia: <title>"
  sourceUrl: string;
};

const SECTION_RE = /production|synthes|preparation|manufactur/i;

function pageUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`;
}

// Splits a plain-text Wikipedia extract into { heading -> body } and returns the
// body of the first heading that looks like a production/synthesis section.
function extractSection(plain: string): { title: string; body: string } | null {
  const headingRe = /\n=+\s*([^=\n]+?)\s*=+\s*\n/g;
  const heads: { title: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(plain)) !== null) {
    heads.push({ title: m[1].trim(), start: m.index, end: headingRe.lastIndex });
  }
  for (let i = 0; i < heads.length; i++) {
    if (!SECTION_RE.test(heads[i].title)) continue;
    const bodyStart = heads[i].end;
    const bodyEnd = i + 1 < heads.length ? heads[i + 1].start : plain.length;
    const body = plain.slice(bodyStart, bodyEnd).trim();
    if (body.length > 40) return { title: heads[i].title, body };
  }
  return null;
}

// First 2 to 4 substantive sentences of the section, cleaned of stray markers.
function toSteps(body: string): string[] {
  const clean = body.replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();
  const sentences = clean
    .split(/(?<=[.;])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);
  return sentences.slice(0, 4);
}

async function fetchExtract(title: string, signal?: AbortSignal): Promise<{ title: string; extract: string } | null> {
  const url =
    `${API}?action=query&prop=extracts&explaintext=1&redirects=1&format=json&origin=*&titles=${encodeURIComponent(title)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    query?: { pages?: Record<string, { title?: string; extract?: string; missing?: string }> };
  };
  const pages = json?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined || !page.extract) return null;
  return { title: page.title ?? title, extract: page.extract };
}

async function searchTitle(name: string, signal?: AbortSignal): Promise<string | null> {
  const url =
    `${API}?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=${encodeURIComponent(name)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const json = (await res.json()) as { query?: { search?: Array<{ title?: string }> } };
  return json?.query?.search?.[0]?.title ?? null;
}

// Resolves the molecule's production chemistry from Wikipedia. Tries the name as
// a direct article title first, then a search fallback, and returns the cited
// production/synthesis section when the article has one.
export async function fetchSynthesis(name: string, signal?: AbortSignal): Promise<SynthesisInfo | null> {
  const key = `synth:${name.toLowerCase().trim()}`;
  const hit = cacheGet<SynthesisInfo | null>(key);
  if (hit !== null) return hit;

  try {
    let page = await fetchExtract(name, signal);
    if (!page || !extractSection(page.extract)) {
      const found = await searchTitle(name, signal);
      if (found) {
        const alt = await fetchExtract(found, signal);
        if (alt && extractSection(alt.extract)) page = alt;
      }
    }
    if (!page) {
      cacheSet(key, null, DAY);
      return null;
    }
    const section = extractSection(page.extract);
    if (!section) {
      cacheSet(key, null, DAY);
      return null;
    }
    const steps = toSteps(section.body);
    if (!steps.length) {
      cacheSet(key, null, DAY);
      return null;
    }
    const info: SynthesisInfo = {
      headline: /synthes|preparation/i.test(section.title) ? "Synthesis route" : "Industrial production",
      steps,
      sourceName: `Wikipedia: ${page.title}`,
      sourceUrl: pageUrl(page.title),
    };
    cacheSet(key, info, DAY);
    return info;
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return null;
  }
}
