import { requireActor } from "@/server/auth/actor-context";
import { userClient } from "@/server/db/user-client";

export default async function InternalProperties() {
  const actor = await requireActor();
  const { data, error } = await (await userClient()).from("properties")
    .select("id, public_code, title, city, area, availability, publication_status")
    .eq("organization_id", actor.organizationId).order("public_code").limit(100);
  if (error) throw new Error("Properti internal belum dapat dimuat.");
  return <main id="main"><div className="page-heading"><h1>Properti</h1><p className="muted">Katalog internal agensi. Pengelolaan listing menyusul setelah uji akses database.</p></div>{data.length ? <div className="lead-list">{data.map(row => <article className="lead-row" key={row.id}><div><h2>{row.title}</h2><p>{row.public_code}</p></div><div><p>{row.area}, {row.city}</p></div><div><p>{row.availability} · {row.publication_status}</p></div></article>)}</div> : <div className="empty-state"><h2>Belum ada listing</h2><p>Jalankan seed pada database uji atau tambahkan katalog setelah modul pengelolaan tersedia.</p></div>}</main>;
}
