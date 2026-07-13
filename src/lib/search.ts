// Thin client for the keyless web-search proxy (SearXNG, see api/search.ts). It
// returns raw web results (title, url, snippet) that the chemistry researcher
// then feeds to a free model to extract a documented route. This is the
// no-credit web-grounding path: SearXNG is free and the extraction runs on a free
// model, so no OpenRouter credit is needed.

export type SearchResult = { title: string; url: string; content: string };

// Configured search endpoint. Default "/api/search" so it works out of the box
// once the proxy is deployed; the proxy returns an empty set when SEARXNG_URL is
// not set on the server, so this degrades gracefully.
const SEARCH_URL = ((import.meta.env.VITE_SEARCH_URL as string | undefined) || "/api/search").trim();

export function hasWebSearch(): boolean {
  return SEARCH_URL.length > 0;
}

export async function searchWeb(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!hasWebSearch()) return [];
  try {
    const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: SearchResult[] };
    return Array.isArray(json.results) ? json.results : [];
  } catch {
    return [];
  }
}
