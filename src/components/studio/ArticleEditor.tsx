import { useEffect, useState } from "react";
import { Check, Eye, Loader2, Pencil, Send, Upload } from "lucide-react";
import MarkdownBody from "@/components/publications/MarkdownBody";
import { ShareBar } from "@/components/publications/ShareBar";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { publishIssue, saveDraft } from "@/lib/publications/store";
import { formatIssueNumber, periodLabel } from "@/lib/publications/fortnight";
import { PUBLICATION_LABELS, type Issue, type IssueItem } from "@/lib/publications/types";
import { cn } from "@/lib/utils";

// Editor for an Insight feature article: title, standfirst, Markdown body, and a
// read-only view of the sources the model cited.
export function ArticleEditor({
  initialIssue,
  initialSources,
  onSaved,
}: {
  initialIssue: Issue;
  initialSources: IssueItem[];
  onSaved: () => void;
}) {
  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    setIssue(initialIssue);
    setSavedAt(null);
    setSendResult(null);
  }, [initialIssue]);

  async function save() {
    setSaving(true);
    await saveDraft(issue, initialSources);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
    onSaved();
  }

  async function onPublish() {
    setPublishing(true);
    await save();
    await publishIssue(issue.id);
    setIssue((cur) => ({ ...cur, status: "published", publishedAt: new Date().toISOString() }));
    setPublishing(false);
    onSaved();
  }

  async function onSend() {
    if (!isSupabaseConfigured || !supabase) return;
    setSending(true);
    setSendResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("send-issue", {
        body: { issueId: issue.id },
      });
      if (error) throw error;
      const sent = (data as { sent?: number })?.sent ?? 0;
      setSendResult(`Sent to ${sent} subscriber(s).`);
    } catch (e) {
      setSendResult(e instanceof Error ? `Send failed: ${e.message}` : "Send failed.");
    } finally {
      setSending(false);
    }
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/publications/${issue.publication}/${issue.issueNumber}`
      : "";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink">
              {PUBLICATION_LABELS[issue.publication]} {formatIssueNumber(issue.issueNumber)}
            </h2>
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
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Feature · {periodLabel(issue.periodStart, issue.periodEnd)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="press inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {preview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="press inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {issue.status === "published" ? "Re-publish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={issue.status !== "published" || sending || !isSupabaseConfigured}
            title={
              !isSupabaseConfigured
                ? "Connect Supabase to email subscribers."
                : issue.status !== "published"
                  ? "Publish before sending."
                  : "Email this feature to subscribers."
            }
            className="press inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/70 disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send to subscribers
          </button>
        </div>
      </div>

      {savedAt ? <p className="text-xs text-muted-foreground">Saved at {savedAt}.</p> : null}
      {sendResult ? (
        <p className="rounded-lg border border-border bg-accent px-4 py-2 text-sm text-accent-foreground">
          {sendResult}
        </p>
      ) : null}

      <ShareBar issue={issue} items={initialSources} url={shareUrl} />

      {preview ? (
        <article className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{issue.title}</h1>
          {issue.intro ? (
            <p className="mt-3 text-lg font-medium leading-relaxed text-foreground/90">{issue.intro}</p>
          ) : null}
          <MarkdownBody markdown={issue.body} className="mt-4" />
        </article>
      ) : (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Headline
            </span>
            <input
              value={issue.title}
              onChange={(e) => setIssue({ ...issue, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Standfirst
            </span>
            <textarea
              value={issue.intro}
              onChange={(e) => setIssue({ ...issue, intro: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Body (Markdown)
            </span>
            <textarea
              value={issue.body}
              onChange={(e) => setIssue({ ...issue, body: e.target.value })}
              rows={18}
              className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed outline-none focus:border-primary"
            />
          </label>
        </div>
      )}

      {initialSources.length ? (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources</p>
          <ul className="mt-2 space-y-1.5">
            {initialSources.map((s) => (
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
        </div>
      ) : null}
    </div>
  );
}
