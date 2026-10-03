do $$
declare target text; n integer;
begin
  foreach target in array array['organizations','memberships','channels','site_settings','properties','property_private_details','property_assets','knowledge_entries','contacts','leads','conversations','messages','surveys','tasks','webhook_events','job_outbox','outbox','ai_runs','ai_tool_calls','audit_events','site_daily_metrics'] loop
    if not (select relrowsecurity from pg_class where oid = ('public.' || target)::regclass) then raise exception 'RLS disabled: %',target; end if;
    if has_table_privilege('anon','public.' || target,'SELECT,INSERT,UPDATE,DELETE') then raise exception 'anon privilege: %',target; end if;
    if has_table_privilege('authenticated','public.' || target,'INSERT,UPDATE,DELETE') then raise exception 'direct mutation: %',target; end if;
  end loop;
  select count(*) into n from public.memberships;
  if n <> 5 then raise exception 'Run seed before access tests'; end if;
end $$;

select set_config('request.jwt.claim.sub',(select user_id::text from public.memberships where display_name = 'Andi'),true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.leads) <> 2 then raise exception 'Andi lead scope'; end if;
  if exists (select 1 from public.property_private_details) then raise exception 'Private details exposed'; end if;
  if exists (select 1 from public.properties where organization_id = '10000000-0000-4000-8000-000000000002') then raise exception 'Tenant exposed'; end if;
end $$;
reset role;

select set_config('request.jwt.claim.sub',(select user_id::text from public.memberships where display_name = 'Tidak aktif'),true);
set local role authenticated;
do $$
begin
  if exists (select 1 from public.properties) or exists (select 1 from public.leads) then raise exception 'Inactive access'; end if;
end $$;
reset role;

select set_config('request.jwt.claim.sub',(select user_id::text from public.memberships where display_name = 'Owner B'),true);
set local role authenticated;
do $$
begin
  if (select count(*) from public.properties) <> 1 then raise exception 'Owner B catalog scope'; end if;
  if exists (select 1 from public.leads) then raise exception 'Owner B lead exposure'; end if;
end $$;
reset role;
