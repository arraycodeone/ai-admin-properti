import Link from "next/link";
import { formatWib } from "@/lib/time";
import { getDashboardSummary } from "@/modules/dashboard/queries";

export default async function Dashboard() {
  const summary = await getDashboardSummary();
  const { actor, listingCount, newLeadCount, handoffCount, overdueTaskCount, upcomingSurveyCount, nextTasks } = summary;

  return (
    <main id="main" className="dashboard-home">
      <header className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="dashboard-kicker">Ruang kerja {actor.role === "owner" ? "pemilik" : "sales"}</p>
          <h1>Selamat datang, {actor.displayName}.</h1>
          <p>Lihat apa yang perlu ditangani tim, lalu lanjutkan pekerjaan dari satu tempat.</p>
        </div>
        <span className="dashboard-date">{formatWib(new Date())}</span>
      </header>

      <section aria-labelledby="priority-heading" className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-kicker">Prioritas saat ini</p>
            <h2 id="priority-heading">Yang perlu perhatian.</h2>
          </div>
          <p>Angka mengikuti data yang dapat Anda akses.</p>
        </div>
        <div className="dashboard-priority-grid">
          <article className="dashboard-priority-card">
            <span>Prospek baru</span>
            <strong>{newLeadCount}</strong>
            <p>{actor.role === "owner" ? "Prospek baru dalam agensi." : "Prospek baru yang ditugaskan kepada Anda."}</p>
          </article>
          <article className="dashboard-priority-card">
            <span>Menunggu pengambilalihan</span>
            <strong>{handoffCount}</strong>
            <p>Percakapan terbuka yang meminta bantuan manusia.</p>
          </article>
          <article className="dashboard-priority-card">
            <span>Tugas lewat tenggat</span>
            <strong>{overdueTaskCount}</strong>
            <p>Tugas terbuka dengan tenggat yang sudah terlewat.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="work-heading" className="dashboard-section dashboard-work-grid">
        <div className="dashboard-work-panel">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-kicker">Pekerjaan berikutnya</p>
              <h2 id="work-heading">Tugas terdekat</h2>
            </div>
          </div>
          {nextTasks.length ? (
            <ul className="dashboard-task-list">
              {nextTasks.map(task => (
                <li key={task.id}>
                  <span className="dashboard-task-marker" aria-hidden="true" />
                  <div>
                    <strong>{task.title}</strong>
                    <p>{formatWib(task.due_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dashboard-empty">
              <strong>Belum ada tugas terbuka.</strong>
              <p>Tugas tindak lanjut akan muncul di sini saat sudah dibuat.</p>
            </div>
          )}
        </div>
        <aside className="dashboard-side-panel" aria-label="Ringkasan kerja">
          <p className="dashboard-kicker">Ringkasan kerja</p>
          <h2>Jadwal dan katalog</h2>
          <dl className="summary-strip">
            <div>
              <dt>Survei mendatang</dt>
              <dd>{upcomingSurveyCount}</dd>
            </div>
            <div>
              <dt>Listing katalog</dt>
              <dd>{listingCount}</dd>
            </div>
            <div>
              <dt>Peran Anda</dt>
              <dd className="small">{actor.role === "owner" ? "Owner" : "Sales"}</dd>
            </div>
          </dl>
          <Link className="button" href="/app/properti">Buka katalog internal</Link>
        </aside>
      </section>
    </main>
  );
}
