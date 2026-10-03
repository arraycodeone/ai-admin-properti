import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { parseConfig } from "../src/server/config";

let stage = "konfigurasi";
let client: pg.Client | undefined;

try {
  if (existsSync(".env.local")) loadEnvFile(".env.local");
  const env = parseConfig(process.env);
  if (env.APP_MODE !== "supabase" || env.APP_ENV !== "test" ||
      !process.env.TEST_DATABASE_URL || process.env.TEST_DATABASE_CONFIRM_ISOLATED !== "true") {
    throw new Error("Konfigurasi uji belum lengkap.");
  }

  const api = new URL(env.NEXT_PUBLIC_SUPABASE_URL!);
  const database = new URL(process.env.TEST_DATABASE_URL);
  const localHosts = ["localhost", "127.0.0.1", "[::1]"];
  const local = localHosts.includes(api.hostname) && localHosts.includes(database.hostname);
  if (!["postgres:", "postgresql:"].includes(database.protocol) ||
      api.username || api.password || api.search || api.hash || api.pathname !== "/") {
    throw new Error("URL koneksi tidak sesuai.");
  }
  if (local) {
    if (!["http:", "https:"].includes(api.protocol)) throw new Error("Protokol API lokal tidak sesuai.");
  } else {
    const ref = api.hostname.match(/^([a-z0-9]+)\.supabase\.co$/)?.[1];
    const direct = database.hostname === `db.${ref}.supabase.co`;
    const pooler = database.hostname.endsWith(".pooler.supabase.com") &&
      decodeURIComponent(database.username) === `postgres.${ref}`;
    if (!ref || api.protocol !== "https:" || (!direct && !pooler) ||
        database.searchParams.get("sslmode") !== "verify-full") {
      throw new Error("API dan SQL harus berasal dari proyek uji yang sama dengan TLS terverifikasi.");
    }
  }
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
  client = new pg.Client({
    connectionString: process.env.TEST_DATABASE_URL,
    connectionTimeoutMillis: 10_000,
    query_timeout: 10_000,
    statement_timeout: 10_000,
  });
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
