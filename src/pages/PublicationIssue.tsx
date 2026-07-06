import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Newspaper, Printer } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { EmptyState } from "@/components/EmptyState";
import { ShareBar } from "@/components/publications/ShareBar";
import { getIssue, listIssues, type IssueWithItems } from "@/lib/publications/store";
import { formatIssueNumber, periodLabel } from "@/lib/publications/fortnight";
import {
  PUBLICATION_LABELS,
  PUBLICATION_TAGLINES,
  type PublicationSlug,
} from "@/lib/publications/types";
import ReactMarkdownBody from "@/components/publications/MarkdownBody";

function isPub(v: string | undefined): v is PublicationSlug {
  return v === "asia-source" || v === "insight";
}

export default function PublicationIssue() {
  const { pub, issue: issueParam } = useParams();
  const issueNumber = Number(issueParam);
  const [data, setData] = useState<IssueWithItems | null>(null);
  const [neighbours, setNeighbours] = useState<{ prev?: number; next?: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!isPub(pub) || !Number.isFinite(issueNumber)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const [got, all] = await Promise.all([getIssue(pub, issueNumber), listIssues(pub, { publishedOnly: true })]);
      if (cancelled) return;
      setData(got && got.issue.status === "published" ? got : null);
      const nums = all.map((i) => i.issueNumber).sort((a, b) => a - b);
      const idx = nums.indexOf(issueNumber);
      setNeighbours({
        prev: idx > 0 ? nums[idx - 1] : undefined,
        next: idx >= 0 && idx < nums.length - 1 ? nums[idx + 1] : undefined,
      });
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [pub, issueNumber]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const included = useMemo(() => (data ? data.items.filter((i) => i.included) : []), [data]);

  if (!isPub(pub)) {
    return (
      <MarketingLayout>
        <NotFound />
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <Link
          to="/publications"
          className="press mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          All publications
        </Link>

        {loading ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Loading issue...</p>
        ) : !data ? (
          <NotFound />
        ) : (
          <>
            {/* Masthead */}
            <header className="border-b-2 border-ink pb-5">
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-primary md:text-4xl">
                  {PUBLICATION_LABELS[data.issue.publication]}
                </h1>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {formatIssueNumber(data.issue.issueNumber)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {PUBLICATION_TAGLINES[data.issue.publication]}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                {periodLabel(data.issue.periodStart, data.issue.periodEnd)}
              </p>
            </header>

            {/* Cover line */}
            {data.issue.title ? (
              <h2 className="mt-8 text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
                {data.issue.title}
              </h2>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4">
              <ShareBar issue={data.issue} items={data.items} url={shareUrl} />
              <button
                type="button"
                onClick={() => window.print()}
                className="press inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary print:hidden"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print or save PDF</span>
              </button>
            </div>

            {data.issue.kind === "article" ? (
              <ArticleBody data={data} />
            ) : (
              <BriefingBody data={data} included={included} />
            )}

            {/* Footer nav */}
            <nav className="mt-12 flex items-center justify-between border-t border-border pt-6 print:hidden">
              {neighbours.prev ? (
                <Link
                  to={`/publications/${pub}/${neighbours.prev}`}
                  className="press inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {formatIssueNumber(neighbours.prev)}
                </Link>
              ) : (
                <span />
              )}
              {neighbours.next ? (
                <Link
                  to={`/publications/${pub}/${neighbours.next}`}
                  className="press inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  {formatIssueNumber(neighbours.next)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </>
        )}
      </article>
    </MarketingLayout>
  );
}

function BriefingBody({ data, included }: { data: IssueWithItems; included: IssueWithItems["items"] }) {
  return (
    <>
      {data.issue.intro ? (
        <section className="mt-8 rounded-2xl bg-accent p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            Fortnight in Focus
          </p>
          <p className="mt-2 leading-relaxed text-ink">{data.issue.intro}</p>
        </section>
      ) : null}

      <div className="mt-10 space-y-8">
        {included.map((item, i) => (
          <section key={item.id} className="border-t border-border pt-6 first:border-0 first:pt-0">
            <div className="flex gap-4">
              <span className="select-none text-2xl font-extrabold leading-none text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.bucket}
                </p>
                <h3 className="mt-0.5 text-lg font-bold leading-snug text-ink">{item.headline}</h3>
                <p className="mt-2 leading-relaxed text-foreground/90">{item.body}</p>
                {item.sourceName ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Source:{" "}
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                      >
                        {item.sourceName}
                        <ExternalLink className="h-3 w-3 print:hidden" />
                      </a>
                    ) : (
                      <span className="font-medium">{item.sourceName}</span>
                    )}
                    {item.sourceDate ? `, ${item.sourceDate}` : ""}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>

      {data.issue.closing ? (
        <section className="mt-10 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Buyer Action
          </p>
          <p className="mt-2 leading-relaxed text-ink">{data.issue.closing}</p>
        </section>
      ) : null}
    </>
  );
}

function ArticleBody({ data }: { data: IssueWithItems }) {
  return (
    <>
      {data.issue.intro ? (
        <p className="mt-6 text-lg font-medium leading-relaxed text-foreground/90">{data.issue.intro}</p>
      ) : null}
      <ReactMarkdownBody markdown={data.issue.body} className="mt-6" />
      {data.items.length ? (
        <section className="mt-10 rounded-2xl bg-muted/60 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Sources
          </p>
          <ul className="mt-3 space-y-1.5">
            {data.items.map((s) => (
              <li key={s.id} className="text-sm">
                {s.sourceUrl ? (
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-primary hover:underline"
                  >
                    {s.sourceName}
                  </a>
                ) : (
                  <span className="font-medium">{s.sourceName}</span>
                )}
                {s.sourceDate ? <span className="text-muted-foreground">, {s.sourceDate}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function NotFound() {
  return (
    <div className="py-12">
      <EmptyState
        icon={Newspaper}
        title="Issue not available"
        hint="This issue has not been published yet, or the link is out of date."
        action={
          <Link
            to="/publications"
            className="press inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Browse publications
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
    </div>
  );
}
