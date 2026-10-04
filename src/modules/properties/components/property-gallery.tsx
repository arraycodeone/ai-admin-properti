"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "../types";

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected];
  return (
    <section className="property-gallery" aria-label="Galeri ilustrasi properti">
      <div className="gallery-main">
        <Image src={current.src} alt={current.alt} fill sizes="(max-width: 760px) 100vw, 65vw" />
        <span className="gallery-counter" aria-live="polite">{selected + 1} / {images.length}</span>
      </div>
      <div className="gallery-thumbnails">
        {images.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            aria-label={`Lihat foto ${index + 1}: ${photo.alt}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <Image src={photo.thumbnail} alt="" width={180} height={120} />
          </button>
        ))}
      </div>
      <p className="small muted">Foto merupakan ilustrasi AI. Spesifikasi adalah data demo.</p>
    </section>
  );
}
