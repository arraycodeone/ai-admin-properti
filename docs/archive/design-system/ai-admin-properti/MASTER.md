# Design system — Website Agen & AI Admin Properti

> Arsip desain lama. Acuan visual aktif adalah [DESIGN.md](../../../../DESIGN.md). Token dan preview di folder ini tidak diimpor aplikasi.

Versi 0.1 · 3 Oktober 2026 · **usulan visual, belum identitas merek final**.

Cakupan yang dipilih: **website publik dan dashboard owner/sales**. Design system ini menjadi panduan implementasi pada proyek yang sudah direncanakan. Pratinjau merupakan contoh komponen dan interaksi lokal, bukan aplikasi yang telah terhubung dengan database, AI, atau WhatsApp.

## 1. File dan sumber acuan

| File | Fungsi |
| --- | --- |
| [MASTER.md](./MASTER.md) | Aturan visual, komponen, layout, bahasa, serta pemetaan ke task. |
| [tokens.css](./tokens.css) | Sumber nilai desain: primitive → semantic → component; juga berisi foundation CSS minimum. |
| [preview.html](./preview.html) | Pratinjau website, dashboard, dan katalog komponen. Buka langsung di browser, tanpa instalasi. |
| [check.cjs](./check.cjs) | Pemeriksaan referensi token, pasangan kontras, struktur dasar HTML, dan sintaks JavaScript. |

Acuan produk: [plan demo](../../../roadmap.md), [struktur folder](../../../architecture.md), [database](../../../database.md), [role/skenario](../../../business.md), dan [task implementasi/testing](../../../backlog.md).

Keputusan bisnis tetap sama: layanan pembuatan/maintenance untuk agensi; pelanggan berinteraksi lewat WhatsApp; dua role login internal. Website tidak menggunakan menu paket SaaS, trial, atau pendaftaran akun pelanggan.

## 2. Arah visual

**Tenang, mudah dibaca, dan berfokus pada properti serta pekerjaan berikutnya.**

- Hijau tua untuk identitas utama dan tindakan penting; latar netral hangat dengan panel putih.
- Website memakai judul serif dan ruang yang lapang. Foto listing berizin menjadi bukti utama; harga, lokasi, dan fakta rumah terbaca sebelum CTA.
- Dashboard memakai sans-serif, jarak lebih ringkas, serta pengelompokan informasi yang konsisten. Status dan penanggung jawab terlihat dekat percakapan.
- Gunakan garis pemisah halus dan sudut membulat sedang. Hindari blur dekoratif, gradien dominan, animasi berlebihan, dan kartu statistik tanpa kebutuhan operasional.
- Nama **Ruang Properti** pada preview adalah placeholder. Nama, logo, warna klien, dan foto final belum ditetapkan. Tidak ada testimoni, sertifikasi, angka keberhasilan, atau klaim ketersediaan yang dianggap nyata dari preview.

Rekomendasi lokal UI/UX yang relevan adalah grid sederhana, hierarki tipografi, serta dashboard CRM yang mengutamakan pekerjaan sales. Saran generik seperti virtual tour, landing promosi software, atau glassmorphism tidak dijadikan scope tambahan. Untuk tahap ini cukup satu tema terang; dark mode memerlukan pasangan warna dan pengujian tersendiri bila nanti diminta.

## 3. Token tiga lapis

```text
Primitive: --p-forest-700       nilai HSL dasar
       ↓
Semantic:  --color-primary     arti: tindakan utama / identitas
       ↓
Component: --button-bg         penggunaan pada tombol
```

Contoh pemakaian:

```css
.button {
  background: var(--button-bg);
  color: var(--button-fg);
  border-radius: var(--button-radius);
}
```

Komponen aplikasi tidak menyalin hex/HSL sendiri. Ganti nilai token untuk mengubah tema, lalu periksa kembali kontras. Warna sukses/gagal terpisah dari warna brand agar perubahan brand tidak mengubah arti status.

`tokens.css` menjadi sumber nilai visual; dokumen ini menjelaskan peruntukannya. Tidak dibuat salinan JSON atau generator tambahan yang harus dijaga tetap sama. Angka struktural CSS seperti rasio grid, breakpoint, dan koordinat ilustrasi boleh berada di layout; warna, tipografi, jarak berulang, serta state memakai token. Theme per agensi diterapkan pada root dokumen; override semantic dan component pada scope yang sama bila kelak memakai tema bersarang agar alias CSS tidak mewarisi nilai dari scope lama.

### Warna dan kegunaan

| Semantic token | Nilai sumber | Penggunaan |
| --- | --- | --- |
| `--color-primary` | `hsl(158 50% 24%)` | Aksi utama dan identitas agensi. |
| `--color-primary-hover` | `hsl(158 45% 18%)` | Hover tombol utama. |
| `--color-primary-active` | `hsl(158 42% 14%)` | Saat tombol ditekan. |
| `--color-on-primary` | Putih | Teks di atas aksi utama. |
| `--color-page` | `hsl(42 35% 97%)` | Latar halaman netral hangat. |
| `--color-surface` | Putih | Panel, form, kartu. |
| `--color-surface-soft` | `hsl(145 20% 94%)` | Area sekunder, pesan masuk, navigasi terpilih. |
| `--color-text` | `hsl(160 20% 13%)` | Teks utama. |
| `--color-text-muted` | `hsl(160 9% 35%)` | Keterangan, metadata, placeholder; tetap dibaca jelas. |
| `--color-border` | `hsl(150 10% 84%)` | Pemisah dekoratif; bukan batas satu-satunya untuk kontrol penting. |
| `--color-control-border` | `hsl(150 8% 43%)` | Batas input dan tombol outline. |
| `--color-focus` | `hsl(215 65% 34%)` | Fokus keyboard yang jelas pada latar terang. |
| `--color-whatsapp` | `hsl(146 45% 25%)` | Treatment CTA WhatsApp dengan teks putih; bukan spesifikasi logo resmi WhatsApp. |
| `--color-info-*` | Biru muda / biru tua | AI aktif, informasi, feedback netral. |
| `--color-success-*` | Hijau muda / hijau tua | Hasil yang sudah dikonfirmasi. |
| `--color-warning-*` | Amber muda / cokelat tua | Pending, pengalihan, ketidakpastian kirim. |
| `--color-danger-*` | Merah muda / merah tua | Gagal, input tidak sah, tindakan berisiko. |

Teks selalu menjelaskan arti warna. “Diterima provider”, “Terkirim ke perangkat”, dan “Dibaca” mempunyai arti berbeda meskipun beberapa memakai kelompok warna yang sama.

### Tipografi

| Peran | Font | Ukuran / line-height | Penggunaan |
| --- | --- | --- | --- |
| Hero publik | Georgia / serif sistem | 32–56 px responsif / 1.12 | Pesan utama agensi, bukan semua heading. |
| Heading halaman dashboard | Segoe UI / system-ui | 32 px / 1.12 | Inbox, Prospek, Survei. |
| Heading bagian | Segoe UI / system-ui | 24 px / 1.12 | Kelompok konten. |
| Isi | Segoe UI / system-ui | 16 px / 1.6 | Paragraf, input, pesan utama. |
| Label dan metadata | Segoe UI / system-ui | 14 px / 1.4–1.6 | Label form, navigasi, status. |
| Caption | Segoe UI / system-ui | 12 px / 1.6 | Keterangan pendukung yang bukan satu-satunya informasi penting. |
| Angka | Font UI + tabular numbers | Sesuai konteks | Harga, tanggal, jumlah lead. |

Ukuran menggunakan `rem`; browser boleh diperbesar. Input ponsel tetap 16 px. Paragraf dibatasi sekitar 65 karakter per baris. Angka rupiah menggunakan locale `id-ID`, tanpa desimal bila nilainya rupiah penuh; tanggal/jam ditampilkan sebagai WIB sesuai model data. Nama panjang dan isi chat membungkus, bukan disembunyikan hanya demi kerapian.

Font sistem membuat preview dapat dibuka offline. Bila font brand ditambahkan kemudian, muat dengan fallback yang sesuai dan uji perubahan line wrapping serta layout; jangan menambah beberapa keluarga font untuk setiap halaman.

### Jarak, bentuk, dan gerak

| Item | Aturan |
| --- | --- |
| Skala jarak | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px. |
| Jarak kontrol sekelompok | 8–12 px; jangan menempelkan tindakan berisiko ke tombol utama. |
| Padding kartu | 24 px desktop; 16 px pada layar kecil bila diperlukan. |
| Section website | 48–80 px; section dashboard 24–32 px. |
| Radius | Kontrol 8 px, kartu 12 px, panel 20 px; badge pill. |
| Tinggi tombol/input | Minimum 44 px; CTA publik 48 px. Konten boleh membuat kontrol lebih tinggi. |
| Baris data | Dasar 56 px, dapat tumbuh untuk teks panjang. |
| Fokus | Outline 3 px dengan offset 3 px; jangan dihapus. |
| Motion | 150 ms untuk perubahan warna; 220 ms untuk transisi pendek jika dibutuhkan. |
| Reduced motion | Nonaktifkan animasi/transisi yang tidak diperlukan; status tetap diperbarui. |
| Lapisan | Sticky 10, overlay 40, toast 50; native dialog memakai top layer browser. |

## 4. Layout website dan dashboard

### Website publik

Urutan halaman utama: identitas agensi → judul/nilai layanan → CTA konsultasi → pilihan listing → cara mengajukan kunjungan → informasi agensi/kontak/privasi. Tampilkan testimoni atau bukti lainnya hanya ketika tersedia dan berizin; jangan membuat social proof palsu.

| Halaman | Susunan minimum | Perilaku utama |
| --- | --- | --- |
| Beranda | Header, hero, CTA, listing pilihan, cara kerja, footer | “Konsultasi via WhatsApp”; pengunjung tidak diarahkan ke login internal. |
| Katalog | Judul, filter lokasi/budget/tipe, jumlah hasil, grid listing | Filter dapat diubah; hasil kosong berbeda dari gagal memuat. |
| Detail listing | Breadcrumb, foto, harga, lokasi, spesifikasi, deskripsi, CTA | “Tanya properti ini”; kode publik dibawa ke pesan awal WhatsApp. |
| Privasi | Informasi pengelolaan data dan kontak agensi yang sah | Terbaca di ponsel, tanpa lorem ipsum ketika produksi. |

Grid listing: satu kolom ponsel, dua pada layar menengah, tiga jika kartu tetap nyaman dibaca. Maksimum konten sekitar 1200 px. Harga serta status tidak diletakkan di atas foto ramai tanpa lapisan kontras yang terukur. Hindari carousel otomatis; galeri listing dapat memakai kontrol sebelumnya/berikutnya dengan label jelas saat dibangun.

CTA tidak mengirim pesan sendiri. Copy menjelaskan bahwa pengunjung melanjutkan ke WhatsApp. Klik tidak ditampilkan sebagai prospek berhasil. Properti tidak aktif atau ditarik dari publikasi mengikuti aturan server, termasuk metadata/aset; UI tidak menyamarkan data lama sebagai tersedia.

### Dashboard internal

| Area | Owner | Sales |
| --- | --- | --- |
| Ringkasan | Angka organisasi, antrean belum ditangani, tugas/survei | Pekerjaan yang menjadi tanggung jawabnya. |
| Inbox | Percakapan organisasi sesuai izin | Percakapan lead yang ditugaskan. |
| Prospek | Detail, stage, assignment, histori | Kebutuhan/stage/tindakan pada lead miliknya. |
| Survei dan tugas | Pekerjaan organisasi | Pekerjaan miliknya. |
| Properti/FAQ/pengaturan | Mutasi owner sesuai scope | Hanya informasi/tindakan yang diizinkan dalam matriks akses. |

Menu disusun dari data izin. Menyembunyikan menu tidak menggantikan otorisasi server/database. UI tidak menyediakan tombol mengganti role pengguna untuk kepentingan demo; peran diuji dengan login akun terpisah.

Desktop memakai sidebar sekitar 224 px; inbox dapat memakai daftar percakapan + detail, dengan profil lead sebagai panel tambahan hanya bila ruang cukup. Di layar kecil, pisahkan daftar dan detail percakapan dengan tombol kembali; jangan mengecilkan tiga kolom menjadi tidak terbaca. Pada preview komponen, panel ditumpuk untuk menampilkan semua bagian; navigasi daftar/detail sebenarnya dibuat pada T-027.

Utamakan nama pelanggan, penanggung jawab, mode AI/manusia, pesan terbaru, serta tindakan berikutnya. Metrik membantu menentukan pekerjaan, bukan memenuhi seluruh layar dengan grafik. Tampilkan label periode dan unit; CTA clicks, lead, requested survey, confirmed survey, dan won bukan angka yang dapat dipertukarkan.

### Breakpoint dan layar uji

- Di bawah 768 px: satu kolom, gutter 16 px, kontrol nyaman disentuh, detail tambahan dapat dibuka lewat disclosure.
- 768–1023 px: grid publik dua kolom jika muat; dashboard mengurangi panel samping.
- Mulai 1024 px: sidebar dan inbox berdampingan; publik dapat tiga kolom.
- Periksa 360, 768, 1024, dan 1440 px, serta pembesaran teks/zoom. Jangan menyembunyikan overflow horizontal untuk menutupi layout yang rusak.
- Jika CTA bawah atau header dibuat sticky pada aplikasi, sisakan ruang konten dan safe area yang cukup; fokus keyboard tidak boleh tertutup.

## 5. Spesifikasi komponen inti

| Komponen | Varian/konten wajib | State dan perilaku |
| --- | --- | --- |
| Button | Primary, secondary, WhatsApp, destructive; teks aksi jelas | Default, hover, active, focus-visible, disabled, loading. Loading mempertahankan label/lebar dan menjelaskan proses; cegah pengiriman berulang pada service juga. |
| Text input/select/textarea | Label terlihat, helper, error terhubung | Fokus jelas, invalid memakai teks + border, nilai aman tetap ada saat gagal. Read-only berbeda dari disabled. |
| Property card | Foto, kode, status, harga, lokasi, fakta utama, CTA | Jangan membuat tautan bersarang. Judul/link detail dan tombol WhatsApp mempunyai tujuan terpisah. |
| Filter | Label lokasi/budget/tipe; tombol terapkan/reset sesuai kebutuhan | Hasil loading/kosong/error jelas; pertahankan filter saat kembali dari detail. |
| Badge | Label status lengkap, boleh ikon pendamping | Tidak berinteraksi kecuali memang tombol filter; label panjang dapat membungkus. Warna tidak menggantikan teks. |
| Alert | Judul, alasan, langkah berikutnya | Peringatan penting tetap terlihat; toast bukan satu-satunya tempat menyampaikan kegagalan. |
| Conversation item | Pelanggan, cuplikan, waktu, penanggung jawab, status relevan | Terpilih terlihat dengan bentuk/weight selain warna; identitas stabil untuk keyboard. |
| Message bubble | Pengirim, isi, waktu, status kirim | AI/sales/pelanggan diberi label. Teks pengguna ditampilkan sebagai teks, bukan HTML mentah. |
| Reply composer | Label, textarea, tombol, alasan bila terkunci | Menunggu handoff selesai; tetap menjelaskan izin/jendela balas/opt-out yang memblokir. |
| Lead panel | Kebutuhan, minat listing, stage, assignee, riwayat | Reassign hanya owner; kegagalan tidak mengubah UI seolah sukses. |
| Survey form | Properti, tanggal, mulai/akhir WIB, agen, ketersediaan unit, catatan | Requested dan confirmed berbeda; bentrok memberi cara memilih slot lain. |
| Task item | Judul, due date, assignee, status | Terlambat memakai teks/tanggal; reminder dashboard tidak diberi label “WhatsApp terkirim”. |
| Table/list | Heading kolom, angka rata kanan, tindakan berlabel | Ponsel memakai list bila lebih jelas; sorting/filter tidak menghilangkan konteks atau fokus. |
| Modal dialog | Judul, penjelasan dampak, batal/tutup, aksi | Fokus berada di dialog, Escape/batal sesuai konteks, fokus kembali ke pemicu; destructive mengutamakan pilihan aman. |
| Loading/empty/error | Skeleton/teks proses, alasan kosong, pemulihan error | Jangan menampilkan 0 sebagai pengganti data yang gagal dimuat. |

Gunakan elemen HTML asli dan komponen aksesibel yang sesuai ketika Next.js dibangun. Tidak perlu menambah date picker, chart library, atau tabel kompleks untuk interaksi yang cukup dengan kontrol native. Jika memakai shadcn/Radix, tetap periksa label, fokus, dan alur aktual setelah styling.

### State tombol

| State | Tampilan | Kontrak |
| --- | --- | --- |
| Default | Fill sesuai varian, label kontras | Satu tindakan utama per konteks. |
| Hover | Warna sedikit lebih gelap | Tidak menggeser layout. |
| Active | Warna paling gelap untuk varian | Tidak mengubah ukuran/posisi hit area. |
| Focus-visible | Outline biru dengan offset | Tidak hilang saat hover/loading. |
| Disabled | Fill netral, label terbaca | `disabled` untuk kontrol native; alasan tersedia dekat kontrol bila diperlukan. |
| Loading | Label seperti “Menyimpan…” dan indikator jika perlu | Gunakan status announcement secukupnya; loading bukan status sukses. |

## 6. Bahasa status sesuai proses bisnis

| Kondisi sistem | Label UI | Warna | Penjelasan/tindakan |
| --- | --- | --- | --- |
| Conversation mode AI | AI aktif | Info | Tidak berarti pelanggan sedang membaca jawaban. |
| Handoff requested | Pengalihan berlangsung | Warning | Composer manusia belum aktif sampai server menyatakan completed. |
| Handoff completed | Ditangani sales | Netral | AI tidak boleh memulai kiriman baru; kiriman lama yang sudah in-flight tetap dilacak. |
| Outbox pending | Mengantre | Netral | Belum memulai pengiriman. |
| Outbox sending | Sedang mengirim | Info | Jangan mengganti dengan sukses sebelum ada hasil. |
| Provider accepted | Diterima provider | Info | Tidak sama dengan sampai di perangkat. |
| Delivery delivered | Terkirim ke perangkat | Success | Berdasarkan callback, bukan tebakan UI. |
| Delivery read | Dibaca | Success | Hanya jika callback read diterima. |
| Outbox unknown | Hasil kirim belum diketahui | Warning | Tampilkan petunjuk pemeriksaan; tidak menawarkan retry otomatis sebagai aksi utama. |
| Failed | Gagal diproses / Gagal dikirim | Danger | Alasan yang aman + pemulihan sesuai klasifikasi kegagalan. |
| Cancelled by handoff | Dibatalkan saat pengalihan | Netral | Berlaku pada pending yang benar-benar dibatalkan, bukan kiriman yang sudah berjalan. |
| Survey requested | Menunggu konfirmasi | Warning | Waktu yang diminta belum janji kunjungan pasti. |
| Survey confirmed | Survei dikonfirmasi | Success | Konfirmasi manusia dan pemeriksaan ketersediaan unit sudah dilakukan. |
| Survey completed | Kunjungan selesai | Success | Hasil dicatat manusia; tidak hanya karena waktu lewat. |
| Survey cancelled/no-show | Dibatalkan · [alasan] | Netral/warning | Gunakan cancellation_reason; jangan menciptakan status database baru dari warna UI. |
| Contact opt-out | Komunikasi dihentikan | Warning | Desain produksi T-050/T-051; belum fitur demo yang tersedia. |
| Lead won/lost | Won / Lost dengan keterangan bisnis | Success/netral | Dicatat manusia; bukan bukti pembayaran yang diverifikasi bank. |

Badge “Simulator” selalu terlihat pada jalur simulasi. Badge “WhatsApp terhubung” hanya berdasarkan pemeriksaan koneksi yang relevan; warna hijau pada UI tidak boleh dijadikan bukti integrasi sudah berjalan.

## 7. Gaya bahasa

Gunakan Bahasa Indonesia yang singkat, ramah, dan spesifik. Sebut tindakan serta dampaknya, bukan detail internal seperti lease, queue ID, atau service key.

| Konteks | Copy yang digunakan |
| --- | --- |
| CTA detail | “Tanya properti ini” + keterangan “Lanjutkan melalui WhatsApp.” |
| Pencarian kosong | “Belum ada properti yang cocok. Coba ubah lokasi atau anggaran.” |
| Jadwal bentrok | “Andi sudah mempunyai survei pada waktu ini. Pilih waktu atau agen lain.” |
| Handoff | “Pengalihan berlangsung. Balasan sales tersedia setelah proses selesai.” |
| Unknown send | “Hasil kirim belum diketahui. Periksa status sebelum mengambil tindakan.” |
| Di luar jendela balas | “Pesan belum bisa dikirim melalui jalur ini. Ikuti langkah tindak lanjut yang tersedia.” |
| Gagal simpan | “Perubahan belum tersimpan. Periksa koneksi lalu coba lagi.” |
| Akses ditolak | “Anda tidak memiliki akses ke data ini.” Tanpa membuka nama/data milik pengguna lain. |

Hindari “AI pasti closing”, “100% akurat”, “pesan berhasil terkirim” ketika hanya accepted, dan “jadwal berhasil” ketika masih requested. Istilah maintenance dan detail teknis berada di dokumentasi internal, bukan hero website pelanggan.

## 8. Aksesibilitas dan pemeriksaan

Target desain: teks normal minimal **4.5:1**; teks besar minimal **3:1** sesuai definisi ukuran WCAG. Untuk menyederhanakan pemakaian, pasangan teks di token ini ditargetkan lolos 4.5:1 juga. Nilai kontras bukan bukti seluruh aplikasi telah memenuhi WCAG. [W3C: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Target klik **44 × 44 CSS px** adalah standar kenyamanan proyek ini, dengan CTA publik 48 px. WCAG 2.2 AA memiliki minimum 24 × 24 CSS px beserta pengecualian/aturan jarak; keduanya tidak disamakan. Badge statis bukan target klik. [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Dialog harus memiliki nama aksesibel, menjaga fokus di dalam selama terbuka, menyediakan cara keluar, serta mengembalikan fokus secara logis. Preview memakai `<dialog>` native; implementasi akhir tetap diuji dengan keyboard dan pembaca layar. [W3C APG: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Checklist untuk implementasi aplikasi:

- [ ] Urutan Tab logis; semua tindakan penting bisa dijalankan tanpa mouse.
- [ ] Label form terlihat; error terhubung melalui `aria-describedby`/`aria-invalid`; input aman tidak hilang saat gagal.
- [ ] Password manager/paste tidak diblokir; login memakai pola Auth yang sah.
- [ ] Fokus tidak tertutup header/CTA sticky/dialog; focus return diperiksa setelah dialog ditutup.
- [ ] Kontras label, placeholder, badge, tombol, dan focus indicator diuji pada background sebenarnya.
- [ ] Status tidak hanya warna; perubahan penting diumumkan tanpa membacakan ulang seluruh chat pada setiap polling.
- [ ] Layout 360–1440 px, teks panjang, 200% zoom, serta reduced motion diuji.
- [ ] Loading, kosong, gagal, data basi, akses ditolak, dan mode simulator/live dibedakan.
- [ ] Gambar bermakna punya alt; ikon dekoratif di samping label memakai `aria-hidden`.
- [ ] Tidak ada informasi/aksi eksklusif hover atau gesture.

### Pemeriksaan yang dapat dijalankan sekarang

Jalankan dari root workspace:

```powershell
node docs/archive/design-system/ai-admin-properti/check.cjs
```

Script memeriksa referensi token, siklus alias, pasangan kontras yang dipilih, ID/tautan/label dasar HTML, serta sintaks JavaScript preview. Script tidak menguji RLS, AI, WhatsApp, rendering browser, pembaca layar, atau integrasi bisnis.

Pemeriksaan browser yang perlu dilakukan pada preview: buka tiga tab bagian, buka/tutup dialog CTA dengan Escape, uji budget kosong/salah/valid, ambil alih → tunggu state berubah → isi balasan lokal → reset, serta periksa layout ponsel. Timer 800 ms hanya demonstrasi state; aplikasi nyata menunggu hasil server, bukan timer.

## 9. Hubungan dengan task implementasi

| Task yang sudah direncanakan | Pemakaian design system |
| --- | --- |
| T-001/T-002 | Finalisasi identitas klien, konten, foto, nama; “Ruang Properti” hanya placeholder. |
| T-004 | Import foundation/token pada CSS global; terapkan layout publik/internal minimum. |
| T-015/T-016 | Form listing, foto, status publikasi, pemisahan informasi privat. |
| T-019–T-022 | Website, katalog/detail, CTA, responsive, metadata serta uji aksesibilitas. |
| T-027/T-028 | Inbox, handoff, composer, lead panel, assignment, pesan kesalahan. |
| T-031–T-034 | Survei, tugas, metrik, status serta pengujian peran. |
| T-039–T-041 | Kejujuran state AI/live, pengiriman, unknown, dan handoff. |
| T-042/T-043 | Audit tampilan, keyboard, kontras, viewport, state/error, serta regresi. |
| T-050/T-051 | State penghentian komunikasi dan alasan pengiriman diblokir sebelum produksi. |

Saat aplikasi dibangun, gunakan sumber token ini atau pindahkan ke lokasi CSS aplikasi dengan memperbarui referensi; jangan memelihara dua salinan berbeda. Petakan semantic token ke theme Tailwind yang sesuai versi terpasang. Tidak perlu membuat seluruh katalog komponen sebelum suatu fitur memakainya.

Nilai warna sudah berupa fungsi `hsl(...)` lengkap. Konsumsi dengan `var(--color-primary)` langsung; jangan membungkusnya lagi menjadi `hsl(var(--color-primary))`. Periksa format warna yang diharapkan komponen/theme yang dipasang.

## 10. Status artefak

Design system dan preview ini merupakan hasil rancangan, bukan penanda task aplikasi selesai.

Validasi saat penyusunan: `check.cjs` **lulus** untuk 165 token, 23 pasangan kontras yang dipilih, 34 ID HTML unik beserta referensinya, serta sintaks JavaScript. Pasangan teks yang diuji memenuhi target 4.5:1; batas kontrol dan fokus yang diuji memenuhi target 3:1. Ini bukan audit aksesibilitas menyeluruh.

Pemeriksaan visual, interaksi keyboard, responsive di browser, dan pembaca layar **belum dijalankan** karena sesi ini tidak menyediakan browser yang dapat dikendalikan. Gunakan langkah pada bagian 8 saat membuka preview. Integrasi AI/database/WhatsApp tetap mengikuti task aplikasi; preview tidak membuktikan integrasi tersebut.
