import Link from "next/link";
import { requireActor } from "@/server/auth/actor-context";
import { logout } from "@/server/auth/session";
import { AdminNav } from "@/components/admin/sidebar";
import { Brand } from "@/components/public/brand";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireActor();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="wordmark" href="/"><Brand name="Nusa Property" /></Link>
        <AdminNav />
        <div className="sidebar-bottom">
          <p>{actor.displayName}<br />{actor.role === "owner" ? "Owner" : "Sales"}</p>
          <form action={logout}><button className="button button-outline" type="submit">Keluar</button></form>
        </div>
      </aside>
      <div className="admin-content">
        <div className="admin-topbar"><span>Ruang kerja tim</span><span className="status-label">Lingkungan demo</span></div>
        {children}
      </div>
    </div>
  );
}
