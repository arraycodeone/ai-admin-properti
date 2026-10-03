import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="container section empty-state"><p className="muted">404</p><h1>Halaman tidak ditemukan</h1><p>Properti mungkin belum dipublikasikan atau sudah tidak tersedia.</p><Link className="button" href="/properti">Kembali ke katalog</Link></main>;
}
