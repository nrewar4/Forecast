import { useEffect, useState } from "react";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { topicLinks, fetchMarketNews, type NewsItem, type NewsQuery } from "@/lib/news";

function timeAgo(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  if (!Number.isFinite(diff) || diff < 0) return "";
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

// Recent chemical-industry and trade headlines, fetched live from Google News.
// Falls back to topic search links if the live feed cannot be reached so the
// panel always offers something useful and never renders empty.
export function MarketNews({
  title = "Recent Market News",
  queries,
}: {
  title?: string;
  queries?: NewsQuery[];
}) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setFailed(false);
    try {
      const news = await fetchMarketNews(16, queries);
      setItems(news);
    } catch {
      setItems(null);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fallbacks = topicLinks(queries);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <button
          onClick={load}
          disabled={loading}
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          aria-label="Refresh news"
          title="Refresh"
        >
          <RefreshCw className={"h-3.5 w-3.5" + (loading ? " animate-spin" : "")} />
        </button>
      </CardHeader>
      <CardContent className="pt-1">
        {loading && !items ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-1.5">
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-2.5 w-1/3 rounded bg-muted/70" />
              </div>
            ))}
          </div>
        ) : items && items.length ? (
          <ul className="max-h-[440px] space-y-0.5 overflow-y-auto pr-1">
            {items.map((it, i) => (
              <li key={it.link + i}>
                <a
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-0.5 rounded-md px-2 py-2 transition hover:bg-muted"
                >
                  <span className="flex items-start gap-1.5 text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                    {it.title}
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {it.source}
                    {timeAgo(it.date) ? <span className="mx-1 text-border">·</span> : null}
                    {timeAgo(it.date)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-3">
            {failed ? (
              <p className="text-xs text-muted-foreground">
                Headlines could not be loaded right now. Open the latest by topic:
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {fallbacks.map((t) => (
                <a
                  key={t.label}
                  href={t.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                >
                  <Newspaper className="h-3 w-3 text-primary" />
                  {t.label}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
