import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/server/env";

export function systemClient() {
  const env = getEnv();
  if (env.APP_MODE !== "supabase") throw new Error("Database belum dikonfigurasi.");
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
