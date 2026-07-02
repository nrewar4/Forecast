// One-click unsubscribe. Linked from every issue email as
// GET /functions/v1/unsubscribe?token=<uuid>. Marks the subscriber row and
// returns a small branded confirmation page.
//
// Deploy WITHOUT JWT verification so the link works from an email client:
//   supabase functions deploy unsubscribe --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function page(title: string, message: string): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#F1F5F9">
  <div style="max-width:480px;margin:80px auto;background:#fff;border-radius:16px;padding:32px;text-align:center;box-shadow:0 10px 30px -10px rgba(15,23,42,.15)">
    <div style="height:8px;width:56px;background:#F47920;border-radius:99px;margin:0 auto 20px"></div>
    <h1 style="color:#0F172A;font-size:22px;margin:0 0 8px">${title}</h1>
    <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0">${message}</p>
    <p style="margin-top:24px"><a href="https://apacss.com" style="color:#F47920;font-weight:600;text-decoration:none">Return to APAC Supply Chain</a></p>
  </div>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token) return page("Invalid link", "This unsubscribe link is missing its token.");

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data, error } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    return page("Link not recognised", "We could not find a matching subscription. It may already be removed.");
  }
  return page("You are unsubscribed", "You will no longer receive APAC Sourcing Intelligence publications. You can resubscribe anytime from our site.");
});
