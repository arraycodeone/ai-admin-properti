import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/server/env";
import type { Database } from "@/types/database";

export function systemClient() {
  const env = getEnv();
  if (env.APP_MODE !== "supabase") throw new Error("Database belum dikonfigurasi.");
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
