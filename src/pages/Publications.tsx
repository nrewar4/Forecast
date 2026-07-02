import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Newspaper } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { EmptyState } from "@/components/EmptyState";
import { SubscribeForm } from "@/components/SubscribeForm";
import { listIssues } from "@/lib/publications/store";
import { formatIssueNumber, periodLabel } from "@/lib/publications/fortnight";
import {
  PUBLICATION_LABELS,
  PUBLICATION_TAGLINES,
  type Issue,
  type PublicationSlug,
} from "@/lib/publications/types";

const PUBS: PublicationSlug[] = ["asia-source", "insight"];

export default function Publications() {
  const [issues, setIssues] = useState<Record<PublicationSlug, Issue[]>>({
    "asia-source": [],
    insight: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(PUBS.map((p) => listIssues(p, { publishedOnly: true }))).then((results) => {
      if (cancelled) return;
      setIssues({ "asia-source": results[0], insight: results[1] });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <header className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Publications
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Fortnightly reads on chemical sourcing
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Two source-backed briefings, prepared every two weeks. Asia Source scans the fortnight across
            16 themes. Insight goes deep on one story that matters. Both are free by email.
          </p>
        </header>

        {/* Subscribe */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-6 md:grid-cols-[1.2fr,1fr] md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-ink">Subscribe</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Get each new issue in your inbox. Pick one or both. Unsubscribe anytime.
              </p>
            </div>
            <SubscribeForm />
          </div>
        </div>

        {/* Publication sections */}
        <div className="mt-12 space-y-12">
          {PUBS.map((pub) => (
            <section key={pub}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                  {pub === "asia-source" ? <Newspaper className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink">{PUBLICATION_LABELS[pub]}</h2>
                  <p className="text-sm text-muted-foreground">{PUBLICATION_TAGLINES[pub]}</p>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading issues...</p>
                ) : issues[pub].length === 0 ? (
                  <EmptyState
                    icon={pub === "asia-source" ? Newspaper : FileText}
                    title="No issues published yet"
                    hint={
                      pub === "asia-source"
                        ? "The first Asia Source issue will appear here."
                        : "The first Insight feature is in preparation. Subscribe to be notified."
                    }
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {issues[pub].map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link
      to={`/publications/${issue.publication}/${issue.issueNumber}`}
      className="press group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-1 hover:border-primary/50 hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {formatIssueNumber(issue.issueNumber)}
        </span>
        <span className="text-xs text-muted-foreground">
          {periodLabel(issue.periodStart, issue.periodEnd)}
        </span>
      </div>
      <h3 className="mt-3 flex-1 text-base font-semibold leading-snug text-ink">
        {issue.title || `${PUBLICATION_LABELS[issue.publication]} ${formatIssueNumber(issue.issueNumber)}`}
      </h3>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Read issue
        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
