// Scheduled fortnightly draft generator. Invoked by a pg_cron job on the 1st and
// 16th of each month. Generates a web-grounded draft for each publication for the
// fortnight that just ended, stores it as a draft, and emails the editor that a
// draft is ready to review. The OpenRouter key stays server-side.
//
// Deploy: supabase functions deploy generate-draft
// Secrets: OPENROUTER_API_KEY, RESEND_API_KEY, EDITOR_EMAIL, PUBLIC_SITE_URL,
//          FROM_EMAIL, optional OPENROUTER_MODEL, optional CRON_SECRET.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { completeJson } from "../_shared/openrouter.ts";
import { previousPeriod, periodLabel, formatIssueNumber } from "../_shared/fortnight.ts";
import {
  ASIA_SOURCE_BUCKETS,
  DEFAULT_ASIA_SOURCE_PROMPT,
  DEFAULT_INSIGHT_PROMPT,
  withPeriod,
} from "../_shared/prompts.ts";

type Pub = "asia-source" | "insight";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const OPENROUTER_MODEL = Deno.env.get("OPENROUTER_MODEL") ?? "openrouter/auto";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const EDITOR_EMAIL = Deno.env.get("EDITOR_EMAIL") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev";
const PUBLIC_SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "").replace(/\/$/, "");
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

function authorized(req: Request): boolean {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  // Accept the service role key (cron sends it) or an explicit shared secret.
  if (token && token === SERVICE_ROLE) return true;
  if (CRON_SECRET && token === CRON_SECRET) return true;
  return false;
}

const uuid = () => crypto.randomUUID();
const str = (v: unknown): string => (typeof v === "string" ? v : "");

async function activePromptContent(
  supabase: ReturnType<typeof createClient>,
  pub: Pub,
  fallback: string,
): Promise<string> {
  const { data } = await supabase
    .from("pub_prompts")
    .select("content")
    .eq("publication", pub)
    .eq("is_active", true)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.content as string) || fallback;
}

async function draftAsiaSource(
  supabase: ReturnType<typeof createClient>,
  label: string,
): Promise<{ issueId: string; itemCount: number }> {
  const prompt = await activePromptContent(supabase, "asia-source", DEFAULT_ASIA_SOURCE_PROMPT);
  const result = await completeJson<{
    title?: string;
    intro?: string;
    closing?: string;
    items?: {
      bucket?: string;
      headline?: string;
      body?: string;
      sourceName?: string;
      sourceUrl?: string;
      sourceDate?: string;
    }[];
  }>(OPENROUTER_API_KEY, OPENROUTER_MODEL, withPeriod(prompt, label), `Produce the Asia Source issue for ${label}.`);

  const period = previousPeriod();
  const issueId = uuid();
  const items = (result.items ?? []).map((it, i) => ({
    id: uuid(),
    issue_id: issueId,
    position: i + 1,
    bucket: str(it.bucket) || ASIA_SOURCE_BUCKETS[i] || "",
    headline: str(it.headline),
    body: str(it.body),
    source_name: str(it.sourceName),
    source_url: str(it.sourceUrl),
    source_date: str(it.sourceDate),
    included: true,
  }));

  await supabase.from("pub_issues").insert({
    id: issueId,
    publication: "asia-source",
    kind: "issue",
    issue_number: period.issueNumber,
    period_start: period.start,
    period_end: period.end,
    status: "draft",
    title: str(result.title) || `Asia Source: ${label}`,
    intro: str(result.intro),
    body: "",
    closing: str(result.closing),
  });
  if (items.length) await supabase.from("pub_issue_items").insert(items);
  return { issueId, itemCount: items.length };
}

async function draftInsightIdeas(
  supabase: ReturnType<typeof createClient>,
  label: string,
): Promise<{ issueId: string; itemCount: number }> {
  const prompt = await activePromptContent(supabase, "insight", DEFAULT_INSIGHT_PROMPT);
  const result = await completeJson<{
    ideas?: { headline?: string; angle?: string; sourceName?: string; sourceUrl?: string; sourceDate?: string }[];
  }>(OPENROUTER_API_KEY, OPENROUTER_MODEL, withPeriod(prompt, label), `Propose 16 Insight story ideas for ${label}.`);

  const period = previousPeriod();
  const issueId = uuid();
  // Store ideas as issue items: headline + angle (in body) + source. The Studio
  // renders these as a picker so the editor can develop one into an article.
  const items = (result.ideas ?? []).map((it, i) => ({
    id: uuid(),
    issue_id: issueId,
    position: i + 1,
    bucket: "Story idea",
    headline: str(it.headline),
    body: str(it.angle),
    source_name: str(it.sourceName),
    source_url: str(it.sourceUrl),
    source_date: str(it.sourceDate),
    included: true,
  }));

  await supabase.from("pub_issues").insert({
    id: issueId,
    publication: "insight",
    kind: "ideas",
    issue_number: period.issueNumber,
    period_start: period.start,
    period_end: period.end,
    status: "draft",
    title: `Insight ideas: ${label}`,
    intro: "",
    body: "",
    closing: "",
  });
  if (items.length) await supabase.from("pub_issue_items").insert(items);
  return { issueId, itemCount: items.length };
}

async function notifyEditor(summaries: string[]) {
  if (!RESEND_API_KEY || !EDITOR_EMAIL) return;
  const studioUrl = `${PUBLIC_SITE_URL}/studio`;
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0F172A">
    <h2 style="color:#F47920">New drafts are ready to review</h2>
    <ul>${summaries.map((s) => `<li>${s}</li>`).join("")}</ul>
    <p><a href="${studioUrl}" style="color:#F47920;font-weight:600">Open the Publications Studio</a> to curate and publish.</p>
  </div>`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: `APAC Sourcing Intelligence <${FROM_EMAIL}>`,
      to: [EDITOR_EMAIL],
      subject: "Publications: new fortnightly drafts ready",
      html,
    }),
  }).catch((e) => console.error("Editor notification failed:", e));
}

Deno.serve(async (req) => {
  if (!authorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY is not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const period = previousPeriod();
  const label = periodLabel(period.start, period.end);
  const summaries: string[] = [];
  const results: Record<string, unknown> = {};

  for (const pub of ["asia-source", "insight"] as Pub[]) {
    try {
      // Skip if a draft or issue already exists for this fortnight.
      const { data: existing } = await supabase
        .from("pub_issues")
        .select("id")
        .eq("publication", pub)
        .eq("issue_number", period.issueNumber)
        .limit(1);
      if (existing && existing.length) {
        results[pub] = "skipped (already exists)";
        continue;
      }
      const res = pub === "asia-source" ? await draftAsiaSource(supabase, label) : await draftInsightIdeas(supabase, label);
      results[pub] = res;
      const name = pub === "asia-source" ? "Asia Source" : "Insight";
      summaries.push(`${name} ${formatIssueNumber(period.issueNumber)} (${label}): ${res.itemCount} items drafted.`);
    } catch (e) {
      results[pub] = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  if (summaries.length) await notifyEditor(summaries);

  return new Response(JSON.stringify({ period: label, results }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
