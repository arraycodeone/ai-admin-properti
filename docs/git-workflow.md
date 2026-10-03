# Workflow Git

Repository: `ai-admin-properti`. Visibilitas yang ditargetkan: private.

| Branch | Tujuan |
| --- | --- |
| `main` | Fondasi yang telah lolos pemeriksaan lokal. Belum berarti siap produksi. |
| `develop` | Integrasi pekerjaan berikutnya sebelum masuk main. |
| `feature/integrasi-supabase` | Migrasi, seed, autentikasi, dan pengujian akses Supabase. |

Buat branch fitur berikutnya dari `develop`, lalu ajukan pull request kembali ke `develop`. Setelah pemeriksaan dan review selesai, ajukan pull request `develop` ke `main`. Hindari push paksa pada branch bersama.

```powershell
git switch develop
git switch -c feature/nama-fitur
```

Jalankan typecheck, lint, unit test, build dan E2E sesuai README sebelum merge. Perubahan database juga memerlukan test:db pada database uji terisolasi.

File environment rahasia, dependensi, hasil build, laporan tes sementara, dan skill lokal dikecualikan dari Git. `.env.example` tetap dilacak karena hanya berisi nama konfigurasi dan nilai contoh.

Branch protection belum dikonfigurasi. Kebijakan wajib review/status checks dapat ditetapkan setelah repository GitHub tersedia dan workflow CI pertama berjalan.
