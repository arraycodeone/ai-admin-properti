import Link from "next/link";

export function Footer({ name }: { name: string }) {
  return <footer className="site-footer"><div className="container footer-main">
    <div><Link className="wordmark" href="/">{name}<span className="brand-period">.</span></Link><p>Ruang baru, cerita berikutnya.</p></div>
    <nav aria-label="Tautan footer"><Link href="/properti">Katalog properti</Link><Link href="/privasi">Privasi</Link><Link href="/preview">Pratinjau dashboard</Link></nav>
  </div><div className="container footer-bottom"><span>© 2026 {name}. Identitas agensi contoh.</span><span>Bekasi & sekitarnya · Indonesia</span></div></footer>;
}
