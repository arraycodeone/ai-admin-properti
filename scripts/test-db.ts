import { readFile } from "node:fs/promises";
import pg from "pg";
import { testDatabaseConfig } from "./test-database";

let client: pg.Client | undefined;
let stage = "konfigurasi";
try {
  if (process.argv.slice(2).some(arg => arg !== "--schema")) throw new Error("Argumen tidak dikenal.");
  client = new pg.Client(testDatabaseConfig());
  stage = "koneksi";
  await client.connect();
  await client.query("begin");
  const schemaOnly = process.argv.includes("--schema");
  if (!schemaOnly) {
    stage = "fixture seed belum siap";
    const { rows } = await client.query("select id,is_demo from public.organizations");
    if (rows.length !== 2 || rows.some(row => !row.is_demo || !["10000000-0000-4000-8000-000000000001", "10000000-0000-4000-8000-000000000002"].includes(row.id))) {
      throw new Error("Database bukan fixture uji terisolasi.");
    }
  }
  for (const file of schemaOnly ? ["schema.test.sql"] : ["access.test.sql", "integrity.test.sql"]) {
    stage = file;
    await client.query(await readFile(new URL(`../supabase/tests/${file}`, import.meta.url), "utf8"));
    console.log(`PASS: ${file}`);
  }
  await client.query("rollback");
  console.log("Transaksi uji dibatalkan; tidak ada fixture yang disimpan. Matriks akses lengkap dan reliabilitas pesan masih pekerjaan lanjutan.");
} catch (error) {
  await client?.query("rollback").catch(() => {});
  const code = error instanceof Error && "code" in error ? String(error.code) : "setup";
  if (code === "P0001" && stage === "schema.test.sql" && error instanceof Error) console.error(error.message);
  console.error(`${stage === "konfigurasi" || stage === "fixture seed belum siap" ? "NOT RUN" : "FAIL"}: ${stage} (${/^[A-Z0-9_]+$/.test(code) ? code : "setup"}). Tidak ada kredensial atau payload yang dicetak.`);
  process.exitCode = 1;
} finally { await client?.end().catch(() => {}); }
