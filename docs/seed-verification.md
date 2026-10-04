# Verifikasi seed demo

Issue #6 / T-011 selesai diverifikasi pada Supabase uji, 4 Oktober 2026. Dua run menghasilkan data yang sama tanpa duplikasi atau perubahan password akun lama; suite database berseed juga lulus.

## Menjalankan

Gunakan proyek Supabase uji terisolasi yang sudah dimigrasi. Konfigurasi API/SQL harus menunjuk proyek yang sama dan koneksi hosted memakai TLS terverifikasi, mengikuti [setup Supabase](supabase-setup.md).

1. Pastikan `APP_ENV=test` dan `TEST_DATABASE_CONFIRM_ISOLATED=true`.
2. Setelah menyetujui bahwa seed mengembalikan fixture ke kondisi contoh, isi `DEMO_SEED_CONFIRM_ISOLATED=true` serta `DEMO_SEED_PASSWORD` unik minimal 16 karakter dalam `.env.local`. Jangan mengirim password melalui chat atau memasukkannya ke Git.
3. Jalankan `npm.cmd run test:seed`. Perintah menjalankan seed dua kali dan meninggalkan fixture untuk pengujian login selanjutnya.
4. Jalankan `npm.cmd run test:db` sesudah seed lulus. Pengujian sesi browser tetap issue #8; matriks akses lengkap tetap #9.

Runner menggunakan definisi fixture aktual untuk menghitung properti/FAQ dan memeriksa ID. Setelah PR desain Nusa #16 digabungkan, katalog memuat 14 properti (10 publik dan 4 fixture akses). Angka ini menggantikan 10 properti pada deskripsi awal issue; fixture akses tetap dipertahankan.

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

Target awal kosong: seluruh hitungan tabel fixture dan akun Auth 0. Sesudah run pertama dan kedua, hasil identik:

| Data | Run 1 | Run 2 |
| --- | --- | --- |
| Organisasi | 2 | 2 |
| Properti | 14 | 14 |
| FAQ | 20 | 20 |
| Akun Auth / membership | 5 / 5 | 5 / 5 |
| Kontak / lead | 4 / 4 | 4 / 4 |
| Site settings / kanal / detail privat | 2 / 1 / 1 | 2 / 1 / 1 |

ID, role, status membership, sales default, assignment, tahap, budget, area dan password akun lama sesuai. `test:db` lulus untuk `access.test.sql` dan `integrity.test.sql`; transaksi pengujian dibatalkan, seed tetap tersimpan. Identitas seed diselaraskan dengan Nusa setelah hasil merge masih menyimpan nama lama. Password acak hanya disimpan pada `.env.local` yang diabaikan Git. Aplikasi tetap preview; kanal simulator paused dan tidak ada pengiriman pesan.

Tes lokal sebelumnya membuktikan guard serta pemulihan Auth sebagian dengan mock; kegagalan provider nyata tidak sengaja dipicu. Login/logout browser dan matriks lengkap tetap issue #8/#9.
