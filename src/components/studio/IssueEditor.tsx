import { useEffect, useState } from "react";
import { Check, Eye, Loader2, Send, Upload } from "lucide-react";
import { ShareBar } from "@/components/publications/ShareBar";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { publishIssue, saveDraft } from "@/lib/publications/store";
import { formatIssueNumber, periodLabel } from "@/lib/publications/fortnight";
import { PUBLICATION_LABELS, type Issue, type IssueItem } from "@/lib/publications/types";
import { cn } from "@/lib/utils";

// The Asia Source issue editor: edit the intro and closing, toggle each item in
// or out, edit item text and sources, then publish and send to subscribers.
export function IssueEditor({
  initialIssue,
  initialItems,
  onSaved,
}: {
  initialIssue: Issue;
  initialItems: IssueItem[];
  onSaved: () => void;
}) {
  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [items, setItems] = useState<IssueItem[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    setIssue(initialIssue);
    setItems(initialItems);
    setSavedAt(null);
    setSendResult(null);
  }, [initialIssue, initialItems]);

  const includedCount = items.filter((i) => i.included).length;
  const readOnly = issue.id.startsWith("sample-");

  function patchItem(id: string, patch: Partial<IssueItem>) {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function save(next?: { issue?: Issue; items?: IssueItem[] }) {
    const i = next?.issue ?? issue;
    const it = next?.items ?? items;
    setSaving(true);
    await saveDraft(i, it);
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
      const failed = (data as { failed?: number })?.failed ?? 0;
      setSendResult(`Sent to ${sent} subscriber(s)${failed ? `, ${failed} failed` : ""}.`);
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
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink">
              {PUBLICATION_LABELS[issue.publication]} {formatIssueNumber(issue.issueNumber)}
            </h2>
            <StatusChip status={issue.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {periodLabel(issue.periodStart, issue.periodEnd)} · {includedCount} of {items.length} items
            included
          </p>
          {includedCount !== 16 && issue.kind === "issue" ? (
            <p className="mt-1 text-xs font-medium text-amber-600">
              A full Asia Source issue usually runs 16 items. You currently have {includedCount}.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => save()}
            disabled={saving || readOnly}
            className="press inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing || readOnly}
            className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {issue.status === "published" ? "Re-publish" : "Publish"}
          </button>
          <SendButton
            disabled={issue.status !== "published" || sending}
            sending={sending}
            onSend={onSend}
          />
        </div>
      </div>

      {readOnly ? (
        <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          This is the seeded sample issue and cannot be edited. Use Generate to create a new draft.
        </p>
      ) : null}
      {savedAt ? <p className="text-xs text-muted-foreground">Saved at {savedAt}.</p> : null}
      {sendResult ? (
        <p className="rounded-lg border border-border bg-accent px-4 py-2 text-sm text-accent-foreground">
          {sendResult}
        </p>
      ) : null}

      <ShareBar issue={issue} items={items} url={shareUrl} />

      {/* Cover + intro */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <Field label="Cover line">
          <input
            value={issue.title}
            onChange={(e) => setIssue({ ...issue, title: e.target.value })}
            disabled={readOnly}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Field>
        <Field label="Fortnight in Focus (intro)">
          <textarea
            value={issue.intro}
            onChange={(e) => setIssue({ ...issue, intro: e.target.value })}
            disabled={readOnly}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary"
          />
        </Field>
        <Field label="Buyer Action (closing)">
          <textarea
            value={issue.closing}
            onChange={(e) => setIssue({ ...issue, closing: e.target.value })}
            disabled={readOnly}
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary"
          />
        </Field>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border bg-card p-4 shadow-card transition-opacity",
              item.included ? "border-border" : "border-dashed border-border opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 select-none text-lg font-extrabold text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  value={item.headline}
                  onChange={(e) => patchItem(item.id, { headline: e.target.value })}
                  disabled={readOnly}
                  placeholder="Headline"
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-semibold outline-none focus:border-primary"
                />
                <textarea
                  value={item.body}
                  onChange={(e) => patchItem(item.id, { body: e.target.value })}
                  disabled={readOnly}
                  rows={2}
                  placeholder="Body"
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm leading-relaxed outline-none focus:border-primary"
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={item.sourceName}
                    onChange={(e) => patchItem(item.id, { sourceName: e.target.value })}
                    disabled={readOnly}
                    placeholder="Source name"
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                  />
                  <input
                    value={item.sourceUrl}
                    onChange={(e) => patchItem(item.id, { sourceUrl: e.target.value })}
                    disabled={readOnly}
                    placeholder="Source URL"
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                  />
                  <input
                    value={item.sourceDate}
                    onChange={(e) => patchItem(item.id, { sourceDate: e.target.value })}
                    disabled={readOnly}
                    placeholder="Source date"
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-3 pt-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.bucket}
                  </span>
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Eye className="h-3 w-3" />
                      Verify source
                    </a>
                  ) : null}
                </div>
              </div>
              <label className="flex cursor-pointer select-none items-center gap-1.5 text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={item.included}
                  onChange={(e) => patchItem(item.id, { included: e.target.checked })}
                  disabled={readOnly}
                  className="h-4 w-4 accent-primary"
                />
                Include
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SendButton({
  disabled,
  sending,
  onSend,
}: {
  disabled: boolean;
  sending: boolean;
  onSend: () => void;
}) {
  const configured = isSupabaseConfigured;
  const title = !configured
    ? "Connect Supabase and deploy the send-issue function to email subscribers."
    : disabled
      ? "Publish the issue before sending."
      : "Email this issue to subscribers.";
  return (
    <button
      type="button"
      onClick={onSend}
      disabled={disabled || !configured}
      title={title}
      className="press inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/70 disabled:opacity-50"
    >
      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      Send to subscribers
    </button>
  );
}

function StatusChip({ status }: { status: Issue["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        status === "published"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
      )}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
