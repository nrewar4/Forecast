import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  KeyRound,
  Loader2,
  Newspaper,
  Sparkles,
  Wand2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { IssueEditor } from "@/components/studio/IssueEditor";
import { PromptEditor } from "@/components/studio/PromptEditor";
import { ArticleEditor } from "@/components/studio/ArticleEditor";
import { hasApiKey, loadAiConfig, saveAiConfig } from "@/lib/aiConfig";
import {
  activePrompt,
  getIssueById,
  listIssues,
  newId,
  publicationsBackend,
  saveDraft,
} from "@/lib/publications/store";
import {
  generateAsiaSourceDraft,
  generateInsightIdeas,
  expandInsightIdea,
} from "@/lib/publications/generator";
import { ASIA_SOURCE_BUCKETS, DEFAULT_INSIGHT_ARTICLE_PROMPT } from "@/lib/publications/prompts";
import { currentPeriod, formatIssueNumber, periodLabel } from "@/lib/publications/fortnight";
import {
  PUBLICATION_LABELS,
  type Issue,
  type IssueItem,
  type PublicationSlug,
  type StoryIdea,
} from "@/lib/publications/types";
import { cn } from "@/lib/utils";

type Tab = PublicationSlug;
type Mode = "issues" | "prompt";

export default function Studio() {
  const [tab, setTab] = useState<Tab>("asia-source");
  const [mode, setMode] = useState<Mode>("issues");

  return (
    <AppShell
      title="Publications Studio"
      subtitle="Generate, curate and publish Asia Source and Insight. Drafts are prepared by AI on a fortnightly schedule; you choose what to publish."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          {(["asia-source", "insight"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "press inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors",
                tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "asia-source" ? <Newspaper className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              {PUBLICATION_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          {(["issues", "prompt"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "press rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "issues" ? "Issues" : "Master prompt"}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        Storage backend: <span className="font-semibold text-foreground">{publicationsBackend}</span>
        {publicationsBackend === "Browser"
          ? ". Drafts live on this device. Connect Supabase to share and to email subscribers."
          : "."}
      </p>

      {mode === "prompt" ? <PromptEditor pub={tab} /> : <IssuesWorkspace key={tab} pub={tab} />}
    </AppShell>
  );
}

function IssuesWorkspace({ pub }: { pub: PublicationSlug }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ issue: Issue; items: IssueItem[] } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<StoryIdea[] | null>(null);
  const [expandingIdx, setExpandingIdx] = useState<number | null>(null);

  const cfg = loadAiConfig();
  const period = currentPeriod();

  const refresh = useCallback(async () => {
    const list = await listIssues(pub);
    setIssues(list);
  }, [pub]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedId) {
      setSelected(null);
      return;
    }
    getIssueById(selectedId).then((got) => {
      if (!cancelled) setSelected(got);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  async function generateAsiaSource() {
    setError(null);
    setGenerating(true);
    try {
      const prompt = await activePrompt(pub);
      const label = periodLabel(period.start, period.end);
      const draft = await generateAsiaSourceDraft(cfg, prompt.content, label);
      const existing = issues.find((i) => i.issueNumber === period.issueNumber && i.status === "draft");
      const issueId = existing?.id ?? newId();
      const issue: Issue = {
        id: issueId,
        publication: pub,
        kind: "issue",
        issueNumber: period.issueNumber,
        periodStart: period.start,
        periodEnd: period.end,
        status: "draft",
        title: draft.title,
        intro: draft.intro,
        body: "",
        closing: draft.closing,
        createdAt: new Date().toISOString(),
      };
      const items: IssueItem[] = draft.items.map((it, i) => ({
        id: `${issueId}-item-${i + 1}`,
        issueId,
        position: i + 1,
        bucket: it.bucket || ASIA_SOURCE_BUCKETS[i] || "",
        headline: it.headline,
        body: it.body,
        sourceName: it.sourceName,
        sourceUrl: it.sourceUrl,
        sourceDate: it.sourceDate,
        included: true,
      }));
      await saveDraft(issue, items);
      await refresh();
      setSelectedId(issueId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function generateIdeas() {
    setError(null);
    setGenerating(true);
    setIdeas(null);
    try {
      const prompt = await activePrompt(pub);
      const label = periodLabel(period.start, period.end);
      const got = await generateInsightIdeas(cfg, prompt.content, label);
      setIdeas(got);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function developIdea(idea: StoryIdea, idx: number) {
    setError(null);
    setExpandingIdx(idx);
    try {
      const label = periodLabel(period.start, period.end);
      const article = await expandInsightIdea(cfg, DEFAULT_INSIGHT_ARTICLE_PROMPT, idea, label);
      const issueId = newId();
      const issue: Issue = {
        id: issueId,
        publication: pub,
        kind: "article",
        issueNumber: period.issueNumber,
        periodStart: period.start,
        periodEnd: period.end,
        status: "draft",
        title: article.title,
        intro: article.intro,
        body: article.body,
        closing: "",
        createdAt: new Date().toISOString(),
      };
      const items: IssueItem[] = article.sources.map((s, i) => ({
        id: `${issueId}-src-${i + 1}`,
        issueId,
        position: i + 1,
        bucket: "Source",
        headline: "",
        body: "",
        sourceName: s.sourceName,
        sourceUrl: s.sourceUrl,
        sourceDate: s.sourceDate,
        included: true,
      }));
      await saveDraft(issue, items);
      await refresh();
      setIdeas(null);
      setSelectedId(issueId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not develop this story.");
    } finally {
      setExpandingIdx(null);
    }
  }

  const keyMissing = !hasApiKey(cfg);

  // Detail view: an issue is open.
  if (selected) {
    const storedIdeas: StoryIdea[] =
      selected.issue.kind === "ideas"
        ? selected.items.map((it) => ({
            headline: it.headline,
            angle: it.body,
            sourceName: it.sourceName,
            sourceUrl: it.sourceUrl,
            sourceDate: it.sourceDate,
          }))
        : [];
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="press mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to {PUBLICATION_LABELS[pub]} issues
        </button>
        {error ? (
          <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {selected.issue.kind === "article" ? (
          <ArticleEditor initialIssue={selected.issue} initialSources={selected.items} onSaved={refresh} />
        ) : selected.issue.kind === "ideas" ? (
          <div>
            <h3 className="mb-1 text-sm font-semibold text-ink">
              Scheduled ideas · {periodLabel(selected.issue.periodStart, selected.issue.periodEnd)}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Pick one story to develop into a feature. Developing creates a new article draft.
            </p>
            <IdeasGrid ideas={storedIdeas} expandingIdx={expandingIdx} onDevelop={developIdea} />
          </div>
        ) : (
          <IssueEditor initialIssue={selected.issue} initialItems={selected.items} onSaved={refresh} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {keyMissing ? <ApiKeyNotice /> : null}
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {/* Generate panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-primary" />
            Prepare {formatIssueNumber(period.issueNumber)} · {periodLabel(period.start, period.end)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {pub === "asia-source"
              ? "Generate a full 16-item draft grounded in real sources, then curate and publish."
              : "Generate 16 source-backed story ideas, pick one, and develop it into a feature."}
          </p>
        </div>
        <button
          type="button"
          onClick={pub === "asia-source" ? generateAsiaSource : generateIdeas}
          disabled={generating || keyMissing}
          className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {generating
            ? "Generating..."
            : pub === "asia-source"
              ? "Generate draft"
              : "Generate ideas"}
        </button>
      </div>

      {/* Insight ideas (freshly generated in-session) */}
      {ideas ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Pick a story to develop</h3>
          <IdeasGrid ideas={ideas} expandingIdx={expandingIdx} onDevelop={developIdea} />
        </div>
      ) : null}

      {/* Existing issues */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Issues</h3>
        {issues.length === 0 ? (
          <EmptyState
            icon={pub === "asia-source" ? Newspaper : FileText}
            title="No issues yet"
            hint="Generate a draft to get started, or wait for the fortnightly scheduled draft."
          />
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => setSelectedId(issue.id)}
                className="press flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-card transition-colors hover:border-primary/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">
                      {formatIssueNumber(issue.issueNumber)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        issue.status === "published"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                          : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
                      )}
                    >
                      {issue.status === "published" ? "Published" : "Draft"}
                    </span>
                    {issue.kind === "article" ? (
                      <span className="text-[11px] font-medium text-muted-foreground">Feature</span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {issue.title || periodLabel(issue.periodStart, issue.periodEnd)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IdeasGrid({
  ideas,
  expandingIdx,
  onDevelop,
}: {
  ideas: StoryIdea[];
  expandingIdx: number | null;
  onDevelop: (idea: StoryIdea, idx: number) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {ideas.map((idea, i) => (
        <div key={i} className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold text-ink">{idea.headline}</h4>
          <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{idea.angle}</p>
          {idea.sourceName ? (
            <a
              href={idea.sourceUrl || undefined}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 text-xs font-medium text-primary hover:underline"
            >
              {idea.sourceName}
              {idea.sourceDate ? `, ${idea.sourceDate}` : ""}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onDevelop(idea, i)}
            disabled={expandingIdx !== null}
            className="press mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/70 disabled:opacity-60"
          >
            {expandingIdx === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {expandingIdx === i ? "Writing..." : "Develop this story"}
          </button>
        </div>
      ))}
    </div>
  );
}

function ApiKeyNotice() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    if (!key.trim()) return;
    const cfg = loadAiConfig();
    saveAiConfig({ ...cfg, apiKey: key.trim() });
    setSaved(true);
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">Add an OpenRouter API key to generate</p>
          <p className="mt-1 text-sm text-amber-800">
            Manual generation runs in your browser and needs an OpenRouter key (sk-or-v1-...). The
            scheduled fortnightly drafts use a server-side key instead. See{" "}
            <Link to="/publications" className="font-semibold underline">
              the setup guide
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="h-10 flex-1 rounded-lg border border-amber-300 bg-white px-3 text-sm outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={save}
              className="press inline-flex h-10 items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700"
            >
              {saved ? "Saved" : "Save key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
