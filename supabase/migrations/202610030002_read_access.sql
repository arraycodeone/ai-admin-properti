create function public.active_role(p_organization_id uuid) returns text
language sql stable security definer set search_path = '' as $$
  select m.role from public.memberships m where m.organization_id = p_organization_id and m.user_id = auth.uid() and m.is_active
$$;
revoke all on function public.active_role(uuid) from public;
grant execute on function public.active_role(uuid) to authenticated;

create function public.can_read_lead(p_organization_id uuid,p_lead_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.leads l join public.memberships m on m.organization_id = l.organization_id and m.user_id = auth.uid() and m.is_active
    where l.organization_id = p_organization_id and l.id = p_lead_id and (m.role = 'owner' or l.assigned_user_id = m.user_id))
$$;
revoke all on function public.can_read_lead(uuid,uuid) from public;
grant execute on function public.can_read_lead(uuid,uuid) to authenticated;

grant select on public.organizations,public.memberships,public.channels,public.site_settings,public.properties,public.property_private_details,public.property_assets,public.knowledge_entries,public.contacts,public.leads,public.conversations,public.messages,public.surveys,public.tasks,public.audit_events,public.site_daily_metrics to authenticated;

create policy member_organization on public.organizations for select to authenticated using (public.active_role(id) is not null);
create policy own_membership on public.memberships for select to authenticated using ((user_id = auth.uid() and is_active) or public.active_role(organization_id) = 'owner');
create policy owner_channels on public.channels for select to authenticated using (public.active_role(organization_id) = 'owner');
create policy owner_settings on public.site_settings for select to authenticated using (public.active_role(organization_id) = 'owner');
create policy member_catalog on public.properties for select to authenticated using (public.active_role(organization_id) is not null);
create policy owner_private_details on public.property_private_details for select to authenticated using (public.active_role(organization_id) = 'owner');
create policy member_assets on public.property_assets for select to authenticated using (public.active_role(organization_id) = 'owner' or (public.active_role(organization_id) = 'sales' and is_public));
create policy member_knowledge on public.knowledge_entries for select to authenticated using (public.active_role(organization_id) = 'owner' or (public.active_role(organization_id) = 'sales' and visibility = 'public' and is_active));
create policy scoped_contacts on public.contacts for select to authenticated using (public.active_role(organization_id) = 'owner' or exists (select 1 from public.leads l where l.organization_id = contacts.organization_id and l.contact_id = contacts.id and public.can_read_lead(l.organization_id,l.id)));
create policy scoped_leads on public.leads for select to authenticated using (public.can_read_lead(organization_id,id));
create policy scoped_conversations on public.conversations for select to authenticated using (public.can_read_lead(organization_id,lead_id));
create policy scoped_messages on public.messages for select to authenticated using (exists (select 1 from public.conversations c where c.organization_id = messages.organization_id and c.id = messages.conversation_id and public.can_read_lead(c.organization_id,c.lead_id)));
create policy scoped_surveys on public.surveys for select to authenticated using (public.can_read_lead(organization_id,lead_id));
create policy scoped_tasks on public.tasks for select to authenticated using (public.active_role(organization_id) = 'owner' or (public.active_role(organization_id) = 'sales' and ((lead_id is not null and public.can_read_lead(organization_id,lead_id)) or (lead_id is null and assigned_user_id = auth.uid()))));
create policy owner_audit on public.audit_events for select to authenticated using (public.active_role(organization_id) = 'owner');
create policy owner_metrics on public.site_daily_metrics for select to authenticated using (public.active_role(organization_id) = 'owner');

create function public.search_public_properties(p_organization_id uuid,p_location text default null,p_budget bigint default null,p_bedrooms smallint default null,p_type text default null)
returns table(id uuid,public_code text,slug text,title text,description text,city text,area text,property_type text,price_rupiah text,bedrooms smallint,bathrooms smallint,land_area_m2 text,building_area_m2 text)
language sql stable set search_path = '' as $$
  select p.id,p.public_code,p.slug,p.title,p.description,p.city,p.area,p.property_type,p.price_rupiah::text,p.bedrooms,p.bathrooms,p.land_area_m2::text,p.building_area_m2::text
  from public.properties p
  where p.organization_id = p_organization_id and p.availability = 'active' and p.publication_status = 'published'
    and (p_location is null or strpos(lower(p.city || ' ' || p.area),lower(p_location)) > 0)
    and (p_budget is null or p.price_rupiah <= p_budget) and (p_bedrooms is null or p.bedrooms >= p_bedrooms)
    and (p_type is null or p.property_type = p_type)
  order by p.public_code limit 50
$$;
revoke all on function public.search_public_properties(uuid,text,bigint,smallint,text) from public,anon,authenticated;
grant execute on function public.search_public_properties(uuid,text,bigint,smallint,text) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('property-media','property-media',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Mutations and Storage policies remain closed until their feature RPCs are implemented.
