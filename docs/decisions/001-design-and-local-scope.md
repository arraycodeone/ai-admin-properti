# Keputusan implementasi lokal

Tanggal: 3 Oktober 2026. Sumber keputusan: permintaan pengguna untuk implementasi lokal, Anti Slop DURING, `DESIGN.md`, dan referensi Pinhome.

## Arah desain yang berlaku

`DESIGN.md` menjadi acuan visual terbaru. Dokumen tersebut merupakan analisis desain marketplace dengan kanvas putih, teks #222222, aksen #ff385c, sans-serif, foto dominan, dan rounded card. `docs/archive/design-system/ai-admin-properti/MASTER.md` sebelumnya mengusulkan hijau/serif; usulan lama disimpan tetapi tidak dipakai aplikasi.

Reading this as: landing page agensi properti untuk calon pembeli Indonesia, dengan bahasa visual marketplace putih dan aksen merah muda. ENERGY 1 / RHYTHM 2 / MOTION 1. Dashboard mengutamakan nama prospek, kebutuhan, penanggung jawab, dan tahap.

| Keputusan | Alasan |
| --- | --- |
| Pencarian lokasi menjadi fokus beranda | Mengikuti kebutuhan utama pembeli dan hierarki pencarian pada Pinhome. |
| Warna putih/gelap dengan aksen merah muda | Mengikuti DESIGN.md; aksen menunjukkan pencarian dan tindakan utama. |
| Tombol memakai #d90940 | Adaptasi aksesibilitas aksen: putih pada #ff385c tidak cukup untuk teks normal; warna lebih gelap mencapai 5,17:1. |
| Font sistem sans-serif | Mengikuti fallback DESIGN.md tanpa mengunduh font proprietary Cereal/Circular. |
| Search panel memakai satu shadow | Memisahkan form yang menjadi interaksi utama dari area hero; elemen lain tetap datar. |
| Grid kartu untuk properti | Setiap kartu membandingkan record sejenis: kode, harga, lokasi, kamar, dan luas. Bukan grid fitur pemasaran. |
| Komposisi berganti dari pencarian ke katalog, daftar lokasi, lalu konsultasi | Membantu urutan keputusan pembeli; tidak menambahkan testimoni, pricing, atau statistik pemasaran. |
| Ikon rumah/apartemen/tanah, pin, kamar, luas, jam, chat | Masing-masing menyampaikan kategori, atribut properti, atau jenis tindakan. Tidak memakai ikon AI dekoratif. |
| Foto placeholder dan wordmark teks | Aset berizin belum tersedia; tidak menyalin foto/identitas Pinhome atau mengklaim rumah contoh sebagai listing nyata. |
| Tema terang | Sesuai DESIGN.md dan kebutuhan perbandingan properti; tidak menyediakan toggle tema yang belum diuji. |
| Gerak hanya perubahan warna/scroll biasa | Mempertahankan fokus membaca; reduced-motion menonaktifkan gerak. |

Referensi: [Pinhome](https://www.pinhome.id/), dibaca 3 Oktober 2026. Pengamatan struktur melalui halaman publik: pencarian lokasi, kategori, listing harga/spesifikasi, dan pintasan area. Tool browser terhubung tidak tersedia; tidak mengklaim audit visual lengkap Pinhome. Screenshot aplikasi sendiri dihasilkan melalui pengujian Playwright.

## Scope lokal dan batas bisnis

Identitas sementara: Ruang Properti. Owner mengelola organisasi, sales menangani lead sesuai assignment. Pelanggan tidak membuat akun dashboard. Maintenance memakai akses operasional yang disepakati; tidak ada role superadmin tersembunyi.

Alur target: katalog → pelanggan membuka dan mengirim WhatsApp → ingest → pencarian/kualifikasi AI → assignment/handoff → permintaan survei → konfirmasi sales → kunjungan → follow-up → closing oleh manusia. Pada milestone ini, katalog dan fondasi akses tersedia; pipeline setelah WhatsApp belum ada.

Penerimaan milestone lokal: halaman/filter/detail berfungsi dengan fixture, route internal tidak terbuka tanpa sesi, noindex aktif, konfigurasi hilang tidak membuka akses, serta typecheck/lint/build/unit/E2E lulus. Penerimaan demo penuh tetap mengikuti backlog asli dan membutuhkan database/layanan nyata.

Tidak ada billing SaaS, signup pelanggan, broadcast, integrasi kalender, atau pembelian layanan. Klik CTA tidak menciptakan lead. Permintaan survei tidak sama dengan jadwal pasti. Won/lost dicatat manusia dan tidak membuktikan pembayaran.

## Gap bisnis yang tetap terbuka

| Gap | Batas sebelum produksi |
| --- | --- |
| G-01 | Belum ada opt-out persisten; wajib sebelum pengiriman pelanggan nyata. |
| G-02 | Satu kontak satu lead; histori closed tidak boleh ditimpa untuk pembelian baru. |
| G-03 | Penggabungan nomor berbeda memerlukan verifikasi dan rancangan audit. |
| G-04 | Reminder dashboard memerlukan SOP pengecekan; bukan notifikasi otomatis. |
| G-05 | Akses maintenance perlu kesepakatan terpisah; tidak ada panel lintas klien. |
| G-06 | No-show memakai cancelled dengan alasan; bukan completed. |
| G-07 | Kriteria won/lost, jam kerja, retensi, biaya, dan SLA menunggu keputusan klien. |
| G-08 | Sales memverifikasi ketersediaan unit/lokasi sebelum konfirmasi. |

## Keputusan teknis

- Struktur modul mengikuti dokumen folder. `/preview` ditambahkan khusus review fixture dan tidak memberi sesi/izin `/app`.
- Kolom `properties.property_type` ditambahkan karena task mensyaratkan filter tipe, tetapi tabel rancangan belum mencantumkannya.
- Migrasi disiapkan untuk 21 tabel; mutasi pengguna masih tertutup sampai RPC tiap fitur dan tesnya dibuat.
- App Router menggunakan Server Components; interaksi preview dan login adalah komponen client kecil. Tidak menambahkan state library, sistem desain kedua, atau service kosong.
- E2E menggunakan production server port 3100 agar tidak bertabrakan dengan dev server port 3000.
- `APP_MODE=preview` merupakan mode berlabel dengan fixture, bukan fallback dari kegagalan database.
