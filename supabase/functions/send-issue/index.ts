// Emails a published issue to its subscribers. Invoked from the Studio via
// supabase.functions.invoke("send-issue", { body: { issueId } }). Uses the
// service role to read subscribers and send through Resend's batch endpoint, one
// personalised email per subscriber so each has its own unsubscribe link.
//
// Deploy: supabase functions deploy send-issue
// Secrets: RESEND_API_KEY, FROM_EMAIL, PUBLIC_SITE_URL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderIssueEmail, issueSubject, type EmailItem } from "../_shared/emailTemplate.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev";
const PUBLIC_SITE_URL = (Deno.env.get("PUBLIC_SITE_URL") ?? "").replace(/\/$/, "");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let issueId = "";
  try {
    const body = await req.json();
    issueId = String(body?.issueId ?? "");
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (!issueId) return json({ error: "issueId is required" }, 400);
  if (!RESEND_API_KEY) return json({ error: "RESEND_API_KEY is not set" }, 500);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: issue, error: issueErr } = await supabase
    .from("pub_issues")
    .select("*")
    .eq("id", issueId)
    .maybeSingle();
  if (issueErr || !issue) return json({ error: "Issue not found" }, 404);
  if (issue.status !== "published") return json({ error: "Issue is not published" }, 400);

  const { data: itemRows } = await supabase
    .from("pub_issue_items")
    .select("*")
    .eq("issue_id", issueId)
    .order("position", { ascending: true });

  const items: EmailItem[] = (itemRows ?? []).map((r) => ({
    position: Number(r.position) || 0,
    bucket: r.bucket ?? "",
    headline: r.headline ?? "",
    body: r.body ?? "",
    sourceName: r.source_name ?? "",
    sourceUrl: r.source_url ?? "",
    sourceDate: r.source_date ?? "",
    included: r.included !== false,
  }));

  // Subscribers who opted into this publication and are still subscribed.
  const { data: subs, error: subErr } = await supabase
    .from("subscribers")
    .select("email, publications, unsubscribe_token")
    .is("unsubscribed_at", null)
    .contains("publications", [issue.publication]);
  if (subErr) return json({ error: `Could not load subscribers: ${subErr.message}` }, 500);

  const recipients = subs ?? [];
  if (recipients.length === 0) return json({ sent: 0, failed: 0, message: "No subscribers." });

  const webUrl = `${PUBLIC_SITE_URL}/publications/${issue.publication}/${issue.issue_number}`;
  const subject = issueSubject(issue as never);

  let sent = 0;
  let failed = 0;

  // Resend batch endpoint accepts up to 100 messages per call.
  for (const group of chunk(recipients, 100)) {
    const payload = group.map((s) => {
      const unsubscribeUrl = `${SUPABASE_URL}/functions/v1/unsubscribe?token=${s.unsubscribe_token}`;
      return {
        from: `APAC Sourcing Intelligence <${FROM_EMAIL}>`,
        to: [s.email],
        subject,
        html: renderIssueEmail(issue as never, items, { webUrl, unsubscribeUrl }),
        headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
      };
    });

    try {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sent += group.length;
      } else {
        failed += group.length;
        console.error("Resend batch failed:", res.status, await res.text().catch(() => ""));
      }
    } catch (e) {
      failed += group.length;
      console.error("Resend batch error:", e);
    }
  }

  return json({ sent, failed });
});
