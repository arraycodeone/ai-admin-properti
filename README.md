# Nusa Property

Fondasi lokal Website Agen dan AI Admin Properti. Next.js, TypeScript, Tailwind, Supabase Auth/PostgreSQL.

**Status 4 Oktober 2026:** website, katalog, dan profil agensi dapat dijalankan lokal dalam mode preview. Dua migrasi untuk 21 tabel, seed berulang, batas akses serta login/logout browser lokal sudah terverifikasi pada Supabase uji. Verifikasi sesi pada URL HTTPS dan matriks akses lengkap masih menunggu. WhatsApp, AI, jobs, handoff, dan operasional sales masih backlog. Ini belum rilis demo end-to-end.

## Mulai membaca proyek

| Kebutuhan | Baca / buka |
| --- | --- |
| Petunjuk kerja AI agent | [AGENTS.md](AGENTS.md) |
| Struktur kode dan alur data saat ini | [Arsitektur](docs/architecture.md) |
| Halaman / fitur / infrastruktur | `src/app/` / `src/modules/` / `src/server/` |
| Data sintetis preview dan seed | `src/demo/` |
| Desain yang berlaku | [DESIGN.md](DESIGN.md) |
| Skema database dan aturan akses | [Database](docs/database.md) |
| Aktor dan skenario produk | [Bisnis](docs/business.md) |
| Rencana / task / status aktual | [Roadmap](docs/roadmap.md) / [Backlog](docs/backlog.md) / [Status](docs/implementation-status.md) |
| Gambar siap pakai dan file sumber | `public/asset/` dan [assets-source](assets-source/README.md) |

Mulai dari file yang terkait tugas. `docs/archive/` menyimpan rancangan lama, bukan acuan implementasi aktif. Konfigurasi Next.js, TypeScript, lint, dan tes tetap di root.

## Menjalankan lokal

Node 24 digunakan saat verifikasi. Dari PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka `http://localhost:3000`. Tidak memerlukan `.env.local` untuk preview sintetis. Gunakan `npm.cmd` di Windows jika execution policy memblokir `npm.ps1`.

| URL | Perilaku |
| --- | --- |
| `/` | Landing page dengan pencarian, kategori, lokasi, dan katalog contoh. |
| `/properti` | Filter lokasi, tipe, anggaran, dan minimal kamar. |
| `/properti/modern-house-bsd` | Detail fixture NUSA-001 dan galeri ilustrasi. |
| `/tentang` | Profil agensi Nusa, pendekatan layanan, kawasan, dan status konsultasi. |
| `/privasi` | Penjelasan penggunaan data pada demo. |
| `/login` | Status koneksi atau login Supabase, sesuai mode. |
| `/app`, `/app/properti` | Memerlukan pengguna Supabase dan membership aktif. |

Navigasi pelanggan tidak memuat tautan login atau dashboard. `/login` hanya tersedia melalui URL langsung; `/app` tetap dilindungi sesi dan membership aktif. Route `/preview` dihapus dan menghasilkan 404. Mode preview lokal tidak mengaktifkan login Supabase. Fixture prospek tetap tersedia untuk seed dan pengujian.

## Pemeriksaan

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
node scripts/check-design.mjs
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

E2E memakai build produksi pada `127.0.0.1:3100`, terpisah dari dev server. Jalankan build sebelum E2E. Pada Windows, Playwright memerlukan izin untuk membuat dan menutup proses browser/server uji. `test-results/` dan `playwright-report/` tidak masuk Git.

`npm.cmd run test:db` membutuhkan database uji yang telah dimigrasi dan di-seed. Perintah gagal dengan `NOT RUN` bila konfigurasi belum tersedia; itu bukan tes lulus. Lihat [hasil pengujian](docs/test-results.md).

`npm.cmd run test:db -- --schema` menguji constraint dan default akses sebelum seed, dengan fixture SQL sementara yang seluruhnya di-rollback. Petunjuk bootstrap proyek kosong dan `db:types` ada di [panduan migrasi](docs/supabase-migrations.md).

`npm.cmd run test:seed` menjalankan seed dua kali pada target uji yang telah dikonfirmasi, lalu memeriksa hitungan, ID, membership, assignment dan password akun lama. Dua run dan suite `test:db` berseed lulus pada 4 Oktober 2026 dengan 14 properti Nusa (10 publik dan 4 fixture akses). Fixture tetap tersimpan; lihat [bukti dan pemulihan seed](docs/seed-verification.md).

`npm.cmd run test:auth` memakai server uji sendiri pada port 3100 dan akun seed untuk menguji login/logout, membership, pergantian akun, refresh serta expiry. Delapan skenario lokal lulus; preview HTTPS belum diuji. Jalankan build terlebih dahulu dan jangan bersamaan dengan E2E preview. Lihat [panduan sesi browser](docs/auth-verification.md).

## Menyiapkan Supabase uji

Ikuti [panduan setup dan pemeriksaan koneksi](docs/supabase-setup.md) untuk issue #3. Jalankan `npm.cmd run check:supabase` setelah konfigurasi target uji lengkap; pemeriksaan ini bisa berjalan sebelum migrasi dan seed.

**Hasil 4 Oktober 2026:** koneksi Auth/PostgreSQL, dua migrasi, tes schema, generation tipe, seed dua kali, tes database berseed dan sesi browser lokal lulus. Actor/RLS diuji melalui `test:access`; sesi browser melalui `test:auth`. Aplikasi tetap preview; URL HTTPS dan matriks akses lengkap menjadi tahap berikutnya.

1. Siapkan proyek Supabase terisolasi. Alternatif lokal memerlukan Docker dan Supabase CLI; keduanya belum tersedia saat implementasi ini.
2. Bila belum ada, salin `.env.example` menjadi `.env.local`. Isi URL/publishable key/secret key serta koneksi SQL milik proyek uji dan `APP_ENV=test`. Jalankan checker dalam mode `supabase` sesuai panduan di atas.
3. Untuk proyek baru kosong, ikuti `db:bootstrap -- --check`, `db:bootstrap`, `db:types`, dan `test:db -- --schema` pada panduan migrasi. Proyek uji saat ini sudah dimigrasi; jangan bootstrap ulang. Aktifkan `APP_MODE=supabase` untuk aplikasi setelah seed dan pemeriksaan akses tersedia.
4. Tetapkan password demo unik minimal 16 karakter pada `DEMO_SEED_PASSWORD`, serta `DEMO_SEED_CONFIRM_ISOLATED=true`.
5. Jalankan `npm.cmd run seed:demo`. Seed menggunakan Auth Admin API dan tidak mengubah password akun yang sudah ada. Seed menolak organisasi non-demo atau organisasi di luar dua fixture.
6. Isi `TEST_DATABASE_URL` dari database uji yang sama dan `TEST_DATABASE_CONFIRM_ISOLATED=true`, lalu jalankan `npm.cmd run test:db`.
7. Seed, isolasi Data API dan sesi browser lokal sudah lulus. Berikutnya ulangi sesi pada URL HTTPS setelah issue #7 dan selesaikan matriks gabungan #9.

Akun fixture: `owner.a@example.test`, `andi@example.test`, `sari@example.test`, `inactive@example.test`, `owner.b@example.test`. Password hanya berasal dari environment. Situs tetap terikat organisasi A melalui konfigurasi server; Owner B adalah identitas uji isolasi.

Seed bersifat reset fixture: menjalankan ulang akan mengembalikan katalog dan empat lead ke kondisi contoh. Gunakan hanya proyek uji. Seed lintas Auth dan tabel belum merupakan transaksi tunggal; jika gagal sebagian, perbaiki penyebab lalu jalankan ulang.

## Batas implementasi

- Tidak ada fallback fixture ketika `APP_MODE=supabase` mengalami error. UI menampilkan kegagalan.
- Secret database hanya di server. Data katalog menggunakan DTO allowlist; bigint rupiah diserialisasi sebagai string.
- Semua 21 tabel memakai RLS. Mutasi langsung pengguna dicabut; RPC mutasi bisnis dan Storage upload belum tersedia.
- Kanal uji belum aktif. Tidak ada nomor acak pada CTA dan tidak ada pengiriman WhatsApp.
- `noindex` berlaku pada metadata dan HTTP header. Sitemap kosong selama demo. `APP_ENV=production` ditolak sampai gate produksi dikerjakan.
- Mode preview memakai 10 listing Nusa dengan foto AI dan spesifikasi sintetis berlabel demo. Mode Supabase belum memiliki integrasi foto. Jangan memakai katalog ini sebagai penawaran nyata.
- Tipe database di `src/types/database.generated.ts` dihasilkan dengan `npm.cmd run db:types`. Client aplikasi memakai koreksi kontrak di `src/types/database.ts`; DTO publik tetap eksplisit dan uang berupa string.

## Desain dan progres

Arahan terbaru mengikuti [DESIGN.md](DESIGN.md): Nusa Property, premium hangat, ivory/charcoal/bronze, judul serif, foto arsitektur besar, serta pencarian responsif. Dokumen dalam `docs/archive/` merupakan sejarah, bukan desain aktif.

Halaman publik memakai Cormorant Garamond 500 dan Manrope 400–600 melalui `next/font/local`, lengkap dengan lisensi. Reveal dan parallax ringan memakai API browser, mendukung reduced motion. Filter menghilangkan outline luar saat klik/tap dan menampilkan garis bawah inset untuk keyboard. Konten publik dan pencarian GET tetap tersedia tanpa JavaScript.

Paket gambar Nusa Property pada `public/asset/` sudah dipetakan melalui metadata `assets-source/` ke 10 listing preview; empat fixture nonpublik/organisasi lain tetap dipertahankan. Galeri, kawasan, dan profil agen diberi label ilustrasi. Seed telah diselaraskan tetapi tidak dijalankan saat redesign; tidak ada perubahan database aktif.

- [Keputusan desain terbaru](docs/decisions/001-design-and-local-scope.md)
- [Delivery Gate Anti Slop](docs/anti-slop-check.md)
- [Status seluruh backlog](docs/implementation-status.md)
- [Skenario demo lokal](docs/demo-script.md)

Referensi teknis yang diperiksa: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Next.js proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs). Versi dependensi tepat tersimpan di `package-lock.json`.
