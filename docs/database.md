# Database dan batas akses

Diperbarui 11 Oktober 2026. Migrasi SQL di `supabase/migrations/` adalah sumber schema; tipe aplikasi dihasilkan dari database uji melalui `npm.cmd run db:types`. Panduan ini merangkum kontrak yang dipakai aplikasi saat ini dan urutan berikutnya.

## Entitas

| Kelompok | Tabel |
| --- | --- |
| Organisasi dan akses | `organizations`, `memberships`, `channels`, `site_settings` |
| Katalog | `properties`, `property_private_details`, `property_assets`, `knowledge_entries` |
| Pelanggan | `contacts`, `leads`, `conversations`, `messages`, `surveys`, `tasks` |
| Integrasi | `webhook_events`, `job_outbox`, `outbox`, `ai_runs`, `ai_tool_calls` |
| Jejak | `audit_events`, `site_daily_metrics` |

Setiap data bisnis memakai `organization_id`; foreign key gabungan menjaga rujukan tetap dalam organisasi. RLS membatasi owner/sales, dan mutasi tabel langsung tertutup bagi browser. `systemClient` hanya untuk operasi server dengan scope organisasi dan hasil DTO publik. Query dashboard memakai `userClient` setelah actor aktif diperiksa. Rupiah tetap bigint/string; jangan melalui JavaScript `Number`.

## Katalog dan privasi

- Properti publik harus `publication_status=published` dan `availability=active`. `published_at` diset saat publikasi pertama dan tidak dihapus setelah unpublish. Kode dan slug tidak berubah setelah pernah terbit.
- `save_property` memeriksa owner aktif melalui Auth, menyimpan listing dan detail privat dalam satu transaksi, lalu mencatat audit tanpa nilai kontak privat.
- Detail kontak pemilik unit hanya untuk owner. Sales dan pengunjung memakai pembaca yang tidak mengeluarkan field itu.
- Aset foto memakai bucket privat; route baca publik harus memeriksa status listing setiap kali, termasuk aturan cache. Editor aset T-016 belum ada.
- FAQ aktif dan publik kelak menjadi sumber bagi website/AI. Editor FAQ dan query final T-017 belum selesai.

## Pesan dan pekerjaan

Webhook terverifikasi harus mengaitkan kanal yang dikenal, lalu menyimpan event, kontak, prospek, percakapan, pesan bernomor urut, dan `job_outbox` dalam satu transaksi. Event duplikat tidak boleh menambah pesan/job. Pengiriman AI/manusia harus melewati coordinator lintas proses dan memeriksa versi kontrol, mode, assignment, pause, serta izin tepat sebelum request provider. Hasil tidak pasti harus direkonsiliasi. T-023–T-030 belum diimplementasikan.

Schema memuat `is_demo` dan `demo_key` sebagai penanda fixture internal yang sudah ada; pembacaan profil website publik pada production menolak organisasi fixture. Istilah kolom ini tidak mengaktifkan mode aplikasi. Target uji harus terisolasi serta memiliki konfirmasi eksplisit sebelum tes atau seed.

Lihat [panduan Supabase](supabase-setup.md), [arsitektur](architecture.md), dan [rancangan database sebelumnya](archive/database-before-nusa-direction.md) untuk riwayat keputusan.
