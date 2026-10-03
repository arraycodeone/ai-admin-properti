"use client";

export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main" className="empty-state" role="alert"><h1>Data belum dapat dimuat</h1><p>Periksa koneksi layanan dan coba kembali.</p><button className="button" onClick={reset}>Coba lagi</button></main>; }
