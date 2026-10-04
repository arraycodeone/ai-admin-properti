import type { PropertyRecord, PublicProperty } from "@/modules/properties/types";
import listingAssets from "../../assets-source/metadata/properties.demo.json";

export const organizationA = "10000000-0000-4000-8000-000000000001";
export const organizationB = "10000000-0000-4000-8000-000000000002";
export const privateMarker = "PRIVATE_OWNER_TEST_DO_NOT_EXPOSE";

// Synthetic specifications, not measurements inferred from the images.
const specifications = [
  [3, 2, "120", "100"], [4, 3, "180", "160"],
  [2, 2, "90", "72"], [5, 4, "300", "280"],
  [2, 1, null, "60"], [3, 2, "150", "120"],
  [3, 2, null, "90"], [3, 2, "120", "110"],
  [3, 2, "90", "100"], [4, 4, "240", "220"],
] as const;

const nusaProperties: PropertyRecord[] = listingAssets.map((listing, index) => {
  const [bedrooms, bathrooms, land, building] = specifications[index];
  // IDs 7–10 remain reserved for the access-control fixtures.
  const id = index < 6 ? index + 1 : index + 5;
  return {
    id: `20000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
    organization_id: organizationA,
    public_code: `NUSA-${String(index + 1).padStart(3, "0")}`,
    slug: listing.slug,
    title: listing.title,
    description: `${listing.title} merupakan contoh ${listing.propertyType === "apartment" ? "apartemen" : "rumah"} di kawasan ${listing.location}. Nama, harga, jumlah kamar, dan luas merupakan data sintetis untuk mencoba pencarian properti. Foto adalah ilustrasi AI, bukan dokumentasi bangunan nyata.`,
    city: "Tangerang Raya",
    area: listing.location,
    property_type: listing.propertyType === "apartment" ? "apartment" : "house",
    price_rupiah: String(listing.price),
    bedrooms,
    bathrooms,
    land_area_m2: land,
    building_area_m2: building,
    availability: "active",
    publication_status: "published",
    published_at: "2026-10-01T02:00:00Z",
  };
});

const base = nusaProperties[0];
export const properties: PropertyRecord[] = [
  ...nusaProperties,
  { ...base, id: "20000000-0000-4000-8000-000000000007", public_code: "BKS-006", slug: "rumah-draft", title: "Contoh listing draft", publication_status: "draft", published_at: null },
  { ...base, id: "20000000-0000-4000-8000-000000000008", public_code: "BKS-007", slug: "rumah-paused", title: "Contoh listing ditunda", availability: "paused" },
  { ...base, id: "20000000-0000-4000-8000-000000000009", public_code: "BKS-008", slug: "rumah-terjual", title: "Contoh listing terjual", availability: "sold" },
  { ...base, id: "20000000-0000-4000-8000-000000000010", organization_id: organizationB, public_code: "AGB-001", slug: "rumah-agensi-b", title: "Listing organisasi B" },
];

export function withDemoMedia(property: PublicProperty): PublicProperty {
  const listing = listingAssets.find(asset => asset.slug === property.slug);
  return listing ? { ...property, media: { cover: listing.cover, images: listing.images } } : property;
}
