import "server-only";
import { redirect } from "next/navigation";
import { getEnv } from "@/server/env";
import { userClient } from "@/server/db/user-client";
import type { Actor } from "./permissions";

export async function requireActor(): Promise<Actor> {
  const env = getEnv();
  if (env.APP_MODE !== "supabase") redirect("/login");
  const client = await userClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login");
  const { data, error: membershipError } = await client.from("memberships")
    .select("role, display_name").eq("organization_id", env.SITE_ORGANIZATION_ID)
    .eq("user_id", user.id).eq("is_active", true).maybeSingle();
  if (membershipError) throw new Error("Tidak dapat memeriksa akses. Silakan coba lagi.");
  if (!data || !["owner", "sales"].includes(data.role)) redirect("/login?error=membership");
  return { userId: user.id, organizationId: env.SITE_ORGANIZATION_ID, role: data.role, displayName: data.display_name };
}
