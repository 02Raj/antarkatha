# AntarKatha

Ancient wisdom, made clear for everyday life — short, source-aware lessons from Indian scriptures
to read, listen to, and practise.

> Status: **Phase 2 (database and auth) in place.** The UI runs without credentials; auth and RLS
> need local or hosted Supabase. See [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md),
> [`docs/product-decisions.md`](./docs/product-decisions.md), and
> [`docs/local-setup.md`](./docs/local-setup.md).

## Requirements

- Node.js ≥ 20.9 (developed on 20.19)
- npm 10+

## Local setup

```bash
npm install
cp .env.example .env.local   # PowerShell: Copy-Item .env.example .env.local
npm run dev                  # http://localhost:3000 (falls back to the next free port)
```

The app runs without credentials. Copy `.env.local` from the example when you are ready to sign
in — full commands are in [`docs/local-setup.md`](./docs/local-setup.md). A development-only style
guide is available at `/styleguide`.

## Scripts

| Script              | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                                |
| `npm run build`     | Production build                                      |
| `npm run start`     | Serve the production build                            |
| `npm run lint`      | ESLint                                                |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`             |
| `npm run test`      | Vitest unit tests                                     |
| `npm run test:e2e`  | Playwright (builds must exist: `npm run build` first) |
| `npm run format`    | Prettier write                                        |
| `npm run check`     | lint + typecheck + unit tests                         |
| `npm run db:start`  | Local Supabase (Docker)                               |
| `npm run db:reset`  | Re-apply migrations + seed (wipes local DB)           |
| `npm run db:types`  | Generate `src/types/database.types.ts` from local DB  |

First Playwright run: `npx playwright install chromium`.

## Environment variables

See [`.env.example`](./.env.example). Only `NEXT_PUBLIC_*` values reach the browser. Never commit
`.env.local` or real credentials.

## Admin bootstrap

After the first signup, promote that user in SQL (see [`docs/local-setup.md`](./docs/local-setup.md)).
Roles cannot be changed from the browser.

## Git & deployment

This project is not initialised, committed, pushed, or deployed automatically. Those steps require
explicit approval from the owner.
