select set_config('request.jwt.claim.sub',(select user_id::text from public.memberships
  where organization_id = '10000000-0000-4000-8000-000000000001' and role = 'owner'),true);
set local role authenticated;
do $$
declare
  org_a uuid := '10000000-0000-4000-8000-000000000001';
  org_b uuid := '10000000-0000-4000-8000-000000000002';
  owner_a uuid;
  sales_a uuid;
  faq_id uuid;
  audit_count integer;
begin
  select user_id into owner_a from public.memberships where organization_id = org_a and role = 'owner';
  select user_id into sales_a from public.memberships where organization_id = org_a and display_name = 'Andi';
  if owner_a is null or sales_a is null then raise exception 'Seed accounts unavailable'; end if;
  perform set_config('request.jwt.claim.sub',owner_a::text,true);
  faq_id := public.save_knowledge_entry(org_a,null,'Bagaimana jadwal kunjungan?','Hubungi tim untuk membuat jadwal.','public',true);
  if not exists (select 1 from public.knowledge_entries where id = faq_id and organization_id = org_a and is_active) then
    raise exception 'FAQ create not persisted';
  end if;
  if (select count(*) from public.audit_events where entity_id = faq_id) <> 1 then
    raise exception 'FAQ create audit missing';
  end if;
  if exists (select 1 from public.audit_events where entity_id = faq_id and changes::text like '%Hubungi tim%') then
    raise exception 'FAQ answer leaked into audit';
  end if;

  perform set_config('request.jwt.claim.sub',sales_a::text,true);
  if not exists (select 1 from public.knowledge_entries where id = faq_id) then
    raise exception 'Sales cannot read public active FAQ';
  end if;
  begin
    perform public.save_knowledge_entry(org_a,faq_id,'Pertanyaan oleh sales?','Jawaban oleh sales ditolak.','public',true);
    raise exception 'Sales mutation accepted';
  exception when insufficient_privilege then null; end;

  perform set_config('request.jwt.claim.sub',owner_a::text,true);
  begin
    perform public.save_knowledge_entry(org_b,faq_id,'Pertanyaan lintas organisasi?','Jawaban lintas organisasi ditolak.','public',true);
    raise exception 'Cross-organization mutation accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.save_knowledge_entry(org_a,faq_id,'Pendek','Terlalu singkat','public',true);
    raise exception 'Invalid FAQ accepted';
  exception when invalid_parameter_value then null; end;
  if (select question from public.knowledge_entries where id = faq_id) <> 'Bagaimana jadwal kunjungan?' then
    raise exception 'Failed FAQ write changed row';
  end if;

  audit_count := (select count(*) from public.audit_events where entity_id = faq_id);
  perform public.save_knowledge_entry(org_a,faq_id,'Bagaimana mengatur kunjungan?','Tim akan membantu mengatur kunjungan.','internal',false);
  if (select count(*) from public.audit_events where entity_id = faq_id) <> audit_count + 1 then
    raise exception 'FAQ update audit missing';
  end if;
  perform set_config('request.jwt.claim.sub',sales_a::text,true);
  if exists (select 1 from public.knowledge_entries where id = faq_id) then
    raise exception 'Sales can read private inactive FAQ';
  end if;
end $$;
reset role;
