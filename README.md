# Nusa Property

Website katalog konsep dan ruang kerja owner/sales, dibangun dengan Next.js, TypeScript, Tailwind, dan Supabase. Bahasa tampilan Indonesia; nominal rupiah disimpan sebagai teks desimal; waktu ditampilkan dalam WIB.

## Status

Katalog, login, pengelolaan listing oleh owner, dan ringkasan kerja tersedia. Editor FAQ owner berada pada branch lanjutan yang menunggu review. Sepuluh listing Nusa memakai spesifikasi sintetis dan gambar AI **sebagai konsep ilustratif**, bukan penawaran unit nyata. Situs tetap `noindex`. Foto listing nyata, inbox, WhatsApp, AI, pekerjaan latar, dan alur sales masih dalam backlog. PR #26 untuk editor listing sudah tergabung ke `develop`; gerbang Auth HTTPS dan akses #7 → #8 → #9 belum dibuktikan.

## Jalankan lokal

Node 24 dan npm digunakan untuk verifikasi. Salin `.env.example` ke `.env.local`, lalu isi URL dan kunci Supabase untuk target pengembangan. `APP_ENV=development` adalah pengaturan lokal. Aplikasi gagal secara jelas bila koneksi database tidak tersedia; tidak ada mode data pengganti.

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka `http://localhost:3000`. Halaman tim ada di `/login` dan `/app`; katalog internal ada di `/app/properti`, FAQ di `/app/faq`. Hanya owner yang dapat mengubah listing dan FAQ. Navigasi publik tidak menautkan halaman tim.

## Pemeriksaan

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
node scripts/check-design.mjs
npm.cmd run build
npm.cmd run test:e2e
```

Playwright membuka server tes sendiri di port 3100 dan tidak memakai server pengguna. `test:db`, `test:access`, `test:auth`, dan `test:seed` memerlukan Supabase uji terisolasi serta konfirmasi target dalam `.env.local`; script menolak target yang tidak sesuai. Lihat [panduan database](docs/supabase-migrations.md), [pengujian akses](docs/access-verification.md), dan [hasil tes](docs/test-results.md). Jangan menjalankan seed pada data pelanggan.

## Batas rilis

- `APP_ENV` hanya menerima `development` atau `production`; produksi belum diaktifkan pada hosting. Selama gerbang rilis belum lulus, metadata dan header tetap `noindex`, robots menutup seluruh situs, dan sitemap kosong.
- Gambar dan profil AI ditandai sebagai ilustrasi. Katalog konsep harus diganti atau diverifikasi sebelum menjadi penawaran properti nyata.
- Supabase Auth dan RLS membatasi owner/sales. Aplikasi menggunakan DTO katalog publik dan tidak mengirim kunci server ke browser. Rupiah tidak dikonversi ke JavaScript `Number`.
- Integrasi WhatsApp yang dipilih adalah Open-WA pada server terpisah. Konfigurasi untuk rilis 5.4.0 tersedia di [panduan Open-WA](docs/open-wa.md); endpoint, webhook HTTPS, dan pengujian perangkat belum diverifikasi. Jangan menganggap tombol konsultasi sebagai bukti pesan masuk.

[Arsitektur](docs/architecture.md) · [Desain](DESIGN.md) · [Backlog](docs/backlog.md) · [Status implementasi](docs/implementation-status.md) · [Aturan Git](docs/git-workflow.md)
