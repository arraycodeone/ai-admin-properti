import { notFound } from "next/navigation";
import { requireActor } from "@/server/auth/actor-context";
import { PropertyForm } from "@/modules/properties/components/property-form";

export default async function NewProperty() {
  if ((await requireActor()).role !== "owner") notFound();
  return (
    <main id="main">
      <div className="page-heading">
        <h1>Tambah properti</h1>
        <p className="muted">Listing baru disimpan sebagai draft. Tinjau isinya sebelum menerbitkan.</p>
      </div>
      <PropertyForm />
    </main>
  );
}
