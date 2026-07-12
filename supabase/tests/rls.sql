begin;

-- Add unpublished fixtures as the database owner; they are rolled back below.
insert into public.collections (activity_id, slug, name_ar, name_en, description_ar, is_published)
values ('10000000-0000-4000-8000-000000000001', 'hidden-rls-check', 'اختبار مخفي', 'Hidden RLS check', 'سجل مؤقت لاختبار الحجب.', false);

-- Anonymous users can see only published rows and cannot write.
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
do $$
begin
  if exists (select 1 from public.activities where not is_published) then
    raise exception 'anon can see unpublished activities';
  end if;
  if exists (select 1 from public.collections where slug = 'hidden-rls-check') then
    raise exception 'anon can see unpublished collections';
  end if;

  begin
    insert into public.activities (slug, name_ar, name_en, type)
    values ('anon-write-check', 'اختبار', 'Anon write check', 'furniture');
    raise exception 'anon write unexpectedly succeeded';
  exception when insufficient_privilege then
    null;
  end;
end $$;

-- An authenticated non-admin must still be unable to write.
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"40000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{},"is_anonymous":false}';
do $$
declare
  changed_rows integer;
begin
  update public.activities set name_en = name_en;
  get diagnostics changed_rows = row_count;
  if changed_rows <> 0 then
    raise exception 'non-admin write unexpectedly changed rows';
  end if;
end $$;

-- An authenticated admin can write. The transaction is rolled back.
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"40000000-0000-4000-8000-000000000002","role":"authenticated","app_metadata":{"role":"admin"},"is_anonymous":false}';
do $$
declare
  changed_rows integer;
begin
  update public.activities set name_en = name_en where id = '10000000-0000-4000-8000-000000000001';
  get diagnostics changed_rows = row_count;
  if changed_rows <> 1 then
    raise exception 'admin write was not allowed';
  end if;
end $$;

rollback;
