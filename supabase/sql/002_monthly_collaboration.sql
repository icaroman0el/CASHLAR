create table if not exists public.monthly_shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  collaborator_id uuid not null references auth.users (id) on delete cascade,
  month_key date not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint monthly_shares_month_key_check
    check (month_key = date_trunc('month', month_key)::date),
  constraint monthly_shares_unique
    unique (owner_id, collaborator_id, month_key),
  constraint monthly_shares_owner_diff_check
    check (owner_id <> collaborator_id)
);

create index if not exists monthly_shares_owner_month_idx
  on public.monthly_shares (owner_id, month_key desc);

create index if not exists monthly_shares_collaborator_month_idx
  on public.monthly_shares (collaborator_id, month_key desc);

insert into public.profiles (id, email, full_name, avatar_url)
select
  users.id,
  coalesce(users.email, ''),
  nullif(users.raw_user_meta_data ->> 'full_name', ''),
  nullif(users.raw_user_meta_data ->> 'avatar_url', '')
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(excluded.full_name, public.profiles.full_name),
  avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
  updated_at = timezone('utc'::text, now());

drop trigger if exists set_monthly_shares_updated_at on public.monthly_shares;
create trigger set_monthly_shares_updated_at
before update on public.monthly_shares
for each row execute procedure public.set_updated_at();

alter table public.monthly_shares enable row level security;

drop policy if exists "Monthly shares are viewable by participants" on public.monthly_shares;
create policy "Monthly shares are viewable by participants"
on public.monthly_shares
for select
to authenticated
using (
  (select auth.uid()) = owner_id
  or (select auth.uid()) = collaborator_id
);

drop policy if exists "Monthly shares are insertable by owner" on public.monthly_shares;
create policy "Monthly shares are insertable by owner"
on public.monthly_shares
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Monthly shares are deletable by owner" on public.monthly_shares;
create policy "Monthly shares are deletable by owner"
on public.monthly_shares
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create or replace function public.share_month_with_email(target_email text, shared_month date)
returns table (
  share_id uuid,
  collaborator_id uuid,
  collaborator_email text,
  collaborator_name text,
  month_key date
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  month_start date := date_trunc('month', coalesce(shared_month, current_date))::date;
  target_user auth.users%rowtype;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if target_email is null or btrim(target_email) = '' then
    raise exception 'EMAIL_REQUIRED';
  end if;

  select *
  into target_user
  from auth.users
  where lower(coalesce(email, '')) = lower(btrim(target_email))
  limit 1;

  if target_user.id is null then
    raise exception 'TARGET_NOT_FOUND';
  end if;

  if target_user.id = current_user_id then
    raise exception 'TARGET_IS_OWNER';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    target_user.id,
    coalesce(target_user.email, ''),
    nullif(target_user.raw_user_meta_data ->> 'full_name', ''),
    nullif(target_user.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc'::text, now());

  return query
  with upserted as (
    insert into public.monthly_shares as monthly_share (owner_id, collaborator_id, month_key)
    values (current_user_id, target_user.id, month_start)
    on conflict on constraint monthly_shares_unique
    do update
      set updated_at = timezone('utc'::text, now())
    returning monthly_share.id, monthly_share.month_key
  )
  select
    upserted.id,
    target_user.id,
    coalesce(nullif(profiles.email, ''), target_user.email, ''),
    coalesce(profiles.full_name, nullif(target_user.raw_user_meta_data ->> 'full_name', '')),
    upserted.month_key
  from upserted
  left join public.profiles
    on profiles.id = target_user.id;
end;
$$;

create or replace function public.get_month_collaborators(shared_month date)
returns table (
  share_id uuid,
  collaborator_id uuid,
  collaborator_email text,
  collaborator_name text,
  month_key date
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  month_start date := date_trunc('month', coalesce(shared_month, current_date))::date;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  return query
  select
    monthly_shares.id,
    auth_users.id,
    coalesce(nullif(profiles.email, ''), auth_users.email, ''),
    coalesce(profiles.full_name, nullif(auth_users.raw_user_meta_data ->> 'full_name', '')),
    monthly_shares.month_key
  from public.monthly_shares
  join auth.users as auth_users
    on auth_users.id = monthly_shares.collaborator_id
  left join public.profiles
    on profiles.id = monthly_shares.collaborator_id
  where monthly_shares.owner_id = current_user_id
    and monthly_shares.month_key = month_start
  order by coalesce(profiles.full_name, auth_users.raw_user_meta_data ->> 'full_name', auth_users.email);
end;
$$;

create or replace function public.get_received_month_shares()
returns table (
  share_id uuid,
  owner_id uuid,
  owner_email text,
  owner_name text,
  month_key date
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  return query
  select
    monthly_shares.id,
    auth_users.id,
    coalesce(nullif(profiles.email, ''), auth_users.email, ''),
    coalesce(profiles.full_name, nullif(auth_users.raw_user_meta_data ->> 'full_name', '')),
    monthly_shares.month_key
  from public.monthly_shares
  join auth.users as auth_users
    on auth_users.id = monthly_shares.owner_id
  left join public.profiles
    on profiles.id = monthly_shares.owner_id
  where monthly_shares.collaborator_id = current_user_id
  order by monthly_shares.month_key desc, coalesce(profiles.full_name, auth_users.raw_user_meta_data ->> 'full_name', auth_users.email);
end;
$$;

create or replace function public.revoke_month_share(share_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  deleted_count integer := 0;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  delete from public.monthly_shares
  where id = share_id
    and owner_id = current_user_id;

  get diagnostics deleted_count = row_count;

  return deleted_count > 0;
end;
$$;

grant execute on function public.share_month_with_email(text, date) to authenticated;
grant execute on function public.get_month_collaborators(date) to authenticated;
grant execute on function public.get_received_month_shares() to authenticated;
grant execute on function public.revoke_month_share(uuid) to authenticated;

drop policy if exists "Transactions are viewable by shared collaborators" on public.transactions;
create policy "Transactions are viewable by shared collaborators"
on public.transactions
for select
to authenticated
using (
  exists (
    select 1
    from public.monthly_shares
    where monthly_shares.owner_id = transactions.user_id
      and monthly_shares.collaborator_id = (select auth.uid())
      and monthly_shares.month_key = date_trunc('month', transactions.transaction_date)::date
  )
);

drop policy if exists "Transactions are insertable by shared collaborators" on public.transactions;
create policy "Transactions are insertable by shared collaborators"
on public.transactions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.monthly_shares
    where monthly_shares.owner_id = transactions.user_id
      and monthly_shares.collaborator_id = (select auth.uid())
      and monthly_shares.month_key = date_trunc('month', transactions.transaction_date)::date
  )
);

drop policy if exists "Transactions are updatable by shared collaborators" on public.transactions;
create policy "Transactions are updatable by shared collaborators"
on public.transactions
for update
to authenticated
using (
  exists (
    select 1
    from public.monthly_shares
    where monthly_shares.owner_id = transactions.user_id
      and monthly_shares.collaborator_id = (select auth.uid())
      and monthly_shares.month_key = date_trunc('month', transactions.transaction_date)::date
  )
)
with check (
  exists (
    select 1
    from public.monthly_shares
    where monthly_shares.owner_id = transactions.user_id
      and monthly_shares.collaborator_id = (select auth.uid())
      and monthly_shares.month_key = date_trunc('month', transactions.transaction_date)::date
  )
);

drop policy if exists "Transactions are deletable by shared collaborators" on public.transactions;
create policy "Transactions are deletable by shared collaborators"
on public.transactions
for delete
to authenticated
using (
  exists (
    select 1
    from public.monthly_shares
    where monthly_shares.owner_id = transactions.user_id
      and monthly_shares.collaborator_id = (select auth.uid())
      and monthly_shares.month_key = date_trunc('month', transactions.transaction_date)::date
  )
);
