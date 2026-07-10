import { useEffect, useState } from "react";
import { ArrowUpRight, Newspaper, RefreshCw } from "lucide-react";
import { fetchMarketNews, topicLinks, type NewsItem, type NewsQuery } from "@/lib/news";

function timeAgo(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  if (!Number.isFinite(diff) || diff < 0) return "";
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// Recent impactful news for the chemical trading sector, pulled live from Google
// News RSS feeds and shown as a grid of hyperlinked cards. Every item links out
// to the full article. Falls back to topic links if the feed cannot be reached.
export function ImpactNews({ queries }: { queries: NewsQuery[] }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await fetchMarketNews(18, queries));
    } catch {
      setItems(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Recent impactful news</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            What is moving the chemical trading sector now, updated live from news feeds.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="press inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={"h-3.5 w-3.5" + (loading ? " animate-spin" : "")} />
          Refresh
        </button>
      </div>

      {loading && !items ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-border bg-card shimmer" />
          ))}
        </div>
      ) : items && items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <a
              key={it.link + i}
              href={it.link}
              target="_blank"
              rel="noreferrer noopener"
              className="press group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                {it.title}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate pr-2">
                  {it.source}
                  {timeAgo(it.date) ? ` · ${timeAgo(it.date)}` : ""}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Live headlines could not be loaded right now. Open the latest by topic:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {topicLinks(queries).map((t) => (
              <a
                key={t.label}
                href={t.link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Newspaper className="h-3 w-3 text-primary" />
                {t.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
