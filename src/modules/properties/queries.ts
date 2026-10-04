import "server-only";
import { getEnv } from "@/server/env";
import { systemClient } from "@/server/db/system-client";
import { userClient } from "@/server/db/user-client";
import { requireActor } from "@/server/auth/actor-context";
import { properties } from "@/demo/properties";
import { filterSchema, publicPropertySchema, internalPropertySchema } from "./schemas";
import { searchProperties } from "./service";
import type { InternalProperty, PropertyFilters, PublicProperty } from "./types";

export async function getPublicProperties(filters: PropertyFilters = {}): Promise<PublicProperty[]> {
  const env = getEnv();
  const parsed = filterSchema.parse(filters);
  if (env.APP_MODE === "preview") return searchProperties(properties, env.SITE_ORGANIZATION_ID, parsed);
  const { data, error } = await systemClient().rpc("search_public_properties", {
    p_organization_id: env.SITE_ORGANIZATION_ID, p_location: parsed.location || undefined,
    p_budget: parsed.budget, p_bedrooms: parsed.bedrooms, p_type: parsed.type,
  });
  if (error) throw new Error("Katalog belum dapat dimuat. Silakan coba kembali.");
  const result = publicPropertySchema.array().safeParse(data);
  if (!result.success) throw new Error("Katalog belum dapat dimuat. Silakan coba kembali.");
  return result.data;
}

export async function getPublicProperty(slug: string) {
  if (slug.length > 100 || !/^[a-z0-9-]+$/.test(slug)) return null;
  const rows = await getPublicProperties();
  return rows.find(row => row.slug === slug) ?? null;
}

export async function getInternalProperties(): Promise<InternalProperty[]> {
  const actor = await requireActor();
  const db = await userClient();
  const { data, error } = await db
    .from("properties")
    .select("id, public_code, title, city, area, availability, publication_status")
    .eq("organization_id", actor.organizationId)
    .order("public_code")
    .limit(100);

  if (error) throw new Error("Properti internal belum dapat dimuat.");
  const result = internalPropertySchema.array().safeParse(data);
  if (!result.success) throw new Error("Properti internal belum dapat dimuat.");
  return result.data;
}
