"use client";

import { useState } from "react";
import Link from "next/link";
import { demoLeads } from "@/demo/leads";
import { formatRupiah } from "@/lib/money";

const stageLabels: Record<string, string> = { new: "Baru", contacted: "Dihubungi sales", survey_scheduled: "Survei terjadwal", won: "Won" };

export function PreviewDashboard() {
  const [role, setRole] = useState("owner");
  const [search, setSearch] = useState("");
  const rows = demoLeads.filter(lead => (role === "owner" || lead.assigned === role) && `${lead.name} ${lead.area}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="wordmark">Ruang Properti<span className="brand-period">.</span></Link><nav aria-label="Navigasi pratinjau"><a href="#main" aria-current="page">Ringkasan contoh</a><Link href="/properti">Katalog publik</Link></nav><div className="sidebar-bottom"><p>Pratinjau visual<br/>Data sintetis, hanya di browser.</p><Link href="/login" className="button button-outline">Halaman login</Link></div></aside><div className="admin-content"><div className="admin-topbar"><span>Ruang kerja tim</span><span className="status-label">Pratinjau lokal</span></div><main id="main"><div className="dashboard-heading"><div><h1>Pekerjaan berikutnya.</h1><p>Lihat kebutuhan prospek dan siapa yang menanganinya.</p></div></div><div className="preview-banner">Pratinjau dengan fixture. Pilihan peran hanya menyaring contoh tampilan, bukan autentikasi. Belum terhubung ke AI atau WhatsApp.</div><div className="preview-controls"><label>Tampilan contoh<select value={role} onChange={event => setRole(event.target.value)}><option value="owner">Owner</option><option value="Andi">Sales Andi</option><option value="Sari">Sales Sari</option></select></label><label>Cari prospek contoh<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Nama atau area" type="search" maxLength={80}/></label></div><dl className="summary-strip"><div><dt>Prospek pada hasil</dt><dd>{rows.length}</dd></div><div><dt>Survei terjadwal</dt><dd>{rows.filter(row => row.stage === "survey_scheduled").length}</dd></div><div><dt>Won dicatat manusia</dt><dd>{rows.filter(row => row.stage === "won").length}</dd></div></dl><h2>Prospek dalam penanganan</h2><div className="lead-list">{rows.length ? rows.map(lead => <article className="lead-row" key={lead.id}><div><h3>{lead.name}</h3><p>{lead.area} · {lead.assigned}</p></div><div><h3>{formatRupiah(lead.budget)}</h3><p>{lead.summary}</p></div><div><span className="status-label">{stageLabels[lead.stage]}</span></div></article>) : <div className="empty-state"><h3>Tidak ada prospek yang cocok</h3><p>Ubah kata pencarian atau tampilan contoh.</p></div>}</div></main></div></div>;
}
