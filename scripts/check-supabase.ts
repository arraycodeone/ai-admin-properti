import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { parseConfig } from "../src/server/config";
import { testDatabaseConfig } from "./test-database";

let stage = "konfigurasi";
let client: pg.Client | undefined;

try {
  const databaseConfig = testDatabaseConfig();
  const env = parseConfig(process.env);
  if (env.APP_MODE !== "supabase") throw new Error("Checker memerlukan mode Supabase.");
  const api = new URL(env.NEXT_PUBLIC_SUPABASE_URL!);
  console.log("PASS: konfigurasi uji dan kecocokan target API/SQL.");

  stage = "Auth dengan publishable key";
  const health = await fetch(new URL("/auth/v1/health", api), {
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
  });
  if (!health.ok) throw new Error("Auth health gagal.");
  await health.arrayBuffer();
  console.log("PASS: layanan Auth menerima publishable key.");

  stage = "Auth Admin dengan secret key";
  const admin = createClient(api.origin, env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10_000), redirect: "error" }) },
  });
  const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) throw new Error("Auth Admin gagal.");
  console.log("PASS: akses baca Auth Admin; data pengguna tidak dicetak.");

  stage = "PostgreSQL";
  client = new pg.Client(databaseConfig);
  await client.connect();
  await client.query("begin read only");
  await client.query("select 1");
  await client.query("rollback");
  console.log("PASS: koneksi PostgreSQL dan transaksi baca saja.");
  console.log("Koneksi dasar terverifikasi. Migrasi, seed, login pengguna, dan RLS belum diuji oleh perintah ini.");
} catch {
  console.error(`${stage === "konfigurasi" ? "NOT RUN" : "FAIL"}: ${stage}. Periksa docs/supabase-setup.md; kredensial dan respons layanan tidak dicetak.`);
  process.exitCode = 1;
} finally {
  if (client) await client.end().catch(() => {});
}
