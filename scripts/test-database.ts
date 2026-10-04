import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

export function testDatabaseConfig() {
  if (existsSync(".env.local")) loadEnvFile(".env.local");
  if (process.env.APP_ENV !== "test" || process.env.TEST_DATABASE_CONFIRM_ISOLATED !== "true" ||
      !process.env.TEST_DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Konfigurasi database uji belum lengkap.");
  }
  const api = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const database = new URL(process.env.TEST_DATABASE_URL);
  const loopback = ["localhost", "127.0.0.1", "[::1]"];
  const local = loopback.includes(api.hostname) && loopback.includes(database.hostname);
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
        database.searchParams.get("sslmode") !== "verify-full" ||
        database.searchParams.get("uselibpqcompat") === "true") {
      throw new Error("Target API/SQL atau verifikasi TLS tidak sesuai.");
    }
  }
  return {
    connectionString: process.env.TEST_DATABASE_URL,
    connectionTimeoutMillis: 10_000,
    statement_timeout: 30_000,
    query_timeout: 35_000,
  };
}
