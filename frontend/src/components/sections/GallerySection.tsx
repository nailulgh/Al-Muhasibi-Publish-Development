import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import type { GalleryItem } from 'shared/types/gallery';

interface GallerySectionProps {
  galleryItems: GalleryItem[] | null;
}

export default function GallerySection({ galleryItems }: GallerySectionProps) {
  return (
    <section
      id="galeri-preview"
      className="py-20 md:py-28 bg-[var(--background)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-[var(--accent-olive)] font-heading">
            Galeri Dokumentasi
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Momen-momen berharga dari berbagai kegiatan dan dokumentasi asrama.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems && galleryItems.length > 0
            ? galleryItems.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className="card-program overflow-hidden rounded-xl shadow-md aspect-[3/4] relative group hover:-translate-y-1 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <Image
                  src={
                    item.image_url ||
                    `https://placehold.co/800x600/212529/F8F9FA?text=${item.title || "Galeri"
                    }`
                  }
                  alt={item.title || item.caption || "Galeri"}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-semibold line-clamp-2">
                    {item.title || item.caption}
                  </p>
                </div>
              </div>
            ))
            : /* Fallback (Static) */
            [
              "/assets/FotoGeneral/gedungMuhasibi.jpg",
              "/assets/FotoGeneral/MusyMuhasibi-1.png",
              "/assets/FotoGeneral/gedungMuhasibi.jpg",
              "/assets/FotoGeneral/MusyMuhasibi-1.png",
            ].map((src, index) => (
              <div
                key={index}
                className="card-program overflow-hidden rounded-xl shadow-md aspect-[3/4] relative group hover:-translate-y-1 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <Image
                  src={src}
                  alt={`Dokumentasi ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
        </div>
        <div className="mt-12 text-center" data-aos="fade-up">
          <Link
            href="/galeri"
            className="btn btn-primary inline-flex items-center justify-center gap-2"
          >
            Lihat Semua Galeri <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
