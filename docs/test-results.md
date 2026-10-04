# Bukti pengujian lokal

## Penyempurnaan animasi hero, 4 Oktober 2026

Judul hero masuk per baris dengan translate 24 px, jeda 70 ms dan durasi 900 ms. Foto zoom-out 1.08 ke 1 dalam bingkai tetap. Keyframe aktual diperiksa pada browser dan screenshot saat animasi ditinjau. Tautan hero memakai fade tanpa transform supaya klik cepat tidak terganggu saat fokus masuk.

Typecheck, lint, 26 tes logika, build, pemeriksaan kontras, dan 22 E2E lulus kembali. E2E mencakup klik CTA hero, tampilan desktop/mobile, sekali per kunjungan, reduced motion dan konten tanpa JavaScript. Tidak ada dependency tambahan.

## Font, motion, profil dan navigasi Nusa, 4 Oktober 2026

Windows, Node 24.16.0, build produksi dalam mode preview. Dependency tidak ditambah. Server Playwright memakai port 3100 dan dihentikan setelah pengujian; dev server pengguna tidak dihentikan.

| Pemeriksaan | Hasil |
| --- | --- |
| `npm.cmd run typecheck` | PASS. |
| `npm.cmd run lint` | PASS tanpa warning. |
| `npm.cmd test` | PASS: 26 tes pada 5 file. |
| `node scripts/check-design.mjs` | PASS: teks 4,76–14,09:1; kontrol/fokus 3,21–14,09:1, termasuk indikator keyboard charcoal. |
| `npm.cmd run build` | PASS: `/tentang` dibangun, `/preview` tidak ada. |
| `npm.cmd run test:e2e` | PASS: 22 tes pada desktop 1440 dan mobile 360 px; screenshot tambahan 768 px, profil pada ketiga lebar; overflow juga diperiksa pada landscape 800 px. |
| Tinjauan visual | Landing, profil dan detail diperiksa; judul, input 16 px, harga dan gambar tampil tanpa overflow. |

Cakupan tambahan:

- Klik desktop dan tap mobile pada filter landing/katalog tanpa outline luar; Tab/Shift+Tab menghasilkan inset bawah charcoal 2 px. Ukuran field tetap; tombol mempertahankan outline keyboard. Select tetap native.
- Tiga WOFF2 dimuat dari origin lokal tanpa request Google Fonts. FontFace normal/body dan italic pada halaman yang memakainya terkonfirmasi loaded; heading bobot 500.
- Reveal sekali saat scroll, scroll cepat ke footer lalu kembali, navigasi ke profil/beranda, parallax desktop dibatasi 12 px dan mati pada mobile. Reduced motion sejak awal dan perubahan preferensi saat terbuka mengakhiri animasi, tanpa pageerror.
- Tanpa JavaScript, landing/profil tampil dan formulir GET dapat disubmit dengan keyboard. Navigasi mobile tetap terlihat. Loading suspense publik sebelumnya menyembunyikan konten akhir; boundary publik itu dihapus, loading dashboard tetap tersedia.
- HTML server dan DOM seluruh halaman publik tidak mengandung tautan `/login`, `/app`, `/preview`. `/preview` berstatus HTTP 404; `/app` dan `/app/properti` tanpa sesi menuju `/login`, dengan status login belum aktif pada mode preview.
- Profil agensi tidak memuat Michael; ketiga kawasan membuka filter sesuai lokasi. Semua alur pencarian, 10 detail, galeri keyboard, menu mobile, noindex, kanal nonaktif, dan larangan listing nonpublik tetap lulus.

Saat menulis tes, pemeriksaan font diperbaiki agar memeriksa keluarga utama yang benar-benar digunakan; font fallback lokal atau italic pada halaman tanpa teks italic tidak wajib diinstansiasi browser. Pengiriman form tanpa JavaScript diuji melalui Tab/Enter karena otomatisasi klik offscreen Chromium tertahan pada viewport mobile; alur klik dengan JavaScript tetap diuji.

Bukti sementara yang diabaikan Git: `test-results/landing-{desktop,mobile}.png`, `landing-*-viewport.png`, `landing-tablet-*.png`, `about-{360,768,1440}-*.png`, dan `detail-*.png`.

Seed, database, sesi Supabase/RLS nyata, WhatsApp dan deployment tidak dijalankan. Tes fixture/mock tidak membuktikan akses database nyata. Bagian berikut adalah riwayat pemeriksaan sebelumnya, termasuk route preview yang kini sudah dihapus.

## Redesign Nusa Property, 4 Oktober 2026

Windows, Node 24.16.0, mode preview. Tidak ada dependency baru.

| Pemeriksaan | Hasil |
| --- | --- |
| `npm.cmd run typecheck` | PASS. |
| `npm.cmd run lint` | PASS tanpa warning. |
| `npm.cmd test` | PASS: 26 tes pada 5 file. |
| `node scripts/check-design.mjs` | PASS: teks 4,76–14,09:1; kontrol/fokus 3,21–6,52:1. |
| `npm.cmd run build` | PASS. |
| `npm.cmd run test:e2e` | PASS: 12 tes, desktop 1440 px dan mobile 360 px; tambahan viewport 768 px dan landscape 800 px. |
| Pemeriksaan visual | Screenshot landing desktop/mobile/tablet, viewport awal dan detail ditinjau; tidak ada overflow atau gambar gagal dimuat. |
| Database / seed | Tidak dijalankan. Perubahan SQL hanya penunjukan fixture dengan UUID stabil, tanpa migrasi schema. |

Interaksi yang diverifikasi: filter BSD/Rumah/Rp2 miliar/minimal 2 kamar; NUSA-001 dan NUSA-003; seluruh 10 kartu menuju detailnya; empat thumbnail galeri dengan keyboard; tiga kategori dan tiga kawasan melalui shortcut serta kartu; anchor pilihan/kawasan/konsultasi; menu mobile/Escape; header/footer/login/privasi/preview; reset, hasil kosong, filter invalid dan preservasi nilai filter di luar preset. Listing draft/paused/sold/organisasi B tetap 404. Kanal kosong tidak menghasilkan tautan wa.me. Noindex, reduced motion, skip link dan pemuatan semua gambar landing diuji.

Pemetaan aset diuji terhadap file lokal: cover, empat galeri dan thumbnail untuk setiap listing. Adapter Supabase diuji tidak menerima field privat atau media sintetis. Mock dan fixture bukan bukti Auth/RLS nyata.

Tes awal dalam sandbox mengalami `uv_os_get_passwd` pada runtime tsx; seluruh suite lulus ketika dijalankan dengan izin proses Windows. Selector tautan ambigu pada iterasi pertama E2E diperbaiki menjadi exact match. Tinjauan visual juga memperbaiki posisi pencarian mobile dan visibilitas skip link pada navigasi pointer.

Bukti sementara (diabaikan Git): `test-results/landing-desktop.png`, `landing-mobile.png`, `landing-*-viewport.png`, `landing-tablet-desktop.png`, serta `detail-desktop.png` dan `detail-mobile.png`. Server E2E memakai port 3100 sendiri dan dihentikan oleh Playwright.

## Verifikasi migrasi dan tipe database, 4 Oktober 2026

| Pemeriksaan | Hasil |
| --- | --- |
| `db:bootstrap -- --check` pada proyek kosong | PASS: dua migrasi dan tes schema; seluruh DDL/fixture di-rollback. |
| `db:bootstrap` | PASS: 21 tabel/RLS, bucket privat, dua versi riwayat; tanpa seed tersimpan. |
| `test:db -- --schema` | PASS: constraint, akses default, RPC/DTO dan presisi bigint di database nyata. |
| `db:types` | PASS: generator resmi menghasilkan schema public dan client aplikasi lolos typecheck. |
| `typecheck`, `lint`, `test`, `build`, `test:e2e` | PASS: 25 tes Vitest dan 10 tes E2E mode preview. |
| HTTP RPC dengan budget string bigint maksimum | PASS: HTTP 200; katalog kosong sesuai kondisi belum seed. |
| Bootstrap ulang setelah schema tersedia | Ditolak sesuai guard; tidak ada reset. |
| `test:db` tanpa flag | NOT RUN: fixture seed belum siap; bukan tes akses yang lulus. |

Detail constraint, target, perbaikan grant, dan batas generator: [panduan migrasi](supabase-migrations.md). Sesudah tes tidak ada organisasi atau akun Auth tersimpan. Matriks RLS lengkap dan login pengguna belum diuji.

Saat instalasi dependency, audit npm melaporkan lima temuan high pada rantai development ESLint (`braces`/`micromatch`/`fast-glob`), bukan generator baru. Tidak dilakukan downgrade besar otomatis melalui `audit fix --force`; tindak lanjut dependency perlu ditangani terpisah.

## Verifikasi setup Supabase, 4 Oktober 2026

Typecheck, lint, dan 21 tes Vitest lulus. Empat tes tambahan memastikan checker menolak produksi, target belum dikonfirmasi, SQL beda proyek, dan TLS tanpa verifikasi sebelum membuka koneksi, tanpa mencetak nilai secret tiruan.

`check:supabase` lulus pada proyek uji hosted dalam mode `supabase`/`test`: Auth health, Auth Admin baca saja, dan PostgreSQL `select 1` dalam transaksi baca saja. Koneksi SQL melalui Session pooler port 5432 dengan `sslmode=verify-full` dan CA resmi Supabase. Kegagalan awal `SELF_SIGNED_CERT_IN_CHAIN` selesai setelah CA ditambahkan ke `sslrootcert` lokal. Lihat [setup dan target uji](supabase-setup.md).

Migrasi, seed, login pengguna, dan `test:db` belum dijalankan. Hasil koneksi ini tidak membuktikan RLS. Build/E2E tidak diulang karena perubahan hanya script setup, tes, dan dokumentasi; kode aplikasi tidak berubah. Hasil milestone terdahulu di bawah dipertahankan sebagai riwayat.

## Verifikasi perapihan struktur, 4 Oktober 2026

Lingkungan: Windows, Node 24.16.0. Dependensi dan lockfile tidak berubah.

| Pemeriksaan | Hasil |
| --- | --- |
| `npm.cmd run typecheck` | PASS: route types dan TypeScript valid. |
| `npm.cmd run lint` | PASS: tanpa error atau warning. |
| `npm.cmd test` | PASS: 17 tes dalam 2 file. Enam tes tambahan memeriksa query internal setelah dipindahkan. |
| `node scripts/check-design.mjs` | PASS: 9 pasangan warna; minimum 4,83:1. CSS tidak berubah. |
| `npm.cmd run build` | PASS: semua route lama tetap dibangun. |
| `npm.cmd run test:e2e` | PASS: 10 tes desktop/mobile, termasuk filter, detail, redirect login, preview, keyboard, dan overflow. |
| Perbandingan screenshot beranda | PASS: SHA-256 desktop dan mobile hasil E2E identik dengan `docs/evidence/landing-desktop.png` dan `landing-mobile.png`. |
| Integritas pemindahan aset | PASS: seluruh 181 file cocok dengan SHA-256 sebelum pemindahan; setelahnya hanya README paket diperbarui. |
| Referensi metadata aset | PASS: 298 path/URL pada metadata diperiksa dan file tujuan tersedia. |
| Tautan dokumentasi lokal | PASS: tautan relatif pada README, AGENTS, DESIGN, dokumen aktif/arsip, dan README aset menunjuk ke target yang ada. |
| Kesetaraan data demo | PASS: isi tiga file sama dengan fixture awal setelah baris import dinormalisasi. |
| Batas import | PASS: tidak ada import fixture lama di `src`, `scripts`, atau tes; aturan ESLint menolak contoh import aplikasi dari `tests`. |
| `git diff --check` | PASS: tidak ada kesalahan whitespace. |
| `npm.cmd run test:db` | NOT RUN: exit 1 karena URL database uji dan konfirmasi isolasi belum tersedia. |

Tes query baru memakai mock untuk memastikan pembacaan tanpa actor ditolak sebelum membuka client, organisasi B tetap menjadi scope query actor B, dan error database tidak berubah menjadi data demo atau membocorkan detail internal. Ini bukan pembuktian Auth/RLS pada Supabase nyata. Migrasi dan isi seed tidak diubah; seed tidak dijalankan.

## Bukti milestone sebelumnya

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Versi: working tree milestone lokal v0.1.0, belum ada commit. Lingkungan: Windows, Node 24.16.0, npm 11.13.0, Next 16.3.8, React 19.3.0. Paket dikunci pada package-lock.json.

## Hasil

| Pemeriksaan | Status | Hasil aktual dan cakupan |
| --- | --- | --- |
| `npm.cmd run typecheck` | PASS | Route types dan TypeScript valid. |
| Percobaan salah yang disengaja | PASS | `tests/check-checks.ts` memasukkan string ke number; typecheck gagal TS2322. File percobaan dihapus, build selanjutnya lulus. |
| `npm.cmd run lint` | PASS | Tanpa error atau warning. |
| `npm.cmd test` | PASS | 11 tes Vitest; katalog/tenant/public DTO, filter, harga bigint, WIB, URL WhatsApp, environment dan helper izin. |
| `node scripts/check-design.mjs` | PASS | 9 pasangan warna teks lulus, rasio terendah 4,83:1. |
| `npm.cmd run build` | PASS | Build produksi, route publik/internal dan batas import server/client berhasil. |
| `npm.cmd run test:e2e` | PASS | 10 tes Playwright: lima skenario masing-masing pada desktop 1440×1000 dan mobile 360×800; tambahan landscape 800×360. |
| Pemeriksaan bundle client | PASS | Pencarian pada `.next/static` tidak menemukan nama env privileged atau marker privat fixture. Ini pemeriksaan terbatas, bukan audit keamanan penuh. |
| Pemeriksaan screenshot | PASS | Screenshot desktop dan mobile ditinjau; tidak ada overflow atau elemen bertumpuk pada halaman yang diuji. |
| `npm.cmd run test:db` | NOT RUN | Menolak berjalan dengan exit 1 karena TEST_DATABASE_URL dan konfirmasi target uji tidak tersedia. |
| Migrasi / seed dua kali / Auth nyata / RLS | NOT RUN | Tidak ada Supabase atau PostgreSQL uji. SQL belum dianggap tervalidasi. |
| AI live / WhatsApp / Inngest / hosting | NOT RUN | Akses belum tersedia; adapter/pipeline penuh belum dibuat. |

## Data awal dan hasil yang diharapkan

- Organisasi A mempunyai 9 listing contoh, organisasi B 1 listing. Publik A hanya melihat 6 listing aktif/published.
- Dimas: Bekasi, rumah, budget Rp700 juta, minimal 2 kamar. Hasil harus BKS-001 dan BKS-002. Aktual sesuai.
- Draft, paused, sold, dan listing B harus tidak tampil pada pencarian atau URL detail publik A. Aktual sesuai pada preview.
- Penanda privat yang disuntikkan ke row sumber tidak boleh lolos DTO. Aktual marker dan kolom tambahan hilang dari hasil allowlist.
- Harga 9007199254740993 harus tidak dibulatkan. Aktual tepat melalui bigint/string.
- 16:59:59 UTC dan 17:00:00 UTC harus berada pada dua tanggal WIB berbeda. Aktual sesuai.
- Tidak ada nomor WhatsApp konfigurasi. Aktual menampilkan status kanal belum aktif dan tidak membuat link wa.me.
- `/app` dan `/app/properti` tanpa sesi harus ke `/login`. Aktual sesuai dalam mode preview; ini tidak membuktikan RLS nyata.

## Interaksi yang diperiksa

| Kontrol / alur | Bukti |
| --- | --- |
| Lokasi + tipe + anggaran → Cari properti | URL filter berubah, katalog menampilkan hasil yang cocok. |
| Minimal kamar → Cari properti | Bekasi/Rp700 juta/2 kamar menghasilkan 2 listing. |
| Hapus filter | Katalog kembali ke 6 listing publik sintetis. |
| Link BKS-001 | Navigasi ke detail dengan harga, kode, dan spesifikasi benar. |
| Kategori rumah / apartemen / tanah | Masing-masing membuka filter kategori yang sesuai. |
| Pintasan Depok | Membuka hasil Rumah Teras Sukmajaya. |
| Wordmark header | Kembali ke beranda. |
| Konsultasi | Navigasi ke anchor `#konsultasi`. |
| Privasi | Membuka informasi privasi demo. |
| Masuk tim | Membuka halaman login dengan status belum dikonfigurasi. |
| Lihat pratinjau dashboard | Membuka `/preview`, terpisah dari route internal. |
| Pilihan Sales Sari | Dimas tidak tampil; Nadia tampil. |
| Pencarian prospek yang tidak ada | Menampilkan empty state. |
| Tab pertama + Enter | Skip link mendapat fokus dan menuju `#main`. |
| Reduced motion | Computed scroll-behavior berubah menjadi auto. |
| Route listing tidak terbit / tenant B | Halaman tidak ditemukan. |

Link lain yang menuju target sama diperiksa melalui href dan target route. Form login live, logout dengan sesi, state kegagalan Supabase, upload, serta kontrol bisnis yang belum dibangun tidak diklaim sudah diuji.

Tes awal menemukan selector alert ambigu karena route announcer Next.js, serta label kategori mobile yang lebih pendek. Selector diperbaiki untuk mengikuti peran/konten yang terlihat. Tes akhir lulus tanpa melemahkan pemeriksaan perilaku. Satu run Windows tertahan saat cleanup server oleh sandbox; proses tes milik sesi dihentikan secara terarah dan run diulang dengan izin proses. Dev server pengguna port 3000 tetap berjalan.

## Artefak

- `tests/integration/foundation.test.ts`
- `tests/e2e/site.spec.ts`
- `supabase/tests/access.test.sql`, `supabase/tests/integrity.test.sql` (belum dieksekusi)
- `test-results/.last-run.json`, `playwright-report/index.html` (hasil lokal, tidak masuk Git)
- `docs/evidence/landing-desktop.png`, `docs/evidence/landing-mobile.png`

Hasil lokal tidak menggantikan T-013, T-025, T-030, T-039, T-041, atau UAT/produksi.
