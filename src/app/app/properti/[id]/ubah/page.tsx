import { notFound } from "next/navigation";
import { z } from "zod";
import { requireActor } from "@/server/auth/actor-context";
import { getPropertyForEdit } from "@/modules/properties/queries";
import { PropertyForm } from "@/modules/properties/components/property-form";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tersimpan?: string }> };

export default async function EditProperty({ params, searchParams }: Props) {
  if ((await requireActor()).role !== "owner") notFound();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const property = await getPropertyForEdit(id);
  if (!property) notFound();
  const saved = (await searchParams).tersimpan === "1";
  return (
    <main id="main">
      <div className="page-heading">
        <h1>Ubah properti</h1>
        <p className="muted">{property.public_code} · {property.title}</p>
      </div>
      {saved && <p role="status" className="notice">Perubahan properti tersimpan.</p>}
      <PropertyForm key={property.id} property={property} />
    </main>
  );
}
