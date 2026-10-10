"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProperty } from "../actions";
import type { z } from "zod";
import type { propertyEditSchema } from "../schemas";

type EditableProperty = z.infer<typeof propertyEditSchema>;

export function PropertyForm({ property }: { property?: EditableProperty }) {
  const [state, action, pending] = useActionState(saveProperty, { error: "" });
  const identifiersLocked = Boolean(property?.published_at);
  const value = (field: string, fallback: string) => state.values?.[field] ?? fallback;

  return (
    <form key={state.attempt ?? 0} action={action} className="property-form">
      <input name="id" type="hidden" value={value("id", property?.id ?? "")} />
      {state.error && <p role="alert" className="notice notice-error">{state.error}</p>}
      <fieldset>
        <legend>Informasi listing</legend>
        <div className="property-form-grid">
          <label>Kode publik
            <input name="public_code" required maxLength={24} defaultValue={value("public_code", property?.public_code ?? "")} readOnly={identifiersLocked} />
          </label>
          <label>Slug URL
            <input name="slug" required maxLength={100} defaultValue={value("slug", property?.slug ?? "")} readOnly={identifiersLocked} />
          </label>
          <label className="property-form-wide">Judul
            <input name="title" required maxLength={160} defaultValue={value("title", property?.title ?? "")} />
          </label>
          <label className="property-form-wide">Deskripsi
            <textarea name="description" required minLength={20} maxLength={5000} rows={5} defaultValue={value("description", property?.description ?? "")} />
          </label>
          <label>Kota
            <input name="city" required maxLength={80} defaultValue={value("city", property?.city ?? "")} />
          </label>
          <label>Kawasan
            <input name="area" required maxLength={80} defaultValue={value("area", property?.area ?? "")} />
          </label>
          <label className="property-form-wide">Alamat publik (opsional)
            <input name="public_address" maxLength={300} defaultValue={value("public_address", property?.public_address ?? "")} />
          </label>
          <label>Tipe
            <select name="property_type" defaultValue={value("property_type", property?.property_type ?? "house")}>
              <option value="house">Rumah</option>
              <option value="apartment">Apartemen</option>
              <option value="land">Tanah</option>
            </select>
          </label>
          <label>Harga (rupiah, tanpa pemisah)
            <input name="price_rupiah" type="text" inputMode="numeric" required defaultValue={value("price_rupiah", property?.price_rupiah ?? "")} />
          </label>
          <label>Kamar tidur
            <input name="bedrooms" type="number" min={0} max={100} required defaultValue={value("bedrooms", String(property?.bedrooms ?? 0))} />
          </label>
          <label>Kamar mandi
            <input name="bathrooms" type="number" min={0} max={100} required defaultValue={value("bathrooms", String(property?.bathrooms ?? 0))} />
          </label>
          <label>Luas tanah (m², opsional)
            <input name="land_area_m2" type="text" inputMode="decimal" defaultValue={value("land_area_m2", property?.land_area_m2 ?? "")} />
          </label>
          <label>Luas bangunan (m², opsional)
            <input name="building_area_m2" type="text" inputMode="decimal" defaultValue={value("building_area_m2", property?.building_area_m2 ?? "")} />
          </label>
          <label className="property-form-wide">Fasilitas (satu per baris, maksimal 20)
            <textarea name="amenities" rows={4} defaultValue={value("amenities", property?.amenities.join("\n") ?? "")} />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status dan publikasi</legend>
        <div className="property-form-grid">
          <label>Ketersediaan
            <select name="availability" defaultValue={value("availability", property?.availability ?? "active")}>
              <option value="active">Tersedia</option>
              <option value="paused">Ditunda</option>
              <option value="sold">Terjual</option>
            </select>
          </label>
          {property ? (
            <label>Publikasi
              <select name="publication_status" defaultValue={value("publication_status", property.publication_status)}>
                <option value="draft">Draft</option>
                <option value="published">Terbit</option>
                <option value="archived">Arsip</option>
              </select>
            </label>
          ) : <input name="publication_status" type="hidden" value="draft" />}
        </div>
        <p className="muted">Hanya listing terbit dan tersedia yang tampil di katalog publik. Kode dan slug terkunci setelah publikasi pertama.</p>
      </fieldset>
      <fieldset>
        <legend>Kontak pemilik unit — hanya owner</legend>
        <div className="property-form-grid">
          <label>Nama pemilik (opsional)
            <input name="owner_name" maxLength={160} defaultValue={value("owner_name", property?.owner_name ?? "")} />
          </label>
          <label>Telepon internasional (opsional)
            <input name="owner_phone_e164" type="tel" maxLength={16} placeholder="+628123456789" defaultValue={value("owner_phone_e164", property?.owner_phone_e164 ?? "")} />
          </label>
          <label className="property-form-wide">Alamat lengkap internal (opsional)
            <input name="exact_address" maxLength={300} defaultValue={value("exact_address", property?.exact_address ?? "")} />
          </label>
          <label className="property-form-wide">Catatan internal (opsional)
            <textarea name="internal_notes" rows={3} maxLength={2000} defaultValue={value("internal_notes", property?.internal_notes ?? "")} />
          </label>
        </div>
      </fieldset>
      <div className="property-form-actions">
        <button className="button" type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan properti"}</button>
        <Link className="button button-outline" href="/app/properti">Kembali ke daftar</Link>
      </div>
    </form>
  );
}
