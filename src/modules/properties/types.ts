export type PublicProperty = {
  id: string;
  public_code: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  area: string;
  property_type: "house" | "apartment" | "land";
  price_rupiah: string;
  bedrooms: number;
  bathrooms: number;
  land_area_m2: string | null;
  building_area_m2: string | null;
};

export type PropertyRecord = PublicProperty & {
  organization_id: string;
  availability: "active" | "paused" | "sold";
  publication_status: "draft" | "published" | "archived";
  published_at: string | null;
};

export type PropertyFilters = { location?: string; budget?: string; bedrooms?: number; type?: PublicProperty["property_type"] };

export const propertyTypeLabels = { house: "Rumah", apartment: "Apartemen", land: "Tanah" } as const;
