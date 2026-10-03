import { getInternalProperties } from "@/modules/properties/queries";

export default async function InternalProperties() {
  const properties = await getInternalProperties();

  return (
    <main id="main">
      <div className="page-heading">
        <h1>Properti</h1>
        <p className="muted">
          Katalog internal agensi. Pengelolaan listing menyusul setelah uji akses database.
        </p>
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
