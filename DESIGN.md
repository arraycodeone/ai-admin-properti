# Nusa Property: desain aktif

Ditetapkan 4 Oktober 2026 melalui pilihan pengguna: beralih ke Nusa Property, premium hangat, Anti Slop selama desain, spesifikasi sintetis dan profil agen berlabel demo. Menggantikan arahan marketplace merah muda sebelumnya.

## Arah dan tujuan

Landing agen properti untuk pencari rumah dan apartemen di BSD, Alam Sutera, dan Bintaro. Foto arsitektur mengenalkan hunian; pencarian lokasi/tipe/anggaran mengantar ke katalog dan detail. ENERGY 2 / RHYTHM 2 / MOTION 2.

| Keputusan | Nilai dan alasan |
| --- | --- |
| Warna | Ivory `#FAF8F3`, charcoal `#242824`, bronze `#97734C`, mengikuti logo dan material hangat pada foto. |
| Aksen | Bronze hanya untuk penanda editorial dan logo; charcoal pada tindakan utama menjaga kontras. |
| Tipografi | Cormorant Garamond 500 untuk hero, judul, dan nama properti, dengan italic asli. Manrope 400–500 untuk isi/kontrol, 600 untuk harga/label penting; harga memakai tabular-nums. WOFF2 lokal sekitar 72 KB, melalui next/font/local dengan lisensi OFL. Font internal tetap font sistem. |
| Tema | Terang tetap agar foto arsitektur dan formulir mudah dibandingkan; tanpa toggle tema. |
| Komposisi | Hero dua kolom, grid listing, foto kawasan, lalu konsultasi dengan potret; variasi mengikuti isi setiap bagian. |
| Motif | Sudut lengkung besar pada satu sisi hero dan potret menghubungkan komposisi dengan bentuk arsitektur. |
| Spasi | Kontainer maksimum 1280 px; bagian utama 56–96 px, kartu berjarak 24–40 px untuk memisahkan editorial dan perbandingan data. |
| Kartu | Cover 3:2, harga dan spesifikasi sejajar untuk membandingkan listing; tanpa bayangan dekoratif. |
| Ikon | SVG yang sudah ada untuk lokasi, tipe properti, kamar, luas, pencarian, dan konsultasi. |
| Label | Uppercase kecil hanya pada pembuka bagian sebagai pembeda kategori editorial; isi dan kontrol memakai sentence case. |
| Bayangan | Hanya search panel untuk menandai fungsi pencarian utama. |
| Gerak | Reveal sekali per elemen per kunjungan, 500–900 ms, perpindahan maksimal 24 px, easing cubic-bezier(0.22, 1, 0.36, 1). Parallax desktop maksimum 12 px, tanpa autoplay atau scroll hijacking. Reduced motion langsung ke keadaan akhir. |

## Responsive dan interaksi

- Desktop: hero berdampingan, grid listing 3 kolom, kawasan 3 kolom.
- Tablet: listing 2 kolom, filter menyesuaikan ruang.
- Mobile: menu dengan expanded state, Escape mengembalikan fokus; pencarian ditempatkan sebelum foto hero, listing satu kolom pada lebar 600 px ke bawah.
- Semua kolom input punya label terlihat, ukuran teks 16 px dan tinggi minimal 48 px. Skip link dan focus-visible tersedia.
- Filter landing/katalog mempertahankan border tipis; klik/tap tidak menambah outline luar. Modalitas pointer/keyboard dicatat eksplisit. Tab/Shift+Tab memberi garis charcoal 2 px di sisi bawah dalam field, tanpa perubahan ukuran. Fokus tombol, tautan, menu, dan galeri tetap terlihat.
- Galeri detail mempunyai empat thumbnail dengan aria-pressed dan penghitung foto; dapat dipilih dengan Tab/Enter/Space.
- Filter GET mempertahankan lokasi, tipe, budget string dan jumlah kamar di URL, termasuk nilai valid di luar preset.
- Kanal WhatsApp tanpa nomor siap menampilkan informasi belum aktif, bukan tombol palsu.

## Motion dan profil agensi

- Hero landing: judul bergerak naik per baris hingga 24 px dengan fade lembut, stagger 70 ms, durasi 900 ms. Foto zoom-out dari 1.08 ke 1 di dalam bingkai tetap, terpisah dari parallax. Judul/foto tetap terlihat sebelum inisialisasi dan tanpa JavaScript. Search panel bergerak singkat tanpa menonaktifkan kontrol.
- Tautan hero hanya fade, tanpa perpindahan posisi, agar menerima klik dengan stabil selama animasi dan perpindahan fokus.
- Listing: heading lebih dahulu, kartu stagger 70 ms dengan jeda maksimum 210 ms. Kawasan memakai reveal foto dan judul; konsultasi memakai potret dan teks berurutan; footer memakai garis serta isi.
- Parallax hanya pada lebar minimal 1024 px dengan pointer presisi dan hover. rAF dijadwalkan pada scroll/resize hanya untuk foto terlihat. Mobile memakai reveal sederhana.
- IntersectionObserver, Web Animations API, listener, dan animasi dibersihkan ketika navigasi. Tidak ada library motion tambahan. Perubahan reduced motion saat halaman terbuka juga menghentikan animasi.
- Konten dasar tidak diberi opacity nol atau visibility hidden. Tanpa JavaScript, konten, navigasi, dan pencarian GET tetap tersedia.
- `/tentang` menyajikan profil agensi, tiga pendekatan layanan, foto interior, kawasan bersama, serta CTA katalog/status konsultasi. Tanpa riwayat perusahaan atau klaim layanan yang dibuat-buat. Michael tetap pada landing.
- Header: Properti · Kawasan · Tentang Nusa · Konsultasi. Footer: Katalog properti · Tentang Nusa · Privasi. Tidak ada tautan internal dalam HTML publik; `/preview` 404, `/login` tersedia langsung, `/app` tetap dilindungi.

## Data dan aset

- Logo, hero, cover, kawasan, dan profil menggunakan `/asset/`; metadata di `assets-source` adalah sumber pemetaan.
- Sepuluh listing Nusa menjadi katalog preview. Empat fixture tambahan tetap menguji draft, paused, sold, dan organisasi B. UUID fixture akses tidak berubah.
- Spesifikasi pada `src/demo/properties.ts` merupakan data sintetis yang disetujui pengguna, bukan hasil pengukuran foto.
- Media ditambahkan setelah filter publik dan hanya dalam mode preview. Mode Supabase tetap memakai DTO database tanpa foto sintetis otomatis.
- Semua foto dan profil agen diberi disclosure terlihat. Tidak ada testimoni, rating, jaminan hasil, atau klaim transaksi.
- PNG asli tidak disalin ke halaman. Gambar WebP memakai ukuran responsif dan lazy loading; hero diprioritaskan.

## Pemeriksaan

Kontras teks minimal 4.5:1, kontrol dan fokus minimal 3:1, diperiksa oleh `scripts/check-design.mjs`. Uji browser mencakup 360, 768, 800 landscape, dan 1440 px, navigasi keyboard, seluruh kategori/kawasan, galeri, filter, gambar, dan larangan akses listing nonpublik. Bukti aktual ada di `docs/test-results.md` dan `docs/anti-slop-check.md`.
