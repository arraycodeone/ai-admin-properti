import Link from "next/link";
import { getInternalProperties } from "@/modules/properties/queries";
import { requireActor } from "@/server/auth/actor-context";

export default async function InternalProperties() {
  const [properties, actor] = await Promise.all([getInternalProperties(), requireActor()]);

  return (
    <main id="main">
      <div className="dashboard-heading">
        <div>
          <h1>Properti</h1>
          <p className="muted">Katalog internal agensi.</p>
        </div>
        {actor.role === "owner" && <Link className="button" href="/app/properti/baru">Tambah properti</Link>}
      </div>
      {properties.length ? (
        <div className="lead-list">
          {properties.map(property => (
            <article className="lead-row" key={property.id}>
              <div>
                <h2>{property.title}</h2>
                <p>{property.public_code}</p>
              </div>
              <div>
                <p>{property.area}, {property.city}</p>
              </div>
              <div>
                <p>{property.availability} · {property.publication_status}</p>
                {actor.role === "owner" && <Link href={`/app/properti/${property.id}/ubah`}>Ubah listing</Link>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Belum ada listing</h2>
          <p>Jalankan seed pada database uji atau tambahkan katalog setelah modul pengelolaan tersedia.</p>
        </div>
      )}
    </main>
  );
}
