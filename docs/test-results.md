# Bukti pengujian lokal

## Autentikasi browser nyata lokal, 4 Oktober 2026

`npm.cmd run test:auth` lulus 8 skenario dengan akun seed dan layanan Auth/Data API Supabase nyata: tanpa sesi, password salah/benar tiga peran, logout, nonaktif/organisasi lain, pergantian akun dan Back, refresh serta penolakan sesi yang `not_after`-nya diubah khusus untuk tes. Cookie expiry dibersihkan; response internal `no-store`. Metode dan batas: [auth-verification.md](auth-verification.md).

Typecheck, lint, 54 tes lokal dan build lulus. Empat tes proxy melindungi penanganan expiry tanpa logout saat layanan terganggu. Trace/video/screenshot dan storage state tidak disimpan; sesi yang dibuat suite dibersihkan. Akun dan data demo tetap tersedia.

Regresi `test:e2e` mode preview lulus 22 tes desktop/mobile. Suite `test:db` berseed juga tetap lulus untuk akses dan integritas setelah cleanup sesi. Tidak ada migrasi baru.

Pengujian preview HTTPS **NOT RUN**, menunggu issue #7. Tidak menunggu JWT habis secara alami: SDK cache dipaksa refresh dengan JWT asli, lalu lifetime sesi server khusus tes dibuat lampau. Tidak mengubah pengaturan Auth proyek, password, atau membership.

## Seed Nusa pada Supabase nyata, 4 Oktober 2026

`test:seed` lulus dua run dari target awal kosong: masing-masing 2 organisasi, 14 properti, 20 FAQ, 5 akun/membership, 4 kontak/lead, 2 site settings, 1 kanal dan 1 detail privat. ID, assignment, sales default serta password lama terjaga. Hash dibandingkan hanya di PostgreSQL; tidak dicetak.

`test:db` berseed lulus (`access.test.sql`, `integrity.test.sql`). Fixture seed dipertahankan untuk tes sesi berikutnya, transaksi tes di-rollback. Ini belum membuktikan login/logout browser atau seluruh matriks tabel/aset. Lihat [bukti rinci](seed-verification.md).

Typecheck, lint, 50 tes lokal, build dan 22 E2E Nusa lulus. Setelah menambahkan pemeriksaan identitas agensi, dua run seed tambahan lulus pada target yang sudah berisi fixture dengan hitungan identik. `test:access` yang command-nya dipulihkan juga lulus; akun dan organisasi sementaranya dibersihkan, fixture demo tetap utuh.

## Persiapan seed dua kali, 4 Oktober 2026

- Typecheck dan lint lulus; `npm.cmd test` lulus 38 tes pada 5 file, termasuk 13 tes seed.
- Build dan 10 E2E desktop/mobile pada branch fondasi lulus. PR desain Nusa tetap terpisah.
- Tes seed memeriksa penolakan produksi/demo, kedua konfirmasi isolasi, password pendek, key kosong, target API/SQL berbeda, organisasi non-demo/aktif/asing, dan akun asing sebelum mutasi. Mock juga membuktikan jalur akun lama tidak membuat ulang akun serta kegagalan createUser sebagian dapat dilanjutkan.
- `npm.cmd run test:seed` pada konfigurasi lokal menghasilkan `NOT RUN: konfigurasi` dengan exit 1. Ini membuktikan guard, bukan kelulusan dua seed nyata.
- `DEMO_SEED_CONFIRM_ISOLATED` belum true dan password belum tersedia; seed, perbandingan password database dan suite `test:db` berseed belum dijalankan. Tidak ada migrasi atau data database yang diubah.

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
