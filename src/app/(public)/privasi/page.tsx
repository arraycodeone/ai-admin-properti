import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privasi" };

export default function Privacy() {
  return (
    <main id="main" className="container section reading">
      <p className="muted small">Terakhir diperbarui 4 Oktober 2026</p>
      <h1>Privasi dan penggunaan data</h1>
      <p>Katalog saat ini menampilkan konsep properti dengan gambar AI dan spesifikasi ilustratif. Ini bukan penawaran unit nyata. Hindari mengirim informasi pribadi sampai kanal konsultasi resmi dinyatakan aktif.</p>
      <h2>Pencarian properti</h2>
      <p>Filter pencarian berada pada URL agar hasil mudah dibuka kembali. Versi ini belum mengaktifkan analitik pengunjung atau pencatatan klik konsultasi.</p>
      <h2>Cookie</h2>
      <p>Cookie autentikasi digunakan ketika ada sesi masuk. Pengunjung tidak perlu membuat akun untuk melihat katalog properti.</p>
      <h2>WhatsApp dan AI</h2>
      <p>Kanal WhatsApp dan AI belum terhubung. Saat kanal diaktifkan, tombol konsultasi membuka WhatsApp; pesan baru terkirim setelah pengguna menekan Kirim.</p>
      <h2>Sebelum layanan dibuka</h2>
      <p>Identitas pengelola, kontak privasi yang sah, dasar pengolahan data, periode penyimpanan, dan prosedur permintaan penghapusan perlu ditetapkan oleh agensi sebelum menerima pelanggan nyata.</p>
    </main>
  );
}
