# Backlog Nusa Property

Diperbarui 11 Oktober 2026. ID task dipertahankan dari [rencana rinci sebelumnya](archive/backlog-before-nusa-direction.md). Status **lokal** berarti implementasi dan tes lokal tersedia, tetapi gerbang HTTPS/produksi belum lulus. Checkbox issue GitHub tetap menjadi sumber keputusan penutupan.

| ID | Status | Hasil yang harus ada atau langkah tersisa |
| --- | --- | --- |
| T-001 | Selesai | Aktor, alur bisnis, dan kriteria awal ditetapkan. |
| T-002 | Sebagian | Katalog konsep dan skenario AI tersedia; materi penawaran nyata serta fixture kegagalan provider diperlukan. |
| T-003 | Sebagian | Supabase uji siap; kredensial jobs, AI, dan Open-WA belum terhubung. |
| T-004 | Selesai | Fondasi Next.js dan batas server/client tersedia. |
| T-005 | Selesai | Pemeriksaan otomatis dan catatan bukti tersedia. |
| T-006 | Tertahan | URL aplikasi HTTPS untuk verifikasi Auth dan webhook diperlukan. |
| T-007 | Sebagian | Konfigurasi Open-WA 5.4.0 disiapkan; server, endpoint, dan sesi harus diverifikasi. |
| T-008 | Tertahan | Uji pesan masuk/keluar pada perangkat nyata. |
| T-009 | Lokal | Schema, constraint, dan tipe database diuji pada target terisolasi. |
| T-010 | Lokal | Actor, RLS, grant, dan Storage tertutup diuji lokal. |
| T-011 | Lokal | Seed uji berulang dan guard isolasi tersedia. |
| T-012 | Lokal | Login, refresh, logout, dan role lulus lokal; HTTPS menunggu T-006. |
| T-013 | Lokal | Matriks akses nyata lulus lokal; ulangi pada URL HTTPS. |
| T-014 | Sebagian | Tinjauan fondasi tersedia; gerbang T-012/T-013 tetap terbuka. |
| T-015 | Lokal | Editor owner dan RPC atomik sudah tergabung lewat PR #26; gerbang akses masih terbuka. |
| T-016 | Belum | Upload, metadata, route aset privat, dan pencabutan akses setelah unpublish. |
| T-017 | Lokal | Editor owner, pembaca FAQ publik, RPC audit, dan uji scope lulus pada target terisolasi; gerbang akses HTTPS tetap terbuka. |
| T-018 | Belum | Uji katalog, aset, FAQ, publikasi, dan isolasi kontak privat bersama. |
| T-019 | Sebagian | Website dan katalog Supabase tersedia; materi saat ini masih konsep. |
| T-020 | Sebagian | Metadata/noindex tersedia; canonical, OG, dan sitemap rilis menunggu konten nyata. |
| T-021 | Sebagian | CTA membuka WhatsApp; metrik klik dan kanal nyata belum terhubung. |
| T-022 | Sebagian | E2E desktop/ponsel lulus lokal; uji perangkat WhatsApp serta metrik tersisa. |
| T-023 | Belum | Ingest event terverifikasi dalam satu transaksi, dengan idempotensi. |
| T-024 | Belum | Dispatcher, worker, recovery, dan pekerjaan durable. |
| T-025 | Belum | Coordinator pengiriman/handoff diuji dengan dua proses. |
| T-026 | Belum | Sender, status delivery, hasil tidak pasti, dan rekonsiliasi. |
| T-027 | Belum | Inbox, handoff, riwayat, dan balasan manusia berizin. |
| T-028 | Belum | Lead, owner queue, assignment, dan reassign atomik. |
| T-029 | Belum | Alat uji internal yang memakai pipeline sama. |
| T-030 | Belum | Uji duplikat, kegagalan, urutan, dan balapan lintas proses. |
| T-031 | Belum | Permintaan, konfirmasi, reschedule, dan hasil survei. |
| T-032 | Belum | Tugas serta tindak lanjut yang terlihat di dashboard. |
| T-033 | Sebagian | Dashboard prioritas baca tersedia; pencatatan closing dan metrik lengkap belum ada. |
| T-034 | Belum | Uji alur sales dari prospek hingga hasil. |
| T-035 | Belum | Adapter AI server, batas pemakaian, dan kegagalan aman. |
| T-036 | Belum | Tool AI membaca hanya listing dan FAQ publik yang layak. |
| T-037 | Belum | Tool mutasi terbatas dan idempotensi. |
| T-038 | Belum | AI terhubung ke conversation/outbox serta tunduk pada handoff. |
| T-039 | Belum | Evaluasi 15 skenario dan kegagalan provider/tool. |
| T-040 | Belum | Adapter Open-WA ke pipeline final dan webhook terautentikasi. |
| T-041 | Belum | Uji website → WhatsApp → AI → sales pada perangkat nyata. |
| T-042 | Sebagian | UI publik/dashboard diperbarui; audit aksesibilitas menyeluruh tersisa. |
| T-043 | Belum | Regresi, keamanan, dan build kandidat rilis. |
| T-044 | Belum | Reset dan pemulihan lingkungan uji. |
| T-045 | Belum | Deploy kandidat dan periksa integrasi ulang. |
| T-046 | Belum | Penerimaan bisnis serta latihan alur lengkap. |
| T-047 | Belum | Perbaiki temuan dan kunci kandidat yang lulus. |
| T-048 | Sebagian | README dan panduan tersedia; runbook operasional lengkap tersisa. |
| T-049 | Belum | Kebutuhan klien dan SOP layanan. |
| T-050 | Belum | Penghentian komunikasi yang persisten. |
| T-051 | Belum | Uji permintaan berhenti dihubungi dari ujung ke ujung. |
| T-052 | Kondisional | Peluang jamak per kontak bila kebutuhan nyata muncul. |
| T-053 | Kondisional | Uji pembelian berulang jika T-052 diperlukan. |
| T-054 | Belum | Data, akun, dan nomor production milik klien. |
| T-055 | Belum | Pemantauan, backup, restore, dan pemulihan production. |
| T-056 | Belum | Penerimaan kandidat production. |
| T-057 | Belum | Peluncuran dan indexing setelah seluruh gerbang lulus. |
| T-058 | Belum | Pemantauan awal dan serah terima pemeliharaan. |

Urutan berikutnya: selesaikan T-016/T-017 dan T-021, lalu T-023–T-030 sebelum menghubungkan AI atau mengirim balasan. T-006/T-012/T-013 dan pengujian Open-WA nyata berjalan saat akses HTTPS tersedia. Catatan pemeriksaan terakhir ada di [status](implementation-status.md).
