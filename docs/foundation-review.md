# T-014 — tinjauan fondasi dan pekerjaan tersisa

11 Oktober 2026. Tinjauan ini memakai hasil lokal yang sudah tercatat, status issue #7/#8/#9/#12, dan kontrak koordinasi pada [desain database](database.md#11-transaksi-urutan-pesan-dan-handoff). Ini rencana kerja, bukan kelulusan gerbang T-013/T-014.

## Bukti dan keputusan gerbang

| Bagian | Bukti saat ini | Keputusan |
| --- | --- | --- |
| Schema, seed, RLS, Auth, Storage | Migrasi 21 tabel; seed dua kali; `test:db`, `test:access` dengan lima sesi Auth nyata, anon, dua organisasi, RPC dan objek Storage privat lulus pada Supabase uji terisolasi. Fixture sementara dibersihkan. [Rincian](access-verification.md). | Lulus **lokal** untuk operasi yang sudah tersedia. Mutasi bisnis dan alur aset aplikasi belum ada; uji terkait tetap T-015/T-016. |
| Sesi browser | Delapan skenario akun Auth nyata lulus pada build lokal. [Rincian](auth-verification.md). | URL preview HTTPS belum diuji; T-012/#8 tetap terbuka. Karena itu T-013/T-014/#9 juga belum selesai. |
| Kanal WhatsApp | Belum ada pesan masuk/keluar pada handset melalui webhook preview. | T-006/#7 dan T-007–T-008/#12 tertunda; simulator kelak tidak mengganti bukti kanal nyata. |
| Coordinator dan sender | Schema serta kontrak tertulis ada, implementasi belum ada. | T-025 wajib membuktikan send gate lintas proses sebelum T-026/T-027 atau AI mengirim. |

Tidak ada timesheet jam fokus yang dapat diaudit. Karena itu jam aktual P0–P2 tidak dihitung dari tanggal kalender atau jumlah commit. Estimasi awal 75–120 jam adalah anggaran **seluruh proyek demo** saat scope belum dirinci; tidak dapat dikurangi dengan jam aktual yang tidak tercatat.

## Estimasi maju

Perkiraan berikut adalah jam fokus **yang masih diperlukan**, dihitung per kelompok task tersisa, termasuk implementasi dan tes penerimaan yang tertulis. Rentangnya bersifat perencanaan dengan keyakinan rendah sampai T-025 dan integrasi provider diuji.

| Task | Pekerjaan tersisa | Jam dasar |
| --- | --- | ---: |
| T-006, T-012–T-014 | Preview HTTPS, smoke Auth dan gerbang akses | 5–8 |
| T-007–T-008 | Adapter kanal terbatas dan bukti handset dua arah | 5–8 |
| T-015–T-022 | CRUD listing/aset/FAQ, data publik, SEO/CTA, uji perangkat | 18–30 |
| T-023–T-030 | Ingest, jobs, coordinator, sender, inbox, assignment, simulator, uji balapan | 35–55 |
| T-031–T-034 | Survei, tugas, ringkasan operasional | 10–16 |
| T-035–T-039 | Provider AI, tools, batas data, fallback, evaluasi | 15–25 |
| T-040–T-041 | Integrasi WhatsApp penuh dan uji handset | 6–10 |
| T-042–T-048 | QA, recovery, UAT, dokumentasi dan latihan demo | 10–15 |
| **Total dasar** | | **104–167** |

Cadangan debugging integrasi dan kegagalan 20–30% memberi **sekitar 125–220 jam fokus tersisa** setelah pembulatan. Pada 5 jam fokus per hari, ini sekitar 25–44 hari kerja aktif. Waktu tunggu hosting, Meta, jobs, AI, persetujuan konten, dan pekerjaan produksi T-049–T-058 tidak termasuk. Rentang ini lebih besar daripada estimasi awal seluruh demo terutama karena T-023–T-030 kini memuat bukti transaksi, pemulihan, dan koordinasi lintas instance yang tidak boleh dipangkas. Kalibrasi ulang setelah T-025 dan setelah koneksi provider pertama lulus; catat jam fokus per task mulai sekarang agar perbandingan berikutnya berbasis data.

## Urutan dan hambatan

| Hambatan / syarat | Task dan issue | Penanggung jawab dan langkah |
| --- | --- | --- |
| Hosting dan URL preview HTTPS stabil belum tersedia | T-003/T-006, #7 | Pemilik proyek menyediakan akses hosting; implementer menyiapkan konfigurasi, deploy, noindex, dan smoke route. |
| Login dan akses belum dibuktikan pada URL preview | T-012/#8 → T-013/T-014/#9 | Implementer mengulang skenario sesi dan akses di preview setelah #7 siap; tutup gerbang hanya jika lulus. |
| Akses Meta, nomor, token, dan penerima uji serta koneksi dua arah belum terbukti | T-003/T-007/T-008, #12 | Pemilik proyek menyediakan akses uji resmi; implementer membuat adapter dan mencatat bukti handset. |
| Kesiapan akun/konfigurasi jobs dan AI belum diverifikasi | T-003 → T-024/T-035 | Pemilik proyek menyediakan akun dan batas biaya; implementer memeriksa konfigurasi uji sebelum integrasi. Status ini **belum terverifikasi**, bukan klaim bahwa akses ditolak. |
| Send gate lintas instance belum terbukti | T-025, lalu T-026/T-027 | Implementer menjalankan uji dua proses dan provider palsu di bawah ini; kegagalan menahan perluasan inbox/pengiriman. |

Prioritas: selesaikan #7 → #8 → #9 untuk membuka T-015. Persiapan #12 dapat berjalan bersamaan setelah aksesnya ada; pekerjaan katalog/website yang independen boleh disiapkan, tetapi task dengan dependensi T-013/T-014 tidak dinyatakan selesai lebih awal. Bangun T-023/T-024, lalu buktikan T-025 sebelum sender, inbox, dan AI live. WhatsApp end-to-end serta rilis demo tetap menunggu kanal nyata. Tidak ada fitur tambahan pada tinjauan ini.

## Rencana pembuktian T-025

Gunakan database uji terisolasi, dua **proses** aplikasi/worker yang berbagi state, dan provider palsu dengan penghalang yang dapat menahan request tepat sebelum dimulai. Pilih primitive koordinasi lintas instance ketika T-025 diimplementasikan; satu mutex proses atau pembatas concurrency Inngest tidak memenuhi kontrak. AI inference berada di luar bagian kritis.

1. Proses A menyiapkan balasan AI dan berhenti pada batas sebelum request provider. Proses B meminta handoff, menaikkan versi, membatalkan balasan pending, lalu mencoba menyelesaikan handoff. Lepas A; setelah status `completed`, provider palsu tidak boleh mencatat **request AI baru**. Jika A sudah memulai request sebelum handoff, catat sebagai in-flight/unknown dan jangan mengklaim pembatalan provider.
2. Ulangi dengan A terhenti sampai lease kedaluwarsa dan dengan A dimulai ulang. B tidak boleh menganggap lease habis sebagai bukti A mati, memberi izin kirim kedua, atau menyelesaikan handoff saat pemilik sender belum pasti; tampilkan status menunggu/eskalasi.
3. Jalankan dua inbound berurutan, worker replay, dan dua upaya `enqueue_reply` dengan operation key sama. Nomor giliran dan generation harus mencegah balasan tersalip/terduplikasi; message, outbox, dan job harus commit atau rollback bersama.
4. Simulasikan crash sebelum request, timeout setelah request dimulai, dan respons provider yang tiba sesudah handoff. Kegagalan sebelum request aman diulang sesuai key; hasil setelah request dimulai tetap `unknown` untuk rekonsiliasi, tanpa retry buta.

Simpan trace berisi ID operasi, versi/generation, transisi state, dan hitungan request provider palsu tanpa secret. T-025 baru lulus jika interleaving ini deterministik pada dua proses. Bila primitive gagal, pertahankan task terbuka dan perbarui estimasi sebelum T-026/T-027.
