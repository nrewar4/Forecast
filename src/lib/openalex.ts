// Searches OpenAlex for scientific papers about a chemical name.
// Returns empty array on any error, the UI shows a "no results" message.

export type Paper = {
  id: string;
  title: string;
  authors: string[];      // first 3 names; 4th entry is "et al." when truncated
  year: number | null;
  doi: string | null;     // bare DOI without https://doi.org/ prefix
  journal: string | null;
  abstract: string;       // reconstructed from OpenAlex inverted index
};

// OpenAlex stores abstracts as { word: [position, ...], ... }.
// Reconstruct by sorting word-position pairs and joining.
function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null | undefined,
): string {
  if (!invertedIndex) return "";
  const pairs: [number, string][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      pairs.push([pos, word]);
    }
  }
  return pairs
    .sort((a, b) => a[0] - b[0])
    .map(([, w]) => w)
    .join(" ");
}

export async function searchLiterature(
  query: string,
  signal?: AbortSignal,
): Promise<Paper[]> {
  const params = new URLSearchParams({
    search: query,
    filter: "type:article",
    sort: "cited_by_count:desc",
    "per-page": "8",
    select:
      "id,title,authorships,publication_year,doi,primary_location,abstract_inverted_index",
  });

  const url = `https://api.openalex.org/works?${params.toString()}`;

  try {
    const res = await fetch(url, {
      signal,
      headers: {
        // OpenAlex polite pool: higher rate limit when you identify yourself
        "User-Agent": "APAC-Sourcing-Intelligence/1.0 (mailto:finance@apacss.com)",
      },
    });
    if (!res.ok) return [];

    const json = (await res.json()) as { results?: unknown[] };
    const results = Array.isArray(json?.results) ? json.results : [];

    return results.map((w) => {
      const work = w as Record<string, unknown>;

      // Authors: take first 3, add "et al." if truncated
      const authorships = Array.isArray(work.authorships) ? work.authorships : [];
      const authors = (authorships as Record<string, unknown>[])
        .slice(0, 3)
        .map((a) => {
          const author = a?.author as Record<string, unknown> | undefined;
          return typeof author?.display_name === "string"
            ? author.display_name
            : "";
        })
        .filter(Boolean) as string[];
      if ((authorships as unknown[]).length > 3) authors.push("et al.");

      // Journal name from primary_location.source
      const loc = work.primary_location as Record<string, unknown> | undefined;
      const src = loc?.source as Record<string, unknown> | undefined;
      const journal =
        typeof src?.display_name === "string" ? src.display_name : null;

      // DOI: strip the https://doi.org/ prefix if present
      const rawDoi = typeof work.doi === "string" ? work.doi : null;
      const doi = rawDoi ? rawDoi.replace("https://doi.org/", "") : null;

      return {
        id: typeof work.id === "string" ? work.id : String(work.id ?? ""),
        title:
          typeof work.title === "string" && work.title
            ? work.title
            : "Untitled",
        authors,
        year:
          typeof work.publication_year === "number"
            ? work.publication_year
            : null,
        doi,
        journal,
        abstract: reconstructAbstract(
          work.abstract_inverted_index as
            | Record<string, number[]>
            | null
            | undefined,
        ),
      };
    });
  } catch (err) {
    if (signal && (err as Error)?.name === "AbortError") throw err;
    return [];
  }
}
