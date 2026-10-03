import type { Metadata } from "next";
import { SearchForm } from "@/modules/properties/components/search-form";
import { PropertyCard } from "@/modules/properties/components/property-card";
import { getPublicProperties } from "@/modules/properties/queries";
import { filterSchema } from "@/modules/properties/schemas";

export const metadata: Metadata = { title: "Cari properti", description: "Cari contoh rumah, apartemen, atau tanah berdasarkan lokasi, anggaran, dan jumlah kamar." };

export default async function Catalog({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const input = Object.fromEntries(["location", "type", "budget", "bedrooms"].map(key => [key, raw[key] === "" ? undefined : raw[key]]));
  const parsed = filterSchema.safeParse(input);
  const filters = parsed.success ? parsed.data : {};
  const properties = parsed.success ? await getPublicProperties(filters) : [];
  return <main id="main" className="container section catalog-page"><div className="page-heading"><p className="muted small">Katalog properti</p><h1>Ruang yang cocok untuk Anda.</h1><p className="muted">Pilih lokasi dan anggaran untuk mempersempit pencarian.</p></div><SearchForm filters={filters} compact/>
    {!parsed.success && <p className="notice notice-error" role="alert">Filter tidak valid. Gunakan pilihan lokasi, anggaran, tipe, dan kamar yang tersedia.</p>}
    <div className="results-heading"><h2>{properties.length} properti ditemukan</h2><span className="muted small">Data demo sintetis</span></div>
    {properties.length ? <div className="property-grid">{properties.map(property => <PropertyCard key={property.id} property={property}/>)}</div> : <div className="empty-state"><h2>Belum ada properti yang cocok</h2><p>Coba ubah lokasi atau anggaran pada filter di atas.</p></div>}
  </main>;
}
