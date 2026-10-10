# Aturan bisnis Nusa Property

Diperbarui 11 Oktober 2026. Nusa Property melayani agensi properti dengan dua role login: `owner` dan `sales`. Pengunjung website tidak memerlukan akun. Owner melihat pekerjaan organisasi dan mengelola listing; sales hanya melihat pekerjaan yang ditugaskan dan katalog tanpa hak edit. Semua data terikat organisasi.

## Alur pelanggan

1. Pengunjung melihat katalog. Listing konsep saat ini berlabel ilustrasi; listing baru hanya terlihat publik ketika berstatus terbit dan tersedia.
2. CTA membuka WhatsApp berisi teks awal. Klik itu bukan pesan terkirim, prospek, atau atribusi yang pasti.
3. Setelah webhook terverifikasi menyimpan pesan, sistem menghubungkannya dengan kontak, prospek, dan percakapan. Kode properti dalam pesan hanya petunjuk dan harus divalidasi dalam organisasi.
4. AI kelak membaca hanya listing/FAQ publik yang layak. Saat pelanggan meminta manusia atau AI gagal, pekerjaan diarahkan ke sales/owner. Handoff menghentikan balasan otomatis baru.
5. Sales mencatat tindak lanjut, survei, negosiasi, dan hasil. Konfirmasi ketersediaan unit serta jadwal kunjungan memerlukan pemeriksaan manusia; aplikasi tidak membuktikan kondisi lapangan.

## Izin dan data

| Data/tindakan | Owner | Sales | Pengunjung |
| --- | --- | --- | --- |
| Katalog terbit | Baca | Baca | Baca |
| Buat/edit/publikasikan listing | Ya | Tidak | Tidak |
| Kontak privat pemilik unit | Ya | Tidak | Tidak |
| Prospek, pesan, tugas, survei | Organisasi sendiri | Penugasan sendiri | Tidak |
| Handoff dan balasan | Setelah izin/gerbang kirim lulus | Setelah izin/gerbang kirim lulus | Tidak |
| Angka operasional | Kejadian organisasi sendiri | Pekerjaan sendiri | Tidak |

Pesan pelanggan dan nomor telepon adalah data privat. Audit perubahan listing tidak menyimpan isi kontak privat. Kontak yang meminta berhenti dihubungi harus dihormati secara persisten sebelum otomasi atau pengiriman diaktifkan. Peluang baru setelah prospek selesai tidak boleh menimpa histori closing; dukungan peluang jamak masih T-052/T-053 bila dibutuhkan.

Open-WA adalah gateway yang dipilih pengguna pada server sendiri. Batas pengiriman dan kepatuhan kanal harus diverifikasi terhadap layanan yang benar sebelum mengirim otomatis; aturan dari adapter penyedia lain tidak diasumsikan berlaku. Kegagalan atau hasil pengiriman tidak pasti masuk antrean penanganan manusia, tanpa pengiriman ulang buta.

Kriteria implementasi ada di [backlog](backlog.md). [Rancangan bisnis sebelumnya](archive/business-before-nusa-direction.md) disimpan sebagai sejarah.
