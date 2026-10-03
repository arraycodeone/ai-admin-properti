import "server-only";
import { getEnv } from "@/server/env";
import { systemClient } from "@/server/db/system-client";
import { properties } from "@/demo/properties";
import { filterSchema } from "./schemas";
import { searchProperties } from "./service";
import type { PropertyFilters, PublicProperty } from "./types";

export async function getPublicProperties(filters: PropertyFilters = {}): Promise<PublicProperty[]> {
  const env = getEnv();
  const parsed = filterSchema.parse(filters);
  if (env.APP_MODE === "preview") return searchProperties(properties, env.SITE_ORGANIZATION_ID, parsed);
  const { data, error } = await systemClient().rpc("search_public_properties", {
    p_organization_id: env.SITE_ORGANIZATION_ID, p_location: parsed.location || null,
    p_budget: parsed.budget ?? null, p_bedrooms: parsed.bedrooms ?? null, p_type: parsed.type ?? null,
  });
  if (error) throw new Error("Katalog belum dapat dimuat. Silakan coba kembali.");
  return data as PublicProperty[];
}

export async function getPublicProperty(slug: string) {
  if (slug.length > 100 || !/^[a-z0-9-]+$/.test(slug)) return null;
  const rows = await getPublicProperties();
  return rows.find(row => row.slug === slug) ?? null;
}
