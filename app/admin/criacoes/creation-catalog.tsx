"use client";

import { useMemo, useState } from "react";
import { CreationForm } from "./creation-form";
import { CreationImageManager } from "./image-manager";

type CategoryOption = { id: string; name: string };
type ImageItem = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  position: number;
  is_cover: boolean;
  public_url: string;
};
type CreationItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string;
  category_name: string;
  featured: boolean;
  is_published: boolean;
  position: number;
  images: ImageItem[];
};

export function CreationCatalog({ creations, categories }: { creations: CreationItem[]; categories: CategoryOption[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [publication, setPublication] = useState("all");
  const filtered = useMemo(() => creations.filter((creation) => {
    const matchesText = `${creation.title} ${creation.category_name}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"));
    const matchesCategory = category === "all" || creation.category_id === category;
    const matchesPublication = publication === "all" || (publication === "published" ? creation.is_published : !creation.is_published);
    return matchesText && matchesCategory && matchesPublication;
  }), [creations, search, category, publication]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="block sm:col-span-2 xl:col-span-1">
          <span className="mb-1.5 block text-sm font-medium">Buscar criação</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-4" placeholder="Digite o nome ou a categoria" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Categoria</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-3">
            <option value="all">Todas as categorias</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Exibição no site</span>
          <select value={publication} onChange={(event) => setPublication(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-3">
            <option value="all">Todas</option>
            <option value="published">Publicadas</option>
            <option value="draft">Rascunhos</option>
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-[#655f58]" aria-live="polite">{filtered.length} {filtered.length === 1 ? "criação encontrada" : "criações encontradas"}</p>

      {creations.length === 0 ? (
        <div className="mt-3 border border-dashed border-[#d8d0c5] bg-white p-6 text-center"><p className="font-serif text-xl">Sua galeria ainda está vazia.</p><p className="mt-2 text-sm text-[#655f58]">Cadastre a primeira criação para começar.</p><a href="#nova-criacao" className="mt-3 inline-flex min-h-11 items-center font-medium underline underline-offset-4">Criar criação</a></div>
      ) : filtered.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((creation) => {
            const cover = creation.images.find((image) => image.is_cover) ?? creation.images[0];
            return (
              <details key={creation.id} className="group border border-[#e8e1d8] bg-white">
                <summary className="cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58]">
                  {cover ? <img src={cover.public_url} alt={cover.alt_text || creation.title} className="aspect-[4/3] w-full object-cover" /> : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#eeeae4] text-sm text-[#655f58]">Foto ainda não adicionada</div>
                  )}
                  <div className="flex items-start justify-between gap-3 p-3 sm:p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{creation.title}</h3>
                      <p className="mt-1 truncate text-sm text-[#655f58]">{creation.category_name}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                        <span className="bg-[#f4efe8] px-2 py-1">{creation.is_published ? "Publicada" : "Rascunho"}</span>
                        {creation.featured && <span className="bg-[#f4efe8] px-2 py-1">Destaque</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-medium underline underline-offset-4">Editar</span>
                  </div>
                </summary>
                <div className="border-t border-[#e8e1d8] p-4 sm:p-5">
                  <CreationForm categories={categories} creation={creation} />
                  <CreationImageManager creationId={creation.id} images={creation.images} />
                </div>
              </details>
            );
          })}
        </div>
      ) : <p className="mt-3 border border-dashed border-[#d8d0c5] px-4 py-8 text-center text-sm text-[#655f58]">Nenhuma criação corresponde à busca e aos filtros.</p>}
    </div>
  );
}

