import Link from "next/link";
import type { Metadata } from "next";
import { getEnv } from "@/server/env";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Masuk tim" };
export const dynamic = "force-dynamic";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const env = getEnv();
  const params = await searchParams;
  return <main id="main" className="login-page"><div className="login-card"><Link href="/" className="wordmark">Ruang Properti<span className="brand-period">.</span></Link><h1>Selamat datang kembali.</h1><p className="muted">Akses internal untuk owner dan sales.</p>
    {params.error === "membership" && <p className="notice notice-error" role="alert">Akun tidak memiliki keanggotaan aktif pada agensi ini. Hubungi owner.</p>}
    {env.APP_MODE === "preview" ? <div className="notice"><strong>Login belum aktif</strong><p>Supabase belum dikonfigurasi. Anda dapat melihat pratinjau dashboard dengan data sintetis.</p></div> : <LoginForm/>}
    <div className="login-links"><Link href="/preview">Lihat pratinjau dashboard</Link><Link href="/">Kembali ke website</Link></div></div></main>;
}
