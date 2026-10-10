import { FaqForm } from "@/modules/knowledge/components/faq-form";
import { getInternalFaqs } from "@/modules/knowledge/queries";

export default async function FaqPage() {
  const { actor, entries } = await getInternalFaqs();
  return (
    <main id="main" className="dashboard-home">
      <div className="dashboard-heading">
        <div>
          <h1>FAQ</h1>
          <p className="muted">Pertanyaan dan jawaban agensi. Hanya FAQ aktif dan publik yang tersedia bagi pengunjung.</p>
        </div>
      </div>
      {actor.role === "owner" && (
        <section className="dashboard-work-panel" aria-labelledby="faq-new">
          <h2 id="faq-new">Tambah FAQ</h2>
          <FaqForm />
        </section>
      )}
      <section className="dashboard-section" aria-labelledby="faq-list">
        <h2 id="faq-list">Daftar FAQ</h2>
        {entries.length ? (
          <div className="faq-list">
            {entries.map(entry => (
              <article className="faq-card" key={entry.id}>
                <div>
                  <h3>{entry.question}</h3>
                  <p>{entry.answer}</p>
                  <p className="muted">{entry.visibility === "public" ? "Publik" : "Internal"} · {entry.is_active ? "Aktif" : "Nonaktif"}</p>
                  {actor.role === "owner" && (
                    <details>
                      <summary>Ubah FAQ</summary>
                      <FaqForm entry={entry} />
                    </details>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><p>Belum ada FAQ yang dapat Anda lihat.</p></div>}
      </section>
    </main>
  );
}
