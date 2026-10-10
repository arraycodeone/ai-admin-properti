import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { testDatabaseConfig } from "../../scripts/test-database";
import type { Database } from "../../src/types/database";

const run = randomUUID();
const organizations = [randomUUID(), randomUUID()];
const propertyIds = [randomUUID(), randomUUID()];
const contactIds = [randomUUID(), randomUUID(), randomUUID()];
const leadIds = [randomUUID(), randomUUID(), randomUUID()];
const channelIds = [randomUUID(), randomUUID()];
const assetIds = [randomUUID(), randomUUID(), randomUUID()];
const knowledgeIds = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];
const conversationIds = [randomUUID(), randomUUID(), randomUUID()];
const messageIds = [randomUUID(), randomUUID(), randomUUID()];
const surveyIds = [randomUUID(), randomUUID(), randomUUID()];
const taskIds = [randomUUID(), randomUUID(), randomUUID()];
const auditIds = [randomUUID(), randomUUID()];
const storagePath = `${organizations[0]}/${propertyIds[0]}/public.webp`;
const accounts = [
  { name: "Owner A", role: "owner", org: 0, active: true },
  { name: "Andi", role: "sales", org: 0, active: true },
  { name: "Sari", role: "sales", org: 0, active: true },
  { name: "Tidak aktif", role: "sales", org: 0, active: false },
  { name: "Owner B", role: "owner", org: 1, active: true },
];
const tables = ["organizations", "memberships", "channels", "site_settings", "properties", "property_private_details", "property_assets", "knowledge_entries", "contacts", "leads", "conversations", "messages", "surveys", "tasks", "webhook_events", "job_outbox", "outbox", "ai_runs", "ai_tool_calls", "audit_events", "site_daily_metrics"] as const;
const users: string[] = [];
const sessions: ReturnType<typeof createClient<Database>>[] = [];
let database: pg.Client | undefined;
let admin: ReturnType<typeof createClient<Database>> | undefined;
let stage = "konfigurasi";
let connected = false;
let uploaded = false;

function client(key: string) {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000), redirect: "error" }) },
  });
}

function denied(result: { error: { code?: string } | null }) {
  assert.equal(result.error?.code, "42501", "Operasi harus ditolak oleh izin database.");
}

try {
  const config = testDatabaseConfig();
  assert.ok(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SECRET_KEY);
  assert.equal(process.argv.length, 2, "Tidak menerima argumen.");
  database = new pg.Client(config);
  stage = "audit grant dan target";
  await database.connect();
  connected = true;
  const existing = await database.query("select is_demo, processing_paused from public.organizations");
  assert.ok(existing.rows.every(row => row.is_demo && row.processing_paused), "Target berisi organisasi non-demo atau aktif.");
  for (const table of tables) {
    const grants: pg.QueryResult<{ rls: boolean; anon: boolean; mutation: boolean }> = await database.query(`select
      (select relrowsecurity from pg_class where oid = $1::regclass) as rls,
      has_table_privilege('anon', $1, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as anon,
      has_table_privilege('authenticated', $1, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as mutation`, [`public.${table}`]);
    assert.deepEqual(grants.rows[0], { rls: true, anon: false, mutation: false });
  }
  const { rows: functions } = await database.query(`select p.proname, p.prosecdef, p.proconfig,
    has_function_privilege('anon', p.oid, 'EXECUTE') as anon,
    has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = any($1::text[])`,
  [["active_role", "can_read_lead", "search_public_properties", "check_message_reference", "touch_updated_at"]]);
  assert.equal(functions.length, 5);
  for (const fn of functions) {
    assert.equal(fn.anon, false);
    assert.equal(fn.authenticated, ["active_role", "can_read_lead"].includes(fn.proname));
    assert.ok(fn.proconfig?.includes('search_path=""'));
    assert.equal(fn.prosecdef, ["active_role", "can_read_lead"].includes(fn.proname));
  }
  const bucket = await database.query("select public from storage.buckets where id = 'property-media'");
  assert.deepEqual(bucket.rows, [{ public: false }]);
  const policies = await database.query("select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'");
  assert.equal(policies.rowCount, 0, "Policy Storage perlu ditinjau ulang saat fitur upload tersedia.");
  console.log("PASS: RLS/grant 21 tabel, 5 fungsi, bucket privat dan Storage tertutup.");

  stage = "akun Auth sementara";
  admin = client(process.env.SUPABASE_SECRET_KEY!);
  for (const index of accounts.keys()) {
    const email = `access-${run}-${index}@example.test`;
    const password = `${randomBytes(32).toString("base64url")}aA1!`;
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { access_test_run: run } });
    assert.equal(created.error, null);
    users.push(created.data.user!.id);
    const session = client(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
    sessions.push(session);
    const login = await session.auth.signInWithPassword({ email, password });
    assert.equal(login.error, null);
    const verified = await session.auth.getUser();
    assert.equal(verified.error, null);
    assert.equal(verified.data.user?.id, users[index]);
  }

  stage = "fixture akses sementara";
  await database.query("begin");
  for (const [index, org] of organizations.entries()) {
    await database.query("insert into public.organizations(id,name,slug) values ($1,$2,$3)", [org, `Access test ${index}`, `access-${run}-${index}`]);
    await database.query(`insert into public.properties(id,organization_id,public_code,slug,title,description,city,area,price_rupiah,bedrooms,bathrooms)
      values ($1,$2,'ACCESS-TEST','access-test','Synthetic access test','Synthetic fixture','Test','Test',1,1,1)`, [propertyIds[index], org]);
    await database.query("insert into public.property_private_details(organization_id,property_id,owner_name) values ($1,$2,'PRIVATE_ACCESS_TEST')", [org, propertyIds[index]]);
    await database.query("insert into public.channels(id,organization_id,kind,label,environment) values ($1,$2,'simulator','Access test','test')", [channelIds[index], org]);
    await database.query(`insert into public.site_settings(organization_id,brand_name,headline,about_text,canonical_origin,seo_title,seo_description,privacy_text)
      values ($1,'Access test','Test','Test',$2,'Test','Test','Test')`, [org, `https://access-${run}-${index}.example.test`]);
    await database.query(`insert into public.property_assets(id,organization_id,property_id,storage_path,alt_text,sort_order,is_public,mime_type,byte_size)
      values ($1,$2,$3,$4,'Access test',0,true,'image/webp',1)`, [assetIds[index], org, propertyIds[index], `${org}/${propertyIds[index]}/public.webp`]);
    await database.query(`insert into public.knowledge_entries(id,organization_id,question,answer,visibility,is_active)
      values ($1,$2,'Access question','Access answer','public',true),($3,$2,'Private question','Private answer','internal',true)`, [knowledgeIds[index * 2], org, knowledgeIds[index * 2 + 1]]);
    await database.query(`insert into public.audit_events(id,organization_id,actor_kind,action,entity_type,changes)
      values ($1,$2,'system','access_test','organization','{}')`, [auditIds[index], org]);
    await database.query(`insert into public.site_daily_metrics(organization_id,metric_date,page_key,event_name)
      values ($1,'2026-01-01','home','cta_click')`, [org]);
  }
  await database.query(`insert into public.property_assets(id,organization_id,property_id,storage_path,alt_text,sort_order,is_public,mime_type,byte_size)
    values ($1,$2,$3,$4,'Private access test',1,false,'image/webp',1)`, [assetIds[2], organizations[0], propertyIds[0], `${organizations[0]}/${propertyIds[0]}/private.webp`]);
  for (const [index, account] of accounts.entries()) {
    await database.query("insert into public.memberships(organization_id,user_id,role,display_name,is_active) values ($1,$2,$3,$4,$5)", [organizations[account.org], users[index], account.role, account.name, account.active]);
  }
  for (const [index, assigned] of [1, 2, 4].entries()) {
    const org = organizations[accounts[assigned].org];
    await database.query("insert into public.contacts(id,organization_id,demo_key) values ($1,$2,$3)", [contactIds[index], org, `access-${run}-${index}`]);
    await database.query("insert into public.leads(id,organization_id,contact_id,assigned_user_id) values ($1,$2,$3,$4)", [leadIds[index], org, contactIds[index], users[assigned]]);
    await database.query(`insert into public.conversations(id,organization_id,lead_id,channel_id)
      values ($1,$2,$3,$4)`, [conversationIds[index], org, leadIds[index], channelIds[accounts[assigned].org]]);
    await database.query(`insert into public.messages(id,organization_id,conversation_id,channel_id,direction,author_kind,body_text,inbound_sequence,processing_status)
      values ($1,$2,$3,$4,'inbound','customer','Access test',1,'processed')`, [messageIds[index], org, conversationIds[index], channelIds[accounts[assigned].org]]);
    await database.query(`insert into public.surveys(id,organization_id,lead_id,property_id,agent_user_id,starts_at,ends_at,operation_key)
      values ($1,$2,$3,$4,$5,'2026-01-01T10:00:00Z','2026-01-01T11:00:00Z',$6)`, [surveyIds[index], org, leadIds[index], propertyIds[accounts[assigned].org], users[assigned], `access-${run}-${index}`]);
    await database.query(`insert into public.tasks(id,organization_id,lead_id,assigned_user_id,kind,title,due_at,operation_key)
      values ($1,$2,$3,$4,'follow_up','Access test','2026-01-01T10:00:00Z',$5)`, [taskIds[index], org, leadIds[index], users[assigned], `access-${run}-${index}`]);
  }
  await database.query("commit");

  stage = "objek Storage sementara";
  const storage = admin.storage.from("property-media");
  uploaded = true;
  const upload = await storage.upload(storagePath, Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "base64"), { contentType: "image/webp" });
  assert.equal(upload.error, null);
  const adminDownload = await storage.download(storagePath);
  assert.equal(adminDownload.error, null);

  for (const [index, session] of sessions.entries()) {
    stage = `akses ${accounts[index].name}`;
    const account = accounts[index];
    const catalog = await session.from("properties").select("id").in("organization_id", organizations);
    assert.equal(catalog.error, null);
    assert.deepEqual(catalog.data?.map(row => row.id), account.active ? [propertyIds[account.org]] : []);
    const leads = await session.from("leads").select("id").in("organization_id", organizations);
    const expected = index === 0 ? [0, 1] : index === 1 ? [0] : index === 2 ? [1] : index === 4 ? [2] : [];
    assert.equal(leads.error, null);
    assert.deepEqual(leads.data?.map(row => row.id).sort(), expected.map(i => leadIds[i]).sort());
    const contacts = await session.from("contacts").select("id").in("organization_id", organizations);
    assert.equal(contacts.error, null);
    assert.deepEqual(contacts.data?.map(row => row.id).sort(), expected.map(i => contactIds[i]).sort());
    const privateRows = await session.from("property_private_details").select("property_id").in("organization_id", organizations);
    assert.equal(privateRows.error, null);
    assert.deepEqual(privateRows.data?.map(row => row.property_id), account.role === "owner" ? [propertyIds[account.org]] : []);
    const ownerOrganizations = account.active && account.role === "owner" ? [organizations[account.org]] : [];
    for (const table of ["channels", "site_settings", "audit_events", "site_daily_metrics"] as const) {
      const rows = await session.from(table).select("organization_id").in("organization_id", organizations);
      assert.equal(rows.error, null);
      assert.deepEqual(rows.data?.map(row => row.organization_id), ownerOrganizations, `${table}: ${account.name}`);
    }
    const visibleMembers = index === 0 ? users.slice(0, 4) : account.active ? [users[index]] : [];
    const members = await session.from("memberships").select("user_id").in("organization_id", organizations);
    assert.equal(members.error, null);
    assert.deepEqual(members.data?.map(row => row.user_id).sort(), visibleMembers.sort());
    const assets = await session.from("property_assets").select("id").in("organization_id", organizations);
    assert.equal(assets.error, null);
    assert.deepEqual(assets.data?.map(row => row.id).sort(),
      !account.active ? [] : account.org === 1 ? [assetIds[1]] : account.role === "owner" ? [assetIds[0], assetIds[2]].sort() : [assetIds[0]]);
    const knowledge = await session.from("knowledge_entries").select("id").in("organization_id", organizations);
    assert.equal(knowledge.error, null);
    assert.deepEqual(knowledge.data?.map(row => row.id).sort(),
      !account.active ? [] : account.org === 1 ? [knowledgeIds[2], knowledgeIds[3]].sort() : account.role === "owner" ? [knowledgeIds[0], knowledgeIds[1]].sort() : [knowledgeIds[0]]);
    for (const table of ["conversations", "messages", "surveys", "tasks"] as const) {
      const ids = { conversations: conversationIds, messages: messageIds, surveys: surveyIds, tasks: taskIds }[table];
      const rows = await session.from(table).select("id").in("organization_id", organizations);
      assert.equal(rows.error, null);
      assert.deepEqual(rows.data?.map(row => row.id).sort(), expected.map(i => ids[i]).sort(), `${table}: ${account.name}`);
    }
    const membership = await session.from("memberships").select("role").eq("organization_id", organizations[0]).eq("user_id", users[index]).eq("is_active", true).maybeSingle();
    assert.equal(membership.error, null);
    assert.equal(membership.data?.role ?? null, account.active && account.org === 0 ? account.role : null);
    const foreignLead = await session.from("leads").select("id").eq("id", leadIds[account.org === 0 ? 2 : 0]);
    assert.equal(foreignLead.error, null);
    assert.deepEqual(foreignLead.data, []);
    const role = await session.rpc("active_role", { p_organization_id: organizations[1 - account.org] });
    assert.equal(role.error, null);
    assert.equal(role.data, null);
    const canReadOwnLead = await session.rpc("can_read_lead", { p_organization_id: organizations[0], p_lead_id: leadIds[0] });
    assert.equal(canReadOwnLead.error, null);
    assert.equal(canReadOwnLead.data, index === 0 || index === 1);
    const canReadForeignLead = await session.rpc("can_read_lead", { p_organization_id: organizations[1 - account.org], p_lead_id: leadIds[account.org === 0 ? 2 : 0] });
    assert.equal(canReadForeignLead.error, null);
    assert.equal(canReadForeignLead.data, false);
    denied(await session.from("memberships").update({ role: "owner", is_active: true }).eq("user_id", users[index]));
    denied(await session.from("leads").update({ assigned_user_id: users[index] }).eq("id", leadIds[0]));
    denied(await session.from("properties").update({ organization_id: organizations[1] }).eq("id", propertyIds[0]));
    denied(await session.from("memberships").insert({ organization_id: organizations[1 - account.org], user_id: users[index], role: "owner", display_name: "Forbidden" }));
    denied(await session.from("leads").delete().eq("id", leadIds[0]));
    denied(await session.rpc("search_public_properties", { p_organization_id: organizations[0] }));
    const objects = await session.storage.from("property-media").list(organizations[0]);
    assert.equal(objects.error, null);
    assert.deepEqual(objects.data, []);
    const download = await session.storage.from("property-media").download(storagePath);
    assert.notEqual(download.error, null, "Objek Storage tanpa policy tidak boleh diunduh.");
    console.log(`PASS: ${account.name}, scope organisasi/lead/kontak/privat, membership, mutasi dan RPC tertutup.`);
  }
  stage = "anon";
  const anon = client(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  for (const table of tables) denied(await anon.from(table).select("*").limit(1));
  denied(await anon.rpc("active_role", { p_organization_id: organizations[0] }));
  denied(await anon.rpc("can_read_lead", { p_organization_id: organizations[0], p_lead_id: leadIds[0] }));
  denied(await anon.rpc("search_public_properties", { p_organization_id: organizations[0] }));
  assert.notEqual((await anon.storage.from("property-media").download(storagePath)).error, null);
  console.log("PASS: anon ditolak pada 21 tabel dan seluruh RPC pembaca.");

  stage = "pencabutan membership dengan sesi yang sama";
  await database.query("update public.memberships set is_active = false where organization_id = $1 and user_id = $2", [organizations[0], users[1]]);
  const revoked = await sessions[1].from("leads").select("id").in("organization_id", organizations);
  assert.equal(revoked.error, null);
  assert.deepEqual(revoked.data, []);
  console.log("PASS: menonaktifkan membership mencabut akses pada request berikutnya dengan sesi lama.");
} catch {
  console.error(`${stage === "konfigurasi" ? "NOT RUN" : "FAIL"}: ${stage}. Respons, identitas login dan kredensial tidak dicetak.`);
  process.exitCode = 1;
} finally {
  let cleaned = true;
  if (database && connected) {
    try {
      await database.query("rollback");
      await database.query("begin");
      for (const table of ["tasks", "surveys", "messages", "conversations", "leads", "contacts", "knowledge_entries", "property_assets", "property_private_details", "site_daily_metrics", "audit_events", "site_settings", "channels", "properties", "memberships"]) {
        await database.query(`delete from public.${table} where organization_id = any($1::uuid[])`, [organizations]);
      }
      await database.query("delete from public.organizations where id = any($1::uuid[])", [organizations]);
      await database.query("commit");
    } catch { cleaned = false; await database.query("rollback").catch(() => {}); }
    await database.end().catch(() => {});
  }
  if (admin && uploaded) {
    try { if ((await admin.storage.from("property-media").remove([storagePath])).error) cleaned = false; }
    catch { cleaned = false; }
  }
  if (admin && cleaned) {
    for (const id of users) {
      try { if ((await admin.auth.admin.deleteUser(id)).error) cleaned = false; }
      catch { cleaned = false; }
    }
  }
  if (!cleaned) {
    process.exitCode = 1;
    console.error(`FAIL: cleanup run ${run}. Lihat docs/access-verification.md sebelum mengulang.`);
  } else if (users.length) {
    console.log("PASS: fixture organisasi dan akun Auth sementara dibersihkan.");
  }
}
