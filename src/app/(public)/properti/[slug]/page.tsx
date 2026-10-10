import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProperty } from "@/modules/properties/queries";
import { PropertyVisual } from "@/modules/properties/components/property-card";
import { PropertyGallery } from "@/modules/properties/components/property-gallery";
import { propertyTypeLabels } from "@/modules/properties/types";
import { getSite } from "@/modules/site/queries";
import { formatRupiah } from "@/lib/money";
import { WhatsappCta } from "@/components/public/whatsapp-cta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPublicProperty((await params).slug);
  if (!property) return { title: "Properti tidak ditemukan" };
  return {
    title: `${property.title}, ${property.area}`,
    description: `Contoh ${propertyTypeLabels[property.property_type].toLowerCase()} di ${property.area}. ${property.bedrooms} kamar. ${formatRupiah(property.price_rupiah)}. Data demo.`,
  };
}

export default async function Detail({ params }: Props) {
  const [property, site] = await Promise.all([getPublicProperty((await params).slug), getSite()]);
  if (!property) notFound();
  return (
    <main id="main" className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link><span>/</span>
        <Link href="/properti">Properti</Link><span>/</span>
        <span>{property.public_code}</span>
      </nav>
      <div className="page-heading">
        <p className="eyebrow">{propertyTypeLabels[property.property_type]} · {property.public_code} · Data demo</p>
        <h1>{property.title}</h1>
        <p>{property.area}, {property.city}</p>
      </div>
      <div className="detail-layout">
        <div>
          {property.media?.images.length ? (
            <PropertyGallery images={property.media.images} />
          ) : (
            <PropertyVisual property={property} large />
          )}
          <section className="detail-description">
            <h2>Tentang properti</h2>
            <p>{property.description}</p>
            <dl className="spec-grid">
              <div><dt>Kamar tidur</dt><dd>{property.bedrooms}</dd></div>
              <div><dt>Kamar mandi</dt><dd>{property.bathrooms}</dd></div>
              <div><dt>Luas tanah</dt><dd>{property.land_area_m2 ? `${property.land_area_m2} m²` : "Tidak tersedia"}</dd></div>
              <div><dt>Luas bangunan</dt><dd>{property.building_area_m2 ? `${property.building_area_m2} m²` : "Tidak tersedia"}</dd></div>
            </dl>
            {property.amenities.length > 0 && (
              <div className="property-amenities">
                <h2>Fasilitas</h2>
                <ul>
                  {property.amenities.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </section>
        </div>
        <aside className="contact-panel">
          <span className="muted">Harga penawaran contoh</span>
          <p className="detail-price">{formatRupiah(property.price_rupiah)}</p>
          <hr />
          <h2>Mari bicarakan rumah ini.</h2>
          <p>Sebutkan kode <strong>{property.public_code}</strong> agar tim dapat memeriksa properti yang Anda maksud.</p>
          <WhatsappCta phone={site.phone} code={property.public_code} />
          <p className="small muted">Ketersediaan dan jadwal kunjungan perlu dikonfirmasi manusia.</p>
        </aside>
      </div>
    </main>
  );
}
