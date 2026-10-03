"use client";

import { useState } from "react";
import { deleteCreationImage, setCreationCover, uploadCreationImage } from "./image-actions";

type ImageItem = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
};

function publicImageUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/gallery/${encodedPath}`;
}

export function CreationImageManager({
  creationId,
  images
}: {
  creationId: string;
  images: ImageItem[];
}) {
  const [selectedFile, setSelectedFile] = useState("");
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  return (
    <div className="mt-6 rounded-2xl border border-[#e8e1d8] bg-[#faf8f4] p-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Fotografias</p>
        <p className="mt-2 text-sm leading-6 text-[#655f58]">
          A primeira foto vira a capa automaticamente. Depois você pode escolher outra.
        </p>
      </div>

      {sortedImages.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {sortedImages.map((image) => {
            const src = publicImageUrl(image.storage_path);
            return (
              <article key={image.id} className="overflow-hidden rounded-2xl border border-[#e8e1d8] bg-white">
                {src ? (
                  <img src={src} alt={image.alt_text || "Foto da criação"} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="aspect-[4/3] bg-[#e8e0d5]" />
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    {image.is_cover ? (
                      <span className="rounded-full bg-[#292622] px-3 py-1 text-xs text-white">Capa</span>
                    ) : (
                      <form action={setCreationCover}>
                        <input type="hidden" name="creation_id" value={creationId} />
                        <input type="hidden" name="image_id" value={image.id} />
                        <button type="submit" className="text-xs font-medium underline underline-offset-4">Usar como capa</button>
                      </form>
                    )}
                    <form action={deleteCreationImage}>
                      <input type="hidden" name="image_id" value={image.id} />
                      <button type="submit" className="inline-flex min-h-11 items-center px-2 text-xs text-red-700 underline underline-offset-4">Remover foto</button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <form
        action={uploadCreationImage}
        className="mt-5 grid gap-4 rounded-2xl border border-dashed border-[#d8d0c5] bg-white p-4"
      >
        <input type="hidden" name="creation_id" value={creationId} />
        <label className="block">
          <span className="text-sm font-medium">Adicionar foto</span>
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? "")}
            className="mt-2 block w-full text-sm"
          />
          <span className="mt-2 block text-xs text-[#8a7c6d]">JPG, PNG ou WebP · até 8 MB</span>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Descrição da foto para leitores de tela <span className="font-normal text-[#756d64]">(opcional)</span></span>
          <input name="alt_text" className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3" placeholder="Ex.: Bolo de aniversário com decoração floral" />
        </label>
        <button type="submit" disabled={!selectedFile} className="min-h-12 w-full bg-[#292622] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit">
          Adicionar foto
        </button>
      </form>
    </div>
  );
}

