import Link from "next/link";

export function Header({ name }: { name: string }) {
  return <>
    <div className="demo-strip"><span>Demo lokal</span> Katalog sintetis untuk pengujian. Bukan penawaran properti nyata.</div>
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="wordmark" aria-label={`${name}, beranda`}>{name}<span className="brand-period">.</span></Link>
      <nav aria-label="Navigasi utama"><Link href="/properti">Cari properti</Link><Link href="/#konsultasi">Konsultasi</Link></nav>
      <Link href="/login" className="button button-outline header-login">Masuk tim</Link>
    </div></header>
  </>;
}
