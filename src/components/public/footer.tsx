import Link from "next/link";
import { Brand } from "./brand";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-rule" data-motion="line" aria-hidden="true" />
      <div className="container footer-main" data-motion="rise">
        <div>
          <Link className="wordmark" href="/" aria-label={`${name}, beranda`}><Brand name={name} /></Link>
          <p>Ruang baru. Cerita berikutnya.</p>
        </div>
        <nav aria-label="Tautan footer">
          <Link href="/properti">Katalog properti</Link>
          <Link href="/tentang">Tentang Nusa</Link>
          <Link href="/privasi">Privasi</Link>
        </nav>
      </div>
      <div className="container footer-bottom" data-motion="rise" data-motion-delay="70">
        <span>© 2026 {name}. Website demo, bukan penawaran properti nyata.</span>
        <span>BSD · Alam Sutera · Bintaro</span>
      </div>
    </footer>
  );
}
