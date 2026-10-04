import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe.each(["scripts/check-supabase.ts", "tests/live/access.ts"])("guard %s", script => {
  it.each([
    { name: "produksi", APP_ENV: "production", TEST_DATABASE_CONFIRM_ISOLATED: "true" },
    { name: "target belum dikonfirmasi", APP_ENV: "test", TEST_DATABASE_CONFIRM_ISOLATED: "false" },
    {
      name: "SQL proyek lain",
      APP_ENV: "test",
      TEST_DATABASE_CONFIRM_ISOLATED: "true",
      TEST_DATABASE_URL: "postgresql://postgres:SQL_SECRET_MARKER@db.otherproject.supabase.co:5432/postgres?sslmode=verify-full",
    },
    {
      name: "TLS tanpa verifikasi",
      APP_ENV: "test",
      TEST_DATABASE_CONFIRM_ISOLATED: "true",
      TEST_DATABASE_URL: "postgresql://postgres:SQL_SECRET_MARKER@db.testproject.supabase.co:5432/postgres?sslmode=disable",
    },
  ])("menolak $name sebelum koneksi tanpa menampilkan secret", overrides => {
    const result = spawnSync(process.execPath, ["--import", "tsx", script], {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 5_000,
      env: {
        ...process.env,
        APP_MODE: "supabase",
        SITE_URL: "http://localhost:3000",
        SITE_ORGANIZATION_ID: "10000000-0000-4000-8000-000000000001",
        NEXT_PUBLIC_SUPABASE_URL: "https://testproject.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "PUBLISHABLE_TEST_MARKER",
        SUPABASE_SECRET_KEY: "AUTH_SECRET_MARKER",
        TEST_DATABASE_URL: "postgresql://postgres:SQL_SECRET_MARKER@db.testproject.supabase.co:5432/postgres?sslmode=verify-full",
        ...overrides,
      },
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("NOT RUN: konfigurasi");
    expect(result.stdout).not.toContain("PASS:");
    expect(result.stdout + result.stderr).not.toMatch(/AUTH_SECRET_MARKER|SQL_SECRET_MARKER|PUBLISHABLE_TEST_MARKER/);
  });
});
