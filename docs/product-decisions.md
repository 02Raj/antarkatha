# AntarKatha — product & architecture decisions

A living, concise record. Change it when a decision changes.

## Product

- **Promise:** Ancient wisdom, made clear for everyday life.
- **Is:** a calm reading + listening product of short, source-aware adaptations.
- **Is not:** a debate forum, social network, astrology app, guru marketplace, or chatbot.
- **Launch collections:** Bhagavad Gita, Upanishads, Mahabharata, Ramayana. The schema already
  supports Ashtavakra Gita, Vedanta primers, Puranic stories, Yoga Vasistha, commentary series.
- **Lesson shape:** Context → The Passage/Story → Simple Meaning → Why It Matters Today →
  Reflection → One Practice, followed by a source block.
- **Editorial honesty:** lessons are _adaptations_, never presented as translations. No invented
  verse numbers, Sanskrit, translators or citations. Missing verified source ⇒ "Source review
  pending" and the item stays unpublished. Demo lessons carry "Demo adaptation — verify before
  publishing".
- **No** fake testimonials, user counts, ratings, or medical/mental-health claims.

## Stack

| Concern         | Choice                                                              |
| --------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, RSC by default, Turbopack)                  |
| Styling         | Tailwind CSS v4 tokens in `src/app/globals.css`; Radix primitives   |
| Data/Auth       | Supabase Postgres + Auth + Storage, `@supabase/ssr`, RLS everywhere |
| Validation      | Zod 4 on every server input                                         |
| Forms           | React Hook Form for admin; plain server actions for simple forms    |
| Tests           | Vitest + Testing Library (unit), Playwright + axe (e2e/a11y)        |
| Payments, email | Provider interfaces; Razorpay / Resend shells; dev-only fallbacks   |

Next.js 16 specifics we rely on: `proxy.ts` (formerly middleware) for session refresh only —
authorization happens in server code and RLS; async `params`/`searchParams`/`cookies()`;
`revalidateTag(tag, profile)`; ESLint CLI instead of `next lint`.

## Visual identity

Contemporary manuscript: parchment `#F6F0E3`, surface `#FFFDF8`, ink `#1C1915`, muted ink
`#6B6257`, saffron `#B85C27`, forest `#23483A`, copper lines `#C9A678`, danger `#A13D3D`.

- `saffron` measures ~4.0:1 on parchment, so it is used for fills, icons and large text only.
  Body-size saffron text uses `saffron-ink` `#9A4A1E` (~5.5:1). Copper is decorative only.
  These ratios are enforced by `src/lib/design/contrast.test.ts`.
- Type: **Newsreader** (editorial serif, optical sizes) for headings/reading; **Instrument Sans**
  for UI. Self-hosted by `next/font`. Devanagari fonts will be added with Hindi.
- Texture is an inline SVG noise data-URI; motifs (inward circles, river line, leaf, diya,
  lozenge ornament) are hand-written SVG in `src/components/motifs`.
- Logo: an open page whose spine sends up a single line that curls inward — river, lamp flame and
  self-inquiry spiral in one stroke. `src/components/brand/logo.tsx`, favicon `src/app/icon.svg`.
- Motion 150–250 ms, `prefers-reduced-motion` respected globally. Radii 6–18 px.

## Architecture

```
src/
  app/
    (site)/            public pages with header/footer (home, explore, collections, read, …)
    (auth)/            login, signup, forgot-password, reset-password
    (member)/          dashboard, settings (library/bookmarks in Phase 4)
    admin/             role-gated shell; CMS CRUD in Phase 5
    api/               analytics ingest now; webhooks/cron later
    auth/callback/     Supabase code exchange
  components/
    ui/                primitives (button, field, dialog, badge, …)
    layout/            SiteHeader, MobileNav, SiteFooter, AnnouncementStrip
    marketing/         EditorialHero, TopicSelector, PricingCards, FAQ …
    reader/            StructuredContentRenderer, AudioPlayer, ReadingToolbar … [Phase 4]
    admin/             data table, content editor, publish checklist …          [Phase 5]
    motifs/, brand/
  lib/
    env.ts             public env (browser-safe)
    env.server.ts      server env + guards (mock checkout never in production)
    supabase/          browser, server, admin, proxy session refresh
    domain/            access, progress, streaks, publishing, webhook idempotency
    payments/, email/, audio/   provider interfaces + adapters    [Phase 6]
  config/              fallback site settings and launch topics
supabase/
  migrations/          SQL source of truth
  seed.sql             demo data
tests/e2e/             Playwright smoke + axe
docs/
```

Rules: domain logic stays out of components; client components only where interaction needs
them; the service-role client is importable only from server modules (ESLint-enforced).

## Data model outline (Phase 2)

- **Identity:** `profiles` (role enum `user|editor|admin`, created by trigger on signup),
  `user_preferences`.
- **Content:** `collections`, `topics`, `content_items` (JSONB block body, source fields,
  `review_status`, `status`, `access_tier`, generated `tsvector`), `content_topics`,
  `daily_features`.
- **Engagement:** `reading_progress`, `listening_progress`, `bookmarks`, `user_streaks`,
  `feedback`.
- **Commerce:** `plans` (integer paise), `orders`, `subscriptions`, `entitlements`, `coupons`,
  `webhook_events` (unique provider event id ⇒ idempotency).
- **Operations:** `analytics_events` (no lesson body), `audit_logs`, `site_settings`.
- Publishing is blocked at the database level (check/trigger) unless source title, source
  locator, adaptation note and `review_status = 'approved'` are present.
- Premium body/audio served via server logic checking entitlements; premium audio via short-lived
  signed URLs from a private bucket.
- **Catalog vs body:** `content_catalog` is a security-definer view of published metadata (no
  `body`, no `audio_path`). `content_items` SELECT is allowed only for free published rows, today’s
  daily feature, entitled members, or staff. That stops the anon key from reading premium bodies.
- Profile rows (and preferences + streak) are created by a trigger on `auth.users`. Role changes
  are blocked unless `auth.uid()` is an admin or the update is service-role SQL.

## Access model

- Free: daily lesson (never blocked), selected previews, bookmarks, limited history.
- Founding Member Monthly ₹99 (9900 paise), Annual ₹799 (79900 paise). Editable in `plans`.
- Access only from verified server-side payment/webhook state. No lifetime plan at launch.
  Coupons modelled, UI disabled.

## Decisions log

| Date       | Decision                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------- |
| 2026-10-05 | Next.js 16.3 (current stable), Tailwind v4, unified `radix-ui` package instead of shadcn CLI |
| 2026-10-05 | Added `saffron-ink` token so saffron text meets WCAG AA                                      |
| 2026-10-05 | `/styleguide` is development-only (404 in production)                                        |
| 2026-10-05 | No git init/commit/push; project lives only in `D:\@Projects\antar-katha`                    |
| 2026-10-05 | `proxy.ts` only refreshes cookies; admin/member gates run in server layouts + RLS            |
| 2026-10-05 | Daily lesson is readable even when the item is premium (`is_daily_content`)                  |
