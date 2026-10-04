import { testDatabaseConfig } from "./test-database";
import { organizationA, organizationB } from "../src/demo/properties";

export function seedConfig() {
  const database = testDatabaseConfig();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SECRET_KEY;
  const password = process.env.DEMO_SEED_PASSWORD;
  if (
    process.env.DEMO_SEED_CONFIRM_ISOLATED !== "true" ||
    !key?.trim() ||
    !password ||
    password.length < 16
  ) {
    throw new Error(
      "Seed memerlukan konfirmasi khusus serta secret/password lokal. Lihat docs/seed-verification.md.",
    );
  }
  return { database, url, key, password };
}

export function assertSeedOrganizations(
  rows: { id: string; is_demo: boolean; processing_paused: boolean }[],
) {
  if (
    rows.some(
      (row) =>
        !row.is_demo ||
        !row.processing_paused ||
        ![organizationA, organizationB].includes(row.id),
    )
  ) {
    throw new Error(
      "Target harus hanya berisi organisasi fixture demo yang paused.",
    );
  }
}
