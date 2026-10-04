# Anti Slop Delivery Gate

4 Oktober 2026. Mode DURING dipilih pengguna. Cakupan: redesign dan penyempurnaan Nusa Property pada preview lokal, termasuk font, fokus filter, motion, profil agensi, dan navigasi pelanggan. Desain premium hangat, penggunaan aset, profil fiktif berlabel dan spesifikasi sintetis disetujui pengguna. ENERGY 2 / RHYTHM 2 / MOTION 2. Alasan visual: [DESIGN.md](../DESIGN.md). Bukti pemeriksaan: [test-results.md](test-results.md).

## Hard Gate

| Aturan | Hasil dan bukti |
| --- | --- |
| R-02 | PASS: copy UI baru tidak memakai em dash. |
| R-03 | PASS: E2E mengukur overflow pada 360/1440 px, tambahan 768 px dan landscape 800 px; screenshot ditinjau. |
| R-17 | PASS: tidak menambahkan statistik pemasaran. Hitungan katalog berasal dari hasil query. |
| R-18 | PASS: tidak menambahkan testimoni atau ulasan. Profil agen merupakan ilustrasi yang dipilih pengguna dan diberi label fiktif/demo. |
| R-23 | PASS: logo dan foto berasal dari aset pengguna; penggunaan brand Nusa, pemetaan listing dan spesifikasi demo dipilih eksplisit. |
| R-24 | PASS: kategori, kawasan, anchor, profil dan route header/footer diverifikasi oleh E2E. HTML publik tidak memuat tautan internal; `/preview` 404. |
| R-25 | PASS: checker teks 4,76–14,09:1, kontrol/fokus 3,21–14,09:1. Fokus filter charcoal/canvas 14,09:1. Copy berada di permukaan solid, tidak ditimpa langsung pada foto. |
| R-26 | PASS: form GET, reset, menu dan galeri punya perilaku nyata. Seluruh 10 kartu dibuka melalui browser. Kanal tidak aktif tampil sebagai informasi. |
| R-27 | PASS: empty state, filter invalid, error dan not-found tersedia. Loading dashboard dipertahankan; suspense loading publik dilepas agar HTML akhir tampil tanpa JavaScript. |
| R-28 | PASS: tidak membuat FAQ pemasaran generik. FAQ fixture diselaraskan dengan katalog baru. |
| R-32 | PASS: label native, skip link, fokus tombol/tautan tetap terlihat; filter membedakan pointer dan keyboard dengan indikator inset. Tab/Shift+Tab, Enter galeri/form dan Escape menu diuji. |
| R-33 | PASS: UI/CSS ditulis langsung melalui source patch. |
| R-34 | PASS: tema terang tetap mengikuti pilihan pengguna; tidak ada toggle palsu. |
| R-35 | PASS: build dan 22 E2E lulus; screenshot landing/detail desktop/mobile serta landing/profil tablet ditinjau. Profil diperiksa pada 360/768/1440 px. |
| R-36 | PASS: tidak menambahkan klaim sertifikasi, jaminan hasil, koneksi AI/WhatsApp atau transaksi. |
| R-37 | PASS: arah premium hangat dipilih pengguna dan dicatat di DESIGN.md sebelum penyerahan. |
| R-38 | PASS: disclosure terlihat pada strip, katalog, galeri, kawasan dan profil. Spesifikasi diberi label sintetis. |

## Purpose Gate

| Aturan | Hasil dan alasan |
| --- | --- |
| R-01 | PASS: warna diambil dari aset Nusa; tanpa gradient/glow dekoratif. |
| R-04 | PASS: SVG bersama mengartikan lokasi, properti, kamar, luas, cari dan konsultasi. |
| R-06 | PASS: Cormorant Garamond 500/italic mengikuti karakter editorial Nusa; Manrope 400–600 untuk isi/form/harga. Font lokal berlisensi, pemuatan dan italic aktual diverifikasi pada halaman yang menggunakannya. |
| R-07 | PASS: tanpa latar grid/blueprint/dot. |
| R-08 | PASS: panah menandai perpindahan ke katalog/kawasan; tombol pencarian memakai ikon cari. |
| R-09 | PASS: label gambar adalah kode listing; tidak ada badge popularitas atau kemampuan palsu. |
| R-10 | PASS: tanpa glassmorphism. |
| R-12 | PASS: shadow hanya search panel untuk prioritas interaksi. |
| R-13 | PASS: tanpa glow. |
| R-14 | PASS: kartu setara untuk membandingkan properti; kawasan dan konsultasi punya komposisi berbeda. |
| R-19 | PASS: reveal berurutan sekali, 500–900 ms dengan perpindahan maksimal 24 px; judul hero per baris dan zoom-out foto dalam bingkai tetap. Parallax maksimal 12 px hanya desktop/pointer presisi. Tanpa autoplay/loop; reduced motion saat awal dan saat berjalan diuji. |
| R-22 | PASS: foto arsitektur, kawasan, dan potret terkait konten dan berasal dari paket yang disetujui. |

## Liveliness

- PASS dials: 2/2/2 mengikuti rencana pengguna dan tercatat di DESIGN.md.
- PASS konsistensi: hero foto besar, grid listing, kawasan, potret dan daftar editorial profil memberi variasi; reveal mengarahkan perhatian sesuai urutan bagian.
- PASS fokus: judul/rumah pada hero, harga pada kartu, lokasi pada kawasan dan konsultasi di bagian akhir.
- PASS whitespace: jarak bagian 56–96 px memisahkan cerita; jarak grid lebih rapat untuk perbandingan.
- PASS aksen: bronze pada penanda editorial dan logo, charcoal untuk tombol utama.
- PASS motif: serif mengikuti wordmark dan lengkung satu sisi pada dua foto utama.
- PASS Design Read: landing properti premium hangat untuk pencari hunian BSD/Alam Sutera/Bintaro dinyatakan sebelum penyerahan.

## Craftsmanship dan Quality Locks

- C-1 / R-31 PASS: alasan warna, font, komposisi, jarak, kartu dan ikon ada di DESIGN.md.
- C-2 PASS: interaksi tersedia diuji; tidak menambahkan tombol booking atau pengiriman yang belum tersedia.
- C-3 / R-05 PASS: setiap bagian mendukung pemilihan hunian atau konsultasi; tanpa pricing, logo pelanggan atau testimonial template.
- C-4 PASS: screenshot dan E2E desktop/mobile/tablet/landscape, navigasi keyboard, noindex, empty state, reduced motion, scroll cepat, kembali ke halaman, font lokal dan pencarian tanpa JavaScript tercatat.
- C-5 PASS: seluruh konten sintetis diberi label; tidak mengklaim properti atau agen nyata.
- R-11 PASS: kontrol 4 px, kartu 6–8 px, lengkung besar hanya pada foto hero/potret.
- R-15 PASS: CTA menyebut tindakan spesifik seperti Cari properti, Lihat semua properti dan Hapus filter.
- R-16 PASS: copy tanpa jargon pemasaran AI.
- R-20 PASS: logo Nusa, material foto tropis, kawasan lokal, judul serif dan rupiah membentuk identitas halaman.
- R-21 PASS: tema terang ditetapkan untuk membandingkan fotografi dan formulir, sesuai brief.
- R-29 PASS: ivory/charcoal/bronze; warna error hanya untuk umpan balik.
- R-30 PASS: komposisi mengikuti aset dan brief Nusa; tidak menyalin identitas produk lain.

Status: **PASS untuk redesign preview lokal**. Database/seed, Auth/RLS nyata, WhatsApp dan rilis produksi tidak diuji dalam pekerjaan ini.
