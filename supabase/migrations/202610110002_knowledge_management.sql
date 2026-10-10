create function public.save_knowledge_entry(
  p_organization_id uuid,p_entry_id uuid,p_question text,p_answer text,p_visibility text,p_is_active boolean
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare saved_id uuid;
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m
    where m.organization_id = p_organization_id and m.user_id = auth.uid()
      and m.role = 'owner' and m.is_active
  ) then raise exception 'Owner access required' using errcode = '42501'; end if;
  if p_question is null or length(btrim(p_question)) not between 10 and 300
    or p_answer is null or length(btrim(p_answer)) not between 10 and 4000
    or p_visibility is null or p_visibility not in ('public','internal')
    or p_is_active is null
  then raise exception 'Invalid FAQ fields' using errcode = '22023'; end if;

  if p_entry_id is null then
    insert into public.knowledge_entries(organization_id,question,answer,visibility,is_active,updated_by_user_id)
    values (p_organization_id,btrim(p_question),btrim(p_answer),p_visibility,p_is_active,auth.uid())
    returning id into saved_id;
  else
    update public.knowledge_entries set question = btrim(p_question),answer = btrim(p_answer),
      visibility = p_visibility,is_active = p_is_active,updated_by_user_id = auth.uid()
    where organization_id = p_organization_id and id = p_entry_id
    returning id into saved_id;
    if saved_id is null then raise exception 'FAQ not found' using errcode = 'P0002'; end if;
  end if;

  insert into public.audit_events(organization_id,actor_kind,actor_user_id,action,entity_type,entity_id,changes)
  values (p_organization_id,'user',auth.uid(),case when p_entry_id is null then 'faq.create' else 'faq.update' end,
    'knowledge_entry',saved_id,jsonb_build_object('question',btrim(p_question),'visibility',p_visibility,'is_active',p_is_active));
  return saved_id;
end $$;
revoke all on function public.save_knowledge_entry(uuid,uuid,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.save_knowledge_entry(uuid,uuid,text,text,text,boolean) to authenticated;
