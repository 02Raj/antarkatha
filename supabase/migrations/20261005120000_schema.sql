-- AntarKatha schema: enums, tables, indexes, triggers, catalog view.
-- RLS and storage follow in 20261005120100_rls_storage.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('user', 'editor', 'admin');
create type public.editorial_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.review_status as enum ('pending', 'in_review', 'approved', 'rejected');
create type public.content_type as enum ('lesson', 'primer', 'commentary', 'story');
create type public.difficulty_level as enum ('introductory', 'familiar', 'deep');
create type public.access_tier as enum ('free', 'premium');
create type public.language_code as enum ('en', 'hi');
create type public.billing_interval as enum ('month', 'year');
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded', 'cancelled');
create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'expired'
);
create type public.entitlement_source as enum ('order', 'subscription', 'grant', 'daily');
create type public.coupon_type as enum ('percent', 'amount');
create type public.webhook_status as enum ('received', 'processed', 'failed', 'ignored');
create type public.feedback_status as enum ('new', 'in_progress', 'resolved', 'archived');
create type public.feedback_category as enum ('general', 'content', 'technical', 'billing');
create type public.reader_theme as enum ('light', 'sepia', 'dark');
create type public.reader_font as enum ('serif', 'sans');

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.content_body_text(body jsonb)
returns text
language sql
immutable
as $$
  select coalesce(
    string_agg(
      coalesce(
        elem ->> 'text',
        elem ->> 'prompt',
        elem ->> 'note',
        array_to_string(
          array(select jsonb_array_elements_text(coalesce(elem -> 'lines', '[]'::jsonb))),
          ' '
        ),
        ''
      ),
      ' '
    ),
    ''
  )
  from jsonb_array_elements(coalesce(body, '[]'::jsonb)) as elem;
$$;

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language public.language_code not null default 'en',
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email_daily boolean not null default true,
  audio_speed numeric(3, 2) not null default 1.00
    constraint user_preferences_audio_speed_range check (audio_speed between 0.50 and 2.00),
  reader_theme public.reader_theme not null default 'sepia',
  font_family public.reader_font not null default 'serif',
  font_scale numeric(3, 2) not null default 1.00
    constraint user_preferences_font_scale_range check (font_scale between 0.85 and 1.40)
);

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text not null,
  description text not null default '',
  introduction text not null default '',
  language public.language_code not null default 'en',
  status public.editorial_status not null default 'draft',
  cover_config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  icon_key text not null default 'inward',
  sort_order integer not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text not null default '',
  collection_id uuid not null references public.collections (id) on delete restrict,
  language public.language_code not null default 'en',
  type public.content_type not null default 'lesson',
  difficulty public.difficulty_level not null default 'introductory',
  access_tier public.access_tier not null default 'free',
  reading_minutes integer not null default 5
    constraint content_items_reading_minutes_positive check (reading_minutes > 0),
  body jsonb not null default '[]'::jsonb,
  preview_blocks jsonb not null default '[]'::jsonb,
  cover_config jsonb not null default '{}'::jsonb,
  source_title text,
  source_locator text,
  adaptation_note text,
  review_status public.review_status not null default 'pending',
  status public.editorial_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  sort_order integer not null default 0,
  audio_path text,
  audio_duration_seconds integer
    constraint content_items_audio_duration_nonneg check (
      audio_duration_seconds is null or audio_duration_seconds >= 0
    ),
  seo_title text,
  seo_description text,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(subtitle, '')), 'B')
    || setweight(to_tsvector('english', coalesce(summary, '')), 'B')
    || setweight(to_tsvector('english', public.content_body_text(body)), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_topics (
  content_id uuid not null references public.content_items (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete restrict,
  primary key (content_id, topic_id)
);

create table public.daily_features (
  id uuid primary key default gen_random_uuid(),
  feature_date date not null,
  content_id uuid not null references public.content_items (id) on delete restrict,
  timezone text not null default 'Asia/Kolkata',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (feature_date, timezone)
);

create or replace function public.assert_publishable()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('published', 'scheduled') then
    if coalesce(btrim(new.source_title), '') = ''
      or coalesce(btrim(new.source_locator), '') = ''
      or coalesce(btrim(new.adaptation_note), '') = ''
      or new.review_status is distinct from 'approved'
    then
      raise exception
        'Cannot publish or schedule without source title, source locator, adaptation note, and approved review';
    end if;
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;

  return new;
end;
$$;

create trigger content_items_assert_publishable
  before insert or update on public.content_items
  for each row execute function public.assert_publishable();

create trigger collections_touch_updated_at
  before update on public.collections
  for each row execute function public.touch_updated_at();

create trigger topics_touch_updated_at
  before update on public.topics
  for each row execute function public.touch_updated_at();

create trigger content_items_touch_updated_at
  before update on public.content_items
  for each row execute function public.touch_updated_at();

-- Listing view: published metadata without body or audio_path.
-- security_invoker = false so anon can see premium titles without reading body rows.
create or replace view public.content_catalog
  with (security_invoker = false, security_barrier = true)
as
select
  id,
  slug,
  title,
  subtitle,
  summary,
  collection_id,
  language,
  type,
  difficulty,
  access_tier,
  reading_minutes,
  preview_blocks,
  cover_config,
  source_title,
  source_locator,
  adaptation_note,
  review_status,
  status,
  published_at,
  sort_order,
  audio_duration_seconds,
  (audio_path is not null) as has_audio,
  seo_title,
  seo_description,
  created_at,
  updated_at
from public.content_items
where status = 'published';

-- ---------------------------------------------------------------------------
-- Engagement
-- ---------------------------------------------------------------------------

create table public.reading_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  content_id uuid not null references public.content_items (id) on delete restrict,
  progress_percent numeric(5, 2) not null default 0
    constraint reading_progress_percent_range check (progress_percent between 0 and 100),
  last_position jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

create table public.listening_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  content_id uuid not null references public.content_items (id) on delete restrict,
  position_seconds numeric(10, 2) not null default 0
    constraint listening_progress_position_nonneg check (position_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

create table public.bookmarks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  content_id uuid not null references public.content_items (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

create table public.user_streaks (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  current_streak integer not null default 0
    constraint user_streaks_current_nonneg check (current_streak >= 0),
  longest_streak integer not null default 0
    constraint user_streaks_longest_nonneg check (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text,
  category public.feedback_category not null default 'general',
  message text not null,
  status public.feedback_status not null default 'new',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feedback_identity check (user_id is not null or email is not null)
);

create trigger reading_progress_touch_updated_at
  before update on public.reading_progress
  for each row execute function public.touch_updated_at();

create trigger listening_progress_touch_updated_at
  before update on public.listening_progress
  for each row execute function public.touch_updated_at();

create trigger user_streaks_touch_updated_at
  before update on public.user_streaks
  for each row execute function public.touch_updated_at();

create trigger feedback_touch_updated_at
  before update on public.feedback
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Commerce
-- ---------------------------------------------------------------------------

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  billing_interval public.billing_interval,
  price_paise integer not null
    constraint plans_price_nonneg check (price_paise >= 0),
  currency text not null default 'INR',
  active boolean not null default true,
  features jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type public.coupon_type not null,
  value integer not null check (value > 0),
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  plan_id uuid not null references public.plans (id) on delete restrict,
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  amount_paise integer not null check (amount_paise >= 0),
  currency text not null default 'INR',
  status public.order_status not null default 'pending',
  coupon_id uuid references public.coupons (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  plan_id uuid not null references public.plans (id) on delete restrict,
  provider_subscription_id text unique,
  status public.subscription_status not null default 'trialing',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_type public.entitlement_source not null,
  source_id uuid,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.webhook_status not null default 'received',
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create trigger plans_touch_updated_at
  before update on public.plans
  for each row execute function public.touch_updated_at();

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Operations
-- ---------------------------------------------------------------------------

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  anonymous_id text,
  event_name text not null,
  content_id uuid references public.content_items (id) on delete set null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint analytics_actor check (user_id is not null or anonymous_id is not null)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index collections_status_sort_idx on public.collections (status, sort_order);
create index topics_sort_idx on public.topics (sort_order) where archived = false;
create index content_items_published_lookup_idx
  on public.content_items (status, published_at desc)
  where status = 'published';
create index content_items_collection_order_idx
  on public.content_items (collection_id, sort_order);
create index content_items_search_idx on public.content_items using gin (search_vector);
create index content_topics_topic_idx on public.content_topics (topic_id, content_id);
create index daily_features_date_idx on public.daily_features (feature_date, timezone)
  where active = true;
create index reading_progress_user_updated_idx
  on public.reading_progress (user_id, updated_at desc);
create index bookmarks_user_created_idx on public.bookmarks (user_id, created_at desc);
create index entitlements_user_active_idx
  on public.entitlements (user_id, ends_at)
  where active = true;
create index orders_user_created_idx on public.orders (user_id, created_at desc);
create index webhook_events_provider_id_idx on public.webhook_events (provider, provider_event_id);
create index analytics_events_created_idx on public.analytics_events (created_at desc);
create index analytics_events_name_created_idx
  on public.analytics_events (event_name, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

comment on table public.content_items is
  'Editorial lessons. Body is row-protected; listings use content_catalog.';
comment on column public.content_items.body is
  'Structured blocks (heading, paragraph, quote, verse, translation, callout, divider, reflection, practice, source-note). Never store raw HTML.';
comment on column public.content_items.source_locator is
  'Human-readable locator. Never invent verse numbers. Use a generic demo locator when unverified.';
