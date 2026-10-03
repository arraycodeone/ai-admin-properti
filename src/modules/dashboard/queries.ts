import "server-only";
import { requireActor } from "@/server/auth/actor-context";
import { userClient } from "@/server/db/user-client";

export async function getDashboardSummary() {
  const actor = await requireActor();
  const db = await userClient();
  const { count, error } = await db
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", actor.organizationId);

  if (error) throw new Error("Ringkasan belum dapat dimuat.");
  return { actor, listingCount: count ?? 0 };
}
