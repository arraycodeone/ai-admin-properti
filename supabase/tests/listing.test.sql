select set_config('request.jwt.claim.sub',(select user_id::text from public.memberships
  where organization_id = '10000000-0000-4000-8000-000000000001' and role = 'owner'),true);
set local role authenticated;
do $$
declare
  org_a uuid := '10000000-0000-4000-8000-000000000001';
  org_b uuid := '10000000-0000-4000-8000-000000000002';
  owner_a uuid;
  sales_a uuid;
  listing_id uuid;
  payload jsonb;
  saved jsonb;
  audit_count integer;
  first_publish timestamptz;
begin
  select user_id into owner_a from public.memberships where organization_id = org_a and role = 'owner';
  select user_id into sales_a from public.memberships where organization_id = org_a and display_name = 'Andi';
  if owner_a is null or sales_a is null then raise exception 'Seed accounts unavailable'; end if;
  perform set_config('request.jwt.claim.sub',owner_a::text,true);

  payload := jsonb_build_object(
    'public_code','TEST-LISTING','slug','test-listing','title','Listing uji owner',
    'description','Deskripsi listing uji yang cukup panjang.',
    'city','Tangerang','area','BSD','public_address',null,'property_type','house',
    'price_rupiah','9007199254740993','bedrooms',2,'bathrooms',1,
    'land_area_m2','120.50','building_area_m2','90.25','amenities',jsonb_build_array('Kolam renang'),
    'availability','active','publication_status','draft',
    'owner_name','PRIVATE_LISTING_OWNER','owner_phone_e164','+628123456789',
    'exact_address','PRIVATE_LISTING_ADDRESS','internal_notes',null
  );
  listing_id := public.save_property(org_a,null,payload);
  saved := public.get_property_for_edit(org_a,listing_id);
  if saved->>'price_rupiah' <> '9007199254740993' or saved->>'owner_name' <> 'PRIVATE_LISTING_OWNER'
    or saved->>'land_area_m2' <> '120.50' or saved->'amenities' <> '["Kolam renang"]'::jsonb then
    raise exception 'Owner read or decimal serialization incorrect';
  end if;
  if (select count(*) from public.audit_events where organization_id = org_a and entity_id = listing_id) <> 1 then
    raise exception 'Create audit missing';
  end if;
  if exists (select 1 from public.audit_events where entity_id = listing_id and changes::text like '%PRIVATE_LISTING%') then
    raise exception 'Private fields leaked into audit';
  end if;

  perform set_config('request.jwt.claim.sub',sales_a::text,true);
  if public.get_property_for_edit(org_a,listing_id) is not null then raise exception 'Sales read private edit DTO'; end if;
  begin
    perform public.save_property(org_a,listing_id,payload);
    raise exception 'Sales mutation accepted';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claim.sub',owner_a::text,true);
  if public.get_property_for_edit(org_b,listing_id) is not null then raise exception 'Cross-tenant edit DTO'; end if;
  begin
    perform public.save_property(org_b,listing_id,payload);
    raise exception 'Cross-tenant mutation accepted';
  exception when insufficient_privilege then null; end;

  perform set_config('request.jwt.claim.sub',owner_a::text,true);
  payload := jsonb_set(payload,'{publication_status}','"published"');
  perform public.save_property(org_a,listing_id,payload);
  select published_at into first_publish from public.properties where organization_id = org_a and id = listing_id;
  if first_publish is null then raise exception 'Publication timestamp missing'; end if;
  begin
    perform public.save_property(org_a,listing_id,jsonb_set(payload,'{slug}','"changed-slug"'));
    raise exception 'Published slug changed';
  exception when invalid_parameter_value then null; end;
  select count(*) into audit_count from public.audit_events where organization_id = org_a and entity_id = listing_id;
  begin
    perform public.save_property(org_a,null,jsonb_set(payload,'{slug}','"test-listing-two"'));
    raise exception 'Duplicate code accepted';
  exception when unique_violation then null; end;
  if (select count(*) from public.audit_events where organization_id = org_a and entity_id = listing_id) <> audit_count
    or (select count(*) from public.properties where organization_id = org_a and public_code = 'TEST-LISTING') <> 1 then
    raise exception 'Failed write left partial data';
  end if;
  payload := jsonb_set(payload,'{publication_status}','"archived"');
  perform public.save_property(org_a,listing_id,payload);
  if (select published_at from public.properties where organization_id = org_a and id = listing_id) is distinct from first_publish then
    raise exception 'First publication timestamp lost';
  end if;
  payload := payload || jsonb_build_object('owner_name',null,'owner_phone_e164',null,'exact_address',null,'internal_notes',null);
  perform public.save_property(org_a,listing_id,payload);
  if exists (select 1 from public.property_private_details where organization_id = org_a and property_id = listing_id) then
    raise exception 'Cleared private details persisted';
  end if;
end $$;
reset role;

do $$
begin
  if exists (select 1 from public.search_public_properties('10000000-0000-4000-8000-000000000001') where public_code = 'TEST-LISTING') then
    raise exception 'Archived listing exposed';
  end if;
  if exists (select 1 from public.audit_events where changes::text like '%PRIVATE_LISTING%') then
    raise exception 'Private marker leaked to audit';
  end if;
end $$;
