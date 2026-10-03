import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import pg from "pg";

if (existsSync(".env.local")) loadEnvFile(".env.local");
if (!process.env.TEST_DATABASE_URL || process.env.TEST_DATABASE_CONFIRM_ISOLATED !== "true" || process.env.APP_ENV === "production") {
  console.error("NOT RUN: test:db memerlukan TEST_DATABASE_URL dan TEST_DATABASE_CONFIRM_ISOLATED=true untuk database uji yang sudah dimigrasi dan di-seed.");
  process.exit(1);
}
const client = new pg.Client({ connectionString: process.env.TEST_DATABASE_URL, connectionTimeoutMillis: 10000 });
try {
  await client.connect();
  await client.query("begin");
  const { rows } = await client.query("select id,is_demo from public.organizations");
  if (rows.length !== 2 || rows.some(row => !row.is_demo || !["10000000-0000-4000-8000-000000000001", "10000000-0000-4000-8000-000000000002"].includes(row.id))) {
    throw new Error("Database bukan fixture uji terisolasi.");
  }
  for (const file of ["access.test.sql", "integrity.test.sql"]) {
    await client.query(await readFile(new URL(`../supabase/tests/${file}`, import.meta.url), "utf8"));
    console.log(`PASS: ${file}`);
  }
  await client.query("rollback");
  console.log("Uji fondasi database selesai; transaksi di-rollback. Suite reliabilitas pesan dan survei belum tersedia.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error(`FAIL: database foundation (${error.code ?? "setup"}). Tidak ada kredensial atau payload yang dicetak.`);
  process.exitCode = 1;
} finally { await client.end(); }
