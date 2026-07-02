# Publications setup (Asia Source and Insight)

The Publications feature works out of the box with no backend: drafts are stored
in your browser and a seeded Asia Source Issue 01 is always available to read.
This guide switches on the shared, automated setup:

- A shared database so every editor sees the same drafts and issues.
- A fortnightly scheduled job that prepares AI drafts and emails you to review.
- A subscribe list and one click sending of a formatted issue email.

It builds on `SUPABASE_SETUP.md`. Do that first so `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are set, then continue here.

## 1. Create the database tables

In the Supabase dashboard open the SQL Editor, paste the block below, and run it.

```sql
create table if not exists public.pub_issues (
  id uuid primary key default gen_random_uuid(),
  publication text not null check (publication in ('asia-source','insight')),
  kind text not null default 'issue' check (kind in ('issue','ideas','article')),
  issue_number int not null,
  period_start date not null,
  period_end date not null,
  status text not null default 'draft' check (status in ('draft','published')),
  title text not null default '',
  intro text not null default '',
  body text not null default '',
  closing text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (publication, kind, issue_number)
);

create table if not exists public.pub_issue_items (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.pub_issues(id) on delete cascade,
  position int not null,
  bucket text not null default '',
  headline text not null default '',
  body text not null default '',
  source_name text not null default '',
  source_url text not null default '',
  source_date text not null default '',
  included boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pub_prompts (
  id uuid primary key default gen_random_uuid(),
  publication text not null,
  version int not null,
  content text not null,
  note text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (publication, version)
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  publications text[] not null default '{asia-source,insight}',
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.pub_issues enable row level security;
alter table public.pub_issue_items enable row level security;
alter table public.pub_prompts enable row level security;
alter table public.subscribers enable row level security;

-- Reader and editor access. These policies mirror the pragmatic shipments table:
-- anyone with the anon key can read and write issues, items and prompts. That is
-- fine for an internal editorial tool. The public reader queries only published
-- issues, so visitors never see drafts, but note that a draft is technically
-- readable by anyone who has the anon key and queries directly. Before a public
-- launch, add Supabase Auth and replace these with authenticated editor policies.
create policy "anon read issues" on public.pub_issues
  for select to anon using (true);
create policy "anon write issues" on public.pub_issues
  for all to anon using (true) with check (true);

create policy "anon read items" on public.pub_issue_items
  for select to anon using (true);
create policy "anon write items" on public.pub_issue_items
  for all to anon using (true) with check (true);

create policy "anon rw prompts" on public.pub_prompts
  for all to anon using (true) with check (true);

-- Subscribers: anon may INSERT only. There is no anon select, update or delete,
-- so the mailing list cannot be read or scraped with the anon key. A duplicate
-- email raises a unique violation which the form maps to "already subscribed".
create policy "anon subscribe" on public.subscribers
  for insert to anon with check (true);
```

After running this, reload the app. The Studio should show
`Storage backend: Supabase`.

## 2. Deploy the Edge Functions

Install the Supabase CLI and link your project (see the Supabase docs), then from
the repo root:

```
supabase functions deploy generate-draft
supabase functions deploy send-issue
supabase functions deploy unsubscribe --no-verify-jwt
```

`unsubscribe` is deployed with `--no-verify-jwt` so the link in an email works
without a login. `generate-draft` and `send-issue` keep JWT verification on.

## 3. Set the function secrets

```
supabase secrets set \
  OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx \
  RESEND_API_KEY=re_xxxxxxxx \
  EDITOR_EMAIL=you@apacss.com \
  FROM_EMAIL="asia-source@your-verified-domain.com" \
  PUBLIC_SITE_URL=https://your-app-domain.com \
  OPENROUTER_MODEL=openrouter/auto
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided to functions
automatically, so you do not set them. Optionally set `CRON_SECRET` and send it
as the bearer token from the cron job instead of the service role key.

## 4. Set up Resend (email delivery)

1. Create a free account at https://resend.com and add an API key as
   `RESEND_API_KEY` above.
2. Verify your sending domain (add the SPF and DKIM DNS records Resend gives
   you) and set `FROM_EMAIL` to an address on that domain.
3. Until a domain is verified, Resend only lets you send from
   `onboarding@resend.dev` and only to your own account email. That is enough to
   test the editor notification, but real subscriber sends need a verified
   domain.
4. The free tier allows 100 emails per day. The send function uses Resend's batch
   endpoint in groups of 100.

## 5. Schedule the fortnightly draft

In the SQL Editor, enable the scheduler and add the job (this uses pg_cron and
pg_net, both available on Supabase):

```sql
select cron.schedule(
  'publications-generate-draft',
  '30 2 1,16 * *',
  $$
    select net.http_post(
      url := 'https://YOUR-PROJECT.supabase.co/functions/v1/generate-draft',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR-SERVICE-ROLE-KEY'
      )
    );
  $$
);
```

This runs at 02:30 UTC on the 1st and 16th of every month and drafts the
fortnight that just ended. Replace the project URL and service role key. To run
it once now for a test, call the same URL with `curl` and the same header.

When it finishes you get an email titled "Publications: new fortnightly drafts
ready". Open the Studio, curate, and publish. For Asia Source you get a full 16
item draft to include or exclude. For Insight you get 16 story ideas to pick
from; developing one writes the full feature.

## 6. The editorial loop

- Every issue item carries a real source with a clickable link. Verify sources
  before publishing. The AI can still get a link wrong even with web search on,
  so this human check is the control.
- Improve the master prompt issue by issue in the Studio under Master prompt.
  Each save is a new version, and you can reactivate an older one. This is how
  the publications get sharper over time.

## How it degrades without the backend

If Supabase is not configured, the app still runs. Drafts and subscriptions are
stored on the device, manual Generate uses your browser OpenRouter key, the
seeded Issue 01 is readable, and the Send to subscribers button is disabled with
a tooltip explaining that email needs the shared database.
