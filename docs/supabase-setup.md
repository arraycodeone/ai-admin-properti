# Setup Supabase uji terisolasi

Gunakan proyek Supabase khusus uji tanpa data pelanggan. Target lokal saat ini memakai project ref `awzaykziwppimnagermn`; verifikasi lagi identitas proyek sebelum menjalankan mutasi. Jangan menyalin kunci, password, atau connection string ke Git, issue, atau chat.

1. Salin `.env.example` ke `.env.local`. Isi `APP_ENV=development`, `SITE_URL`, `SITE_ORGANIZATION_ID`, `NEXT_PUBLIC_SUPABASE_URL`, publishable key, dan secret key dari proyek yang sama.
2. Isi `TEST_DATABASE_URL` dengan koneksi PostgreSQL direct/session pooler proyek itu. Hosted connection harus memakai `sslmode=verify-full`; bila perlu, gunakan CA lokal melalui `sslrootcert`. Encode karakter khusus pada password.
3. Setelah API dan SQL dipastikan menunjuk proyek yang sama dan target bebas data pelanggan, isi `TEST_DATABASE_CONFIRM_ISOLATED=true`. Seed memerlukan konfirmasi terpisah `TEST_SEED_CONFIRM_ISOLATED=true` dan `TEST_SEED_PASSWORD` minimal 16 karakter.
4. Jalankan `npm.cmd run check:supabase`. Script memeriksa Auth, Admin API, dan SQL dasar tanpa mengubah data. Untuk schema/seed/tes, ikuti [panduan migrasi](supabase-migrations.md) dan [verifikasi seed](seed-verification.md).

Checker dan script tes menolak target yang tidak cocok atau TLS hosted yang tidak terverifikasi. Aplikasi membaca Supabase pada `development` maupun `production`; ketiadaan layanan menghasilkan error yang terlihat.

Rujukan: [API keys Supabase](https://supabase.com/docs/guides/getting-started/api-keys), [koneksi PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres). [Catatan setup sebelumnya](archive/supabase-setup-before-nusa-direction.md) hanya untuk sejarah.
