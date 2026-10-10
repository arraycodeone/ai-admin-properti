import { z } from "zod";

const schema = z.object({
  APP_ENV: z.enum(["development", "production"]).default("development"),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  SITE_ORGANIZATION_ID: z.string().uuid().default("10000000-0000-4000-8000-000000000001"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

export function parseConfig(source: Record<string, string | undefined>) {
  if (source.APP_MODE !== undefined) throw new Error("APP_MODE tidak didukung. Hapus variabel ini dari konfigurasi.");
  const result = schema.safeParse(source);
  if (!result.success) throw new Error(`Konfigurasi tidak valid: ${result.error.issues.map(i => i.path.join(".")).join(", ")}. Periksa .env.local.`);
  const config = result.data;
  const site = new URL(config.SITE_URL);
  if (site.username || site.password || site.search || site.hash || site.pathname !== "/" || !["http:", "https:"].includes(site.protocol)) {
    throw new Error("SITE_URL harus berupa origin tanpa path, query, atau kredensial.");
  }
  if (!z.string().url().safeParse(config.NEXT_PUBLIC_SUPABASE_URL).success) throw new Error("NEXT_PUBLIC_SUPABASE_URL tidak valid.");
  return config;
}
