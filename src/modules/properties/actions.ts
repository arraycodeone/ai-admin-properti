"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActor } from "@/server/auth/actor-context";
import { requireOwner } from "@/server/auth/permissions";
import { userClient } from "@/server/db/user-client";
import { propertyInputSchema } from "./schemas";

export type SavePropertyState = { error: string; values?: Record<string, string>; attempt?: number };

const formFields = [
  "id", "public_code", "slug", "title", "description", "city", "area", "public_address",
  "property_type", "price_rupiah", "bedrooms", "bathrooms", "land_area_m2", "building_area_m2",
  "amenities", "availability", "publication_status", "owner_name", "owner_phone_e164",
  "exact_address", "internal_notes",
];

export async function saveProperty(previous: SavePropertyState, form: FormData): Promise<SavePropertyState> {
  const actor = await requireActor();
  requireOwner(actor);
  const values = Object.fromEntries(formFields.map(field => {
    const raw = form.get(field);
    return [field, typeof raw === "string" ? raw : ""];
  }));
  const fail = (error: string): SavePropertyState => ({ error, values, attempt: (previous.attempt ?? 0) + 1 });
  const rawId = form.get("id");
  const id = rawId === "" ? null : z.string().uuid().safeParse(rawId);
  if (id !== null && !id.success) return fail("ID properti tidak valid.");

  const rawAmenities = form.get("amenities");
  const parsed = propertyInputSchema.safeParse({
    public_code: form.get("public_code"), slug: form.get("slug"),
    title: form.get("title"), description: form.get("description"),
    city: form.get("city"), area: form.get("area"), public_address: form.get("public_address"),
    property_type: form.get("property_type"), price_rupiah: form.get("price_rupiah"),
    bedrooms: form.get("bedrooms"), bathrooms: form.get("bathrooms"),
    land_area_m2: form.get("land_area_m2"), building_area_m2: form.get("building_area_m2"),
    amenities: typeof rawAmenities === "string" ? rawAmenities.split(/\r?\n/).map(item => item.trim()).filter(Boolean) : null,
    availability: form.get("availability"), publication_status: form.get("publication_status"),
    owner_name: form.get("owner_name"), owner_phone_e164: form.get("owner_phone_e164"),
    exact_address: form.get("exact_address"), internal_notes: form.get("internal_notes"),
  });
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "formulir");
    const label = field === "price_rupiah" ? "harga" : field.replaceAll("_", " ");
    const message = (parsed.error.issues[0]?.message ?? "nilai tidak valid").replace(/[.!]$/, "");
    return fail(`Periksa ${label}: ${message}.`);
  }

  const db = await userClient();
  const { data, error } = await db.rpc("save_property", {
    p_organization_id: actor.organizationId, p_property_id: id?.data ?? null, p_data: parsed.data,
  });
  if (error) {
    if (error.code === "23505") return fail("Kode atau slug sudah dipakai pada organisasi ini.");
    if (error.code === "P0002") return fail("Properti tidak ditemukan pada organisasi ini.");
    if (error.code === "22023") return fail("Periksa kembali data properti dan status publikasi.");
    return fail("Perubahan belum dapat disimpan. Silakan coba lagi.");
  }
  if (typeof data !== "string") return fail("Perubahan belum dapat dipastikan. Muat ulang daftar properti.");
  revalidatePath("/app");
  revalidatePath("/app/properti");
  revalidatePath("/");
  revalidatePath("/properti");
  revalidatePath(`/properti/${parsed.data.slug}`);
  redirect(`/app/properti/${data}/ubah?tersimpan=1`);
}
