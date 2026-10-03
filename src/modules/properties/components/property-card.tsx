import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatRupiah } from "@/lib/money";
import { propertyTypeLabels, type PublicProperty } from "../types";

export function PropertyVisual({ property, large = false }: { property: PublicProperty; large?: boolean }) {
  return <div className={`property-visual ${large ? "property-visual-large" : ""}`}>
    <span className="photo-code">{property.public_code}</span>
    <Icon name={property.property_type === "apartment" ? "apartment" : property.property_type === "land" ? "land" : "home"}/>
    <span className="photo-placeholder">Foto properti belum tersedia</span>
  </div>;
}

export function PropertyCard({ property }: { property: PublicProperty }) {
  return <article className="property-card"><Link href={`/properti/${property.slug}`} className="property-link">
    <PropertyVisual property={property}/><div className="property-meta"><span className="small muted">{propertyTypeLabels[property.property_type]} · Data demo</span><h3 className="property-price">{formatRupiah(property.price_rupiah)}</h3><p className="property-title">{property.title}</p><p className="property-location"><Icon name="pin"/>{property.area}, {property.city}</p>
    <div className="property-facts"><span><Icon name="bed"/>{property.bedrooms} kamar</span><span><Icon name="area"/>LT {property.land_area_m2 ?? "–"} m²</span><span>LB {property.building_area_m2 ?? "–"} m²</span></div></div>
  </Link></article>;
}
