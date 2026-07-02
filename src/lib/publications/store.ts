// Persistence for the Publications feature. Mirrors src/lib/tradeStore.ts: when
// Supabase is configured it is the source of truth, otherwise everything lives
// in localStorage so the feature works out of the box. The seeded Asia Source
// Issue 01 is merged into read results so the public reader always renders, even
// with an empty store.

import { isSupabaseConfigured, supabase } from "../supabase";
import { defaultPromptFor } from "./prompts";
import { SAMPLE_ISSUE, SAMPLE_ITEMS } from "./sampleIssue";
import type {
  Issue,
  IssueItem,
  PromptVersion,
  PublicationSlug,
} from "./types";

const ISSUES_KEY = "apac.pub.issues.v1";
const ITEMS_KEY = "apac.pub.items.v1";
const PROMPTS_KEY = "apac.pub.prompts.v1";
const SUBS_KEY = "apac.pub.subscribers.v1";

export const publicationsBackend = isSupabaseConfigured ? "Supabase" : "Browser";

export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // fall through
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readArr<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArr<T>(key: string, rows: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // storage may be unavailable, ignore
  }
}

// ---------------------------------------------------------------------------
// Row mappers (snake_case DB <-> camelCase app)
// ---------------------------------------------------------------------------

type IssueRow = {
  id: string;
  publication: string;
  kind: string;
  issue_number: number;
  period_start: string;
  period_end: string;
  status: string;
  title: string;
  intro: string;
  body: string;
  closing: string;
  published_at: string | null;
  created_at: string;
};

function issueToRow(i: Issue): IssueRow {
  return {
    id: i.id,
    publication: i.publication,
    kind: i.kind,
    issue_number: i.issueNumber,
    period_start: i.periodStart,
    period_end: i.periodEnd,
    status: i.status,
    title: i.title,
    intro: i.intro,
    body: i.body,
    closing: i.closing,
    published_at: i.publishedAt ?? null,
    created_at: i.createdAt,
  };
}

function issueFromRow(r: IssueRow): Issue {
  return {
    id: r.id,
    publication: r.publication as PublicationSlug,
    kind: (r.kind as Issue["kind"]) ?? "issue",
    issueNumber: Number(r.issue_number) || 0,
    periodStart: r.period_start,
    periodEnd: r.period_end,
    status: (r.status as Issue["status"]) ?? "draft",
    title: r.title ?? "",
    intro: r.intro ?? "",
    body: r.body ?? "",
    closing: r.closing ?? "",
    publishedAt: r.published_at ?? undefined,
    createdAt: r.created_at,
  };
}

type ItemRow = {
  id: string;
  issue_id: string;
  position: number;
  bucket: string;
  headline: string;
  body: string;
  source_name: string;
  source_url: string;
  source_date: string;
  included: boolean;
};

function itemToRow(it: IssueItem): ItemRow {
  return {
    id: it.id,
    issue_id: it.issueId,
    position: it.position,
    bucket: it.bucket,
    headline: it.headline,
    body: it.body,
    source_name: it.sourceName,
    source_url: it.sourceUrl,
    source_date: it.sourceDate,
    included: it.included,
  };
}

function itemFromRow(r: ItemRow): IssueItem {
  return {
    id: r.id,
    issueId: r.issue_id,
    position: Number(r.position) || 0,
    bucket: r.bucket ?? "",
    headline: r.headline ?? "",
    body: r.body ?? "",
    sourceName: r.source_name ?? "",
    sourceUrl: r.source_url ?? "",
    sourceDate: r.source_date ?? "",
    included: r.included !== false,
  };
}

type PromptRow = {
  id: string;
  publication: string;
  version: number;
  content: string;
  note: string;
  is_active: boolean;
  created_at: string;
};

function promptFromRow(r: PromptRow): PromptVersion {
  return {
    id: r.id,
    publication: r.publication as PublicationSlug,
    version: Number(r.version) || 1,
    content: r.content ?? "",
    note: r.note ?? "",
    isActive: !!r.is_active,
    createdAt: r.created_at,
  };
}

// Merges the seeded issue into a list, but only if the store has no issue with
// the same publication and issue number (a real stored issue always wins).
function withSample(issues: Issue[]): Issue[] {
  const clash = issues.some(
    (i) => i.publication === SAMPLE_ISSUE.publication && i.issueNumber === SAMPLE_ISSUE.issueNumber,
  );
  return clash ? issues : [...issues, SAMPLE_ISSUE];
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export async function listIssues(
  pub: PublicationSlug,
  opts: { publishedOnly?: boolean } = {},
): Promise<Issue[]> {
  let issues: Issue[] = [];
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("pub_issues")
      .select("*")
      .eq("publication", pub)
      .order("issue_number", { ascending: false });
    if (error) {
      console.warn("Supabase issue load failed, using local cache:", error.message);
      issues = readArr<Issue>(ISSUES_KEY).filter((i) => i.publication === pub);
    } else {
      issues = (data as IssueRow[]).map(issueFromRow);
    }
  } else {
    issues = readArr<Issue>(ISSUES_KEY).filter((i) => i.publication === pub);
  }
  if (pub === "asia-source") issues = withSample(issues);
  issues.sort((a, b) => b.issueNumber - a.issueNumber);
  if (opts.publishedOnly) issues = issues.filter((i) => i.status === "published");
  return issues;
}

async function itemsForIssue(issueId: string): Promise<IssueItem[]> {
  if (issueId === SAMPLE_ISSUE.id) return SAMPLE_ITEMS.slice();
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("pub_issue_items")
      .select("*")
      .eq("issue_id", issueId)
      .order("position", { ascending: true });
    if (error) {
      console.warn("Supabase item load failed, using local cache:", error.message);
      return readArr<IssueItem>(ITEMS_KEY).filter((i) => i.issueId === issueId);
    }
    return (data as ItemRow[]).map(itemFromRow);
  }
  return readArr<IssueItem>(ITEMS_KEY)
    .filter((i) => i.issueId === issueId)
    .sort((a, b) => a.position - b.position);
}

export type IssueWithItems = { issue: Issue; items: IssueItem[] };

export async function getIssue(
  pub: PublicationSlug,
  issueNumber: number,
): Promise<IssueWithItems | null> {
  const issues = await listIssues(pub);
  const issue = issues.find((i) => i.issueNumber === issueNumber);
  if (!issue) return null;
  const items = await itemsForIssue(issue.id);
  return { issue, items };
}

export async function getIssueById(id: string): Promise<IssueWithItems | null> {
  if (id === SAMPLE_ISSUE.id) return { issue: SAMPLE_ISSUE, items: SAMPLE_ITEMS.slice() };
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("pub_issues").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    const issue = issueFromRow(data as IssueRow);
    return { issue, items: await itemsForIssue(id) };
  }
  const issue = readArr<Issue>(ISSUES_KEY).find((i) => i.id === id);
  if (!issue) return null;
  return { issue, items: await itemsForIssue(id) };
}

// Inserts or updates a draft (or published) issue together with its items.
export async function saveDraft(issue: Issue, items: IssueItem[]): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error: iErr } = await supabase.from("pub_issues").upsert(issueToRow(issue));
    if (iErr) {
      console.warn("Supabase issue save failed, using local cache:", iErr.message);
    } else {
      // Replace items for this issue.
      await supabase.from("pub_issue_items").delete().eq("issue_id", issue.id);
      if (items.length) {
        const { error: itErr } = await supabase.from("pub_issue_items").insert(items.map(itemToRow));
        if (itErr) console.warn("Supabase item save failed:", itErr.message);
      }
      return;
    }
  }
  const issues = readArr<Issue>(ISSUES_KEY).filter((i) => i.id !== issue.id);
  writeArr(ISSUES_KEY, [issue, ...issues]);
  const others = readArr<IssueItem>(ITEMS_KEY).filter((i) => i.issueId !== issue.id);
  writeArr(ITEMS_KEY, [...others, ...items]);
}

export async function updateItem(item: IssueItem): Promise<void> {
  if (item.issueId === SAMPLE_ISSUE.id) return; // sample is read-only
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("pub_issue_items").upsert(itemToRow(item));
    if (!error) return;
    console.warn("Supabase item update failed, using local cache:", error.message);
  }
  const items = readArr<IssueItem>(ITEMS_KEY).filter((i) => i.id !== item.id);
  writeArr(ITEMS_KEY, [...items, item]);
}

export async function publishIssue(id: string): Promise<void> {
  const publishedAt = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("pub_issues")
      .update({ status: "published", published_at: publishedAt })
      .eq("id", id);
    if (!error) return;
    console.warn("Supabase publish failed, using local cache:", error.message);
  }
  const issues = readArr<Issue>(ISSUES_KEY).map((i) =>
    i.id === id ? { ...i, status: "published" as const, publishedAt } : i,
  );
  writeArr(ISSUES_KEY, issues);
}

// ---------------------------------------------------------------------------
// Prompts (with version history)
// ---------------------------------------------------------------------------

export async function listPromptVersions(pub: PublicationSlug): Promise<PromptVersion[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("pub_prompts")
      .select("*")
      .eq("publication", pub)
      .order("version", { ascending: false });
    if (!error && data) return (data as PromptRow[]).map(promptFromRow);
    console.warn("Supabase prompt load failed, using local cache:", error?.message);
  }
  return readArr<PromptVersion>(PROMPTS_KEY)
    .filter((p) => p.publication === pub)
    .sort((a, b) => b.version - a.version);
}

// The active prompt for a publication, or a synthesised default (version 0) when
// none has been saved yet.
export async function activePrompt(pub: PublicationSlug): Promise<PromptVersion> {
  const versions = await listPromptVersions(pub);
  const active = versions.find((v) => v.isActive) ?? versions[0];
  if (active) return active;
  return {
    id: `default-${pub}`,
    publication: pub,
    version: 0,
    content: defaultPromptFor(pub),
    note: "Built-in default",
    isActive: true,
    createdAt: new Date(0).toISOString(),
  };
}

export async function savePromptVersion(
  pub: PublicationSlug,
  content: string,
  note: string,
): Promise<PromptVersion> {
  const existing = await listPromptVersions(pub);
  const nextVersion = (existing[0]?.version ?? 0) + 1;
  const record: PromptVersion = {
    id: newId(),
    publication: pub,
    version: nextVersion,
    content,
    note,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured && supabase) {
    await supabase.from("pub_prompts").update({ is_active: false }).eq("publication", pub);
    const { error } = await supabase.from("pub_prompts").insert({
      id: record.id,
      publication: pub,
      version: nextVersion,
      content,
      note,
      is_active: true,
    });
    if (!error) return record;
    console.warn("Supabase prompt save failed, using local cache:", error.message);
  }
  const rows = readArr<PromptVersion>(PROMPTS_KEY).map((p) =>
    p.publication === pub ? { ...p, isActive: false } : p,
  );
  writeArr(PROMPTS_KEY, [...rows, record]);
  return record;
}

export async function activatePromptVersion(pub: PublicationSlug, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("pub_prompts").update({ is_active: false }).eq("publication", pub);
    const { error } = await supabase.from("pub_prompts").update({ is_active: true }).eq("id", id);
    if (!error) return;
    console.warn("Supabase prompt activate failed, using local cache:", error.message);
  }
  const rows = readArr<PromptVersion>(PROMPTS_KEY).map((p) =>
    p.publication === pub ? { ...p, isActive: p.id === id } : p,
  );
  writeArr(PROMPTS_KEY, rows);
}

// ---------------------------------------------------------------------------
// Subscribers
// ---------------------------------------------------------------------------

export type SubscribeResult = { ok: boolean; alreadySubscribed: boolean; message: string };

export async function subscribe(
  email: string,
  publications: PublicationSlug[],
): Promise<SubscribeResult> {
  const clean = email.trim().toLowerCase();
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("subscribers").insert({ email: clean, publications });
    if (!error) return { ok: true, alreadySubscribed: false, message: "You are subscribed." };
    // 23505 is a unique-violation: the email is already on the list.
    if (error.code === "23505") {
      return { ok: true, alreadySubscribed: true, message: "You are already subscribed." };
    }
    console.warn("Supabase subscribe failed, using local cache:", error.message);
  }
  const rows = readArr<{ email: string; publications: PublicationSlug[] }>(SUBS_KEY);
  if (rows.some((r) => r.email === clean)) {
    return { ok: true, alreadySubscribed: true, message: "You are already subscribed." };
  }
  writeArr(SUBS_KEY, [...rows, { email: clean, publications }]);
  return {
    ok: true,
    alreadySubscribed: false,
    message: isSupabaseConfigured
      ? "You are subscribed."
      : "Saved on this device. Email delivery is enabled once the shared database is connected.",
  };
}
