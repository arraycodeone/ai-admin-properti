import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { WhatsappCta } from "@/components/public/whatsapp-cta";
import { PropertyCard } from "@/modules/properties/components/property-card";
import { SearchForm } from "@/modules/properties/components/search-form";
import { getPublicProperties } from "@/modules/properties/queries";
import { getSite } from "@/modules/site/queries";
import { areas } from "@/modules/site/content";
import { AreaCards } from "@/modules/site/area-cards";

export default async function Home() {
  const [properties, site] = await Promise.all([getPublicProperties(), getSite()]);
  return (
    <main id="main">
      <section className="home-hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="eyebrow" data-motion="hero-text"><span />BSD, Alam Sutera & Bintaro</p>
              <h1>
                <span className="hero-line" data-motion="hero-text" data-motion-delay="70">Temukan rumah</span>{" "}
                <span className="hero-line" data-motion="hero-text" data-motion-delay="140">untuk cerita</span>{" "}
                <em className="hero-line" data-motion="hero-text" data-motion-delay="210">berikutnya.</em>
              </h1>
              <p data-motion="hero-text" data-motion-delay="140">Setiap rencana punya ruangnya. Temukan hunian yang sesuai dengan cara Anda ingin tinggal.</p>
              <Link href="#pilihan" className="text-link" data-motion="hero-link" data-motion-delay="210">Lihat pilihan hunian <Icon name="arrow" /></Link>
            </div>
            <figure className="hero-figure">
              <div className="hero-image">
                <div className="hero-image-content" data-motion="hero-photo">
                  <Image
                    data-parallax
                    src="/asset/images/hero/nusa-property-hero.webp"
                    alt="Ilustrasi AI rumah tropis modern dengan material kayu dan taman"
                    fill
                    sizes="(max-width: 760px) 100vw, 55vw"
                    preload
                  />
                </div>
              </div>
              <figcaption><span>Ruang untuk hidup, bukan sekadar tinggal.</span><span>Ilustrasi AI</span></figcaption>
            </figure>
          </div>
          <SearchForm />
          <div className="location-shortcuts">
            <span>Telusuri kawasan:</span>
            {areas.map(area => <Link key={area.name} href={`/properti?location=${encodeURIComponent(area.name)}`}>{area.name}</Link>)}
          </div>
        </div>
      </section>

      <section id="pilihan" className="container section" aria-labelledby="listing-heading">
        <div className="section-heading" data-motion="rise">
          <div>
            <p className="eyebrow">Pilihan hunian</p>
            <h2 id="listing-heading">Ruang yang bisa Anda<br /><em>sebut rumah.</em></h2>
          </div>
          <div className="listing-intro">
            <p>Dari rumah keluarga hingga apartemen.<br />Mulai dengan yang paling sesuai untuk Anda.</p>
            <Link className="text-link" href="/properti">Lihat semua properti <Icon name="arrow" /></Link>
          </div>
        </div>
        <div className="catalog-toolbar">
          <nav aria-label="Kategori properti" className="category-links">
            <Link href="/properti">Semua properti</Link>
            <Link href="/properti?type=house"><Icon name="home" />Rumah</Link>
            <Link href="/properti?type=apartment"><Icon name="apartment" />Apartemen</Link>
          </nav>
          <p className="catalog-note">Listing & spesifikasi demo · Foto ilustrasi AI</p>
        </div>
        {properties.length ? (
          <div className="property-grid">
            {properties.slice(0, 6).map((property, index) => (
              <PropertyCard property={property} motionDelay={Math.min(index * 70, 210)} key={property.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Belum ada properti yang diterbitkan</h3>
            <p>Katalog akan tampil setelah listing siap.</p>
          </div>
        )}
      </section>

      <section id="kawasan" className="area-section" aria-labelledby="area-heading">
        <div className="container">
          <div className="section-heading" data-motion="rise">
            <div>
              <p className="eyebrow">Kenali kawasannya</p>
              <h2 id="area-heading">Rumah yang tepat.<br /><em>Lingkungan yang Anda suka.</em></h2>
            </div>
            <p>Mulai dari kawasan pilihan Anda,<br />lalu temukan properti di sekitarnya.</p>
          </div>
          <AreaCards />
        </div>
      </section>

      <section id="konsultasi" className="consultation-section" aria-labelledby="consultation-heading">
        <div className="container consultation-inner">
          <figure className="agent-figure" data-motion="side">
            <div className="agent-image">
              <Image src="/asset/images/agent/michael-santoso-demo.webp" alt="Potret ilustrasi AI Michael Santoso, agen fiktif untuk demo" fill sizes="(max-width: 760px) 100vw, 40vw" />
            </div>
            <figcaption><strong>Michael Santoso</strong><span>Konsultan properti · Profil agen demo</span></figcaption>
          </figure>
          <div className="consultation-copy" data-motion="rise" data-motion-delay="140">
            <p className="eyebrow">Mari bicarakan rencana Anda</p>
            <h2 id="consultation-heading">Pencarian rumah<br />dimulai dari<br /><em>percakapan.</em></h2>
            <p>Ceritakan lokasi, anggaran, dan ruang yang Anda butuhkan. Mulai dari pilihan yang cocok, lalu bicarakan rencana kunjungan.</p>
            <div className="consultation-areas"><Icon name="pin" />BSD · Alam Sutera · Bintaro</div>
            <WhatsappCta phone={site.phone} />
            <Link href="/properti" className="text-link">Pilih properti untuk dibicarakan <Icon name="arrow" /></Link>
            <p className="consultation-note">Kunjungan baru terjadwal setelah konfirmasi tim. Profil dan potret di samping merupakan ilustrasi demo.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
