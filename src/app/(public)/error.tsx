"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="container section"><div className="empty-state" role="alert"><h1>Katalog belum dapat dimuat</h1><p>Terjadi masalah saat mengambil data. Silakan coba kembali.</p><button className="button" onClick={reset}>Coba lagi</button></div></main>;
}
