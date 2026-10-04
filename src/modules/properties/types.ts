export type PropertyImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  thumbnail: string;
};

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
  media?: { cover: string; images: PropertyImage[] };
};

export type PropertyRecord = PublicProperty & {
  organization_id: string;
  availability: "active" | "paused" | "sold";
  publication_status: "draft" | "published" | "archived";
  published_at: string | null;
};

export type PropertyFilters = { location?: string; budget?: string; bedrooms?: number; type?: PublicProperty["property_type"] };

export type InternalProperty = Pick<
  PropertyRecord,
  "id" | "public_code" | "title" | "city" | "area" | "availability" | "publication_status"
>;

export const propertyTypeLabels = { house: "Rumah", apartment: "Apartemen", land: "Tanah" } as const;
