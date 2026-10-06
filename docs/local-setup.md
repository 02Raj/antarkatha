# Local setup — database and auth

The Next.js app runs without credentials. Auth, profiles, and RLS need a local Supabase stack
(Docker) or a hosted project. Do not paste real production secrets into the repo.

## 1. App

```bash
cd D:\@Projects\antar-katha
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. `/login` and `/signup` create sessions when `.env.local` has a project
URL plus either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## 2. Local Supabase (Docker)

Requires Docker Desktop running.

```bash
npx supabase start
npx supabase status -o env
```

Copy these into `.env.local` (never commit the file):

- `NEXT_PUBLIC_SUPABASE_URL` → `API_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` → `SERVICE_ROLE_KEY`

`npx supabase start` applies `supabase/migrations/` on first boot. To re-apply migrations **and**
`supabase/seed.sql` (this wipes local data):

```bash
npx supabase db reset
```

Ask before running reset if you have local users you care about.

Regenerate TypeScript types after schema changes:

```bash
npm run db:types
```

Studio: http://127.0.0.1:54323  
Inbucket (local auth email): http://127.0.0.1:54324

Stop with `npx supabase stop`.

## 3. Hosted Supabase instead of Docker

Create a project in the Supabase dashboard, set the same three env vars, then:

```bash
npx supabase db push
npx supabase db query --linked -f supabase/seed.sql
```

Use the SQL editor if the CLI is not linked. Seed is demo content only.

## 4. Bootstrap an admin

Sign up once at `/signup`, then in the SQL editor (or `psql`):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'you@example.com'
);
```

Only run this for an address you control. Users cannot change `role` from the browser.

## 5. OAuth (optional)

Google buttons are always visible. If the Google provider is not enabled in Supabase Auth, the
button returns a calm error and the rest of the app keeps working.

Redirect allow-list must include:

`http://localhost:3000/auth/callback`

Local `supabase/config.toml` already lists that URL.

## 6. Checks

```bash
npm run check          # lint, typecheck, unit tests
npm run build
npx playwright install chromium   # first time
npm run test:e2e
```
