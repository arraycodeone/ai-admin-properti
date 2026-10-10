alter table public.properties add column amenities text[] not null default '{}';
alter table public.properties add constraint properties_amenities_valid check (
  cardinality(amenities) <= 20 and array_position(amenities, null) is null
);

drop function public.search_public_properties(uuid,text,bigint,smallint,text);
create function public.search_public_properties(p_organization_id uuid,p_location text default null,p_budget bigint default null,p_bedrooms smallint default null,p_type text default null)
returns table(id uuid,public_code text,slug text,title text,description text,city text,area text,property_type text,price_rupiah text,bedrooms smallint,bathrooms smallint,land_area_m2 text,building_area_m2 text,amenities text[])
language sql stable set search_path = '' as $$
  select p.id,p.public_code,p.slug,p.title,p.description,p.city,p.area,p.property_type,p.price_rupiah::text,p.bedrooms,p.bathrooms,p.land_area_m2::text,p.building_area_m2::text,p.amenities
  from public.properties p
  where p.organization_id = p_organization_id and p.availability = 'active' and p.publication_status = 'published'
    and (p_location is null or strpos(lower(p.city || ' ' || p.area),lower(p_location)) > 0)
    and (p_budget is null or p.price_rupiah <= p_budget) and (p_bedrooms is null or p.bedrooms >= p_bedrooms)
    and (p_type is null or p.property_type = p_type)
  order by p.public_code limit 50
$$;
revoke all on function public.search_public_properties(uuid,text,bigint,smallint,text) from public,anon,authenticated;
grant execute on function public.search_public_properties(uuid,text,bigint,smallint,text) to service_role;

create function public.get_property_for_edit(p_organization_id uuid,p_property_id uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'id',p.id,'public_code',p.public_code,'slug',p.slug,'title',p.title,
    'description',p.description,'city',p.city,'area',p.area,'public_address',p.public_address,
    'property_type',p.property_type,'price_rupiah',p.price_rupiah::text,
    'bedrooms',p.bedrooms,'bathrooms',p.bathrooms,
    'land_area_m2',p.land_area_m2::text,'building_area_m2',p.building_area_m2::text,
    'amenities',p.amenities,'availability',p.availability,
    'publication_status',p.publication_status,'published_at',p.published_at,
    'owner_name',d.owner_name,'owner_phone_e164',d.owner_phone_e164,
    'exact_address',d.exact_address,'internal_notes',d.internal_notes
  )
  from public.properties p left join public.property_private_details d
    on d.organization_id = p.organization_id and d.property_id = p.id
  where p.organization_id = p_organization_id and p.id = p_property_id
    and public.active_role(p_organization_id) = 'owner'
$$;
revoke all on function public.get_property_for_edit(uuid,uuid) from public,anon,authenticated;
grant execute on function public.get_property_for_edit(uuid,uuid) to authenticated;

create function public.save_property(p_organization_id uuid,p_property_id uuid,p_data jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  old_row public.properties;
  saved_id uuid;
  price_text text;
  land_text text;
  building_text text;
  amenities_value text[];
  private_name text;
  private_phone text;
  private_address text;
  private_notes text;
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m
    where m.organization_id = p_organization_id and m.user_id = auth.uid() and m.role = 'owner' and m.is_active
  ) then raise exception 'Owner access required' using errcode = '42501'; end if;

  if jsonb_typeof(p_data) is distinct from 'object' or not (p_data ?& array[
    'public_code','slug','title','description','city','area','public_address','property_type',
    'price_rupiah','bedrooms','bathrooms','land_area_m2','building_area_m2','amenities',
    'availability','publication_status','owner_name','owner_phone_e164','exact_address','internal_notes'
  ]) or exists (
    select 1 from jsonb_object_keys(p_data) k where k <> all(array[
      'public_code','slug','title','description','city','area','public_address','property_type',
      'price_rupiah','bedrooms','bathrooms','land_area_m2','building_area_m2','amenities',
      'availability','publication_status','owner_name','owner_phone_e164','exact_address','internal_notes'
    ])
  ) then raise exception 'Invalid listing fields' using errcode = '22023'; end if;

  if (p_data->>'public_code') !~ '^[A-Z0-9-]{3,24}$'
    or length(p_data->>'slug') > 100 or (p_data->>'slug') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or length(btrim(p_data->>'title')) not between 5 and 160
    or length(btrim(p_data->>'description')) not between 20 and 5000
    or length(btrim(p_data->>'city')) not between 2 and 80
    or length(btrim(p_data->>'area')) not between 2 and 80
    or length(coalesce(p_data->>'public_address','')) > 300
    or (p_data->>'property_type') not in ('house','apartment','land')
    or (p_data->>'availability') not in ('active','paused','sold')
    or (p_data->>'publication_status') not in ('draft','published','archived')
    or (p_data->>'bedrooms') !~ '^(0|[1-9][0-9]{0,2})$'
    or (p_data->>'bathrooms') !~ '^(0|[1-9][0-9]{0,2})$'
    or (p_data->>'bedrooms')::integer > 100 or (p_data->>'bathrooms')::integer > 100
  then raise exception 'Invalid listing fields' using errcode = '22023'; end if;

  price_text := p_data->>'price_rupiah';
  if jsonb_typeof(p_data->'price_rupiah') is distinct from 'string'
    or price_text !~ '^[0-9]{1,19}$' then
    raise exception 'Invalid price' using errcode = '22023';
  end if;
  land_text := nullif(p_data->>'land_area_m2','');
  building_text := nullif(p_data->>'building_area_m2','');
  if (land_text is not null and (land_text !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$' or land_text::numeric <= 0))
    or (building_text is not null and (building_text !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$' or building_text::numeric <= 0))
  then raise exception 'Invalid area' using errcode = '22023'; end if;

  if jsonb_typeof(p_data->'amenities') is distinct from 'array'
    or jsonb_array_length(p_data->'amenities') > 20
    or exists (select 1 from jsonb_array_elements(p_data->'amenities') item
      where jsonb_typeof(item) <> 'string' or length(btrim(item #>> '{}')) not between 1 and 80)
  then raise exception 'Invalid amenities' using errcode = '22023'; end if;
  select coalesce(array_agg(btrim(value)), '{}') into amenities_value
    from jsonb_array_elements_text(p_data->'amenities') value;

  private_name := nullif(btrim(p_data->>'owner_name'),'');
  private_phone := nullif(btrim(p_data->>'owner_phone_e164'),'');
  private_address := nullif(btrim(p_data->>'exact_address'),'');
  private_notes := nullif(btrim(p_data->>'internal_notes'),'');
  if length(coalesce(private_name,'')) > 160 or length(coalesce(private_address,'')) > 300
    or length(coalesce(private_notes,'')) > 2000
    or (private_phone is not null and private_phone !~ '^\+[1-9][0-9]{7,14}$')
  then raise exception 'Invalid private details' using errcode = '22023'; end if;

  if p_property_id is not null then
    select * into old_row from public.properties
      where organization_id = p_organization_id and id = p_property_id for update;
    if not found then raise exception 'Listing not found' using errcode = 'P0002'; end if;
    if old_row.published_at is not null and (old_row.public_code <> p_data->>'public_code' or old_row.slug <> p_data->>'slug') then
      raise exception 'Published identifiers cannot change' using errcode = '22023';
    end if;
    update public.properties set
      public_code = p_data->>'public_code', slug = p_data->>'slug',
      title = btrim(p_data->>'title'), description = btrim(p_data->>'description'),
      city = btrim(p_data->>'city'), area = btrim(p_data->>'area'),
      public_address = nullif(btrim(p_data->>'public_address'),''), property_type = p_data->>'property_type',
      price_rupiah = price_text::bigint, bedrooms = (p_data->>'bedrooms')::smallint,
      bathrooms = (p_data->>'bathrooms')::smallint, land_area_m2 = land_text::numeric,
      building_area_m2 = building_text::numeric, amenities = amenities_value,
      availability = p_data->>'availability', publication_status = p_data->>'publication_status',
      published_at = case when old_row.published_at is null and p_data->>'publication_status' = 'published' then now() else old_row.published_at end,
      updated_by_user_id = auth.uid()
    where organization_id = p_organization_id and id = p_property_id;
    saved_id := p_property_id;
  else
    insert into public.properties (
      organization_id,public_code,slug,title,description,city,area,public_address,property_type,
      price_rupiah,bedrooms,bathrooms,land_area_m2,building_area_m2,amenities,
      availability,publication_status,published_at,created_by_user_id,updated_by_user_id
    ) values (
      p_organization_id,p_data->>'public_code',p_data->>'slug',btrim(p_data->>'title'),
      btrim(p_data->>'description'),btrim(p_data->>'city'),btrim(p_data->>'area'),
      nullif(btrim(p_data->>'public_address'),''),p_data->>'property_type',
      price_text::bigint,(p_data->>'bedrooms')::smallint,(p_data->>'bathrooms')::smallint,
      land_text::numeric,building_text::numeric,amenities_value,
      p_data->>'availability',p_data->>'publication_status',
      case when p_data->>'publication_status' = 'published' then now() else null end,
      auth.uid(),auth.uid()
    ) returning id into saved_id;
  end if;

  if private_name is null and private_phone is null and private_address is null and private_notes is null then
    delete from public.property_private_details where organization_id = p_organization_id and property_id = saved_id;
  else
    insert into public.property_private_details(organization_id,property_id,owner_name,owner_phone_e164,exact_address,internal_notes)
    values (p_organization_id,saved_id,private_name,private_phone,private_address,private_notes)
    on conflict (organization_id,property_id) do update set
      owner_name = excluded.owner_name,owner_phone_e164 = excluded.owner_phone_e164,
      exact_address = excluded.exact_address,internal_notes = excluded.internal_notes;
  end if;

  insert into public.audit_events(organization_id,actor_kind,actor_user_id,action,entity_type,entity_id,changes)
  values (p_organization_id,'user',auth.uid(),case when p_property_id is null then 'property.create' else 'property.update' end,
    'property',saved_id,jsonb_build_object(
      'before',case when p_property_id is null then null else jsonb_build_object('title',old_row.title,'price_rupiah',old_row.price_rupiah::text,'availability',old_row.availability,'publication_status',old_row.publication_status) end,
      'after',jsonb_build_object('title',btrim(p_data->>'title'),'price_rupiah',price_text,'availability',p_data->>'availability','publication_status',p_data->>'publication_status')
    ));
  return saved_id;
end $$;
revoke all on function public.save_property(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.save_property(uuid,uuid,jsonb) to authenticated;
