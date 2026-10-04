import { readFile, readdir } from "node:fs/promises";
import pg from "pg";
import { testDatabaseConfig } from "./test-database";

let client: pg.Client | undefined;
let stage = "konfigurasi";
try {
  if (process.argv.slice(2).some(arg => arg !== "--check")) throw new Error("Argumen tidak dikenal.");
  client = new pg.Client(testDatabaseConfig());
  await client.connect();
  stage = "target harus kosong";
  await client.query("begin");
  await client.query("select pg_advisory_xact_lock(hashtextextended('ai-admin-properti:bootstrap', 0))");
  const { rows: [target] } = await client.query(`
    select exists (
      select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname in ('public','supabase_migrations') and c.relkind in ('r','p','v','m','S','f')
        and not exists (select 1 from pg_depend d where d.classid = 'pg_class'::regclass and d.objid = c.oid and d.deptype = 'e')
      union all
      select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
        and not exists (select 1 from pg_event_trigger e where e.evtfoid = p.oid)
      union all
      select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typtype in ('e','d')
        and not exists (select 1 from pg_depend d where d.classid = 'pg_type'::regclass and d.objid = t.oid and d.deptype = 'e')
    ) or exists (select 1 from auth.users) or exists (select 1 from storage.buckets) as occupied
  `);
  if (target.occupied) throw new Error("Bootstrap hanya untuk proyek uji kosong; tidak ada reset otomatis.");
  await client.query(`create schema if not exists supabase_migrations;
    create table supabase_migrations.schema_migrations (version text primary key, statements text[], name text);
    revoke all on schema supabase_migrations from public, anon, authenticated;
    revoke all on supabase_migrations.schema_migrations from public, anon, authenticated;`);
  const directory = new URL("../supabase/migrations/", import.meta.url);
  const files = (await readdir(directory)).filter(name => /^\d+_.+\.sql$/.test(name)).sort();
  if (!files.length) throw new Error("Migrasi tidak ditemukan.");
  for (const file of files) {
    stage = file;
    const sql = await readFile(new URL(file, directory), "utf8");
    await client.query(sql);
    const [version, ...name] = file.replace(/\.sql$/, "").split("_");
    await client.query("insert into supabase_migrations.schema_migrations(version,name,statements) values ($1,$2,$3)", [version, name.join("_"), [sql]]);
    console.log(`PASS: ${file}`);
  }
  stage = "schema.test.sql";
  await client.query("savepoint schema_tests");
  await client.query(await readFile(new URL("../supabase/tests/schema.test.sql", import.meta.url), "utf8"));
  await client.query("rollback to savepoint schema_tests");
  console.log("PASS: constraint, default akses, dan DTO katalog; fixture SQL dibatalkan.");
  const check = process.argv.includes("--check");
  await client.query(check ? "rollback" : "commit");
  console.log(check ? "PASS: migrasi dari kosong berhasil; seluruh transaksi dibatalkan." : "PASS: migrasi dan riwayat diterapkan; tidak ada seed yang disimpan.");
} catch (error) {
  await client?.query("rollback").catch(() => {});
  const code = error instanceof Error && "code" in error ? String(error.code) : "setup";
  if (code === "P0001" && stage === "schema.test.sql" && error instanceof Error) console.error(error.message);
  console.error(`FAIL: ${stage} (${/^[A-Z0-9_]+$/.test(code) ? code : "setup"}). Periksa docs/supabase-migrations.md; detail koneksi tidak dicetak.`);
  process.exitCode = 1;
} finally {
  await client?.end().catch(() => {});
}
