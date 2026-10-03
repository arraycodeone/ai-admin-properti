# Pemeriksaan aset Nusa Property

Status: PASS untuk paket aset statis. Pemeriksaan ini tidak menyatakan bahwa website atau integrasi aplikasinya sudah dibangun.

## Kelengkapan dan file

- PASS: 45 gambar hasil image_gen unik berdasarkan hash SHA-256 sumber PNG.
- PASS: 10 properti, masing-masing 4 gambar, sesuai `metadata/validation.json`.
- PASS: distribusi listing 4 BSD, 3 Alam Sutera, dan 3 Bintaro sesuai PRD.
- PASS: 1 hero, 3 ilustrasi area, dan 1 potret agen tersedia di luar 40 gambar listing.
- PASS: seluruh 170 file gambar dan turunannya dapat dibaca, termasuk PNG, WebP, JPEG, dan SVG.
- PASS: seluruh path cover, galeri, thumbnail, serta OpenGraph di metadata menunjuk ke file yang tersedia.
- PASS: cover 720 x 480, thumbnail 360 x 240, dan 11 OpenGraph 1200 x 630 telah diperiksa ukurannya.
- PASS: logo PNG gelap dan terang mempunyai alpha transparan.
- PASS: semua WebP utama mempertahankan dimensi sumber; tidak diperbesar untuk mengklaim resolusi tambahan.
- PASS: total WebP utama 10.925.938 byte dibanding sumber PNG 121.456.753 byte. Ini ukuran aset, bukan jaminan skor Lighthouse website.

## Pemeriksaan visual

- PASS: galeri BSD diperiksa pada lembar pratinjau 02; tiap baris memakai palet material yang senada.
- PASS: galeri Alam Sutera diperiksa pada lembar 03; dua listing apartemen memakai interior sebagai cover.
- PASS: galeri Bintaro diperiksa pada lembar 04; urutan cover, ruang keluarga, kamar, dan dapur sesuai nama file.
- PASS: hero, tiga area, dan agen diperiksa pada lembar 05.
- PASS: avatar agen telah diperiksa; wajah dan rambut tidak terpotong oleh crop persegi.
- PASS: logo gelap dan terang diperiksa pada lembar 06 dengan latar yang sesuai.
- PASS: ekspor OpenGraph diperbaiki menjadi fit-contain untuk mempertahankan seluruh gambar sumber; contoh townhouse diperiksa ulang.
- PASS: foto tidak memuat label harga, watermark, atau nama pengembang yang membatasi pemakaiannya.

## Pemeriksaan konten dan arah visual

- R-02 PASS: dokumentasi paket memakai tanda baca biasa, tanpa em dash.
- R-17/R-36 PASS: tidak ada angka transaksi, pengalaman agen, sertifikasi, atau klaim performa bisnis yang dikarang.
- R-18/R-38 PASS untuk lingkup demo yang diminta PRD: tiga testimoni dan profil agen jelas ditandai fiktif dengan `isDemo` serta `label`/`disclosure`; README meminta keterangan demo yang terlihat pada website.
- R-23 PASS: pembuatan aset telah diminta pengguna; PNG asli, prompt, metadata, dan status AI disertakan.
- R-25 PASS: label pada pratinjau memakai teks charcoal/muted gelap pada ivory; logo terang diperiksa pada charcoal.
- R-37 PASS: arah premium modern minimal, putih, netral hangat, dan fotografi besar berasal dari PRD.
- R-01/R-07/R-10/R-12/R-13/R-19 PASS: tidak memakai gradient, pola dekoratif, glassmorphism, glow, bayangan UI, atau animasi.
- R-04/R-06/R-22 PASS: motif N, garis arsitektur, jenis huruf wordmark, serta fotografi tropis mempunyai alasan yang dicatat di `ART-DIRECTION.md`.
- R-08/R-09/R-14 PASS: tidak ada panah CTA, badge klaim, atau kartu fitur dekoratif pada aset.
- Liveliness PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 tercatat; subjek rumah/ruang menjadi fokus; ruang kosong pada wordmark menjaga keterbacaan; bronze menjadi aksen kecil; monogram dan material hangat mengikat identitas.
- C-1/C-3/R-20/R-29/R-30/R-31 PASS: pilihan visual mengikuti isi PRD, palet brand terbatas, dan alasan keputusan tersedia dalam `ART-DIRECTION.md`.
- R-03/R-05/R-11/R-15/R-16/R-21/R-24/R-26/R-27/R-28/R-32/R-34/R-35/C-2/C-4: tidak berlaku untuk pengujian UI aplikasi karena deliverable ini hanya file aset dan dokumentasi, tanpa halaman atau kontrol interaktif.
- R-33 PASS: skrip menghasilkan file aset dan metadata; tidak melakukan patch terhadap kode aplikasi tujuan.

Pemeriksaan teknis dicatat di `metadata/integrity-check.json`. Angka total file pada catatan tersebut adalah snapshot saat pemeriksaan dijalankan. Penilaian visual tidak menyatakan bangunan hasil AI mempunyai denah yang konsisten secara geometris atau fasilitas yang benar-benar tersedia.
