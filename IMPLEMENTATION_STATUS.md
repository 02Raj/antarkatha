# Implementation status

_Last updated: 2026-10-06_

## Completed

### Phase 1 — Foundation

- [x] Next.js 16.3.8 + React 19.2 + TypeScript + Tailwind v4 scaffold (no git init)
- [x] Packages: Supabase SSR/JS, Zod 4, React Hook Form, Radix, Framer Motion, Lucide, Sonner,
      TanStack Query, Recharts, server-only
- [x] Design tokens, paper texture, focus styles, reduced-motion handling (`globals.css`)
- [x] Fonts via `next/font` (Newsreader + Instrument Sans)
- [x] Original logo mark + wordmark, SVG favicon, motif set
- [x] Primitives: Button, Input/Textarea/Select, Field (ARIA-wired), Badge/StatusBadge, Dialog,
      Accordion, Skeleton, EmptyState, Notice, Toaster, Container, SectionHeading
- [x] Layout: AnnouncementStrip, SiteHeader, MobileNav (sheet), SiteFooter, skip link
- [x] EditorialHero on `/`
- [x] Error boundary, global error, not-found, loading states
- [x] Typed env (`env.ts` public, `env.server.ts` server-only) incl. production-safe mock guard
- [x] Security headers in `next.config.ts`
- [x] ESLint (flat), Prettier (+ Tailwind plugin), Vitest, Playwright + axe
- [x] `docs/product-decisions.md`, `.env.example`, README

### Phase 2 — Database and auth

- [x] Supabase CLI config (`supabase/config.toml`) — no git remotes
- [x] Migrations: enums, identity, content, engagement, commerce, operations, indexes, triggers
- [x] Publishing trigger (source + approved review required)
- [x] Signup trigger: profile, preferences, streak
- [x] Role protection and audit logs for content status / role changes
- [x] RLS for public catalog vs protected bodies; staff vs admin; own engagement rows
- [x] Storage buckets: public `motifs`, private `audio`
- [x] Seed: 4 collections, 7 topics, 10 demo lessons (3 free full, 7 premium previews), daily
      feature, 3 plans, site settings
- [x] Typed clients: browser, server, service-role (`server-only`)
- [x] `src/proxy.ts` session refresh only
- [x] Auth: email/password, magic link, forgot/reset, Google slot, callback, sign-out
- [x] Rate-limited server actions; open-redirect-safe `next` paths
- [x] Member `/dashboard` + `/settings`; admin layout denial; admin desk placeholders
- [x] Domain logic + tests: access, publishing, progress, streaks, webhook idempotency, renderer
- [x] Privacy-conscious `POST /api/analytics`
- [x] `docs/local-setup.md`
- [x] Hosted public env aliases (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → anon) without logging
      values

### Phase 3 — Public product

- [x] Catalog queries against `content_catalog` / collections / topics / plans / daily features,
      with typed demo fallback when tables are missing or empty
- [x] Home conversion flow: situation selector, sample lesson, three layers, collections,
      listen/save/resume, source trust, pricing, FAQ, final CTA — all live links
- [x] Explore: search, collection/topic/type/duration/difficulty/access/sort, pagination,
      GET form URL sync
- [x] Collection and topic detail pages; care topics carry a non-medical notice
- [x] Daily wisdom (Asia/Kolkata date, never paywalled) and public `/read/[slug]` with
      preview/paywall for member lessons
- [x] Pricing, about + source policy, contact/feedback (rate-limited; DB insert or local
      acknowledgement), privacy, terms, refunds
- [x] Responsive header (desktop + mobile sheet) and complete footer
- [x] Per-page metadata + canonical paths, sitemap, robots, Organization/WebSite/CollectionPage
      JSON-LD (no invented ratings)
- [x] Public Playwright coverage (desktop + mobile Chromium, axe on home and reader)

### Phase 4 — Reader and library

- [x] Reading toolbar: size, save, scroll progress
- [x] Guest progress and saves stay in the browser; signed-in saves go to Supabase when the tables exist
- [x] Bookmarks page and practice dashboard (streak, continue, saved count)
- [x] Settings for size, type, page colour, listening speed, daily email
- [x] Private audio route returns a short-lived file URL only when the lesson has audio and the reader may hear it
- [ ] Hosted audio files are not uploaded yet, so published lessons still say audio is coming

## In progress

- Phase 5 — Admin CMS CRUD

## Blocked

- Applying migrations against the hosted Postgres used by `.env.local`. SQL is ready (`npx
  supabase start` or `npx supabase db push`; see `docs/local-setup.md`). The public site currently
  uses the typed demo catalogue when remote tables are absent or empty. No reset was run.

## Next

1. Phase 5: admin CMS CRUD connected to Supabase.
2. Phase 6: commerce + email adapters.
3. Phase 7: QA + handoff.

## Verification log

| Date       | Command               | Result                                                                                          |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| 2026-10-05 | `npx next dev --port 3001` | Starts with `Environments: .env.local` (values not logged). Auth UI active when keys present. |
| 2026-10-05 | `npm run lint`        | pass                                                                                            |
| 2026-10-05 | `npm run typecheck`   | pass                                                                                            |
| 2026-10-05 | `npm run test`        | 16 files, 57 tests passed                                                                       |
| 2026-10-05 | `npm run build`       | pass; public routes generated; `Environments: .env.local` (values not logged)                   |
| 2026-10-05 | `npx playwright test` | 26 passed (desktop + mobile Chromium, axe on home, login, reader)                               |
| 2026-10-05 | Browser inspect       | Home, explore (URL filters), collection, daily, pricing, about, contact (ack), privacy, paywall, mobile nav, sitemap/robots HTTP 200 |

| 2026-10-06 | `npm run typecheck`   | pass after reader, bookmarks, dashboard, settings, audio route                                  |
| 2026-10-06 | `npm run test`        | 17 files, 59 tests passed                                                                       |
| 2026-10-06 | eslint on Phase 4 files | pass                                                                                          |
