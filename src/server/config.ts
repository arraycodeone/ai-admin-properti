import { z } from "zod";

const schema = z.object({
  APP_MODE: z.enum(["preview", "supabase"]).default("preview"),
  APP_ENV: z.enum(["demo", "test", "production"]).default("demo"),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  SITE_ORGANIZATION_ID: z.string().uuid().default("10000000-0000-4000-8000-000000000001"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
});

export function parseConfig(source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);
  if (!result.success) throw new Error(`Konfigurasi tidak valid: ${result.error.issues.map(i => i.path.join(".")).join(", ")}. Periksa .env.local.`);
  const config = result.data;
  const site = new URL(config.SITE_URL);
  if (site.username || site.password || site.search || site.hash || site.pathname !== "/" || !["http:", "https:"].includes(site.protocol)) {
    throw new Error("SITE_URL harus berupa origin tanpa path, query, atau kredensial.");
  }
  if (config.APP_ENV === "production") {
    throw new Error("Rilis produksi belum diaktifkan. Selesaikan gate produksi sebelum APP_ENV=production.");
  }
  if (config.APP_MODE === "supabase") {
    const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"] as const;
    const missing = required.filter(key => !config[key]?.trim());
    if (missing.length) throw new Error(`Konfigurasi wajib belum diisi: ${missing.join(", ")}.`);
    if (!z.string().url().safeParse(config.NEXT_PUBLIC_SUPABASE_URL).success) throw new Error("NEXT_PUBLIC_SUPABASE_URL tidak valid.");
  }
  return config;
}
