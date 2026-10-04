-- The runner always rolls back these temporary fixtures, including the Auth row.
do $$
declare
  org_a uuid := gen_random_uuid(); org_b uuid := gen_random_uuid();
  actor_id uuid := gen_random_uuid(); property_a uuid; property_b uuid;
  contact_a uuid; lead_a uuid; channel_a uuid; conversation_a uuid;
  target text; amount text; public_row jsonb;
begin
  foreach target in array array['organizations','memberships','channels','site_settings','properties','property_private_details','property_assets','knowledge_entries','contacts','leads','conversations','messages','surveys','tasks','webhook_events','job_outbox','ai_runs','outbox','ai_tool_calls','audit_events','site_daily_metrics'] loop
    if not (select relrowsecurity from pg_class where oid = ('public.' || target)::regclass) then
      raise exception 'RLS disabled: %', target;
    end if;
    if has_table_privilege('anon','public.' || target,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') then
      raise exception 'anon privilege: %', target;
    end if;
    if has_table_privilege('authenticated','public.' || target,'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') then
      raise exception 'direct mutation: %', target;
    end if;
  end loop;
  foreach target in array array['active_role(uuid)','can_read_lead(uuid,uuid)','check_message_reference()','touch_updated_at()','search_public_properties(uuid,text,bigint,smallint,text)'] loop
    if has_function_privilege('anon','public.' || target,'EXECUTE') then
      raise exception 'anon function privilege: %', target;
    end if;
  end loop;
  if has_function_privilege('authenticated','public.search_public_properties(uuid,text,bigint,smallint,text)','EXECUTE') then
    raise exception 'catalog RPC must be server-only';
  end if;
  if not exists (select 1 from storage.buckets where id = 'property-media' and not public) then
    raise exception 'private bucket missing';
  end if;

  insert into public.organizations(id,name,slug) values (org_a,'Schema test A',org_a::text),(org_b,'Schema test B',org_b::text);
  if not (select processing_paused from public.organizations where id = org_a) then
    raise exception 'processing must default to paused';
  end if;
  insert into auth.users(id,email,aud,role) values (actor_id,'schema-test-' || actor_id || '@example.test','authenticated','authenticated');
  insert into public.memberships(organization_id,user_id,role,display_name) values (org_a,actor_id,'owner','Schema test');
  insert into public.properties(organization_id,public_code,slug,title,description,city,area,price_rupiah,bedrooms,bathrooms,publication_status,published_at)
    values (org_a,'TEST-A','schema-test-a','Test A','Synthetic schema fixture','Bekasi','Test',9007199254740993,2,1,'published',now()) returning id into property_a;
  insert into public.properties(organization_id,public_code,slug,title,description,city,area,price_rupiah,bedrooms,bathrooms)
    values (org_b,'TEST-B','schema-test-b','Test B','Synthetic schema fixture','Bekasi','Test',1,1,1) returning id into property_b;
  if (select publication_status from public.properties where id = property_b) <> 'draft' then
    raise exception 'publication must default to draft';
  end if;
  begin
    update public.properties set price_rupiah = -1 where id = property_a;
    raise exception 'negative price accepted';
  exception when check_violation then null; end;
  begin
    insert into public.properties(organization_id,public_code,slug,title,description,city,area,price_rupiah,bedrooms,bathrooms)
      values (org_a,'TEST-A','different-slug','Duplicate','Test','Bekasi','Test',1,1,1);
    raise exception 'duplicate code accepted';
  exception when unique_violation then null; end;
  begin
    insert into public.property_private_details(organization_id,property_id) values (org_a,property_b);
    raise exception 'cross-tenant property accepted';
  exception when foreign_key_violation then null; end;

  insert into public.contacts(organization_id,demo_key) values (org_a,'schema-test') returning id into contact_a;
  insert into public.leads(organization_id,contact_id,assigned_user_id) values (org_a,contact_a,actor_id) returning id into lead_a;
  begin
    update public.leads set interested_property_id = property_b where id = lead_a;
    raise exception 'cross-tenant lead reference accepted';
  exception when foreign_key_violation then null; end;
  begin
    update public.leads set budget_min_rupiah = 2, budget_max_rupiah = 1 where id = lead_a;
    raise exception 'reversed budget accepted';
  exception when check_violation then null; end;

  insert into public.channels(organization_id,kind,label,environment) values (org_a,'simulator','Schema test','test') returning id into channel_a;
  insert into public.conversations(organization_id,lead_id,channel_id) values (org_a,lead_a,channel_a) returning id into conversation_a;
  if (select mode from public.conversations where id = conversation_a) <> 'human' then
    raise exception 'conversation must default to human';
  end if;
  insert into public.messages(organization_id,conversation_id,channel_id,direction,author_kind,body_text,inbound_sequence,processing_status,provider_message_id)
    values (org_a,conversation_a,channel_a,'inbound','customer','Schema test',1,'queued','schema-message');
  begin
    insert into public.messages(organization_id,conversation_id,channel_id,direction,author_kind,body_text,inbound_sequence,processing_status,provider_message_id)
      values (org_a,conversation_a,channel_a,'inbound','customer','Duplicate',2,'queued','schema-message');
    raise exception 'duplicate provider key accepted';
  exception when unique_violation then null; end;

  begin
    insert into public.surveys(organization_id,lead_id,property_id,agent_user_id,starts_at,ends_at,operation_key)
      values (org_a,lead_a,property_a,actor_id,'2030-01-01 10:00+07','2030-01-01 10:00+07','invalid-interval');
    raise exception 'empty survey interval accepted';
  exception when check_violation then null; end;
  insert into public.surveys(organization_id,lead_id,property_id,agent_user_id,status,starts_at,ends_at,confirmed_by_user_id,confirmed_at,operation_key)
    values (org_a,lead_a,property_a,actor_id,'confirmed','2030-01-01 10:00+07','2030-01-01 11:00+07',actor_id,now(),'first');
  begin
    insert into public.surveys(organization_id,lead_id,property_id,agent_user_id,status,starts_at,ends_at,confirmed_by_user_id,confirmed_at,operation_key)
      values (org_a,lead_a,property_a,actor_id,'confirmed','2030-01-01 10:30+07','2030-01-01 11:30+07',actor_id,now(),'overlap');
    raise exception 'overlapping surveys accepted';
  exception when exclusion_violation then null; end;
  insert into public.surveys(organization_id,lead_id,property_id,agent_user_id,status,starts_at,ends_at,confirmed_by_user_id,confirmed_at,operation_key)
    values (org_a,lead_a,property_a,actor_id,'confirmed','2030-01-01 11:00+07','2030-01-01 12:00+07',actor_id,now(),'adjacent');

  select price_rupiah, to_jsonb(p) into amount, public_row from public.search_public_properties(org_a) p where id = property_a;
  if amount is distinct from '9007199254740993' then raise exception 'bigint serialization lost precision'; end if;
  if (select array_agg(k order by k) from jsonb_object_keys(public_row) k) is distinct from
    array['area','bathrooms','bedrooms','building_area_m2','city','description','id','land_area_m2','price_rupiah','property_type','public_code','slug','title'] then
    raise exception 'public DTO fields changed';
  end if;
  if exists (select 1 from public.search_public_properties(org_a,null,9007199254740992) where id = property_a) then
    raise exception 'bigint budget filter lost precision';
  end if;
  if exists (select 1 from public.search_public_properties(org_b)) then raise exception 'draft published'; end if;
end $$;
