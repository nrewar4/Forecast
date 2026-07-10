// Live market news for the Overview.
//
// The dashboard pulls recent chemical-industry and trade headlines so a sourcing
// analyst sees market-moving events (capacity, prices, tariffs, plant outages)
// next to the trade data. We use Google News RSS search feeds because they are
// reliable, CORS-friendly through a JSON bridge, and let us target exactly the
// topics that matter (India chemicals, US chemicals, prices, tariffs).
//
// Feeds are fetched in the browser via the public rss2json bridge (no key, light
// rate limits). If that is unavailable, the caller falls back to topic links
// (see `fallbackTopics`) so the panel is never empty or broken.

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  date: string; // ISO
};

// Each entry is a Google News search the bridge turns into an RSS feed.
const GOOGLE_NEWS = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

export type NewsQuery = { label: string; q: string };

const QUERIES: NewsQuery[] = [
  { label: "India chemicals", q: "India chemical industry OR specialty chemicals when:14d" },
  { label: "US chemicals", q: "United States chemical industry OR petrochemicals when:14d" },
  { label: "Prices & supply", q: "chemical prices OR chemical plant capacity OR feedstock when:14d" },
  { label: "Trade & tariffs", q: "chemical imports OR chemical exports OR tariff chemicals when:14d" },
];

// Trade-market queries for the Market Overview's six focus countries.
export const TRADE_QUERIES: NewsQuery[] = [
  { label: "US trade", q: "United States trade exports imports tariffs when:14d" },
  { label: "China trade", q: "China trade exports customs data when:14d" },
  { label: "India trade", q: "India trade exports imports merchandise when:14d" },
  { label: "Japan trade", q: "Japan trade exports imports balance when:14d" },
  { label: "Korea trade", q: "South Korea trade exports semiconductors when:14d" },
  { label: "Saudi trade", q: "Saudi Arabia trade exports oil non-oil when:14d" },
];

// Chemical-sector trade queries for the impactful-news section. Tuned to the
// events that move chemical sourcing: tariffs, capacity, feedstock, freight.
export const CHEM_TRADE_QUERIES: NewsQuery[] = [
  { label: "Chemical tariffs and trade", q: "chemical industry tariff OR trade OR export controls when:21d" },
  { label: "Petrochemical capacity", q: "petrochemical capacity OR plant OR shutdown OR expansion when:21d" },
  { label: "Feedstock and prices", q: "chemical prices OR naphtha OR ethylene OR feedstock when:21d" },
  { label: "Freight and supply", q: "chemical shipping OR freight OR supply chain chemicals when:21d" },
  { label: "China chemicals", q: "China chemical exports OR overcapacity OR anti-dumping when:21d" },
  { label: "Regulation", q: "chemical regulation OR REACH OR sustainability chemicals when:21d" },
];

const BRIDGE = "https://api.rss2json.com/v1/api.json?count=12&rss_url=";

type BridgeResponse = {
  status?: string;
  feed?: { title?: string };
  items?: { title?: string; link?: string; pubDate?: string; author?: string }[];
};

// Google News titles arrive as "Headline - Publisher". Split off the publisher
// so we can show a clean source chip.
function splitSource(title: string, fallback: string): { title: string; source: string } {
  const idx = title.lastIndexOf(" - ");
  if (idx > 20) {
    return { title: title.slice(0, idx).trim(), source: title.slice(idx + 3).trim() };
  }
  return { title: title.trim(), source: fallback };
}

async function fetchFeed(q: string): Promise<NewsItem[]> {
  const url = BRIDGE + encodeURIComponent(GOOGLE_NEWS(q));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`news bridge ${res.status}`);
  const data = (await res.json()) as BridgeResponse;
  if (data.status && data.status !== "ok") throw new Error("news bridge error");
  return (data.items ?? [])
    .filter((it) => it.title && it.link)
    .map((it) => {
      const { title, source } = splitSource(it.title as string, "Google News");
      return {
        title,
        link: it.link as string,
        source,
        date: it.pubDate ? new Date(it.pubDate).toISOString() : new Date().toISOString(),
      };
    });
}

// Pulls all topic feeds in parallel, merges, de-duplicates by title, and returns
// the most recent items. Throws only if every feed fails.
export async function fetchMarketNews(limit = 12, queries: NewsQuery[] = QUERIES): Promise<NewsItem[]> {
  const results = await Promise.allSettled(queries.map((t) => fetchFeed(t.q)));
  const merged: NewsItem[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }
  if (merged.length === 0) throw new Error("all news feeds failed");
  return merged.sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

// Used when live news cannot load: real, useful links to the same topic searches
// so the user can still jump straight to current headlines.
export const topicLinks = (queries: NewsQuery[] = QUERIES): { label: string; link: string }[] =>
  queries.map((t) => ({
    label: t.label,
    link: `https://news.google.com/search?q=${encodeURIComponent(t.q.replace(/ when:14d/, ""))}`,
  }));

export const fallbackTopics = topicLinks();
