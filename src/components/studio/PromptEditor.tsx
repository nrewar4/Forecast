import { useEffect, useState } from "react";
import { Check, History, Loader2, Save } from "lucide-react";
import {
  activatePromptVersion,
  activePrompt,
  listPromptVersions,
  savePromptVersion,
} from "@/lib/publications/store";
import type { PromptVersion, PublicationSlug } from "@/lib/publications/types";
import { cn } from "@/lib/utils";

// Edits the master prompt for a publication and keeps a version history. This is
// the "read the output, improve the prompt" loop: each save is a new version,
// and any older version can be reactivated.
export function PromptEditor({ pub }: { pub: PublicationSlug }) {
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const [active, list] = await Promise.all([activePrompt(pub), listPromptVersions(pub)]);
    setContent(active.content);
    setActiveId(active.id);
    setVersions(list);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pub]);

  async function onSave() {
    if (!content.trim()) return;
    setSaving(true);
    await savePromptVersion(pub, content, note.trim() || "Updated prompt");
    setNote("");
    await refresh();
    setSaving(false);
  }

  async function onActivate(id: string) {
    await activatePromptVersion(pub, id);
    await refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Master prompt</h3>
          <span className="text-xs text-muted-foreground">
            Use <code className="rounded bg-muted px-1 py-0.5">{"{{PERIOD}}"}</code> for the fortnight
          </span>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading prompt...</p>
        ) : (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="mt-3 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed outline-none focus:border-primary"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What changed? (e.g. tightened source rules)"
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save as new version
              </button>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-ink">Version history</h3>
        </div>
        <ul className="mt-3 space-y-2">
          {versions.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Using the built-in default. Save a version to start your history.
            </li>
          ) : (
            versions.map((v) => (
              <li
                key={v.id}
                className={cn(
                  "rounded-lg border p-3",
                  v.id === activeId ? "border-primary/40 bg-accent" : "border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">Version {v.version}</span>
                  {v.id === activeId ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onActivate(v.id)}
                      className="press text-xs font-semibold text-primary hover:underline"
                    >
                      Activate
                    </button>
                  )}
                </div>
                {v.note ? <p className="mt-1 text-xs text-muted-foreground">{v.note}</p> : null}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(v.createdAt).toLocaleString()}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
