import Link from "next/link";
import type { GalleryCreation } from "@/lib/gallery/get-gallery";

export function GalleryPreview({ creations }: { creations: GalleryCreation[] }) {
  const photos = creations.flatMap((creation) =>
    creation.images.map((image, index) => ({
      ...image,
      creation,
      imageIndex: index
    }))
  );

  if (photos.length === 0) {
    return (
      <p className="mt-8 border-y border-[#ded5c9] py-8 text-center font-serif text-2xl text-[#292622]">
        A galeria está sendo preparada.
      </p>
    );
  }

  return (
    <div className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3 2xl:columns-4" role="list" aria-label="Fotos das criações">
      {photos.map((photo, index) => (
        <article key={photo.id} className="mb-3 break-inside-avoid sm:mb-4" role="listitem">
          <Link
            href={"/criacoes/" + photo.creation.slug}
            className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#655f58]"
            aria-label={`Ver detalhes: ${photo.creation.title}, foto ${photo.imageIndex + 1}`}
          >
            <img
              src={photo.public_url}
              alt={photo.alt_text || photo.creation.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-auto w-full bg-[#f0ebe5] transition-opacity duration-200 group-hover:opacity-90"
            />
          </Link>
        </article>
      ))}
    </div>
  );
}

