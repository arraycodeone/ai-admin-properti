# Hasil pemeriksaan

Diperbarui 11 Oktober 2026. Hasil ini berlaku untuk checkout lokal dan target Supabase uji terisolasi, bukan hosting production.

| Perintah | Hasil terakhir |
| --- | --- |
| `npm.cmd run typecheck` | Lulus setelah editor dan pembaca FAQ ditambahkan. |
| `npm.cmd run lint` | Lulus. |
| `npm.cmd test` | 58/58 lulus. |
| `npm.cmd run test:db` | Lulus pada target uji terisolasi. |
| `npm.cmd run test:access` | Lulus pada target uji terisolasi; akun/organisasi sementara dibersihkan. |
| `npm.cmd run build` | Lulus. |
| `npm.cmd run test:e2e` | 22/22 desktop/ponsel lulus pada port 3100; FAQ publik hanya menampilkan entri aktif organisasi situs. |
| `npm.cmd run test:auth` | 10/10 lulus; owner mengelola FAQ dan sales hanya membaca entri publik aktif. |
| `node scripts/check-design.mjs` | Lulus untuk pasangan warna yang diperiksa. |

Browser Auth dan tes akses harus dijalankan berurutan karena keduanya memakai target uji yang sama. Tes fixture/mock tidak menggantikan pembuktian Auth pada HTTPS atau WhatsApp perangkat nyata. [Log historis](archive/test-results-before-nusa-direction.md) tetap tersedia.

Unit test guard sempat gagal di sandbox karena `node:os.userInfo()` mengembalikan `uv_os_get_passwd ENOMEM` sebelum script dimuat. Pengulangan di lingkungan yang dapat membaca identitas Windows lulus 58/58.

GitHub CI menjalankan typecheck, lint, unit, dan build tanpa kredensial database. E2E CI hanya berjalan bila `RUN_ISOLATED_E2E=true` serta empat secret `CI_SUPABASE_URL`, `CI_SUPABASE_PUBLISHABLE_KEY`, `CI_SUPABASE_SECRET_KEY`, dan `CI_TEST_DATABASE_URL` disetel untuk target uji terisolasi. Tanpa itu, E2E CI dilewati secara eksplisit; hasil E2E lokal di atas tetap berlaku hanya untuk target lokal yang diuji.
