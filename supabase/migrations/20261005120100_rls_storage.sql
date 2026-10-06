-- AntarKatha RLS, auth triggers, audit, storage buckets and policies.

-- ---------------------------------------------------------------------------
-- Role helpers (security definer to avoid profiles RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.has_library_access(_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(_uid is not null, false)
    and exists (
      select 1
      from public.entitlements e
      where e.user_id = _uid
        and e.active
        and e.starts_at <= now()
        and (e.ends_at is null or e.ends_at > now())
    );
$$;

create or replace function public.is_daily_content(_content_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.daily_features d
    where d.content_id = _content_id
      and d.active
      and d.feature_date = (timezone(d.timezone, now()))::date
  );
$$;

create or replace function public.can_read_content_body(_item public.content_items)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_staff()
    or (
      _item.status = 'published'
      and (
        _item.access_tier = 'free'
        or public.is_daily_content(_item.id)
        or public.has_library_access(auth.uid())
      )
    );
$$;

revoke all on function public.current_profile_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.has_library_access(uuid) from public;
revoke all on function public.is_daily_content(uuid) from public;
revoke all on function public.can_read_content_body(public.content_items) from public;

grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_library_access(uuid) to anon, authenticated;
grant execute on function public.is_daily_content(uuid) to anon, authenticated;
grant execute on function public.can_read_content_body(public.content_items) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Signup: profile + preferences + streak
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  insert into public.user_preferences (user_id) values (new.id);
  insert into public.user_streaks (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role changes: users cannot self-promote. Service-role SQL (auth.uid() is null) is allowed
-- for bootstrap. Admins may change others' roles.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is null then
      return new;
    end if;
    if not public.is_admin() then
      raise exception 'Only admins can change roles';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  entity uuid;
  action text;
begin
  action := lower(tg_op) || '_' || tg_table_name;
  entity := coalesce(new.id, old.id);

  if tg_table_name = 'profiles' and tg_op = 'UPDATE' and new.role is not distinct from old.role then
    return coalesce(new, old);
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (
    auth.uid(),
    action,
    tg_table_name,
    entity,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

-- Avoid logging full lesson body on every autosave: only status/review/role changes.
create or replace function public.write_content_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT'
    or new.status is distinct from old.status
    or new.review_status is distinct from old.review_status
    or new.access_tier is distinct from old.access_tier
  then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_data, after_data)
    values (
      auth.uid(),
      lower(tg_op) || '_content_items',
      'content_items',
      coalesce(new.id, old.id),
      case
        when tg_op = 'INSERT' then null
        else jsonb_build_object(
          'status', old.status,
          'review_status', old.review_status,
          'access_tier', old.access_tier,
          'slug', old.slug
        )
      end,
      jsonb_build_object(
        'status', new.status,
        'review_status', new.review_status,
        'access_tier', new.access_tier,
        'slug', new.slug
      )
    );
  end if;
  return new;
end;
$$;

create trigger content_items_audit
  after insert or update on public.content_items
  for each row execute function public.write_content_audit_log();

create trigger profiles_role_audit
  after update of role on public.profiles
  for each row execute function public.write_audit_log();

-- ---------------------------------------------------------------------------
-- Grants (tighten defaults: no deletes on editorial tables)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.content_catalog to anon, authenticated;
grant select on public.content_items to anon, authenticated;
grant select on public.content_topics to anon, authenticated;
grant select on public.collections to anon, authenticated;
grant select on public.topics to anon, authenticated;
grant select on public.daily_features to anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

grant select, insert, update on public.content_items to authenticated;
grant select, insert, update on public.collections to authenticated;
grant select, insert, update on public.topics to authenticated;
grant select, insert, update, delete on public.content_topics to authenticated;
grant select, insert, update on public.daily_features to authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
grant select, insert, update, delete on public.reading_progress to authenticated;
grant select, insert, update, delete on public.listening_progress to authenticated;
grant select, insert, update, delete on public.bookmarks to authenticated;
grant select, insert, update on public.user_streaks to authenticated;
grant select, insert on public.feedback to authenticated;
grant insert on public.feedback to anon;
grant insert on public.analytics_events to anon, authenticated;

grant select on public.orders to authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.entitlements to authenticated;

grant select, insert, update on public.feedback to authenticated;
grant select on public.audit_logs to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update on public.plans to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert, update on public.entitlements to authenticated;
grant select, insert, update on public.coupons to authenticated;
grant select, insert, update on public.webhook_events to authenticated;
grant select on public.analytics_events to authenticated;

revoke delete on public.content_items from authenticated, anon;
revoke delete on public.collections from authenticated, anon;
revoke delete on public.topics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.collections enable row level security;
alter table public.topics enable row level security;
alter table public.content_items enable row level security;
alter table public.content_topics enable row level security;
alter table public.daily_features enable row level security;
alter table public.reading_progress enable row level security;
alter table public.listening_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.user_streaks enable row level security;
alter table public.feedback enable row level security;
alter table public.plans enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;
alter table public.webhook_events enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.site_settings enable row level security;

-- Profiles
create policy profiles_select_own_or_staff on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Preferences
create policy prefs_own_select on public.user_preferences
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy prefs_own_write on public.user_preferences
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Collections / topics: public read of live rows; staff manage
create policy collections_public_read on public.collections
  for select to anon, authenticated
  using (status = 'published' or public.is_staff());

create policy collections_staff_write on public.collections
  for insert to authenticated
  with check (public.is_staff());

create policy collections_staff_update on public.collections
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy topics_public_read on public.topics
  for select to anon, authenticated
  using (archived = false or public.is_staff());

create policy topics_staff_write on public.topics
  for insert to authenticated
  with check (public.is_staff());

create policy topics_staff_update on public.topics
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Content: body only when free, daily, entitled, or staff
create policy content_items_read_body on public.content_items
  for select to anon, authenticated
  using (public.can_read_content_body(content_items));

create policy content_items_staff_insert on public.content_items
  for insert to authenticated
  with check (public.is_staff());

create policy content_items_staff_update on public.content_items
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy content_topics_read on public.content_topics
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.content_catalog c where c.id = content_id
    )
    or public.is_staff()
  );

create policy content_topics_staff_write on public.content_topics
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy daily_features_read on public.daily_features
  for select to anon, authenticated
  using (active = true or public.is_staff());

create policy daily_features_staff_write on public.daily_features
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Engagement: own rows only
create policy reading_progress_own on public.reading_progress
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy listening_progress_own on public.listening_progress
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy bookmarks_own on public.bookmarks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy streaks_own_select on public.user_streaks
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy streaks_own_update on public.user_streaks
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Feedback: insert own/anonymous; staff read/update
create policy feedback_insert_anon on public.feedback
  for insert to anon
  with check (user_id is null and email is not null);

create policy feedback_insert_auth on public.feedback
  for insert to authenticated
  with check (user_id = auth.uid());

create policy feedback_select_own_or_staff on public.feedback
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy feedback_staff_update on public.feedback
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Plans: public read of active; admin write
create policy plans_public_read on public.plans
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy plans_admin_write on public.plans
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy coupons_admin_all on public.coupons
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Orders / subscriptions / entitlements: user read own; never user-write
create policy orders_select_own on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy subscriptions_select_own on public.subscriptions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy entitlements_select_own on public.entitlements
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy webhook_admin_read on public.webhook_events
  for select to authenticated
  using (public.is_admin());

-- Analytics: insert only; cannot select others; no body field by convention
create policy analytics_insert_auth on public.analytics_events
  for insert to authenticated
  with check (user_id = auth.uid());

create policy analytics_insert_anon on public.analytics_events
  for insert to anon
  with check (user_id is null and anonymous_id is not null);

create policy analytics_select_own_or_admin on public.analytics_events
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy audit_admin_read on public.audit_logs
  for select to authenticated
  using (public.is_admin());

create policy site_settings_read on public.site_settings
  for select to anon, authenticated
  using (true);

create policy site_settings_admin_write on public.site_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'motifs',
    'motifs',
    true,
    2097152,
    array['image/png', 'image/jpeg', 'image/webp']
  ),
  (
    'audio',
    'audio',
    false,
    52428800,
    array['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/m4a']
  )
on conflict (id) do nothing;

create policy motifs_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'motifs');

create policy motifs_staff_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'motifs' and public.is_staff());

create policy motifs_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'motifs' and public.is_staff())
  with check (bucket_id = 'motifs' and public.is_staff());

create policy motifs_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'motifs' and public.is_staff());

-- Private audio: staff manage; listeners get short-lived signed URLs via service role.
create policy audio_staff_select on storage.objects
  for select to authenticated
  using (bucket_id = 'audio' and public.is_staff());

create policy audio_staff_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'audio' and public.is_staff());

create policy audio_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'audio' and public.is_staff())
  with check (bucket_id = 'audio' and public.is_staff());

create policy audio_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'audio' and public.is_staff());
