# Nusa Property: paket aset demo

Paket aset berdasarkan PRD Nusa Property Demo MVP v1.0. Semua foto dibuat dengan built-in image_gen. Properti, kawasan yang divisualisasikan, dan profil agen merupakan ilustrasi AI untuk demo.

## Isi

- 40 foto galeri untuk 10 listing: masing-masing 4 foto.
- 1 hero, 3 ilustrasi suasana area, dan 1 potret agen fiktif.
- 45 file PNG asli dan 45 gambar WebP pada resolusi asli.
- 40 thumbnail galeri, 10 cover kartu, 11 OpenGraph JPEG 1200 x 630, hero untuk mobile, dan avatar agen.
- Logo Nusa Property versi gelap/terang dalam SVG dan PNG, monogram, favicon SVG/PNG, ikon 192/512, dan Apple touch icon.
- Placeholder foto, metadata gambar, pemetaan galeri, contoh profil agen, dan 3 contoh testimoni berlabel fiktif.
- Enam lembar pratinjau, daftar file CSV, prompt lengkap, dan hasil pemeriksaan.

## Struktur setelah perapihan 4 Oktober 2026

Gambar siap pakai sudah dipindahkan ke `../public/asset/`. Sumber PNG, metadata, prompt, dan lembar pratinjau tetap di folder ini. Seluruh file paket diverifikasi dengan SHA-256 saat pemindahan sebelum dokumentasi diperbarui.

Paket **Nusa Property** kini dipetakan ke 10 listing preview pada `src/demo/`, sesuai persetujuan redesign 4 Oktober 2026. Nama, harga, lokasi, cover, dan galeri berasal dari metadata paket; kamar dan luas ditambahkan sebagai spesifikasi sintetis. Media hanya ditempelkan setelah penyaringan publik pada mode preview. Data Supabase tidak otomatis memperoleh foto ilustrasi.

```text
public/asset/
  images/         WebP utama: properties, hero, locations, agent
  cards/          cover listing 720 x 480
  thumbnails/     thumbnail galeri 360 x 240
  og/             JPEG untuk preview tautan 1200 x 630
  brand/          logo dan ikon aplikasi
  placeholders/   tampilan saat foto belum tersedia
assets-source/
  metadata/       daftar aset dan data demo JSON/CSV
  originals/      sumber PNG asli untuk penyuntingan berikutnya
  preview/        lembar kontak untuk meninjau seluruh gambar
  PROMPTS.md      prompt persis setiap gambar
  ART-DIRECTION.md
  QA.md
```

## Arti path metadata

- URL berawalan `/asset/` dilayani dari `public/asset/`.
- Field `file`, `thumbnail`, `card`, dan `og` yang berupa path relatif pada `metadata/assets.json` mengacu ke `public/asset/`.
- Field `original` mengacu ke `assets-source/`.
- Kolom `file` pada `metadata/asset-inventory.csv` mengacu ke `public/asset/`.
- Catatan `validation.json`, `integrity-check.json`, dan `QA.md` merekam pemeriksaan paket saat dibuat. Angka dan path historis di dalamnya tidak berarti gambar sudah terintegrasi dengan aplikasi.

## Integrasi pada Next.js

1. Folder `images`, `cards`, `thumbnails`, `og`, `brand`, dan `placeholders` sudah berada di `public/asset/`; tidak perlu menyalin paket lagi.
2. Gunakan `metadata/properties.demo.json` untuk pemetaan cover dan galeri. Path dalam JSON memakai awalan `/asset/`.
3. Gunakan `metadata/assets.json` untuk ukuran gambar, alt text, path sumber, dan status demo. Semua gambar utama memiliki `isDemo: true` dan `aiGenerated: true`.
4. Tetapkan width/height dari metadata pada komponen gambar. Muat hero lebih awal; lazy-load galeri di bawah layar. File PNG asli tidak perlu ikut diunggah ke website.
5. Gambar OG tersedia per slug. Pakai URL publik absolut sesuai domain deployment untuk metadata berbagi tautan.

Contoh path cover: `/asset/cards/modern-house-bsd.webp`.

Contoh path foto detail: `/asset/images/properties/modern-house-bsd/01-exterior.webp`.

Contoh logo: `/asset/brand/logo-dark.svg` pada latar terang dan `/asset/brand/logo-light.svg` pada latar gelap.

Untuk Supabase Storage, unggah WebP dari folder galeri ke bucket `property-images`, misalnya `modern-house-bsd/01-exterior.webp`, lalu ganti awalan URL lokal dengan URL Storage yang dipakai aplikasi. Paket ini belum melakukan upload.

## Penggunaan demo

Tampilkan keterangan yang terlihat: **“Website demo. Foto, profil agen, dan testimoni merupakan ilustrasi.”** Label pada metadata/alt text saja tidak menggantikan keterangan yang terlihat bagi pengunjung.

Harga dan nama listing mengikuti contoh dalam PRD. Gambar tidak membuktikan adanya properti, fasilitas, alamat, luas, sertifikat, atau transaksi tertentu. Interior dibuat mengikuti palet tiap galeri, bukan denah bangunan terukur. Gambar kawasan tidak boleh dianggap dokumentasi jalan atau fasilitas tertentu di BSD, Alam Sutera, atau Bintaro.

Profil Michael Santoso dan tiga testimoni adalah konten fiktif yang diminta untuk demo. Nomor kontak sengaja kosong; isi nomor agen yang benar sebelum mengaktifkan tombol WhatsApp. Jangan gunakan profil, testimoni, atau gambar ini sebagai bukti transaksi aktual.

Logo adalah identitas konsep untuk demo Nusa Property. SVG wordmark menggunakan Georgia dan Arial dengan fallback sistem; PNG transparan tersedia untuk tampilan konsisten. File font tidak dibundel.

Paket ini berisi aset; pemasangan komponen website, peta, dashboard, autentikasi, dan formulir mengikuti implementasi aplikasi. Ikon antarmuka memakai pustaka Lucide sesuai PRD dan tidak perlu dibuat ulang sebagai gambar raster.

## Memeriksa hasil

Buka `preview/01-covers.jpg` untuk melihat sepuluh listing. Lembar `02` sampai `04` menampilkan galeri menurut area; lembar `05` menampilkan hero, area, dan agen; lembar `06` menampilkan logo pada latar terang dan gelap. Angka ukuran file dan kelengkapan terdapat di `metadata/validation.json`. Foto OpenGraph dipasang utuh pada kanvas netral 1200 x 630 agar atap dan bagian fasad tetap terlihat.
