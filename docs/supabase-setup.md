# Setup Supabase uji

Lingkup [issue #3](https://github.com/arraycodeone/ai-admin-properti/issues/3): proyek uji terisolasi, konfigurasi lokal, dan koneksi dasar Auth/PostgreSQL. Migrasi, seed, login pengguna, dan pembuktian RLS menjadi issue berikutnya.

## Status 4 Oktober 2026

Update setelah issue #4: kedua migrasi dan tes schema sudah lulus; rincian terbaru ada di [panduan migrasi](supabase-migrations.md). Catatan di bawah merekam tahap koneksi issue #3. Mode aplikasi tetap preview sampai seed dan pengujian akses siap.

- Pengguna sudah login ke dashboard dan menyatakan proyek uji sudah dibuat.
- Target uji: project ref `awzaykziwppimnagermn`, hosted Supabase. API dan username Session pooler cocok dengan proyek tersebut; pengguna mengonfirmasi proyek khusus uji.
- URL/key dan koneksi SQL tersedia di `.env.local`. Gunakan file ini untuk konfigurasi; nilainya diprioritaskan terhadap `.env` oleh Next.js. Checker membaca `.env.local`.
- Browser pengguna belum terhubung ke akses otomasi sesi ini. Supabase CLI dan Docker tidak ditemukan pada PATH.
- Pemeriksaan nyata lulus: Auth health dengan publishable key, akses baca Auth Admin dengan secret key, serta `select 1` dalam transaksi PostgreSQL baca saja melalui Session pooler port 5432.
- TLS menggunakan `sslmode=verify-full` dan `sslrootcert` lokal. Percobaan pertama gagal `SELF_SIGNED_CERT_IN_CHAIN`; setelah CA resmi dipasang, koneksi berhasil. CA diunduh dari URL pada [konfigurasi dashboard resmi](https://github.com/supabase/supabase/blob/master/apps/studio/hooks/custom-content/custom-content.json), disimpan pada `.supabase/prod-ca-2021.crt` yang diabaikan Git.
- Lingkungan checker: `APP_MODE=supabase`, `APP_ENV=test`, origin `http://localhost:3000`, organisasi A `10000000-0000-4000-8000-000000000001`, isolasi SQL dikonfirmasi. Mode aplikasi di file tetap `preview` sampai migrasi tersedia; mode checker diatur pada proses PowerShell.
- Typecheck, lint, dan 21 tes Vitest lulus. Empat tes checker membuktikan penolakan produksi, target belum dikonfirmasi, SQL beda proyek, dan TLS tanpa verifikasi dengan nilai tiruan. Migrasi, seed, login pengguna, dan RLS belum diuji.

## Konfigurasi proyek dan lokal

1. Gunakan proyek khusus aplikasi ini untuk pengujian, tanpa data pelanggan/produksi. Catat nama dan project ref setelah target dikonfirmasi. Jangan menghapus atau mereset proyek lain untuk setup ini.
2. Bila `.env.local` belum ada, salin `.env.example`. Jika sudah ada, lengkapi nilai yang diperlukan tanpa menimpa konfigurasi lain.
3. Ambil Project URL serta publishable key dan secret key dari pengaturan API proyek yang sama. Isi langsung pada `.env.local`, bukan di chat, issue, atau commit. Secret key berbeda dari password database. [Panduan API keys Supabase](https://supabase.com/docs/guides/getting-started/api-keys).
4. Dari **Connect**, ambil connection string SQL. Gunakan direct connection jika jaringan mendukungnya; Session pooler port 5432 tersedia untuk IPv4. Password database yang mengandung karakter khusus harus di-URL-encode. [Panduan koneksi Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).
5. Untuk Supabase hosted, gunakan `sslmode=verify-full`. Bila sertifikat CA diperlukan, unduh dari pengaturan database proyek dan tambahkan `sslrootcert` ke connection string, menunjuk file lokal dengan path yang di-URL-encode. Pertahankan verifikasi sertifikat; jangan memakai `rejectUnauthorized=false`. [Panduan SSL Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres#ssl).
6. Setelah nama/URL dan asal connection string diperiksa, isi `TEST_DATABASE_CONFIRM_ISOLATED=true`. Biarkan `DEMO_SEED_CONFIRM_ISOLATED=false` sampai pekerjaan seed memang dimulai.

| Variabel | Nilai untuk issue #3 |
| --- | --- |
| `APP_MODE` | `supabase` ketika URL dan key sudah siap |
| `APP_ENV` | `test` |
| `SITE_URL` | `http://localhost:3000` |
| `SITE_ORGANIZATION_ID` | `10000000-0000-4000-8000-000000000001` (organisasi A pada fixture) |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari proyek uji |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key proyek tersebut |
| `SUPABASE_SECRET_KEY` | Secret key server proyek tersebut |
| `TEST_DATABASE_URL` | URL PostgreSQL direct/session pooler proyek yang sama |
| `TEST_DATABASE_CONFIRM_ISOLATED` | `true` setelah target uji dikonfirmasi |

Connection string hosted yang diterima checker menggunakan host `db.<project-ref>.supabase.co` atau host `*.pooler.supabase.com` dengan username `postgres.<project-ref>`. API menggunakan `https://<project-ref>.supabase.co`. URL kustom membutuhkan pemeriksaan pemetaan tersendiri. Koneksi lokal didukung bila kedua host memakai loopback.

## Memeriksa koneksi sebelum migrasi

```powershell
$env:APP_MODE = 'supabase'
npm.cmd run check:supabase
Remove-Item Env:APP_MODE
```

Perintah ini memvalidasi mode/target, memeriksa Auth dengan publishable key, membaca satu halaman Auth Admin tanpa mencetak data pengguna, lalu menjalankan `select 1` dalam transaksi SQL baca saja. Tidak membuat tabel, akun, atau data seed. Koneksi/Auth dibatasi 10 detik; statement SQL 30 detik. Endpoint Auth mengikuti [spesifikasi resmi](https://github.com/supabase/auth/blob/master/openapi.yaml); akses Admin memakai [listUsers](https://supabase.com/docs/reference/javascript/auth-admin-listusers).

- `NOT RUN: konfigurasi`: periksa kelengkapan variabel, mode test, konfirmasi isolasi, kecocokan proyek API/SQL, dan pengaturan TLS.
- `FAIL: Auth dengan publishable key`: periksa Project URL, publishable key, status proyek, dan jaringan.
- `FAIL: Auth Admin dengan secret key`: pastikan secret key berasal dari proyek yang sama dan belum dicabut.
- `FAIL: PostgreSQL`: periksa password yang di-encode, host/port, dukungan IPv4/IPv6, serta sertifikat CA dan pengaturan TLS.
- Semua langkah `PASS` membuktikan koneksi dasar saja. `test:db` memerlukan migrasi dan seed, sehingga belum menjadi syarat pada issue #3.

Mode `supabase` pada aplikasi memerlukan tabel dan RPC yang belum tersedia sebelum issue #4. Untuk tetap melihat UI sintetis selama persiapan, gunakan `APP_MODE=preview`; kembalikan ke `supabase` saat menjalankan checker. Pengaturan Auth hosted tidak otomatis mengikuti `supabase/config.toml`; verifikasi URL login dan pembatasan pendaftaran saat mengerjakan Auth.

## Bukti yang dicatat setelah koneksi berhasil

Catat nama/project ref, lingkungan, tanggal, metode koneksi, hasil setiap pemeriksaan, dan hambatan yang tersisa. Jangan mencatat key, password, connection string lengkap, atau data pengguna. Perbarui README dan `docs/implementation-status.md`; tutup issue #3 hanya setelah koneksi nyata terbukti.
