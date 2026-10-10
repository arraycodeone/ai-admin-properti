import "server-only";
import { getEnv } from "@/server/env";
import { requireActor } from "@/server/auth/actor-context";
import { systemClient } from "@/server/db/system-client";
import { userClient } from "@/server/db/user-client";
import { faqSchema, publicFaqSchema } from "./schemas";

export async function getInternalFaqs() {
  const actor = await requireActor();
  const db = await userClient();
  const { data, error } = await db.from("knowledge_entries")
    .select("id,question,answer,visibility,is_active")
    .eq("organization_id", actor.organizationId).order("question").limit(100);
  if (error) throw new Error("FAQ internal belum dapat dimuat.");
  const parsed = faqSchema.array().safeParse(data);
  if (!parsed.success) throw new Error("Data FAQ tidak valid.");
  return { actor, entries: parsed.data };
}

export async function getPublicFaqs() {
  const env = getEnv();
  const { data, error } = await systemClient().from("knowledge_entries")
    .select("id,question,answer")
    .eq("organization_id", env.SITE_ORGANIZATION_ID)
    .eq("visibility", "public").eq("is_active", true).order("question").limit(50);
  if (error) throw new Error("FAQ belum dapat dimuat.");
  const parsed = publicFaqSchema.array().safeParse(data);
  if (!parsed.success) throw new Error("Data FAQ tidak valid.");
  return parsed.data;
}
