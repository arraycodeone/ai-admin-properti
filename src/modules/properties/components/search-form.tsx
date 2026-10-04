import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { PropertyFilters } from "../types";

export function SearchForm({ filters = {}, compact = false }: { filters?: PropertyFilters; compact?: boolean }) {
  return (
    <form action="/properti" className={compact ? "catalog-filters" : "search-panel"} data-motion={compact ? undefined : "hero"}>
      {!compact && <div className="search-heading"><strong>Mulai dari yang Anda cari.</strong><span>Properti untuk dibeli</span></div>}
      <div className="search-fields">
        <label className="search-location">
          <span>Lokasi</span>
          <div className="field-icon">
            <Icon name="pin" />
            <input name="location" defaultValue={filters.location} placeholder="BSD, Alam Sutera, Bintaro" maxLength={80} />
          </div>
        </label>
        <label>
          <span>Tipe properti</span>
          <select name="type" defaultValue={filters.type ?? ""}>
            <option value="">Semua tipe</option>
            <option value="house">Rumah</option>
            <option value="apartment">Apartemen</option>
            <option value="land">Tanah</option>
          </select>
        </label>
        <label>
          <span>Anggaran maks.</span>
          <select name="budget" defaultValue={filters.budget ?? ""}>
            <option value="">Semua harga</option>
            <option value="1000000000">Rp1 miliar</option>
            <option value="2000000000">Rp2 miliar</option>
            <option value="3500000000">Rp3,5 miliar</option>
            <option value="6000000000">Rp6 miliar</option>
            {filters.budget && !["1000000000", "2000000000", "3500000000", "6000000000"].includes(filters.budget) && (
              <option value={filters.budget}>Rp{BigInt(filters.budget).toLocaleString("id-ID")}</option>
            )}
          </select>
        </label>
        {compact && (
          <label>
            <span>Minimal kamar</span>
            <select name="bedrooms" defaultValue={filters.bedrooms ?? ""}>
              <option value="">Semua</option>
              {[1, 2, 3, 4, 5].map(count => <option key={count} value={count}>{count} kamar</option>)}
              {filters.bedrooms !== undefined && ![1, 2, 3, 4, 5].includes(filters.bedrooms) && (
                <option value={filters.bedrooms}>{filters.bedrooms} kamar</option>
              )}
            </select>
          </label>
        )}
        <button className="button search-button" type="submit"><Icon name="search" />Cari properti</button>
      </div>
      {compact && <Link href="/properti" className="reset-link">Hapus filter</Link>}
    </form>
  );
}
