import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privasi demo" };

export default function Privacy() {
  return <main id="main" className="container section reading"><p className="muted small">Terakhir diperbarui 3 Oktober 2026</p><h1>Privasi pada demo ini</h1><p>Website ini adalah lingkungan pengembangan Ruang Properti. Listing, nama prospek, dan catatan contoh merupakan data sintetis. Hindari memasukkan informasi pribadi atau data pelanggan nyata.</p><h2>Pencarian properti</h2><p>Filter pencarian berada pada URL agar hasil mudah dibuka kembali. Demo ini belum mengaktifkan analitik pengunjung atau pencatatan klik CTA.</p><h2>Akses internal</h2><p>Login tim menggunakan Supabase setelah dikonfigurasi. Cookie autentikasi digunakan untuk menjaga sesi. Pratinjau dashboard tidak memberi akses ke data internal.</p><h2>WhatsApp dan AI</h2><p>WhatsApp dan AI belum terhubung pada versi lokal ini. Jika kanal uji kemudian diaktifkan, tombol WhatsApp membuka aplikasi atau situs WhatsApp. Pesan baru terkirim setelah pengguna menekan Kirim.</p><h2>Sebelum layanan dibuka</h2><p>Identitas pengelola, kontak privasi yang sah, dasar pengolahan data, periode penyimpanan, dan prosedur permintaan penghapusan perlu ditetapkan oleh agensi sebelum menerima pelanggan nyata.</p></main>;
}
