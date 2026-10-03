import Link from "next/link";
import { requireActor } from "@/server/auth/actor-context";
import { userClient } from "@/server/db/user-client";

export default async function Dashboard() {
  const actor = await requireActor();
  const db = await userClient();
  const { count, error } = await db.from("properties").select("id", { count: "exact", head: true }).eq("organization_id", actor.organizationId);
  if (error) throw new Error("Ringkasan belum dapat dimuat.");
  return <main id="main"><div className="dashboard-heading"><div><h1>Halo, {actor.displayName}.</h1><p>Katalog dan akses tim sudah terhubung ke database demo.</p></div></div><div className="notice">Fondasi aplikasi. Inbox, AI, dan WhatsApp masih dalam backlog.</div><dl className="summary-strip"><div><dt>Listing organisasi</dt><dd>{count ?? 0}</dd></div><div><dt>Peran Anda</dt><dd className="small">{actor.role === "owner" ? "Owner" : "Sales"}</dd></div></dl><Link className="button" href="/app/properti">Buka katalog internal</Link></main>;
}
