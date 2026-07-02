# Shared database setup with Supabase

By default the app stores uploaded trade data in the browser. Follow these steps
to switch on a shared cloud database so every user sees the same uploads. It is
free for normal use and takes about ten minutes.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign up, it is free.
2. Click New project. Give it a name like apac-sourcing.
3. Choose a database password and a region close to your users.
4. Wait for the project to finish provisioning.

## 2. Create the shipments table

1. In the Supabase dashboard open the SQL Editor in the left menu.
2. Click New query, paste the SQL below, and click Run.

```sql
create table if not exists public.shipments (
  id bigint generated always as identity primary key,
  mode text not null default 'Imports',
  date text,
  hs_code text,
  product text,
  sector text,
  transport text,
  importer text,
  supplier text,
  origin text,
  quantity_t numeric default 0,
  unit_price numeric default 0,
  total_value numeric default 0,
  created_at timestamptz not null default now()
);

alter table public.shipments enable row level security;

create policy "anon read shipments"
  on public.shipments for select to anon using (true);

create policy "anon insert shipments"
  on public.shipments for insert to anon with check (true);

create policy "anon delete shipments"
  on public.shipments for delete to anon using (true);
```

Note. These policies let anyone with the anon key read, add, and clear rows,
which is fine for an internal tool. For a public deployment, add Supabase Auth
and tighten the policies so only signed in users can write.

## 3. Get your keys

1. In the dashboard open Project Settings, then API.
2. Copy the Project URL and the anon public key.

## 4. Add the keys to the app

1. In the project folder, copy `.env.example` to a new file named `.env`.
2. Paste your values:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

3. Stop the dev server if it is running, then start it again with `npm run dev`
   so the new values load. For a production build run `npm run build` again.

## 5. Confirm it works

1. Open the Integrations page. The Application Database card should read
   Supabase connected.
2. Open the Documents page and upload an Excel file. The success message will say
   the records went into the shared Supabase database.
3. Open the app in another browser or device. The uploaded rows should appear in
   Trade Analytics for everyone.

## How the fallback works

If the two environment values are missing or empty, the app automatically uses
browser storage and keeps working. Nothing breaks. The moment valid keys are
present, it switches to the shared database. If a Supabase call ever fails, the
app logs a warning and falls back to the local cache so uploads are not lost.
