create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.activity_type as enum ('furniture', 'restaurant', 'retail', 'other');

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_ar text not null check (char_length(name_ar) between 2 and 120),
  name_en text not null check (char_length(name_en) between 2 and 120),
  type public.activity_type not null,
  logo_url text not null default '/brand/touch-logo.svg',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_settings (
  activity_id uuid primary key references public.activities(id) on delete cascade,
  whatsapp_number text not null check (whatsapp_number ~ '^\d{10,15}$'),
  address_ar text not null check (char_length(address_ar) between 5 and 500),
  accent_primary text not null default '#6d4c3d' check (accent_primary ~ '^#[0-9A-Fa-f]{6}$'),
  accent_secondary text not null default '#b18b57' check (accent_secondary ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_ar text not null check (char_length(name_ar) between 2 and 120),
  name_en text not null check (char_length(name_en) between 2 and 120),
  description_ar text not null check (char_length(description_ar) between 4 and 1200),
  cover_url text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_id, slug)
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_ar text not null check (char_length(name_ar) between 2 and 120),
  description_ar text not null check (char_length(description_ar) between 4 and 2400),
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'ج.م' check (char_length(currency) between 1 and 20),
  stock integer not null default 0 check (stock >= 0),
  cover_url text not null default '',
  gallery_urls text[] not null default '{}',
  is_published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index collections_activity_order_idx on public.collections(activity_id, sort_order);
create index rooms_collection_order_idx on public.rooms(collection_id, sort_order);
create index rooms_low_stock_idx on public.rooms(stock) where stock < 5;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
create trigger activities_updated_at before update on public.activities for each row execute function private.set_updated_at();
create trigger activity_settings_updated_at before update on public.activity_settings for each row execute function private.set_updated_at();
create trigger collections_updated_at before update on public.collections for each row execute function private.set_updated_at();
create trigger rooms_updated_at before update on public.rooms for each row execute function private.set_updated_at();

alter table public.activities enable row level security;
alter table public.activity_settings enable row level security;
alter table public.collections enable row level security;
alter table public.rooms enable row level security;

grant select on public.activities, public.activity_settings, public.collections, public.rooms to anon;
grant select, insert, update, delete on public.activities, public.activity_settings, public.collections, public.rooms to authenticated;

create policy "published activities are public"
on public.activities for select to anon, authenticated
using (is_published);

create policy "published settings are public"
on public.activity_settings for select to anon, authenticated
using (exists (select 1 from public.activities a where a.id = activity_id and a.is_published));

create policy "published collections are public"
on public.collections for select to anon, authenticated
using (is_published and exists (select 1 from public.activities a where a.id = activity_id and a.is_published));

create policy "published rooms are public"
on public.rooms for select to anon, authenticated
using (
  is_published and exists (
    select 1 from public.collections c
    join public.activities a on a.id = c.activity_id
    where c.id = collection_id and c.is_published and a.is_published
  )
);

create policy "admins manage activities"
on public.activities for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true');

create policy "admins manage settings"
on public.activity_settings for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true');

create policy "admins manage collections"
on public.collections for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true');

create policy "admins manage rooms"
on public.rooms for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin' and (select auth.jwt()->>'is_anonymous') is distinct from 'true');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('catalog-images', 'catalog-images', true, 15728640, array['image/jpeg','image/png','image/webp']),
  ('catalog-raw', 'catalog-raw', false, 15728640, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads processed catalog images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'catalog-images');

create policy "admins insert processed catalog images"
on storage.objects for insert to authenticated
with check (bucket_id = 'catalog-images' and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins update processed catalog images"
on storage.objects for update to authenticated
using (bucket_id = 'catalog-images' and (select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check (bucket_id = 'catalog-images' and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins delete processed catalog images"
on storage.objects for delete to authenticated
using (bucket_id = 'catalog-images' and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins read own raw images"
on storage.objects for select to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins upload own raw images"
on storage.objects for insert to authenticated
with check (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins update own raw images"
on storage.objects for update to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and (select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "admins delete own raw images"
on storage.objects for delete to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and (select auth.jwt()->'app_metadata'->>'role') = 'admin');
