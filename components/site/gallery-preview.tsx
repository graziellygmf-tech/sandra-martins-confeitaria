import Link from "next/link";
import type { GalleryCreation } from "@/lib/gallery/get-gallery";
import { ImagePlaceholder } from "@/components/site/image-placeholder";

export function GalleryPreview({ creations }: { creations: GalleryCreation[] }) {
  if (creations.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-dashed border-[#d8d0c5] p-8 text-center">
        <p className="font-serif text-2xl text-[#292622]">A galeria está sendo preparada.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#655f58]">Assim que as primeiras criações forem cadastradas no painel, elas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {creations.slice(0, 6).map((creation, index) => {
        const cover = creation.images.find((image) => image.is_cover) ?? creation.images[0];
        return (
          <article key={creation.id} className={index % 3 === 1 ? "md:mt-12" : ""}>
            <Link href={"/criacoes/" + creation.slug} className="group block">
              {cover ? (
                <div className="overflow-hidden rounded-[2rem] bg-[#e8e0d5]">
                  <img src={cover.public_url} alt={cover.alt_text || creation.title} loading={index < 3 ? "eager" : "lazy"} className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]" />
                </div>
              ) : <ImagePlaceholder label={creation.title} className="min-h-[24rem]" />}
              <div className="px-2 pt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8a7c6d]">{creation.category.name}</p>
                <h3 className="mt-1 font-serif text-2xl text-[#292622]">{creation.title}</h3>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
