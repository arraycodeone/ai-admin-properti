import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { WhatsappCta } from "@/components/public/whatsapp-cta";
import { PropertyCard } from "@/modules/properties/components/property-card";
import { SearchForm } from "@/modules/properties/components/search-form";
import { getPublicProperties } from "@/modules/properties/queries";
import { getSite } from "@/modules/site/queries";

export default async function Home() {
  const [properties, site] = await Promise.all([getPublicProperties(), getSite()]);
  return (
    <main id="main">
      <section className="home-hero">
        <div className="container">
          <div className="hero-copy">
            <p>Rumah, apartemen, dan tanah di Bekasi & sekitarnya</p>
            <h1>Temukan ruang<br />untuk cerita berikutnya.</h1>
            <p>
              Mulai dari lokasi yang Anda suka.<br className="desktop-break" /> Cocokkan anggaran,
              lalu bicarakan kebutuhan bersama tim kami.
            </p>
          </div>
          <SearchForm />
          <div className="location-shortcuts">
            <span>Mulai dari:</span>
            <Link href="/properti?location=Bekasi">Bekasi</Link>
            <Link href="/properti?location=Jatiasih">Jatiasih</Link>
            <Link href="/properti?location=Depok">Depok</Link>
          </div>
        </div>
      </section>
      <div className="container category-row" aria-label="Kategori properti">
        <Link href="/properti?type=house">
          <Icon name="home" />
          <span><strong>Rumah</strong><small>Ruang untuk bertumbuh</small></span>
          <Icon name="arrow" />
        </Link>
        <Link href="/properti?type=apartment">
          <Icon name="apartment" />
          <span><strong>Apartemen</strong><small>Hunian yang lebih ringkas</small></span>
          <Icon name="arrow" />
        </Link>
        <Link href="/properti?type=land">
          <Icon name="land" />
          <span><strong>Tanah</strong><small>Awal rencana baru</small></span>
          <Icon name="arrow" />
        </Link>
      </div>
      <section className="container section" aria-labelledby="listing-heading">
        <div className="section-heading">
          <div>
            <h2 id="listing-heading">Pilihan properti untuk Anda</h2>
            <p>Lihat lokasi, harga, dan ruang yang sesuai kebutuhan.</p>
          </div>
          <Link className="text-link" href="/properti">Lihat semua properti <Icon name="arrow" /></Link>
        </div>
        <p className="catalog-note">Semua listing di bawah merupakan data sintetis. Foto berizin belum tersedia.</p>
        {properties.length ? (
          <div className="property-grid">
            {properties.slice(0, 4).map(property => <PropertyCard property={property} key={property.id} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Belum ada properti yang diterbitkan</h3>
            <p>Katalog akan tampil setelah listing siap.</p>
          </div>
        )}
      </section>
      <section className="container area-section">
        <div>
          <h2>Dekat dengan<br />rencana Anda.</h2>
          <p>Mulai pencarian dari kota yang dituju.<br />Sesuaikan lagi dengan anggaran dan jumlah kamar.</p>
        </div>
        <div className="area-links">
          <Link href="/properti?location=Bekasi">
            <span>01</span><strong>Bekasi</strong><Icon name="arrow" />
          </Link>
          <Link href="/properti?location=Depok">
            <span>02</span><strong>Depok</strong><Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section id="konsultasi" className="consultation-section">
        <div className="container consultation-inner">
          <div>
            <h2>Sudah punya gambaran<br />rumah yang dicari?</h2>
            <p>
              Ceritakan lokasi, anggaran, dan kebutuhan ruang. Tim sales membantu memeriksa pilihan
              dan mengatur permintaan kunjungan.
            </p>
            <WhatsappCta phone={site.phone} />
          </div>
          <div className="visit-note">
            <Icon name="clock" />
            <h3>Kunjungan yang terencana</h3>
            <p>
              Permintaan survei diperiksa terlebih dahulu. Jadwal menjadi pasti setelah dikonfirmasi
              oleh tim sales.
            </p>
            <Link href="/properti" className="text-link">
              Pilih properti yang ingin dilihat <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
