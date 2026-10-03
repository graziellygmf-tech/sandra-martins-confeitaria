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

  const stats = useMemo(() => ({
    total: creations.length,
    published: creations.filter((item) => item.is_published).length,
    drafts: creations.filter((item) => !item.is_published).length,
    withoutPhoto: creations.filter((item) => item.is_published && item.images.length === 0).length
  }), [creations]);

  const filtered = useMemo(() => creations.filter((creation) => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const matchesText = !term || `${creation.title} ${creation.category_name}`.toLocaleLowerCase("pt-BR").includes(term);
    const matchesCategory = category === "all" || creation.category_id === category;
    const matchesPublication = publication === "all"
      || (publication === "published" ? creation.is_published : !creation.is_published);
    return matchesText && matchesCategory && matchesPublication;
  }), [creations, search, category, publication]);

  return (
    <div>
      <div className="grid gap-px overflow-hidden border border-[#e8e1d8] bg-[#e8e1d8] sm:grid-cols-4">
        <Summary value={stats.total} label="total" />
        <Summary value={stats.published} label="publicadas" />
        <Summary value={stats.drafts} label="rascunhos" />
        <Summary value={stats.withoutPhoto} label="publicadas sem foto" tone={stats.withoutPhoto ? "attention" : "good"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_1fr_1fr]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c6d]">Buscar</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-4" placeholder="Nome ou categoria" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c6d]">Categoria</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-3">
            <option value="all">Todas</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c6d]">Exibição</span>
          <select value={publication} onChange={(event) => setPublication(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-3">
            <option value="all">Todas</option>
            <option value="published">Publicadas</option>
            <option value="draft">Rascunhos</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#655f58]" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "criação encontrada" : "criações encontradas"}
        </p>
        {(search || category !== "all" || publication !== "all") && (
          <button type="button" onClick={() => { setSearch(""); setCategory("all"); setPublication("all"); }} className="text-xs font-medium underline underline-offset-4">
            Limpar filtros
          </button>
        )}
      </div>

      {creations.length === 0 ? (
        <div className="mt-3 border border-dashed border-[#d8d0c5] bg-white p-6 text-center">
          <p className="font-serif text-xl">Sua galeria ainda está vazia.</p>
          <p className="mt-2 text-sm text-[#655f58]">Cadastre a primeira criação para começar.</p>
          <a href="#nova-criacao" className="mt-3 inline-flex min-h-11 items-center font-medium underline underline-offset-4">Criar criação</a>
        </div>
      ) : filtered.length ? (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((creation) => {
            const cover = creation.images.find((image) => image.is_cover) ?? creation.images[0];
            return (
              <details key={creation.id} className="group overflow-hidden border border-[#e8e1d8] bg-white">
                <summary className="cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58]">
                  {cover ? (
                    <img src={cover.public_url} alt={cover.alt_text || creation.title} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.01]" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#eeeae4] text-sm text-[#655f58]">Foto ainda não adicionada</div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{creation.title}</h3>
                        <p className="mt-1 truncate text-sm text-[#655f58]">{creation.category_name}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium underline underline-offset-4">Editar</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="bg-[#f4efe8] px-2 py-1">{creation.images.length} {creation.images.length === 1 ? "foto" : "fotos"}</span>
                      <span className={creation.is_published ? "bg-[#edf4eb] px-2 py-1 text-[#31502f]" : "bg-[#f4efe8] px-2 py-1 text-[#655f58]"}>
                        {creation.is_published ? "Publicada" : "Rascunho"}
                      </span>
                      {creation.featured && <span className="bg-[#292622] px-2 py-1 text-white">Destaque</span>}
                    </div>
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
      ) : (
        <p className="mt-3 border border-dashed border-[#d8d0c5] px-4 py-8 text-center text-sm text-[#655f58]">
          Nenhuma criação corresponde aos filtros.
        </p>
      )}
    </div>
  );
}

function Summary({ value, label, tone = "default" }: { value: number; label: string; tone?: "default" | "attention" | "good" }) {
  const toneClass = tone === "attention" ? "text-[#754f45]" : tone === "good" ? "text-[#31502f]" : "text-[#292622]";
  return (
    <div className="bg-white p-3 sm:p-4">
      <p className={`font-serif text-2xl ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs text-[#655f58]">{label}</p>
    </div>
  );
}
