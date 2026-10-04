do $$
begin
  begin
    update public.properties set price_rupiah = -1 where id = '20000000-0000-4000-8000-000000000001';
    raise exception 'negative price accepted';
  exception when check_violation then null; end;
  begin
    update public.leads set interested_property_id = '20000000-0000-4000-8000-000000000010' where id = '50000000-0000-4000-8000-000000000001';
    raise exception 'cross-tenant property accepted';
  exception when foreign_key_violation then null; end;
  begin
    update public.properties set public_code = (select public_code from public.properties where id = '20000000-0000-4000-8000-000000000001') where id = '20000000-0000-4000-8000-000000000002';
    raise exception 'duplicate code accepted';
  exception when unique_violation then null; end;
  begin
    update public.contacts set phone_e164 = '+12025550123' where demo_key = 'fixture:1';
    raise exception 'mixed simulator identity accepted';
  exception when check_violation then null; end;
end $$;
