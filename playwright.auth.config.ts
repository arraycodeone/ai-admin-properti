import { defineConfig } from "@playwright/test";
import { testDatabaseConfig } from "./scripts/test-database";
import { organizationA } from "./src/demo/properties";

testDatabaseConfig();
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || !process.env.SUPABASE_SECRET_KEY ||
    (process.env.DEMO_SEED_PASSWORD?.length ?? 0) < 16) {
  throw new Error("NOT RUN: konfigurasi akun uji belum lengkap. Lihat docs/auth-verification.md.");
}

export default defineConfig({
  testDir: "./tests/auth",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 1440, height: 1000 },
    trace: "off", screenshot: "off", video: "off",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/login",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { APP_MODE: "supabase", APP_ENV: "test", SITE_URL: "http://127.0.0.1:3100", SITE_ORGANIZATION_ID: organizationA },
  },
});
