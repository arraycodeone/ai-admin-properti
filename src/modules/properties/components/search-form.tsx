import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { PropertyFilters } from "../types";

export function SearchForm({ filters = {}, compact = false }: { filters?: PropertyFilters; compact?: boolean }) {
  return <form action="/properti" className={compact ? "catalog-filters" : "search-panel"}>
    {!compact && <div className="search-heading"><span>Temukan properti</span><span className="muted">Untuk dibeli</span></div>}
    <div className="search-fields">
      <label className="search-location"><span>Lokasi</span><div className="field-icon"><Icon name="pin"/><input name="location" defaultValue={filters.location} placeholder="Kota atau kecamatan" maxLength={80}/></div></label>
      <label><span>Tipe properti</span><select name="type" defaultValue={filters.type ?? ""}>
        <option value="">Semua tipe</option>
        <option value="house">Rumah</option>
        <option value="apartment">Apartemen</option>
        <option value="land">Tanah</option>
      </select></label>
      <label><span>Anggaran maks.</span><select name="budget" defaultValue={filters.budget ?? ""}>
        <option value="">Semua harga</option>
        <option value="500000000">Rp500 juta</option>
        <option value="700000000">Rp700 juta</option>
        <option value="1000000000">Rp1 miliar</option>
      </select></label>
      {compact && <label><span>Minimal kamar</span><select name="bedrooms" defaultValue={filters.bedrooms ?? ""}>
        <option value="">Semua</option>
        <option value="1">1 kamar</option>
        <option value="2">2 kamar</option>
        <option value="3">3 kamar</option>
      </select></label>}
      <button className="button search-button" type="submit"><Icon name="search"/>Cari properti</button>
    </div>
    {compact && <Link href="/properti" className="reset-link">Hapus filter</Link>}
  </form>;
}
