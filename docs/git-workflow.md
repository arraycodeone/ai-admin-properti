# Workflow Git

Repository: `ai-admin-properti`. Visibilitas yang ditargetkan: private.

| Branch | Tujuan |
| --- | --- |
| `main` | Fondasi yang telah lolos pemeriksaan lokal. Belum berarti siap produksi. |
| `develop` | Integrasi pekerjaan berikutnya sebelum masuk main. |

Branch fitur dibuat sementara dari `develop` untuk PR. Setelah branch remote dan PR tersedia, branch fitur lokal boleh dihapus agar checkout lokal hanya menyisakan `main` dan `develop`. Branch remote yang dipakai PR tidak dihapus sebelum review selesai.

Buat branch fitur berikutnya dari `develop`, lalu ajukan pull request kembali ke `develop`. Setelah pemeriksaan dan review selesai, ajukan pull request `develop` ke `main`. Hindari push paksa pada branch bersama. PR #26 sudah tergabung pada `develop`; status task akses tetap mengikuti bukti HTTPS, bukan status merge saja.

```powershell
git switch develop
git switch -c feature/nama-fitur
```

Jalankan typecheck, lint, unit test, build dan E2E sesuai README sebelum merge. Perubahan database juga memerlukan test:db pada database uji terisolasi.

File environment rahasia, dependensi, hasil build, laporan tes sementara, dan skill lokal dikecualikan dari Git. `.env.example` tetap dilacak karena hanya berisi nama konfigurasi dan nilai contoh.

Branch protection belum dikonfigurasi. Kebijakan wajib review/status checks dapat ditetapkan setelah repository GitHub tersedia dan workflow CI pertama berjalan.
