import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { areas } from "./content";

export function AreaCards() {
  return (
    <>
      <div className="area-grid">
        {areas.map((area, index) => (
          <Link className="area-card" href={`/properti?location=${encodeURIComponent(area.name)}`} key={area.name}>
            <div className="area-image" data-motion="photo" data-motion-delay={index * 70}>
              <Image data-parallax src={`/asset/images/locations/${area.image}.webp`} alt={`Ilustrasi AI suasana kawasan ${area.name}`} fill sizes="(max-width: 760px) 100vw, 33vw" />
            </div>
            <div data-motion="rise" data-motion-delay={70 + index * 70}>
              <div className="area-title"><span>0{index + 1}</span><h3>{area.name}</h3><Icon name="arrow" /></div>
              <p className="area-caption">{area.caption}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="area-disclosure">Gambar kawasan adalah ilustrasi AI, bukan dokumentasi lokasi sebenarnya.</p>
    </>
  );
}
