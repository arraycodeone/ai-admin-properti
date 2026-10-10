# Verifikasi seed pada target uji

T-011 telah diuji pada Supabase terisolasi: dua run menghasilkan ID dan hitungan yang sama tanpa mengubah password akun yang sudah ada. Seed hanya untuk fixture pengujian; jangan menjalankannya pada data pelanggan.

## Jalankan

1. Periksa target sesuai [setup Supabase](supabase-setup.md): `APP_ENV=development`, `TEST_DATABASE_CONFIRM_ISOLATED=true`, dan API/SQL satu proyek dengan TLS terverifikasi.
2. Setelah target diperiksa, isi `TEST_SEED_CONFIRM_ISOLATED=true` dan `TEST_SEED_PASSWORD` unik minimal 16 karakter di `.env.local`.
3. Jalankan `npm.cmd run test:seed`; runner menjalankan seed dua kali dan membandingkan hasil. Kemudian jalankan `npm.cmd run test:db`, `npm.cmd run test:access`, dan `npm.cmd run test:auth` secara berurutan. Tes tersebut memakai database yang sama dan tidak boleh berjalan bersamaan.

Fixture mencakup dua organisasi, 14 properti (10 konsep publik dan 4 kasus akses), 20 FAQ, lima akun/membership, dan empat kontak/prospek sintetis. Guard menolak organisasi asing, proses aktif, akun di luar allowlist, password pendek, URL proyek berbeda, serta target yang tidak dikonfirmasi. Runner tidak menghapus data asing secara otomatis.

Seed memakai upsert bertahap melalui Data API dan Auth Admin, bukan transaksi lintas layanan. Jika gagal, perbaiki penyebab lalu ulangi pada target yang sama setelah proses lama berhenti; akun lama ditemukan kembali melalui email dan password tidak direset. Jangan memakai reset schema atau penghapusan akun massal sebagai pemulihan.

[Bukti awal](archive/seed-verification-before-nusa-direction.md) disimpan sebagai sejarah. Nama fixture internal `src/demo/` tidak menunjukkan mode aplikasi.
