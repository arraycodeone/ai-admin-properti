create extension if not exists btree_gist;

create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  timezone text not null default 'Asia/Jakarta' check (timezone = 'Asia/Jakarta'),
  is_demo boolean not null default true, default_sales_user_id uuid,
  processing_paused boolean not null default true, processing_epoch bigint not null default 1 check (processing_epoch > 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations(id), user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','sales')), display_name text not null,
  is_active boolean not null default true, primary key (organization_id,user_id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index memberships_user_idx on public.memberships(user_id,is_active);
alter table public.organizations add foreign key (id,default_sales_user_id) references public.memberships(organization_id,user_id);

create table public.channels (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  kind text not null check (kind in ('whatsapp','simulator')), label text not null,
  environment text not null check (environment in ('test','production')),
  status text not null default 'paused' check (status in ('ready','paused','needs_attention')),
  provider_phone_number_id text unique, public_phone_e164 text,
  unique (organization_id,id),
  check ((kind = 'whatsapp' and provider_phone_number_id is not null and public_phone_e164 is not null and public_phone_e164 ~ '^\+[1-9][0-9]{7,14}$') or
    (kind = 'simulator' and provider_phone_number_id is null and public_phone_e164 is null)),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.site_settings (
  organization_id uuid primary key references public.organizations(id), brand_name text not null,
  headline text not null, about_text text not null, canonical_origin text not null unique,
  logo_path text, public_contact_text text, cta_channel_id uuid,
  seo_title text not null, seo_description text not null, privacy_text text not null,
  indexing_enabled boolean not null default false,
  foreign key (organization_id,cta_channel_id) references public.channels(organization_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  public_code text not null check (public_code ~ '^[A-Z0-9-]{3,24}$'),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null, description text not null, city text not null, area text not null, public_address text,
  property_type text not null default 'house' check (property_type in ('house','apartment','land')),
  price_rupiah bigint not null check (price_rupiah >= 0),
  bedrooms smallint not null check (bedrooms >= 0), bathrooms smallint not null check (bathrooms >= 0),
  land_area_m2 numeric(12,2) check (land_area_m2 > 0), building_area_m2 numeric(12,2) check (building_area_m2 > 0),
  availability text not null default 'active' check (availability in ('active','paused','sold')),
  publication_status text not null default 'draft' check (publication_status in ('draft','published','archived')),
  published_at timestamptz, seo_title text, seo_description text, created_by_user_id uuid, updated_by_user_id uuid,
  unique (organization_id,id), unique (organization_id,public_code), unique (organization_id,slug),
  foreign key (organization_id,created_by_user_id) references public.memberships(organization_id,user_id),
  foreign key (organization_id,updated_by_user_id) references public.memberships(organization_id,user_id),
  check (publication_status <> 'published' or published_at is not null),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index properties_catalog_idx on public.properties(organization_id,city,area,price_rupiah) where availability = 'active' and publication_status = 'published';

create table public.property_private_details (
  organization_id uuid not null references public.organizations(id), property_id uuid not null,
  owner_name text, owner_phone_e164 text, exact_address text, internal_notes text,
  primary key (organization_id,property_id), foreign key (organization_id,property_id) references public.properties(organization_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.property_assets (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  property_id uuid not null, storage_path text not null unique, alt_text text not null,
  sort_order integer not null check (sort_order >= 0), is_public boolean not null default false, is_cover boolean not null default false,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 10485760),
  unique (organization_id,id), unique (organization_id,property_id,sort_order),
  foreign key (organization_id,property_id) references public.properties(organization_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index property_assets_cover_idx on public.property_assets(organization_id,property_id) where is_cover;

create table public.knowledge_entries (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  question text not null, answer text not null, visibility text not null check (visibility in ('public','internal')),
  is_active boolean not null default false, updated_by_user_id uuid,
  unique (organization_id,id), foreign key (organization_id,updated_by_user_id) references public.memberships(organization_id,user_id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  display_name text, phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'), demo_key text, archived_at timestamptz,
  unique (organization_id,id), unique (organization_id,phone_e164), unique (organization_id,demo_key),
  check (num_nonnulls(phone_e164,demo_key) = 1),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), contact_id uuid not null,
  assigned_user_id uuid, stage text not null default 'new' check (stage in ('new','qualifying','contacted','survey_scheduled','visited','negotiating','won','lost')),
  budget_min_rupiah bigint check (budget_min_rupiah >= 0), budget_max_rupiah bigint check (budget_max_rupiah >= 0),
  preferred_area text, summary text, min_bedrooms smallint check (min_bedrooms >= 0), interested_property_id uuid,
  source_channel_id uuid, source_message_id uuid, source_kind text not null default 'unknown' check (source_kind in ('unknown','website_message','whatsapp_direct','simulator','manual')),
  source_evidence text, closed_at timestamptz,
  unique (organization_id,id), unique (organization_id,contact_id),
  foreign key (organization_id,contact_id) references public.contacts(organization_id,id),
  foreign key (organization_id,assigned_user_id) references public.memberships(organization_id,user_id),
  foreign key (organization_id,interested_property_id) references public.properties(organization_id,id),
  foreign key (organization_id,source_channel_id) references public.channels(organization_id,id),
  check (budget_min_rupiah <= budget_max_rupiah),
  check ((stage in ('won','lost')) = (closed_at is not null)),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index leads_assignment_idx on public.leads(organization_id,assigned_user_id,stage,updated_at);

create table public.conversations (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), lead_id uuid not null, channel_id uuid not null,
  status text not null default 'open' check (status in ('open','closed')), mode text not null default 'human' check (mode in ('ai','human')),
  control_version bigint not null default 1 check (control_version > 0), handoff_status text not null default 'none' check (handoff_status in ('none','requested','completed')),
  handoff_reason text, handoff_requested_by_user_id uuid, handoff_requested_at timestamptz, handoff_completed_at timestamptz,
  last_customer_message_at timestamptz, next_inbound_sequence bigint not null default 1 check (next_inbound_sequence > 0),
  processed_through_sequence bigint not null default 0 check (processed_through_sequence >= 0), active_message_id uuid,
  processing_token uuid, processing_lease_expires_at timestamptz, processing_generation bigint not null default 0 check (processing_generation >= 0),
  unique (organization_id,id), unique (organization_id,id,channel_id), unique (organization_id,lead_id,id), unique (organization_id,channel_id,lead_id),
  foreign key (organization_id,lead_id) references public.leads(organization_id,id),
  foreign key (organization_id,channel_id) references public.channels(organization_id,id),
  foreign key (organization_id,handoff_requested_by_user_id) references public.memberships(organization_id,user_id),
  check (processed_through_sequence < next_inbound_sequence),
  check (handoff_status <> 'completed' or (mode = 'human' and handoff_completed_at is not null)),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index conversations_status_idx on public.conversations(organization_id,status,updated_at);

create table public.messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), conversation_id uuid not null, channel_id uuid not null,
  direction text not null check (direction in ('inbound','outbound')), author_kind text not null check (author_kind in ('customer','ai','user')), author_user_id uuid,
  body_text text not null check (length(body_text) <= 16000), content_kind text not null default 'text' check (content_kind in ('text','unsupported')),
  provider_message_id text, provider_timestamp timestamptz, received_at timestamptz, inbound_sequence bigint,
  processing_status text check (processing_status in ('queued','running','processed','failed','skipped')),
  delivery_status text check (delivery_status in ('pending','accepted','delivered','read','failed','unknown','cancelled')),
  accepted_at timestamptz, delivered_at timestamptz, read_at timestamptz,
  unique (organization_id,id), unique (organization_id,conversation_id,id), unique (organization_id,channel_id,id),
  foreign key (organization_id,conversation_id,channel_id) references public.conversations(organization_id,id,channel_id),
  foreign key (organization_id,author_user_id) references public.memberships(organization_id,user_id),
  check ((author_kind = 'user') = (author_user_id is not null)),
  check ((direction = 'inbound' and author_kind = 'customer' and inbound_sequence is not null and inbound_sequence > 0 and processing_status is not null and delivery_status is null) or
    (direction = 'outbound' and author_kind in ('ai','user') and inbound_sequence is null and processing_status is null and delivery_status is not null)),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index messages_provider_idx on public.messages(organization_id,channel_id,provider_message_id) where provider_message_id is not null;
create unique index messages_sequence_idx on public.messages(organization_id,conversation_id,inbound_sequence) where direction = 'inbound';
create index messages_history_idx on public.messages(organization_id,conversation_id,created_at,id);
alter table public.leads add foreign key (organization_id,source_message_id) references public.messages(organization_id,id);
alter table public.conversations add foreign key (organization_id,id,active_message_id) references public.messages(organization_id,conversation_id,id);

create table public.surveys (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  lead_id uuid not null, property_id uuid not null, agent_user_id uuid not null,
  status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled')),
  starts_at timestamptz not null, ends_at timestamptz not null, confirmed_by_user_id uuid, confirmed_at timestamptz,
  visit_notes text, result_notes text, cancellation_reason text, completed_at timestamptz, operation_key text not null,
  unique (organization_id,id), unique (organization_id,operation_key),
  foreign key (organization_id,lead_id) references public.leads(organization_id,id),
  foreign key (organization_id,property_id) references public.properties(organization_id,id),
  foreign key (organization_id,agent_user_id) references public.memberships(organization_id,user_id),
  foreign key (organization_id,confirmed_by_user_id) references public.memberships(organization_id,user_id),
  check (ends_at > starts_at), check (status not in ('confirmed','completed') or (confirmed_by_user_id is not null and confirmed_at is not null)),
  check ((status = 'completed') = (completed_at is not null)),
  check (status <> 'cancelled' or nullif(trim(cancellation_reason),'') is not null),
  exclude using gist (organization_id with =, agent_user_id with =, tstzrange(starts_at,ends_at,'[)') with &&) where (status in ('confirmed','completed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index surveys_agent_idx on public.surveys(organization_id,agent_user_id,starts_at);

create table public.tasks (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), lead_id uuid, conversation_id uuid, assigned_user_id uuid,
  kind text not null check (kind in ('follow_up','survey_reminder','ai_error','provider_error','unassigned_lead')),
  title text not null, description text, status text not null default 'open' check (status in ('open','done','cancelled')),
  due_at timestamptz not null, completed_at timestamptz, operation_key text not null,
  unique (organization_id,id), unique (organization_id,operation_key),
  foreign key (organization_id,lead_id) references public.leads(organization_id,id),
  foreign key (organization_id,lead_id,conversation_id) references public.conversations(organization_id,lead_id,id),
  foreign key (organization_id,assigned_user_id) references public.memberships(organization_id,user_id),
  check (conversation_id is null or lead_id is not null), check ((status = 'done') = (completed_at is not null)),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index tasks_due_idx on public.tasks(organization_id,assigned_user_id,due_at) where status = 'open';

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), channel_id uuid not null,
  event_key text not null, event_kind text not null check (event_kind in ('incoming_message','delivery_status','unsupported')),
  provider_message_id text, provider_status text, message_id uuid, occurred_at timestamptz, received_at timestamptz not null default now(), payload jsonb,
  status text not null default 'stored' check (status in ('stored','processed','failed')), processed_at timestamptz, last_error_code text,
  unique (organization_id,id), unique (organization_id,channel_id,event_key),
  foreign key (organization_id,channel_id) references public.channels(organization_id,id),
  foreign key (organization_id,channel_id,message_id) references public.messages(organization_id,channel_id,id),
  created_at timestamptz not null default now()
);
create index webhook_events_pending_idx on public.webhook_events(status,received_at);
create index webhook_events_provider_idx on public.webhook_events(organization_id,channel_id,provider_message_id);

create table public.job_outbox (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), webhook_event_id uuid, conversation_id uuid,
  kind text not null check (kind in ('process_message','send_message','process_status')), operation_key text not null, payload jsonb not null,
  organization_epoch bigint not null check (organization_epoch > 0),
  dispatch_status text not null default 'pending' check (dispatch_status in ('pending','publishing','published')),
  execution_status text not null default 'queued' check (execution_status in ('queued','running','succeeded','failed','cancelled')),
  dispatch_attempts integer not null default 0 check (dispatch_attempts >= 0), run_attempts integer not null default 0 check (run_attempts >= 0),
  next_dispatch_at timestamptz not null default now(), next_run_at timestamptz not null default now(), last_run_activity_at timestamptz not null default now(),
  publish_token uuid, publish_lease_expires_at timestamptz, run_token uuid, run_lease_expires_at timestamptz,
  published_at timestamptz, started_at timestamptz, finished_at timestamptz, last_error_code text,
  unique (organization_id,id), unique (organization_id,operation_key),
  foreign key (organization_id,webhook_event_id) references public.webhook_events(organization_id,id),
  foreign key (organization_id,conversation_id) references public.conversations(organization_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index job_outbox_dispatch_idx on public.job_outbox(dispatch_status,next_dispatch_at);
create index job_outbox_execution_idx on public.job_outbox(execution_status,next_run_at);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), conversation_id uuid not null, trigger_message_id uuid not null,
  run_key text not null, control_version bigint not null check (control_version > 0), organization_epoch bigint not null check (organization_epoch > 0), processing_generation bigint not null check (processing_generation >= 0),
  status text not null check (status in ('queued','running','succeeded','failed','cancelled')), model_id text not null, prompt_version text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0), output_tokens integer not null default 0 check (output_tokens >= 0),
  tool_call_count integer not null default 0 check (tool_call_count >= 0), duration_ms integer check (duration_ms >= 0), estimated_cost_usd numeric(12,6) check (estimated_cost_usd >= 0),
  started_at timestamptz, finished_at timestamptz, handoff_reason text, error_code text, result_summary text, public_evidence jsonb,
  unique (organization_id,id), unique (organization_id,conversation_id,id), unique (organization_id,run_key),
  foreign key (organization_id,conversation_id) references public.conversations(organization_id,id),
  foreign key (organization_id,conversation_id,trigger_message_id) references public.messages(organization_id,conversation_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.outbox (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), conversation_id uuid not null, message_id uuid not null,
  operation_key text not null, ai_run_id uuid, control_version bigint not null check (control_version > 0), organization_epoch bigint not null check (organization_epoch > 0),
  status text not null default 'pending' check (status in ('pending','sending','sent','unknown','failed','cancelled')),
  attempt_count integer not null default 0 check (attempt_count >= 0), next_attempt_at timestamptz, request_started_at timestamptz, finished_at timestamptz, claim_token uuid, last_error_code text,
  unique (organization_id,id), unique (organization_id,message_id), unique (organization_id,operation_key),
  foreign key (organization_id,conversation_id) references public.conversations(organization_id,id),
  foreign key (organization_id,conversation_id,message_id) references public.messages(organization_id,conversation_id,id),
  foreign key (organization_id,conversation_id,ai_run_id) references public.ai_runs(organization_id,conversation_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index outbox_pending_idx on public.outbox(status,next_attempt_at);

create table public.ai_tool_calls (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), ai_run_id uuid not null, call_key text not null,
  operation_key text not null, tool_name text not null, validated_arguments jsonb not null, result jsonb,
  status text not null default 'prepared' check (status in ('prepared','succeeded','failed','cancelled')), error_code text, finished_at timestamptz,
  unique (organization_id,id), unique (organization_id,ai_run_id,call_key), unique (organization_id,operation_key),
  foreign key (organization_id,ai_run_id) references public.ai_runs(organization_id,id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  actor_kind text not null check (actor_kind in ('user','system','ai')), actor_user_id uuid, action text not null, entity_type text not null, entity_id uuid,
  operation_key text, changes jsonb not null, unique (organization_id,id),
  foreign key (organization_id,actor_user_id) references public.memberships(organization_id,user_id),
  check ((actor_kind = 'user') = (actor_user_id is not null)), created_at timestamptz not null default now()
);

create table public.site_daily_metrics (
  organization_id uuid not null references public.organizations(id), metric_date date not null,
  page_key text not null check (page_key = 'home' or page_key ~ '^property:[0-9a-f-]{36}$'),
  event_name text not null check (event_name = 'cta_click'), count bigint not null default 0 check (count >= 0),
  primary key (organization_id,metric_date,page_key,event_name), updated_at timestamptz not null default now()
);

create function public.check_message_reference() returns trigger language plpgsql set search_path = '' as $$
declare msg public.messages; related_lead uuid;
begin
  if tg_table_name = 'leads' then
    if new.source_message_id is not null then
      select c.lead_id into related_lead from public.messages m join public.conversations c on c.id = m.conversation_id where m.id = new.source_message_id;
      if related_lead is distinct from new.id then raise exception 'source_message must belong to lead' using errcode = '23514'; end if;
    end if;
  elsif tg_table_name = 'conversations' then
    if new.active_message_id is not null then
      select * into msg from public.messages where id = new.active_message_id;
      if msg.direction is distinct from 'inbound' then raise exception 'active_message must be inbound' using errcode = '23514'; end if;
    end if;
  elsif tg_table_name = 'outbox' then
    select * into msg from public.messages where id = new.message_id;
    if msg.direction is distinct from 'outbound' or (msg.author_kind = 'ai') <> (new.ai_run_id is not null) then raise exception 'invalid outbound message' using errcode = '23514'; end if;
  elsif tg_table_name = 'ai_runs' then
    select * into msg from public.messages where id = new.trigger_message_id;
    if msg.direction is distinct from 'inbound' then raise exception 'AI trigger must be inbound' using errcode = '23514'; end if;
  end if;
  return new;
end $$;
create constraint trigger leads_source_check after insert or update on public.leads deferrable initially immediate for each row execute function public.check_message_reference();
create constraint trigger conversation_message_check after insert or update on public.conversations deferrable initially immediate for each row execute function public.check_message_reference();
create constraint trigger outbox_message_check after insert or update on public.outbox deferrable initially immediate for each row execute function public.check_message_reference();
create constraint trigger ai_message_check after insert or update on public.ai_runs deferrable initially immediate for each row execute function public.check_message_reference();

create function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['organizations','memberships','channels','site_settings','properties','property_private_details','property_assets','knowledge_entries','contacts','leads','conversations','messages','surveys','tasks','webhook_events','job_outbox','ai_runs','outbox','ai_tool_calls','audit_events','site_daily_metrics'] loop
    execute format('alter table public.%I enable row level security',table_name);
    execute format('revoke all on public.%I from anon, authenticated',table_name);
    execute format('grant all on public.%I to service_role',table_name);
    if table_name not in ('webhook_events','audit_events') then
      execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',table_name);
    end if;
  end loop;
end $$;
revoke execute on function public.check_message_reference() from public;
revoke execute on function public.touch_updated_at() from public;
