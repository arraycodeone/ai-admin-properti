import type { PropertyFilters, PropertyRecord, PublicProperty } from "./types";

export function publicProperty(row: PropertyRecord): PublicProperty {
  return {
    id: row.id, public_code: row.public_code, slug: row.slug, title: row.title,
    description: row.description, city: row.city, area: row.area, property_type: row.property_type,
    price_rupiah: row.price_rupiah, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    land_area_m2: row.land_area_m2, building_area_m2: row.building_area_m2,
    amenities: row.amenities,
  };
}

export function searchProperties(rows: PropertyRecord[], organizationId: string, filters: PropertyFilters = {}): PublicProperty[] {
  const location = filters.location?.toLocaleLowerCase("id-ID");
  return rows.filter(row =>
    row.organization_id === organizationId && row.availability === "active" && row.publication_status === "published" && row.published_at &&
    (!location || `${row.city} ${row.area}`.toLocaleLowerCase("id-ID").includes(location)) &&
    (!filters.budget || BigInt(row.price_rupiah) <= BigInt(filters.budget)) &&
    (filters.bedrooms === undefined || row.bedrooms >= filters.bedrooms) &&
    (!filters.type || row.property_type === filters.type)
  ).slice(0, 50).map(publicProperty);
}
