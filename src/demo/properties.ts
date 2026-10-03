import type { PropertyRecord } from "@/modules/properties/types";

export const organizationA = "10000000-0000-4000-8000-000000000001";
export const organizationB = "10000000-0000-4000-8000-000000000002";
export const privateMarker = "PRIVATE_OWNER_TEST_DO_NOT_EXPOSE";

const base: PropertyRecord = {
  id: "20000000-0000-4000-8000-000000000001", organization_id: organizationA,
  public_code: "BKS-001", slug: "rumah-taman-naraya-bekasi", title: "Rumah Taman Naraya",
  description: "Contoh rumah dua kamar dengan ruang keluarga terbuka dan halaman belakang. Seluruh informasi ini merupakan data sintetis untuk pengujian, bukan penawaran properti nyata.",
  city: "Bekasi", area: "Mustikajaya", property_type: "house", price_rupiah: "650000000", bedrooms: 2, bathrooms: 1,
  land_area_m2: "90", building_area_m2: "60", availability: "active", publication_status: "published", published_at: "2026-10-01T02:00:00Z",
};

export const properties: PropertyRecord[] = [
  base,
  { ...base, id: "20000000-0000-4000-8000-000000000002", public_code: "BKS-002", slug: "rumah-jatiasih", title: "Rumah Halaman Jatiasih", area: "Jatiasih", price_rupiah: "695000000", bedrooms: 3, land_area_m2: "105", building_area_m2: "72" },
  { ...base, id: "20000000-0000-4000-8000-000000000003", public_code: "BKS-003", slug: "rumah-pondok-gede", title: "Rumah Sudut Pondok Gede", area: "Pondok Gede", price_rupiah: "920000000", bedrooms: 3, bathrooms: 2, land_area_m2: "120", building_area_m2: "100" },
  { ...base, id: "20000000-0000-4000-8000-000000000004", public_code: "BKS-004", slug: "apartemen-bekasi-selatan", title: "Apartemen Bekasi Selatan", area: "Bekasi Selatan", property_type: "apartment", price_rupiah: "480000000", bedrooms: 1, land_area_m2: null, building_area_m2: "36" },
  { ...base, id: "20000000-0000-4000-8000-000000000005", public_code: "DPK-001", slug: "rumah-sukmajaya-depok", title: "Rumah Teras Sukmajaya", city: "Depok", area: "Sukmajaya", price_rupiah: "680000000" },
  { ...base, id: "20000000-0000-4000-8000-000000000006", public_code: "BKS-005", slug: "tanah-setu", title: "Tanah Setu", area: "Setu", property_type: "land", price_rupiah: "550000000", bedrooms: 0, bathrooms: 0, land_area_m2: "150", building_area_m2: null },
  { ...base, id: "20000000-0000-4000-8000-000000000007", public_code: "BKS-006", slug: "rumah-draft", title: "Contoh listing draft", publication_status: "draft", published_at: null },
  { ...base, id: "20000000-0000-4000-8000-000000000008", public_code: "BKS-007", slug: "rumah-paused", title: "Contoh listing ditunda", availability: "paused" },
  { ...base, id: "20000000-0000-4000-8000-000000000009", public_code: "BKS-008", slug: "rumah-terjual", title: "Contoh listing terjual", availability: "sold" },
  { ...base, id: "20000000-0000-4000-8000-000000000010", organization_id: organizationB, public_code: "AGB-001", slug: "rumah-agensi-b", title: "Listing organisasi B" },
];
