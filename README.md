# Ruang Properti

Fondasi lokal Website Agen dan AI Admin Properti. Next.js, TypeScript, Tailwind, Supabase Auth/PostgreSQL.

**Status 4 Oktober 2026:** website dan preview dapat dijalankan lokal. Dua migrasi untuk 21 tabel sudah diterapkan pada Supabase uji; constraint dasar dan tipe hasil generator terverifikasi. Seed, login pengguna, dan matriks RLS lengkap belum diuji. WhatsApp, AI, jobs, handoff, dan operasional sales masih backlog. Ini belum rilis demo end-to-end.

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
| `/properti/rumah-taman-naraya-bekasi` | Detail fixture BKS-001. |
| `/privasi` | Penjelasan penggunaan data pada demo. |
| `/login` | Status koneksi atau login Supabase, sesuai mode. |
| `/preview` | Pratinjau visual owner/Andi/Sari dari fixture, hanya pada mode preview. |
| `/app`, `/app/properti` | Memerlukan pengguna Supabase dan membership aktif. |

`/preview` tidak menguji RLS dan bukan simulator pesan. Pergantian peran di sana hanya menyaring fixture publik sintetis. `/app` tetap dilindungi.

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

`npm.cmd run test:access` menguji actor/RLS/grant dengan lima akun Auth sementara pada Supabase uji terisolasi, lalu membersihkan fixture. Pengujian ini lulus pada 4 Oktober 2026; seed berulang, login/logout browser dan matriks gabungan tetap terpisah. Lihat [cakupan dan pemulihan](docs/access-verification.md).

## Menyiapkan Supabase uji

Ikuti [panduan setup dan pemeriksaan koneksi](docs/supabase-setup.md) untuk issue #3. Jalankan `npm.cmd run check:supabase` setelah konfigurasi target uji lengkap; pemeriksaan ini bisa berjalan sebelum migrasi dan seed.

**Hasil 4 Oktober 2026:** koneksi Auth/PostgreSQL, dua migrasi, tes schema, dan generation tipe lulus. Aplikasi tetap memakai preview sampai seed dan pengujian akses tersedia. Seed, login pengguna, dan matriks RLS lengkap belum diuji.

1. Siapkan proyek Supabase terisolasi. Alternatif lokal memerlukan Docker dan Supabase CLI; keduanya belum tersedia saat implementasi ini.
2. Bila belum ada, salin `.env.example` menjadi `.env.local`. Isi URL/publishable key/secret key serta koneksi SQL milik proyek uji dan `APP_ENV=test`. Jalankan checker dalam mode `supabase` sesuai panduan di atas.
3. Untuk proyek baru kosong, ikuti `db:bootstrap -- --check`, `db:bootstrap`, `db:types`, dan `test:db -- --schema` pada panduan migrasi. Proyek uji saat ini sudah dimigrasi; jangan bootstrap ulang. Aktifkan `APP_MODE=supabase` untuk aplikasi setelah seed dan pemeriksaan akses tersedia.
4. Tetapkan password demo unik minimal 16 karakter pada `DEMO_SEED_PASSWORD`, serta `DEMO_SEED_CONFIRM_ISOLATED=true`.
5. Jalankan `npm.cmd run seed:demo`. Seed menggunakan Auth Admin API dan tidak mengubah password akun yang sudah ada. Seed menolak organisasi non-demo atau organisasi di luar dua fixture.
6. Isi `TEST_DATABASE_URL` dari database uji yang sama dan `TEST_DATABASE_CONFIRM_ISOLATED=true`, lalu jalankan `npm.cmd run test:db`.
7. Uji login owner/sales/nonaktif, isolasi antarorganisasi, dan jalankan seed dua kali. Langkah ini **belum dilakukan** pada sesi implementasi lokal.

Akun fixture: `owner.a@example.test`, `andi@example.test`, `sari@example.test`, `inactive@example.test`, `owner.b@example.test`. Password hanya berasal dari environment. Situs tetap terikat organisasi A melalui konfigurasi server; Owner B adalah identitas uji isolasi.

Seed bersifat reset fixture: menjalankan ulang akan mengembalikan katalog dan empat lead ke kondisi contoh. Gunakan hanya proyek uji. Seed lintas Auth dan tabel belum merupakan transaksi tunggal; jika gagal sebagian, perbaiki penyebab lalu jalankan ulang.

## Batas implementasi

- Tidak ada fallback fixture ketika `APP_MODE=supabase` mengalami error. UI menampilkan kegagalan.
- Secret database hanya di server. Data katalog menggunakan DTO allowlist; bigint rupiah diserialisasi sebagai string.
- Semua 21 tabel memakai RLS. Mutasi langsung pengguna dicabut; RPC mutasi bisnis dan Storage upload belum tersedia.
- Kanal uji belum aktif. Tidak ada nomor acak pada CTA dan tidak ada pengiriman WhatsApp.
- `noindex` berlaku pada metadata dan HTTP header. Sitemap kosong selama demo. `APP_ENV=production` ditolak sampai gate produksi dikerjakan.
- Foto masih placeholder jujur. Jangan memakai katalog ini sebagai penawaran nyata.
- Tipe database di `src/types/database.generated.ts` dihasilkan dengan `npm.cmd run db:types`. Client aplikasi memakai koreksi kontrak di `src/types/database.ts`; DTO publik tetap eksplisit dan uang berupa string.

## Desain dan progres

Arahan terbaru mengikuti [DESIGN.md](DESIGN.md), dengan struktur pencarian/katalog terinspirasi [Pinhome](https://www.pinhome.id/). Panduan hijau/serif lama di `docs/archive/design-system/ai-admin-properti/` tetap disimpan sebagai artefak sebelumnya dan tidak diimpor aplikasi.

Paket gambar Nusa Property telah dipisahkan ke `public/asset/` dan `assets-source/`. Paket itu belum dipetakan ke katalog Ruang Properti/Bekasi; halaman tetap memakai placeholder. Metadata paket bukan sumber data aplikasi.

- [Keputusan desain terbaru](docs/decisions/001-design-and-local-scope.md)
- [Delivery Gate Anti Slop](docs/anti-slop-check.md)
- [Status seluruh backlog](docs/implementation-status.md)
- [Skenario demo lokal](docs/demo-script.md)

Referensi teknis yang diperiksa: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Next.js proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs). Versi dependensi tepat tersimpan di `package-lock.json`.
