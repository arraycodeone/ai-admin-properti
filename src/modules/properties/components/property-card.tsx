import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatRupiah } from "@/lib/money";
import { propertyTypeLabels, type PublicProperty } from "../types";

export function PropertyVisual({ property, large = false }: { property: PublicProperty; large?: boolean }) {
  return (
    <div className={`property-visual ${large ? "property-visual-large" : ""}`}>
      {property.media ? (
        <Image
          src={property.media.cover}
          alt={`Ilustrasi AI ${property.title}`}
          fill
          sizes={large ? "(max-width: 760px) 100vw, 65vw" : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"}
        />
      ) : (
        <>
          <Icon name={property.property_type === "apartment" ? "apartment" : property.property_type === "land" ? "land" : "home"} />
          <span className="photo-placeholder">Foto properti belum tersedia</span>
        </>
      )}
      <span className="photo-code">{property.public_code}</span>
    </div>
  );
}

export function PropertyCard({ property, motionDelay }: { property: PublicProperty; motionDelay?: number }) {
  return (
    <article className="property-card" data-motion={motionDelay === undefined ? undefined : "rise"} data-motion-delay={motionDelay}>
      <Link href={`/properti/${property.slug}`} className="property-link">
        <PropertyVisual property={property} />
        <div className="property-meta">
          <p className="property-location"><Icon name="pin" />{property.area}</p>
          <h3 className="property-title">{property.title}</h3>
          <p className="property-price">{formatRupiah(property.price_rupiah)}</p>
          <div className="property-facts">
            <span><Icon name="bed" />{property.bedrooms} kamar</span>
            <span><Icon name="area" />LB {property.building_area_m2 ?? "–"} m²</span>
            <span>{propertyTypeLabels[property.property_type]}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
