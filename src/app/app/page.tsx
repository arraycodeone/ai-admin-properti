import Link from "next/link";
import { getDashboardSummary } from "@/modules/dashboard/queries";

export default async function Dashboard() {
  const { actor, listingCount } = await getDashboardSummary();

  return (
    <main id="main">
      <div className="dashboard-heading">
        <div>
          <h1>Halo, {actor.displayName}.</h1>
          <p>Katalog dan akses tim sudah terhubung ke database demo.</p>
        </div>
      </div>
      <div className="notice">Fondasi aplikasi. Inbox, AI, dan WhatsApp masih dalam backlog.</div>
      <dl className="summary-strip">
        <div>
          <dt>Listing organisasi</dt>
          <dd>{listingCount}</dd>
        </div>
        <div>
          <dt>Peran Anda</dt>
          <dd className="small">{actor.role === "owner" ? "Owner" : "Sales"}</dd>
        </div>
      </dl>
      <Link className="button" href="/app/properti">Buka katalog internal</Link>
    </main>
  );
}
