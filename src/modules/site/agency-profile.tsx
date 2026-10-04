import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { WhatsappCta } from "@/components/public/whatsapp-cta";
import { AreaCards } from "./area-cards";
import { agencyApproach } from "./content";

export function AgencyProfile({ phone }: { phone: string | null }) {
  return (
    <main id="main">
      <section className="container about-hero" aria-labelledby="about-heading">
        <div className="about-hero-copy">
          <p className="eyebrow" data-motion="hero">Tentang agensi</p>
          <h1 id="about-heading" data-motion="hero" data-motion-delay="70">Mengenal<br /><em>Nusa Property.</em></h1>
          <p data-motion="hero" data-motion-delay="140">Ruang yang Anda pilih akan menjadi bagian dari keseharian. Pencariannya layak dimulai dengan memahami apa yang Anda butuhkan.</p>
          <Link href="#pendekatan" className="text-link" data-motion="hero" data-motion-delay="210">Kenali pendekatan kami <Icon name="arrow" /></Link>
        </div>
        <figure>
          <div className="about-hero-image" data-motion="photo">
            <Image data-parallax src="/asset/images/properties/luxury-residence-bsd/02-living-room.webp" alt="Ilustrasi AI interior hunian dengan ruang duduk dan cahaya alami" fill sizes="(max-width: 760px) 100vw, 55vw" preload />
          </div>
          <figcaption className="image-caption">Ilustrasi AI dari koleksi hunian demo Nusa.</figcaption>
        </figure>
      </section>

      <section className="container about-intro section" aria-labelledby="agency-heading">
        <p className="eyebrow" data-motion="rise">Tentang Nusa Property</p>
        <div data-motion="rise" data-motion-delay="70">
          <h2 id="agency-heading">Pendamping pencarian<br /><em>hunian Anda.</em></h2>
          <p>Nusa Property diperkenalkan dalam demo ini sebagai agensi yang mendampingi pencarian rumah dan apartemen di BSD, Alam Sutera, dan Bintaro.</p>
          <p>Pendekatannya berawal dari kebutuhan ruang, lokasi, dan anggaran. Katalog membantu Anda membandingkan pilihan sebelum membicarakan rincian properti dan rencana kunjungan.</p>
          <p className="about-disclosure">Profil agensi dan listing pada website ini merupakan materi demo, bukan penawaran properti nyata.</p>
        </div>
      </section>

      <section id="pendekatan" className="about-approach section" aria-labelledby="approach-heading">
        <div className="container">
          <div className="section-heading" data-motion="rise">
            <div>
              <p className="eyebrow">Pendekatan layanan</p>
              <h2 id="approach-heading">Dari kebutuhan,<br /><em>menuju pilihan.</em></h2>
            </div>
          </div>
          <div className="approach-layout">
            <figure>
              <div className="approach-image" data-motion="photo">
                <Image data-parallax src="/asset/images/properties/family-house-alam-sutera/02-living-room.webp" alt="Ilustrasi AI ruang keluarga yang terbuka ke taman" fill sizes="(max-width: 760px) 100vw, 45vw" />
              </div>
              <figcaption className="image-caption">Ruang keluarga · Ilustrasi AI</figcaption>
            </figure>
            <ol className="approach-list">
              {agencyApproach.map((step, index) => (
                <li key={step.title} data-motion="rise" data-motion-delay={index * 70}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="service-area-heading">
        <div className="section-heading" data-motion="rise">
          <div>
            <p className="eyebrow">Kawasan layanan</p>
            <h2 id="service-area-heading">Mulai dari<br /><em>kawasan pilihan.</em></h2>
          </div>
          <p>Telusuri rumah dan apartemen<br />di BSD, Alam Sutera, dan Bintaro.</p>
        </div>
        <AreaCards />
      </section>

      <section className="about-closing section" aria-labelledby="next-step-heading">
        <div className="container about-closing-inner">
          <div data-motion="rise">
            <p className="eyebrow">Langkah berikutnya</p>
            <h2 id="next-step-heading">Ada ruang<br /><em>untuk rencana Anda.</em></h2>
          </div>
          <div data-motion="rise" data-motion-delay="70">
            <p>Lihat pilihan hunian yang tersedia dalam katalog demo. Catat properti yang ingin Anda kenali lebih jauh.</p>
            <Link href="/properti" className="text-link">Lihat katalog properti <Icon name="arrow" /></Link>
            <WhatsappCta phone={phone} />
          </div>
        </div>
      </section>
    </main>
  );
}
