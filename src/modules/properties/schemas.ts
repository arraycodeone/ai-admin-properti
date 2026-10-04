import { z } from "zod";
import { parseRupiah } from "@/lib/money";

export const moneySchema = z.string().refine(value => {
  try { parseRupiah(value); return true; } catch { return false; }
}, "Gunakan angka rupiah bulat tanpa titik atau koma.");

export const propertySchema = z.object({
  public_code: z.string().regex(/^[A-Z0-9-]{3,24}$/),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(20).max(5000),
  city: z.string().trim().min(2).max(80),
  area: z.string().trim().min(2).max(80),
  property_type: z.enum(["house", "apartment", "land"]),
  price_rupiah: moneySchema,
  bedrooms: z.coerce.number().int().min(0).max(100),
  bathrooms: z.coerce.number().int().min(0).max(100),
  availability: z.enum(["active", "paused", "sold"]),
  publication_status: z.enum(["draft", "published", "archived"]),
});

export const filterSchema = z.object({
  location: z.string().trim().max(80).optional(),
  budget: moneySchema.optional(),
  bedrooms: z.coerce.number().int().min(0).max(100).optional(),
  type: z.enum(["house", "apartment", "land"]).optional(),
});

export const publicPropertySchema = z.object({
  id: z.string().uuid(),
  public_code: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  city: z.string(),
  area: z.string(),
  property_type: propertySchema.shape.property_type,
  price_rupiah: moneySchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  land_area_m2: z.string().nullable(),
  building_area_m2: z.string().nullable(),
});

export const internalPropertySchema = publicPropertySchema.pick({
  id: true, public_code: true, title: true, city: true, area: true,
}).extend({
  availability: propertySchema.shape.availability,
  publication_status: propertySchema.shape.publication_status,
});
