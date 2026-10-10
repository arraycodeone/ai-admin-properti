# Roadmap Nusa Property

Diperbarui 11 Oktober 2026. Nusa Property adalah website agensi properti dan pusat kerja owner/sales. Website memakai palet ivory, charcoal, dan bronze. Dashboard mendahulukan tindakan yang perlu dikerjakan. Katalog saat ini berisi sepuluh listing konsep dengan gambar ilustratif; itu belum menjadi penawaran unit nyata.

## Alur yang harus dibuktikan

Pengunjung membaca listing terbit → membuka WhatsApp dan menekan Kirim → gateway Open-WA mengirim webhook terautentikasi → transaksi ingest menyimpan pesan, prospek, percakapan, dan pekerjaan → AI membaca listing/FAQ publik yang sesuai → sales mengambil alih → tugas, survei, dan hasil penjualan dicatat. Klik CTA, pesan masuk, prospek, survei, dan closing adalah kejadian berbeda dan harus dihitung terpisah.

## Urutan implementasi

| Tahap | Task | Gerbang selesai |
| --- | --- | --- |
| Fondasi akses | T-006, T-012–T-015 | Auth pada HTTPS, RLS owner/sales dan lintas organisasi, editor listing diuji di URL tersebut. |
| Katalog | T-016–T-022 | Aset berizin, FAQ, filter, status publikasi, CTA, metrik klik, dan uji desktop/ponsel. |
| Pesan dan pekerjaan | T-023–T-030 | Ingest atomik, pekerjaan durable, coordinator dua proses, sender aman, inbox, assignment, dan uji kegagalan. |
| Operasi sales | T-031–T-034 | Survei, tugas, follow-up, closing, dan angka dashboard berasal dari perubahan yang tersimpan. |
| AI | T-035–T-039 | Batas biaya, data publik saja, tool terbatas, handoff yang menghentikan balasan otomatis baru, serta evaluasi skenario. |
| WhatsApp nyata | T-007–T-008, T-040–T-041 | Open-WA pada server sendiri, webhook HTTPS, pesan dua arah pada perangkat nyata, dan pemulihan kegagalan. |
| Rilis | T-042–T-058 | Konten nyata, kredensial, backup, pemantauan, uji penerimaan, dan indexing baru diaktifkan sesudah gerbang produksi lulus. |

Ketergantungan utama: T-025 harus terbukti dengan dua proses sebelum balasan otomatis atau manusia dikirim. T-040 mengikuti pipeline T-023–T-030 dan evaluasi AI T-039. T-057 mengikuti semua gerbang rilis; `APP_ENV=production` sendiri tidak mengaktifkan indexing.

## Lingkungan dan batas data

- Aplikasi memakai `APP_ENV=development` atau `APP_ENV=production` dengan Supabase. Tes database memakai target terisolasi dan konfirmasi khusus. Jika Supabase gagal, halaman menampilkan error, bukan listing pengganti.
- Materi saat ini tetap berlabel katalog konsep/ilustrasi. Organisasi fixture tidak dapat menjadi situs production. Foto AI dan potret ilustratif tidak dinyatakan sebagai properti atau orang nyata.
- Pengguna memilih Open-WA pada server sendiri. [Konfigurasi gateway](open-wa.md) disiapkan untuk rilis 5.4.0; URL dan secret, penerima webhook, serta perangkat nyata belum diverifikasi.
- Tidak ada migrasi, seed, atau deployment ke production dalam pekerjaan saat ini.

## Gerbang peluncuran

Sebelum pelanggan nyata dilayani, verifikasi isi listing/harga/hak foto, akses owner dan sales pada HTTPS, koneksi WhatsApp nyata, AI dan handoff, pekerjaan tertunda serta kegagalan provider, backup/restore, pemantauan, keamanan kredensial, dan uji ujung ke ujung desktop/ponsel. Situs tetap `noindex` sampai semua syarat ini lulus.

Rincian kriteria task tetap pada [backlog](backlog.md). [Rencana sebelumnya](archive/roadmap-before-nusa-direction.md) disimpan sebagai catatan sejarah.
