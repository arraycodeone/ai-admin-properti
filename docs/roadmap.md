# Plan shipping demo — AI Admin Properti

Tanggal: 27 September 2026  
Revisi: 3 Oktober 2026 — website agen dengan CTA WhatsApp, model jasa maintenance, SEO, pemulihan pekerjaan, urutan pesan, handoff, dan cadangan waktu.  
Status: rencana target demo; fondasi aplikasi lokal tersedia, integrasi end-to-end dan deployment belum selesai. Status aktual: [implementation-status.md](implementation-status.md).

Dasar: spesifikasi MVP AI Admin Properti tanggal 26 September 2026 dan mockup ArrayCodeone.

## Membaca roadmap setelah perapihan 4 Oktober 2026

[Arsitektur aktif](architecture.md) menjelaskan kode yang sudah tersedia. Dokumen ini dan [backlog](backlog.md) menjelaskan target pekerjaan. ID T-001 sampai T-058 tetap dipertahankan.

| Tahap berikutnya | Lokasi saat diimplementasikan |
| --- | --- |
| CRUD properti dan FAQ | `src/modules/properties/`, lalu `src/modules/knowledge/` |
| Prospek, inbox, survei, tugas | Modul fitur terkait di `src/modules/` |
| Adapter AI, WhatsApp, Storage | `src/server/integrations/` |
| Urutan pesan, handoff, send gate | `src/server/conversations/` |
| Dispatcher, outbox, pemulihan | `src/server/jobs/` |
| Tipe database hasil generator | `src/types/database.generated.ts` setelah migrasi diuji |

Folder tersebut dibuat ketika task-nya dikerjakan, bukan sebagai scaffold kosong. [Rancangan folder sebelumnya](archive/architecture-plan.md) menyimpan rincian historis alur target. Kontrak bisnis dan database tetap mengikuti [business.md](business.md) dan [database.md](database.md).

## 1. Hasil akhir yang ingin kita ship

Satu website demo milik agen/agensi properti dengan katalog dan CTA WhatsApp, terhubung ke AI Admin Properti serta dashboard internal owner/sales. Pemilik dan sales memakai akun berbeda; data tersimpan dan satu alur end-to-end dapat diulang untuk presentasi.

**Model layanan:** sistem dikelola untuk klien agen/agensi; pendapatan yang direncanakan berasal dari jasa maintenance. Website publik menampilkan bisnis serta properti klien. Pendaftaran SaaS, paket langganan aplikasi, dan checkout mandiri tidak masuk rencana ini.

**Alur utama:** calon pembeli membuka website/landing page agen → melihat listing → menekan CTA → WhatsApp terbuka → calon pembeli mengirim pesan → AI menggali kebutuhan dan mencari listing sesuai → prospek tercatat dan ditugaskan → sales mengambil alih → survei diajukan dan dikonfirmasi → hasil kunjungan serta tugas berikutnya tercatat → pemilik melihat progres.

Calon pembeli menggunakan website publik dan WhatsApp tanpa akun dashboard. Aplikasi AI bekerja di belakang kanal WhatsApp; dashboard hanya untuk owner/sales yang login. Klik CTA belum merupakan chat masuk atau prospek: pesan baru diproses setelah dikirim pengguna dan diterima webhook.

Ada dua hasil yang dibedakan secara jelas:

| Hasil | Yang harus nyata | Kanal pelanggan | Kapan boleh dinyatakan selesai |
| --- | --- | --- | --- |
| Demo aplikasi dan AI | Login, izin pengguna, database, pencarian listing, API AI, handoff, prospek, survei, tugas | Simulator chat berlabel di dalam aplikasi | Alur aplikasi lulus dan URL dapat diakses oleh akun demo. |
| Demo website → WhatsApp → AI admin — target utama rencana ini | Semua di atas ditambah website agen, detail listing, CTA dengan konteks properti, serta penerimaan/pengiriman WhatsApp dan statusnya | CTA website menuju nomor uji resmi, digunakan dari perangkat/penerima uji yang diizinkan | CTA membuka nomor dan pesan yang benar; pesan yang dikirim masuk ke inbox, konteks properti dikenali, jawaban kembali ke perangkat, dan handoff terbukti bekerja. |

Simulator membantu pembangunan dan pemulihan presentasi. Jika akun atau integrasi WhatsApp belum siap, status rilis harus menyebutkan bahwa baru demo aplikasi/AI yang selesai. Simulator tidak disebut sebagai integrasi WhatsApp yang sudah aktif. Balasan skrip tidak disebut sebagai AI live.

## 2. Asumsi dan ruang lingkup

- Satu developer yang sudah mengenal JavaScript/TypeScript, dengan waktu fokus sekitar 5 jam per hari kerja.
- Satu agensi demo, satu pemilik, dan dua sales. Satu organisasi tambahan hanya untuk menguji pemisahan data.
- Website memakai identitas agen/agensi klien. Untuk demo gunakan identitas contoh berlabel; calon pembeli tidak diarahkan ke halaman pemasaran software atau form permintaan demo SaaS.
- Kanal pelanggan adalah WhatsApp yang terhubung ke AI admin. Chat web pelanggan tidak masuk cakupan; simulator internal tetap tersedia untuk pengembangan dan latihan.
- Sepuluh listing sintetis, sekitar dua puluh FAQ, empat contoh prospek, dan skenario percakapan yang dapat diulang.
- Semua percakapan demo menggunakan data sintetis atau data yang telah diizinkan dan disamarkan.
- Bahasa Indonesia, rupiah, dan waktu tampilan Asia/Jakarta.
- Satu nomor WhatsApp uji; tidak ada migrasi nomor bisnis utama pada tahap demo.
- Login memakai akun demo yang disiapkan secara administratif. Pembuatan akun anggota klien dikelola operator; undangan otomatis dapat dipertimbangkan nanti, tanpa onboarding SaaS mandiri.
- Penugasan prospek menggunakan sales default milik agensi, dengan pemindahan oleh pemilik. Penugasan berbasis beban kerja ditunda.
- Reminder berupa tugas di dashboard. Pengiriman follow-up otomatis WhatsApp di luar jendela layanan ditunda; kanal wajib menolak pengiriman yang tidak memenuhi aturan.
- Marketplace lintas agensi, aplikasi mobile native, voice note, komisi sales, dan kampanye massal berada setelah demo. Penagihan jasa maintenance berada di luar aplikasi demo.

Estimasi perencanaan setelah penambahan website agen: **sekitar 75–120 jam fokus atau 15–24 hari kerja**, termasuk cadangan 20–30% dari estimasi dasar 59–92 jam dan pembulatan. Dasarnya adalah aplikasi 47–72 jam ditambah website/SEO/CTA 12–20 jam, dengan asumsi identitas, foto, dan konten siap. Ini bukan janji tanggal selesai. Waktu menunggu akses akun, persetujuan platform, data, atau billing berada di luar jam implementasi. Jika hanya tersedia 2 jam sehari, gunakan sekitar 38–60 hari kerja sebagai konversi awal. Evaluasi ulang estimasi setelah P2 berdasarkan hasil pengerjaan fondasi dan uji koneksi awal; hitung kembali cadangan jika estimasi dasar berubah.

## 3. Keputusan teknis awal

Untuk rencana implementasi pada repository sendiri, usulan default adalah:

| Komponen | Pilihan | Batas penggunaan |
| --- | --- | --- |
| Aplikasi web dan API | Next.js App Router + TypeScript | Satu aplikasi, satu repository; logika server dipisahkan dari komponen UI. |
| Website publik | Halaman agen dan katalog dalam proyek yang sama | Halaman publik menampilkan field yang diizinkan; dashboard menggunakan area `/app` dengan login. CTA menuju WhatsApp, bukan dashboard. |
| Tampilan | Tailwind CSS dan komponen aksesibel | Adaptasi desain mockup, dengan teks, formulir, dan navigasi yang nyaman di ponsel. |
| Database/login/file | Supabase PostgreSQL, Auth, Storage | Migrasi SQL, pembatasan akses RLS, serta foto demo di bucket yang aksesnya diatur. |
| Model AI | Satu penyedia API dengan structured output/tool calling | Model dan kunci dikonfigurasi di server. Pilihan model dikunci setelah evaluasi kecil dan pemeriksaan biaya pada awal implementasi AI. |
| Kanal | WhatsApp Cloud API resmi | Adapter simulator dan adapter WhatsApp menggunakan logika percakapan yang sama. |
| Pekerjaan latar belakang | Inngest dengan pencatatan pekerjaan/outbox di PostgreSQL | Dispatcher dan pemulihan berkala untuk pekerjaan tertunda; urutan percakapan dikendalikan aplikasi, bukan hanya pengaturan concurrency. |
| Hosting yang diusulkan | Vercel untuk Next.js, layanan terkelola untuk data dan jobs | Target teknis rencana; akun dan paket dipilih saat implementasi, belum ada layanan yang dibeli/dipasang. |
| Verifikasi | Typecheck, production build, pengujian database/izin, dan Playwright untuk alur inti | Fokus pada data, izin, handoff, pesan ganda, serta keberhasilan demonstrasi. |

Jika implementasi nantinya dilakukan melalui hosting lain, sesuaikan runtime, jobs, serta cara memasang secret sebelum membuat scaffold. Jangan menjalankan dua jalur hosting sekaligus untuk demo yang sama.

Prinsip implementasi: tidak melatih model sendiri, tidak membangun microservices, dan tidak menambahkan vector database sebelum pencarian SQL terstruktur serta FAQ terbukti tidak mencukupi.

## 4. Persiapan yang dilakukan sejak awal

| Kebutuhan | Penanggung jawab | Dibutuhkan sebelum | Jika belum tersedia |
| --- | --- | --- | --- |
| Repository dan pilihan hosting | Developer/pemilik proyek | Setup | Kerjakan kode lokal; pertahankan satu lockfile. |
| Project Supabase terpisah untuk demo | Pemilik akun + developer | Login/database ter-host | Gunakan lingkungan development; tidak menghubungkan ke database pelanggan. |
| Akun penyedia AI dan batas biaya | Pemilik akun | Uji AI live | Gunakan fixture berlabel untuk pengembangan; milestone AI live belum lulus. |
| Meta developer/business setup dan nomor uji | Pemilik akun | Uji koneksi P1a, ditargetkan selama P1–P2 | Catat hambatan akses dan lanjutkan simulator; P1a serta milestone WhatsApp tetap terbuka. |
| Akun jobs dan kunci deployment | Pemilik akun + developer | Pemrosesan webhook async | Jalankan lingkungan pengembangan jobs; jangan mengandalkan proses setelah respons serverless berakhir. |
| Listing, FAQ, aturan sales | Pemilik produk | Pengujian alur | Gunakan seed sintetis yang konsisten. |
| Nama/identitas agen, logo, foto, teks profil, dan kontak publik | Klien + developer | P0/P3a | Gunakan identitas serta aset contoh berlabel untuk demo. |
| Domain sendiri | Pemilik produk | Opsional setelah demo | Gunakan URL hosting bawaan. |

API key dan password dimasukkan langsung pada konfigurasi rahasia layanan; `.env.example` hanya berisi nama variabel dan petunjuk tanpa nilai rahasia. Keputusan akun diperiksa sejak tahap awal agar tidak baru diketahui menjelang presentasi.

## 5. Backlog berurutan dan kriteria selesai

Rentang berikut berjumlah sekitar 59–92 jam: aplikasi 47–72 jam dan P3a untuk website/SEO/CTA 12–20 jam. Cadangan 20–30% menghasilkan sekitar 71–120 jam, dibulatkan menjadi anggaran 75–120 jam. Cadangan digunakan untuk debugging integrasi, izin data, dan pengujian kegagalan. Angka ini tetap estimasi awal yang ditinjau setelah P2; penambahan website memperluas estimasi aplikasi sebelumnya.

Kerjakan tahap sesuai dependensinya. P1a adalah uji kanal awal selama P1–P2; alokasi 1–2 jam dipindahkan dari P7 sehingga tidak dihitung dua kali. P2–P6 dapat berjalan jika P1a tertunda karena akses Meta, tetapi P7 dan rilis WhatsApp tetap memerlukan P1a lulus. Persiapan akun dapat berjalan bersamaan dengan coding tanpa memerlukan agent tambahan.

| ID | Tahap | Estimasi | Dependensi | Hasil yang harus dapat diperiksa |
| --- | --- | --- | --- | --- |
| P0 | Kunci alur demo dan data | 2–3 jam | — | Daftar layar, 10 listing, FAQ, akun/peran, dan satu skrip demo. |
| P1 | Setup proyek dan konfigurasi | 3–5 jam | P0 | Aplikasi berjalan lokal, struktur modul, `.env.example`, lockfile, dan perintah build terdokumentasi. |
| P1a | Uji koneksi WhatsApp awal | 1–2 jam | P1 + akses Meta | Webhook menerima pesan perangkat uji dan pesan uji kembali ke perangkat, tanpa menunggu AI/inbox selesai. |
| P2 | Database, login, dan hak akses | 7–10 jam | P1 | Migrasi/seed dapat dijalankan ulang, login owner/sales, serta tes akses lintas agensi dan sales lulus. |
| P3 | Listing dan pengetahuan | 4–6 jam | P2 | Listing/FAQ dapat diedit dan tetap tersimpan; status listing memengaruhi hasil pencarian. |
| P3a | Website agen, SEO, dan CTA WhatsApp | 12–20 jam | P3 + identitas/konten | Beranda, katalog/detail properti, profil/kontak dan privasi; data publik tersaring, CTA membawa kode properti, serta konfigurasi SEO diuji. |
| P4 | Inbox, prospek, dan simulator | 7–10 jam | P2, P3 | Pesan dan prospek tersimpan, assignment bekerja, handoff manual tersedia, serta simulator masuk lewat service yang sama. |
| P5 | Survei, tugas, ringkasan | 5–8 jam | P4 | Pengajuan/konfirmasi survei, hasil kunjungan, tugas, dan angka dashboard berasal dari database. |
| P6 | AI berbasis data bisnis | 7–10 jam | P3, P4 | AI live mengumpulkan kebutuhan, mencari listing valid, membuat ringkasan, dan menyerahkan ke sales saat perlu. |
| P7 | Integrasi WhatsApp lengkap dan jobs | 6–10 jam | P1a, P3a, P4, P6 + akses Meta/jobs | Website → CTA → pesan WhatsApp → inbox → AI/sales → perangkat uji; pemulihan pekerjaan, urutan pesan, retry, deduplikasi, dan handoff diuji. |
| P8 | QA, release, dan latihan demo | 5–8 jam | P3a, P5, P6, P7 | Build sukses, checklist website dan aplikasi lulus, URL demo sehat, seed/reset terkendali, dan presentasi dapat diulang. |

### P0 — Putuskan pengalaman yang didemokan

- Tetapkan fitur inti dan fitur yang ditunda menurut bagian 2.
- Gunakan alur Dimas: anggaran Rp700 juta, Bekasi, minimal dua kamar, ingin survei.
- Tetapkan identitas website agen dan teks CTA: “Tanya Properti Ini” pada detail listing serta “Konsultasi via WhatsApp” pada beranda. Pilih satu listing berkode publik untuk menguji konteks dari website sampai inbox.
- Siapkan listing yang cocok, satu listing di atas anggaran, satu listing tidak tersedia, serta satu skenario tanpa hasil.
- Tentukan profil owner dan sales; pergantian peran dalam demo dilakukan lewat akun berbeda, bukan tombol yang mengubah izin pengguna.
- Siapkan board pekerjaan dengan kolom Backlog, Dikerjakan, Diperiksa, Selesai.

### P1 — Fondasi aplikasi

- Buat aplikasi TypeScript, komponen dasar, navigasi, dan tema sesuai mockup.
- Pisahkan UI, aturan bisnis, query database, adapter AI, adapter kanal, dan handler jobs.
- Sediakan penanganan loading, empty, error, dan sukses untuk alur utama.
- Buat scripts `dev`, `typecheck`, `build`, `test`, serta langkah migrasi/seed di README.
- Kunci versi melalui lockfile. Siapkan pemeriksaan otomatis typecheck/build; jangan memakai kredensial live dalam pemeriksaan kode.
- Uji deployment development/preview dasar untuk menemukan masalah runtime dan menyediakan endpoint P1a. Setelah login dan data awal berfungsi pada P2, ulangi pemeriksaan di URL tersebut. URL ini belum disebut demo siap presentasi.

### P1a — Uji koneksi WhatsApp awal selama P1–P2

- Mulai persiapan akun pada P0. Begitu deployment dasar dan akses Meta tersedia, verifikasi webhook GET, signature POST, serta penerimaan pesan dari perangkat uji yang diizinkan.
- Kirim balasan uji tetap berlabel melalui API dan pastikan tiba di perangkat. Uji ini memeriksa koneksi dua arah; hasilnya belum memenuhi milestone AI live atau integrasi inbox lengkap.
- Catat URL callback, waktu uji, hasil, dan hambatan tanpa mencetak token atau isi percakapan sensitif. Endpoint uji dibatasi untuk kanal/penerima demo dan tidak menunggu AI.
- Jika akses belum tersedia, catat P1a sebagai tertunda beserta penanggung jawabnya. Lanjutkan database/simulator dan ulangi uji saat akses tersedia; jangan menandai koneksi lulus berdasarkan simulator.

### P2 — Data dan izin

- Buat migrasi tabel, foreign key, constraint, indeks, dan kebijakan akses.
- Buat seed satu agensi demo dengan owner/dua sales, serta agensi kedua untuk pengujian isolasi.
- Login/logout dan pemeriksaan sesi di server. Halaman dan API internal memerlukan pengguna yang sah.
- Owner melihat semua data organisasinya; sales melihat prospek/percakapan/tugas yang ditugaskan kepadanya serta katalog yang diizinkan.
- Batasi akses file listing sesuai kebutuhan dan pastikan kontak internal pemilik properti tidak dibawa ke konteks AI pelanggan.
- Buat pengujian negatif terhadap URL/API langsung dan manipulasi ID organisasi. Secret/service key server tidak boleh menjadi jalan pintas untuk melewati pemeriksaan agensi.
- Pada akhir P2, tinjau jam aktual, hasil atau hambatan P1a, serta rancangan pemulihan dan handoff. Perbarui estimasi tahap tersisa dan cadangan 20–30% sebelum memperluas dashboard.

### P3 — Listing dan FAQ

- Tambah/edit listing: judul, area, harga numerik dalam rupiah, kamar, luas, status, foto, dan waktu pembaruan.
- Pisahkan field publik dari catatan internal serta kontak pemilik properti.
- FAQ awal berupa entri teks terstruktur; unggahan PDF besar belum diperlukan.
- Pencarian memakai filter SQL dan parameter tervalidasi. Hasil yang ditujukan kepada pelanggan dibatasi pada organisasi yang sah, listing aktif, dan listing yang sudah dipublikasikan oleh owner.
- Uji perubahan harga dan status dari akun owner; perubahan harus terlihat pada pencarian berikutnya.

### P3a — Website agen, SEO, dan CTA WhatsApp

- Buat beranda/landing page agen, katalog sederhana, detail properti, bagian profil/kontak, dan halaman privasi. Katalog menggunakan sepuluh listing seed; pencarian awal cukup filter area, harga, dan kamar yang sudah tersedia. Halaman detail mempunyai slug serta kode properti publik yang stabil.
- Website dan AI membaca sumber listing yang sama. Data publik hanya mencakup field yang diizinkan dari listing aktif dan dipublikasikan; catatan internal, kontak pemilik properti, prospek, serta percakapan tidak masuk respons publik. Identitas organisasi website ditentukan konfigurasi server, bukan parameter bebas dari pengunjung. Perubahan harga/status harus memperbarui halaman dan hasil AI; listing yang ditarik dari publikasi tidak lagi dapat dibaca melalui URL/API publik.
- CTA memakai click-to-chat ke nomor WhatsApp yang terhubung ke Cloud API untuk klien tersebut. Isi pesan awal mencantumkan kode properti dan sumber yang sederhana, misalnya “Halo, saya tertarik rumah Bekasi kode BKS-001 dari website. Bisa dibantu?” Gunakan format nomor internasional dan encode teks sesuai [panduan WhatsApp](https://faq.whatsapp.com/5913398998672934).
- Klik CTA membuka WhatsApp dengan teks awal; pengguna tetap menekan Kirim. AI dan pembuatan prospek baru berjalan setelah webhook menerima pesan tersebut. CTA beranda menggunakan pesan konsultasi umum. Uji di ponsel dan desktop; sediakan nomor kontak yang terbaca jika pengguna belum dapat membuka WhatsApp.
- Server memvalidasi kode properti pada pesan terhadap katalog organisasi kanal. Pengguna dapat mengubah/menghapus pesan awal; jika kode tidak valid atau konteks tidak cukup, AI menanyakan kebutuhan. Teks pelanggan bukan dasar otorisasi, harga, atau ketersediaan. Penanda “dari website” dicatat sebagai sumber yang dinyatakan pada pesan, bukan bukti atribusi pasti; tanpa penanda, sumber website tidak diasumsikan.
- SEO berfokus pada properti dan area layanan agen. Siapkan judul/deskripsi unik, heading jelas, URL deskriptif, canonical, sitemap halaman publik yang layak diindeks, tautan internal, serta gambar ringan dengan teks alternatif. Pilih topik berdasarkan listing nyata dan kebutuhan calon pembeli; halaman area tambahan dibuat saat tersedia konten berguna. Ikuti [panduan SEO Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- Website demo dengan listing sintetis diberi label demo dan `noindex`; sitemap untuk rilis publik tidak memasukkan URL demo, login, simulator, dashboard, atau halaman filter duplikat. Saat website klien berisi listing nyata siap rilis, aktifkan indeks hanya untuk halaman publik yang disetujui dan periksa melalui Search Console. Pastikan crawler dapat membaca `noindex` pada halaman yang dapat diakses; robots.txt bukan pengganti autentikasi. Lihat [panduan noindex Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- Ukur klik CTA secara terpisah dari jumlah percakapan masuk, prospek, dan survei. Klik tidak otomatis dihubungkan ke identitas WhatsApp; hindari memasukkan nomor calon pembeli atau isi chat ke log analitik website. Kriteria demo adalah konfigurasi SEO dan alur CTA lulus uji, bukan janji peringkat Google.

### P4 — Inbox dan prospek

- Simpan pesan, arah pesan, sumber kanal, waktu, serta status pemrosesan/pengiriman.
- Normalisasi kontak untuk menghindari prospek ganda dari nomor yang sama dalam agensi yang sama.
- Input simulator hanya tersedia untuk pengguna demo yang berwenang; beri label bahwa kanalnya simulasi.
- Catat kebutuhan pembeli, sumber yang memang tersedia, sales penanggung jawab, dan tahap prospek.
- Untuk pesan dari CTA, tampilkan properti yang ditanyakan setelah kode tervalidasi, serta sumber sesuai bukti yang tersedia. Klik website saja tidak membuat kontak atau lead WhatsApp.
- Mode percakapan `ai` atau `human` disimpan pada server; handoff mengubah mode dan versi pengendali secara atomik serta membatalkan balasan AI yang masih mengantre. Hasil AI yang selesai setelah versi berubah tidak boleh membuat balasan baru.
- Handoff dan tahap akhir pengiriman memakai pengendali yang sama per percakapan, termasuk pada simulator. UI baru menyatakan handoff selesai setelah pengendali memastikan tidak ada pengiriman AI baru yang dapat dimulai. Pesan yang request pengirimannya sudah dimulai dapat tetap tiba; tampilkan statusnya sebagai sedang dikirim atau hasil belum diketahui, bukan dibatalkan.
- UI inbox memperlihatkan keadaan gagal/menunggu tanpa menghilangkan pesan. Pesan baru dapat diperbarui melalui polling sederhana; realtime bukan prasyarat demo.

### P5 — Pekerjaan sales dan ringkasan owner

- Status survei: diajukan, dikonfirmasi, selesai, dibatalkan. Perubahan jadwal membutuhkan konfirmasi ulang.
- Sales memeriksa ketersediaan agen/pemilik properti sebelum mengonfirmasi; catat siapa yang melakukan konfirmasi.
- Deteksi benturan rentang waktu kunjungan agen yang sama. Simpan timestamp terstandar dan tampilkan WIB.
- Setelah survei, catat hasil, tahap prospek, dan tanggal follow-up berikutnya.
- Dashboard sales menampilkan tugas hari ini; dashboard owner menampilkan prospek yang belum ditangani dan progres tim.
- Definisi metrik: prospek unik, tugas terlambat, survei dikonfirmasi, survei selesai, dan closing yang dicatat manual. Semua angka dapat ditelusuri ke record.

### P6 — AI live dengan aturan bisnis

- Pilih satu model dan simpan ID model sebagai konfigurasi; validasi kemampuan bahasa Indonesia, tool calling, waktu respons, dan biaya menggunakan kasus uji.
- Tools terbatas: cari listing, baca FAQ publik, perbarui preferensi prospek, ajukan survei, dan minta handoff. Server memvalidasi peran/agensi dan argumen tool.
- Nilai budget/lokasi/kamar yang ambigu ditanyakan kembali; harga dan ketersediaan diambil dari database, bukan ingatan model.
- Catat versi prompt, model, durasi, penggunaan, serta alasan handoff; minimalkan data sensitif dalam log.
- Tetapkan batas panjang percakapan, jumlah tool call, timeout, dan biaya sebelum demo dibuka ke pengguna uji.
- Jika API gagal atau jawaban tidak dapat diverifikasi, buat tugas sales. Jangan mengganti kegagalan dengan janji harga, jadwal, atau persetujuan yang dibuat-buat.
- Uji set kecil: 10 kasus umum/variasi bahasa dan 5 kasus penting—listing kosong, harga baru, informasi internal, manipulasi instruksi, serta handoff saat AI sedang berjalan. Ini uji awal, bukan bukti akurasi di seluruh pasar.

### P7 — Integrasi WhatsApp

- Konfigurasikan nomor uji dan penerima yang diizinkan mengikuti alur Meta.
- Cocokkan nomor tujuan CTA dengan kanal WhatsApp yang diproses aplikasi. Uji lengkap dimulai dari halaman properti: tekan CTA, kirim pesan awal, periksa kode properti di inbox, dan terima jawaban AI pada perangkat. Jika teks awal dihapus, AI tetap dapat menangani konsultasi umum.
- Endpoint GET untuk verifikasi webhook dan POST untuk peristiwa pesan/status; verifikasi tanda tangan POST memakai body asli.
- Setelah validasi, simpan event dengan unique key dan record pekerjaan `pending` dalam `job_outbox` pada transaksi PostgreSQL yang sama. Beri respons sukses webhook setelah transaksi tersimpan; respons tidak menunggu inferensi AI. Event duplikat tidak membuat pekerjaan atau pesan kedua.
- Dispatcher menerbitkan pekerjaan tersimpan ke Inngest dengan ID pekerjaan stabil, menunggu konfirmasi penerimaan, lalu mencatat hasilnya. Jika aplikasi mati setelah commit database tetapi sebelum penerbitan, pekerjaan tetap dapat ditemukan. Jika mati setelah penerbitan tetapi sebelum pencatatan, penerbitan ulang dan worker tetap idempoten: operasi bisnis maupun balasan tidak digandakan.
- Jalankan pemulihan berkala untuk pekerjaan `pending`, kegagalan sementara yang boleh diulang, serta pekerjaan yang macet melewati batas waktu. Tetapkan interval, batas percobaan, dan status gagal yang terlihat oleh operator. Bedakan tanda terbit dari tanda selesai agar pekerjaan yang sudah diterbitkan tetapi belum selesai tetap terpantau. Setelah layanan pulih, pekerjaan tertunda harus terjadwalkan kembali paling lambat dua interval pemulihan.
- Tetapkan nomor urut pesan masuk secara atomik per percakapan berdasarkan urutan penerimaan di database; simpan timestamp provider terpisah. Nomor ini tidak menjamin urutan asli di perangkat jika provider mengirim event terlambat. Worker memproses urutan tersebut dengan satu pengendali aktif per percakapan; retry pesan sebelumnya tidak boleh disalip balasan pesan berikutnya. Jika retry habis, catat kegagalan dan serahkan ke sales agar antrean tidak macet tanpa penanganan.
- Jangan mengandalkan `concurrency: 1` Inngest sebagai jaminan urutan seluruh pekerjaan. Batas concurrency berlaku pada langkah aktif dan urutan antreannya bersifat best-effort; gunakan state/nomor urut serta koordinasi aplikasi lintas langkah dan retry. Lihat [dokumentasi concurrency Inngest](https://www.inngest.com/docs/durable-execution/flow-control/concurrency).
- Pisahkan `job_outbox` untuk pemicu pekerjaan dari `outbox` untuk pesan keluar. Pesan keluar menyimpan kunci operasi, versi pengendali, serta status seperti `pending`, `sending`, `sent`, `unknown`, `failed`, dan `cancelled`. Saat request pengiriman timeout atau proses mati ketika mengirim, hasilnya dianggap belum diketahui; rekonsiliasi atau eskalasi sebelum mengirim ulang. Pemulihan jobs tidak otomatis mengulang pengiriman berstatus `sending`/`unknown`.
- Handoff dan pengiriman akhir harus melewati satu pengendali per percakapan. Koordinasikan pemeriksaan mode/versi, perubahan status outbox, dan dimulainya request provider terhadap handoff; pemeriksaan mode lalu pengiriman tanpa koordinasi menyisakan celah. Inferensi AI berada di luar bagian yang dikunci. Setelah handoff selesai, tidak ada request AI baru; request yang telah dimulai tetap dicatat dan mungkin tiba belakangan. Gunakan timeout terbatas dan tampilkan status menunggu jika pengendali belum dapat menyelesaikan handoff.
- Uji proses mati setelah penyimpanan tetapi sebelum penerbitan job, penerbitan ganda, beberapa pesan beruntun, retry yang terlambat, dan handoff tepat di antara pemeriksaan mode dan pengiriman. Uji juga request yang sudah dimulai ketika handoff diminta agar UI tidak menjanjikan pembatalan pesan tersebut.
- Nomor uji/penerima bukan akses produksi pelanggan. Simpan batas dan label mode demo dengan jelas.
- Di luar jendela pengiriman yang diizinkan, balasan bebas tidak dikirim. Template follow-up terjadwal berada di fase berikutnya; simulasi penolakan aturan tetap diuji.

### P8 — Rilis dan latihan

- Jalankan pemeriksaan yang tercantum pada bagian 8; perbaiki masalah yang menghalangi alur utama.
- Siapkan akun presenter, prosedur seed/reset, README, skrip demo, dan catatan keterbatasan.
- Deploy kandidat rilis, jalankan pemeriksaan di URL yang benar-benar akan digunakan, lalu tandai versi/commit demo yang lulus.
- Ulangi demonstrasi dua kali dengan sesi login baru. Jangan mengganti skenario secara diam-diam ketika kanal live gagal; tampilkan mode fallback secara eksplisit.

## 6. Peta layar dan data minimal

| Layar | Isi utama |
| --- | --- |
| Website publik `/` | Profil singkat agen, properti unggulan, kontak, dan CTA konsultasi WhatsApp. |
| Katalog/detail `/properti` dan `/properti/[slug]` | Field publik listing, foto, area, harga/status, serta CTA “Tanya Properti Ini”. |
| Privasi `/privasi` | Penjelasan penggunaan data website dan percakapan yang sesuai dengan praktik layanan. |
| Login | Akses akun demo yang telah dibuat. |
| Hari ini | Ringkasan sesuai peran dan tugas yang dapat langsung dikerjakan. |
| Inbox | Daftar percakapan, chat, mode AI/manusia, serta profil prospek. |
| Prospek | Penanggung jawab, tahap, kebutuhan, dan tindakan berikutnya. |
| Properti | Daftar/detail/edit listing dan ketersediaan. |
| Survei | Pengajuan, konfirmasi, jadwal, serta hasil kunjungan. |
| Pengetahuan | FAQ publik yang digunakan AI. |
| Pengaturan demo | Status koneksi yang aman ditampilkan; tindakan reset khusus owner. |

Layar internal setelah login berada di area `/app`. Profil/kontak agen dapat menjadi bagian beranda pada tahap demo; pengunjung tidak memerlukan akun untuk membuka halaman publik atau CTA.

Entitas minimal: `organizations`, `memberships`, `properties`, `property_assets`, `knowledge_entries`, `contacts`, `leads`, `conversations`, `messages`, `tasks`, `surveys`, `channels`, `webhook_events`, `job_outbox`, `outbox`, `ai_runs`, dan `audit_events`.

Keputusan penting: record bisnis mempunyai `organization_id`; pesan provider unik per kanal; penugasan sales konsisten antara lead dan conversation; perubahan mode mempunyai version/counter; harga disimpan sebagai angka; tugas dan kunjungan memiliki timezone yang jelas. Entitas persetujuan komunikasi ditambahkan sebelum pengiriman outbound lanjutan diaktifkan.

Untuk pemulihan dan urutan: `job_outbox` memiliki ID operasi unik, status penerbitan/penyelesaian, jumlah percobaan, jadwal percobaan berikutnya, dan waktu aktivitas terakhir. Pesan masuk memiliki nomor urut unik dalam percakapan; state percakapan mencatat kemajuan pemrosesan dan pemilik pemrosesan aktif. `outbox` menyimpan versi pengendali serta waktu mulai request provider agar handoff dapat membedakan pesan mengantre dari pengiriman yang sudah dimulai.

Untuk website: listing memiliki status publikasi, slug, dan kode publik unik dalam organisasi. Profil agen dan nomor CTA berasal dari konfigurasi organisasi/kanal. Lead dapat menyimpan properti yang ditanyakan dan penanda sumber beserta asal buktinya; keduanya diturunkan dari pesan masuk yang tervalidasi, bukan diasumsikan dari klik. Tetapkan data/foto yang boleh publik secara eksplisit.

## 7. Runbook deployment demo

1. **Siapkan lingkungan demo terpisah.** Tetapkan project database/storage demo dan akun AI/kanal yang sesuai. Preview perubahan tidak boleh melakukan migrasi/reset ke data pelanggan.
2. **Konfigurasikan secret per lingkungan.** Contoh nama aplikasi: URL/key publik database, secret server, `AI_API_KEY`, `AI_MODEL`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `META_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, serta key jobs. Nama aktual mengikuti implementasi; nilai tidak dicetak ke log.
3. **Terapkan migrasi dan seed.** Jalankan terhadap target yang diverifikasi, buat akun demo, uji login dan kebijakan data sebelum membuka link ke tester.
4. **Build kandidat.** Instal dari lockfile; typecheck, tes inti, dan production build harus berhasil. Periksa tidak ada key, password, atau data pelanggan di bundle browser.
5. **Deploy aplikasi.** Untuk usulan Vercel, pasang environment variables pada lingkungan yang benar dan gunakan URL demo stabil. Perubahan konfigurasi diikuti deployment baru sesuai mekanisme platform.
6. **Pasang URL callback dan pemulihan.** Konfigurasikan URL situs/redirect Auth, handler jobs, webhook Meta, dispatcher, serta jadwal pemulihan berkala pada deployment yang benar. Verifikasi pekerjaan tertunda dipulihkan setelah gangguan sementara; proses tidak bergantung pada request browser yang tetap terbuka.
7. **Atur akses dan indeks.** Halaman website yang ditetapkan publik dapat diakses tanpa login; dashboard serta API internal tetap membutuhkan izin. Terapkan `noindex` pada demo dan halaman login. Endpoint webhook harus dapat dijangkau provider tanpa login browser, tetapi memverifikasi signature. Jangan mematikan proteksi seluruh aplikasi untuk memperbaiki callback yang terblokir.
8. **Verifikasi eksternal.** Buka detail properti tanpa login, tekan CTA dari perangkat WhatsApp uji yang diizinkan, dan kirim pesan awal. Periksa nomor tujuan, konteks properti, inbox owner/sales, job, respons, handoff, dan penyimpanan data di lingkungan ter-host. Periksa metadata, canonical, serta pengecualian URL dari sitemap.
9. **Pasang batas operasional demo.** Batas request/AI, penerima uji, status koneksi, logging error, dan tombol pause AI. Tidak ada akses publik tanpa batas untuk memicu biaya.
10. **Catat versi yang lulus.** Simpan commit/build, langkah rilis, dan keterbatasan yang diketahui. Bagikan akun demo melalui jalur yang sesuai; tidak menaruh password pada halaman publik.

Rollback: hentikan pemrosesan/pengiriman bila terjadi kesalahan, lalu kembalikan deployment aplikasi ke versi lulus sebelumnya. Dispatcher dan pemulihan juga harus mematuhi status pause agar pekerjaan tidak aktif kembali selama penanganan. Migrasi database dibuat kompatibel ke belakang; rollback aplikasi tidak otomatis memulihkan schema/data. Seed/reset hanya menyentuh organisasi demo yang ditentukan dan memerlukan konfirmasi owner; hentikan worker terkait dan batalkan pekerjaan lama organisasi tersebut sebelum membuka kembali pemrosesan. Uji prosedur ini tanpa merusak organisasi uji lain.

## 8. Definition of done

Semua item berikut adalah syarat rilis demo utama, bukan klaim bahwa sudah dilakukan:

- [ ] Fresh checkout dapat dijalankan mengikuti README dan `.env.example`.
- [ ] Typecheck, production build, dan pengujian inti berhasil.
- [ ] Data tetap tersedia setelah refresh, logout, dan login ulang.
- [ ] Owner melihat organisasinya; sales hanya mengakses pekerjaan yang diizinkan.
- [ ] Akses agensi lain, akses anonymous ke data internal, dan manipulasi ID ditolak oleh server/database; akses publik hanya mengembalikan field listing yang diizinkan.
- [ ] Website agen, katalog/detail properti, serta CTA berfungsi pada ponsel dan desktop; data internal tidak muncul pada HTML, metadata, respons API, atau aset publik.
- [ ] Perubahan harga/status/publikasi konsisten pada website dan AI; URL/API listing yang ditarik dari publikasi tidak membocorkan isinya.
- [ ] CTA membuka nomor kanal yang benar dengan kode properti; prospek baru tercatat setelah pengguna mengirim pesan dan webhook menerimanya.
- [ ] Kode properti yang valid dikenali; kode hilang, diubah, atau milik organisasi lain ditangani tanpa kebocoran data atau asumsi harga/ketersediaan.
- [ ] Judul/deskripsi, canonical, tampilan ponsel, dan aturan sitemap diperiksa; website demo sintetis tetap `noindex` dan tidak dianggap sebagai peluncuran SEO produksi.
- [ ] Klik CTA dan percakapan masuk dihitung terpisah; atribusi website hanya dicatat sesuai bukti yang tersedia.
- [ ] Listing yang dijeda atau diubah tidak ditawarkan dengan data lama pada pencarian baru.
- [ ] AI live mengambil harga dan status dari data bisnis; kasus tanpa jawaban masuk ke sales.
- [ ] Handoff membatalkan balasan AI mengantre dan mencegah request AI baru setelah handoff selesai, termasuk saat handoff terjadi di antara pemeriksaan mode dan pengiriman.
- [ ] Request yang sudah dimulai saat handoff tetap dilacak; UI membedakannya dari pesan dibatalkan dan tidak menjamin bahwa pesan tersebut tidak akan tiba.
- [ ] Proses mati setelah commit database tetapi sebelum penerbitan job tidak membuat pesan terlantar; pekerjaan terjadwalkan kembali paling lambat dua interval pemulihan setelah layanan pulih.
- [ ] Penerbitan job ganda serta retry worker tidak menggandakan operasi bisnis atau balasan; pengiriman dengan hasil belum diketahui direkonsiliasi atau dieskalasi.
- [ ] Beberapa chat beruntun diproses mengikuti nomor urut penerimaan database, termasuk saat ada retry; kegagalan permanen terlihat dan masuk ke sales.
- [ ] Peristiwa webhook duplikat tidak menyebabkan pesan atau balasan ganda dalam skenario uji.
- [ ] Kegagalan provider tercatat dan dapat ditangani; pesan pelanggan tidak hilang.
- [ ] Pengajuan survei belum dianggap pasti; benturan jadwal terdeteksi.
- [ ] Tugas follow-up dan ringkasan owner sesuai record.
- [ ] Jalur inti nyaman pada lebar sekitar 360 px dan desktop, dengan label serta kontrol terbaca.
- [ ] Endpoint produksi demo, login, file, jobs, dan callback diuji dari lingkungan ter-host.
- [ ] Bukti uji koneksi awal P1a tercatat; uji tersebut dilengkapi pengujian integrasi penuh P7 di URL rilis.
- [ ] Pesan WhatsApp uji berhasil dikirim dan diterima dari perangkat yang diizinkan.
- [ ] Mode simulator/live terlihat jelas; tidak ada klaim fitur live ketika hanya fixture yang berjalan.
- [ ] Secret tidak berada dalam bundle browser; batas akses dan pemakaian demo aktif.
- [ ] Reset organisasi demo aman dan latihan presentasi dapat diulang dua kali.

Jika satu blocker inti gagal, jangan tandai demo utama selesai. Catat apakah yang masih tersedia adalah demo aplikasi/AI, lalu perbaiki blocker atau nyatakan batasnya pada presentasi.

## 9. Skrip presentasi sekitar 5–7 menit

| Menit | Aksi presenter | Nilai yang terlihat |
| --- | --- | --- |
| 0–1 | Buka website agen tanpa login; lihat rumah Bekasi dan detail listing | Calon pembeli menemukan informasi properti dan CTA yang jelas. |
| 1–2 | Tekan “Tanya Properti Ini”; dari WhatsApp uji kirim pesan awal dan anggaran maksimal Rp700 juta | Pesan masuk ke AI admin dengan konteks properti yang tervalidasi. |
| 2–3 | Jawab kebutuhan dua kamar; lihat listing yang cocok dan prospek tercatat | Chat menghasilkan informasi yang dapat dipakai sales. |
| 3–4 | Login sales pada sesi berbeda; ambil alih dan balas setelah handoff selesai | Sales mendapat konteks; balasan AI mengantre dibatalkan dan pengiriman AI baru berhenti. |
| 4–5 | Ajukan survei, kemudian konfirmasi setelah pemeriksaan | Jadwal dan penanggung jawab terlihat jelas. |
| 5–6 | Catat hasil survei contoh dan buat follow-up | Pekerjaan berikutnya tidak bergantung pada ingatan. |
| 6–7 | Buka ringkasan owner dan jelaskan batas demo | Owner melihat progres dari record yang sama. |

Penandaan hasil kunjungan pada presentasi menggunakan skenario contoh, bukan klaim bahwa kunjungan nyata terjadi. Jangan menyatakan peningkatan conversion sebelum ada data pilot.

## 10. Risiko pengerjaan dan keputusan praktis

| Risiko | Tindakan yang direncanakan |
| --- | --- |
| Akses Meta belum siap | Mulai persiapan P0 dan targetkan uji koneksi P1a selama P1–P2; bangun simulator selama menunggu, dengan milestone WhatsApp tetap terbuka. |
| API AI belum aktif | Gunakan fixture untuk UI/test; aktivasi dan evaluasi AI menjadi gate P6. |
| Scope bertambah | Masukkan fitur baru ke backlog setelah demo, kecuali diperlukan untuk alur utama. |
| Data listing tidak rapi | Gunakan seed sintetis konsisten; tetapkan format impor/manual yang sederhana. |
| Biaya tidak terkendali | Batasi pengguna, penerima, request, konteks AI, retry, dan penggunaan berbayar sebelum link dibagikan. |
| Integrasi async menghasilkan duplikasi atau urutan keliru | Gunakan ID operasi unik, nomor urut database, pengendali per percakapan, dan pengujian retry serta hasil pengiriman tidak pasti. |
| Pesan tersimpan tetapi pekerjaan tidak berjalan | Simpan event dan pekerjaan pending dalam satu transaksi; dispatcher serta pemulihan berkala menemukan pekerjaan tertunda/macet. |
| Handoff berbenturan dengan pengiriman AI | Koordinasikan keduanya melalui pengendali yang sama; batalkan pesan mengantre dan tampilkan pengiriman yang telah dimulai secara terpisah. |
| Estimasi terlalu optimistis | Sediakan cadangan 20–30%; tinjau jam aktual dan sisa pekerjaan setelah P2, termasuk hambatan uji kanal awal. |
| Nomor CTA berbeda dari kanal AI | Ambil nomor dari konfigurasi kanal dan uji website → WhatsApp → inbox sebelum rilis. |
| Klik CTA disangka prospek atau atribusi pasti | Pisahkan metrik klik dan pesan masuk; proses prospek dari webhook serta tandai sumber sesuai bukti. |
| Website demo tampil sebagai penawaran properti nyata | Gunakan label demo dan `noindex`; pengaktifan SEO publik menunggu data nyata yang diizinkan klien. |
| Demo terganggu saat presentasi | Siapkan seed dan simulator berlabel; tampilkan keterbatasan live secara jujur. |

Biaya layanan tidak ditetapkan dalam dokumen ini karena budget belum diberikan dan tarif dapat berubah. Developer memeriksa paket/ketentuan, kebutuhan komersial demo, serta batas pemakaian pada P0 sebelum mengaktifkan layanan berbayar. Tidak ada pembelian layanan yang diotorisasi oleh rencana ini.

### Layanan maintenance setelah demo

- Pendapatan layanan berasal dari maintenance sistem untuk klien. Tarif, periode pembayaran, dan pembagian biaya hosting, domain, AI, serta WhatsApp ditetapkan terpisah; tidak diasumsikan otomatis termasuk biaya maintenance.
- Cakupan yang perlu disepakati: pemantauan website/webhook/jobs, perbaikan gangguan, pembaruan keamanan/dependency, backup dan uji pemulihan, serta pemeriksaan batas biaya dan integrasi. Tetapkan jam layanan, jalur pelaporan, dan target respons sebelum beroperasi untuk klien.
- Tetapkan siapa yang memperbarui listing/FAQ dan berapa porsi bantuan konten/SEO yang termasuk layanan. Fitur baru serta produksi konten berkala memiliki cakupan tersendiri.
- Catat kepemilikan akun/domain/nomor/data, akses operator yang diperlukan, serta prosedur serah terima dan ekspor saat layanan berakhir. Operator memakai akses yang disepakati dengan klien.
- Sebelum membuka layanan ke calon pembeli umum, gunakan nomor WhatsApp klien yang siap untuk penggunaan produksi, listing nyata yang diizinkan, konfigurasi indeks yang benar, dan batas operasional yang telah diuji. Demo dengan nomor serta penerima uji tidak memenuhi syarat rilis produksi ini.

## 11. Urutan sesi implementasi pertama

Sesi pertama difokuskan pada P0–P1: tetapkan identitas website agen dan alur CTA WhatsApp, lalu buat repository, scaffold TypeScript, tema/navigasi, pemisahan halaman publik dan `/app`, `.env.example`, struktur modul, serta README; mulai persiapan akses Meta pada P0. Setelah deployment dasar tersedia, lakukan P1a selama P1–P2 jika akses siap. Berikutnya kerjakan P2 sampai login owner/sales dan satu halaman listing benar-benar membaca database. Tinjau hasil uji kanal serta estimasi pada titik ini. Setelah P3, bangun website dan CTA pada P3a, lalu lengkapi inbox/AI serta uji WhatsApp end-to-end sebelum rilis.

## 12. Referensi implementasi resmi

Referensi awal dicatat 27 September 2026; tambahan dokumentasi Inngest, click-to-chat WhatsApp, dan SEO Google diperiksa 3 Oktober 2026. Gunakan versi dokumentasi yang sesuai dengan dependency yang dipasang.

- [Next.js — Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [Supabase — Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase — Server-side Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel — Environments](https://vercel.com/docs/deployments/environments)
- [Vercel — Environment variables](https://vercel.com/docs/environment-variables)
- [Meta — Cloud API Get Started](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started)
- [Meta — Webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview/)
- [Meta — About the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/about-the-platform)
- [WhatsApp — Business Messaging Policy](https://business.whatsapp.com/policy)
- [Inngest — Documentation](https://www.inngest.com/docs)
- [Inngest — Step concurrency dan batas urutan antrean](https://www.inngest.com/docs/durable-execution/flow-control/concurrency)
- [Inngest — Sending events](https://www.inngest.com/docs/durable-execution/guides-and-advanced/events-and-triggers/send-events)
- [WhatsApp — How to use click to chat](https://faq.whatsapp.com/5913398998672934)
- [Google Search Central — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central — Block indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
