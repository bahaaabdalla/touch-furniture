-- Keep a single SELECT policy per catalog table so administrators can inspect
-- drafts without creating overlapping permissive policies.
drop policy "admins manage activities" on public.activities;
drop policy "admins manage settings" on public.activity_settings;
drop policy "admins manage collections" on public.collections;
drop policy "admins manage rooms" on public.rooms;

drop policy "published activities are public" on public.activities;
create policy "read visible activities"
on public.activities for select to anon, authenticated
using (
  is_published
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy "published settings are public" on public.activity_settings;
create policy "read visible settings"
on public.activity_settings for select to anon, authenticated
using (
  exists (select 1 from public.activities a where a.id = activity_id and a.is_published)
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy "published collections are public" on public.collections;
create policy "read visible collections"
on public.collections for select to anon, authenticated
using (
  (is_published and exists (select 1 from public.activities a where a.id = activity_id and a.is_published))
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy "published rooms are public" on public.rooms;
create policy "read visible rooms"
on public.rooms for select to anon, authenticated
using (
  (
    is_published and exists (
      select 1 from public.collections c
      join public.activities a on a.id = c.activity_id
      where c.id = collection_id and c.is_published and a.is_published
    )
  )
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "admins insert activities" on public.activities for insert to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins update activities" on public.activities for update to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins delete activities" on public.activities for delete to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');

create policy "admins insert settings" on public.activity_settings for insert to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins update settings" on public.activity_settings for update to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins delete settings" on public.activity_settings for delete to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');

create policy "admins insert collections" on public.collections for insert to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins update collections" on public.collections for update to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins delete collections" on public.collections for delete to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');

create policy "admins insert rooms" on public.rooms for insert to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins update rooms" on public.rooms for update to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');
create policy "admins delete rooms" on public.rooms for delete to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and ((select auth.jwt()) ->> 'is_anonymous') is distinct from 'true');

-- Public buckets already serve individual object URLs. A broad SELECT policy
-- additionally exposes directory listing, so it is intentionally absent.
drop policy "public reads processed catalog images" on storage.objects;

drop policy "admins insert processed catalog images" on storage.objects;
create policy "admins insert processed catalog images" on storage.objects for insert to authenticated
with check (bucket_id = 'catalog-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
drop policy "admins update processed catalog images" on storage.objects;
create policy "admins update processed catalog images" on storage.objects for update to authenticated
using (bucket_id = 'catalog-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'catalog-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
drop policy "admins delete processed catalog images" on storage.objects;
create policy "admins delete processed catalog images" on storage.objects for delete to authenticated
using (bucket_id = 'catalog-images' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins read own raw images" on storage.objects;
create policy "admins read own raw images" on storage.objects for select to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
drop policy "admins upload own raw images" on storage.objects;
create policy "admins upload own raw images" on storage.objects for insert to authenticated
with check (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
drop policy "admins update own raw images" on storage.objects;
create policy "admins update own raw images" on storage.objects for update to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
drop policy "admins delete own raw images" on storage.objects;
create policy "admins delete own raw images" on storage.objects for delete to authenticated
using (bucket_id = 'catalog-raw' and (storage.foldername(name))[1] = (select auth.uid())::text and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
