# Verifikasi seed demo

Issue #6 / T-011. Implementasi pemeriksaan tersedia; pembuktian dua kali pada Supabase **belum dijalankan**. Konfirmasi khusus seed dan password belum disiapkan pada 4 Oktober 2026.

## Menjalankan

Gunakan proyek Supabase uji terisolasi yang sudah dimigrasi. Konfigurasi API/SQL harus menunjuk proyek yang sama dan koneksi hosted memakai TLS terverifikasi, mengikuti [setup Supabase](supabase-setup.md).

1. Pastikan `APP_ENV=test` dan `TEST_DATABASE_CONFIRM_ISOLATED=true`.
2. Setelah menyetujui bahwa seed mengembalikan fixture ke kondisi contoh, isi `DEMO_SEED_CONFIRM_ISOLATED=true` serta `DEMO_SEED_PASSWORD` unik minimal 16 karakter dalam `.env.local`. Jangan mengirim password melalui chat atau memasukkannya ke Git.
3. Jalankan `npm.cmd run test:seed`. Perintah menjalankan seed dua kali dan meninggalkan fixture untuk pengujian login selanjutnya.
4. Jalankan `npm.cmd run test:db` sesudah seed lulus. Pengujian sesi browser tetap issue #8; matriks akses lengkap tetap #9.

Runner menggunakan definisi fixture aktual untuk menghitung properti/FAQ dan memeriksa ID. Branch develop saat ini memuat 10 properti; PR desain Nusa #16 memuat 14 (10 publik dan 4 fixture akses). Gunakan dataset dari branch yang diuji, jangan menghapus fixture akses untuk memenuhi angka lama issue.

## Pemeriksaan

- Guard menolak selain lingkungan test, konfirmasi yang belum diberikan, password pendek, URL API/SQL berbeda proyek, dan TLS hosted yang tidak terverifikasi.
- Sebelum mutasi, seed menolak organisasi non-demo, organisasi di luar dua UUID fixture, organisasi yang processing-nya aktif, serta akun Auth di luar lima email fixture. Seed tidak otomatis membersihkan data asing.
- Runner mencatat hitungan sebelum/sesudah, memeriksa dua organisasi, lima akun/membership, empat kontak/lead, properti/FAQ, site settings, kanal, dan detail privat.
- ID fixture, membership aktif/nonaktif, role, sales default Andi, assignment lead, tahap, budget string dan area dicocokkan dengan definisi demo.
- Seed kedua memakai password acak berbeda hanya pada environment child. Hash akun yang sudah ada dibandingkan di PostgreSQL melalui tabel sementara; hash dan password tidak dikirim ke log. ID akun/membership harus tetap sama.
- Tes lokal memeriksa penolakan konfigurasi/target dan pemulihan kegagalan Auth sebagian dengan mock. Ini bukan bukti idempotensi database nyata.

## Kegagalan sebagian

Seed melakukan upsert bertahap melalui Data API dan Auth Admin, bukan satu transaksi lintas layanan. Jika gagal, exit code nonzero menyebut tahap tanpa mencetak respons layanan atau secret. Jangan menganggap pesan awal sebagai selesai.

Perbaiki konfigurasi/koneksi/constraint pada target yang sama, lalu ulangi perintah. Akun yang berhasil dibuat ditemukan kembali melalui email dan password-nya tidak diganti. ID organisasi, properti, FAQ, kontak dan lead stabil. Jika password akun yang sudah ada tidak diketahui, pemulihan akses dilakukan terpisah; mengganti `DEMO_SEED_PASSWORD` tidak mereset akun lama.

Jangan menjalankan dua seed bersamaan. Sebelum mengulang, pastikan proses lama sudah berhenti. Bila runner terhenti atau timeout, data parsial tetap ada dan perlu diperiksa; tabel snapshot password sementara hilang saat koneksi SQL ditutup. Data tambahan yang membuat hitungan berbeda tidak dihapus otomatis. Jangan memakai reset schema, penghapusan akun massal, atau mencabut guard sebagai pemulihan.

## Hasil aktual

Typecheck, lint, 38 tes lokal, build dan 10 E2E branch fondasi lulus pada 4 Oktober 2026. `test:seed` dijalankan untuk memeriksa guard dan berhenti dengan `NOT RUN: konfigurasi` sebelum membuka koneksi.

Belum ada hasil hitungan Supabase sebelum/sesudah untuk issue #6. Seed nyata ditahan karena `DEMO_SEED_CONFIRM_ISOLATED` belum true dan password belum tersedia. T-011 tetap belum selesai sampai kedua run dan suite berseed benar-benar lulus.
