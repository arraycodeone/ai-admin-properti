"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="id"><body><main><h1>Aplikasi belum dapat dimuat</h1><p>Periksa konfigurasi dan koneksi layanan, lalu coba kembali.</p><button onClick={reset}>Coba lagi</button></main></body></html>;
}
