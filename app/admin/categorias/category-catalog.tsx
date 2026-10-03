"use client";

import { useMemo, useState } from "react";
import { CategoryForm } from "./category-form";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  is_active: boolean;
  image_url: string | null;
};

export function CategoryCatalog({ categories }: { categories: CategoryItem[] }) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("all");
  const filtered = useMemo(() => categories.filter((category) => {
    const matchesSearch = `${category.name} ${category.description ?? ""}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"));
    const matchesState = state === "all" || (state === "active" ? category.is_active : !category.is_active);
    return matchesSearch && matchesState;
  }), [categories, search, state]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Buscar categoria</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-4" placeholder="Digite o nome ou a descrição" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Situação</span>
          <select value={state} onChange={(event) => setState(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-3">
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-[#655f58]" aria-live="polite">{filtered.length} {filtered.length === 1 ? "categoria encontrada" : "categorias encontradas"}</p>

      {categories.length === 0 ? (
        <div className="mt-3 border border-dashed border-[#d8d0c5] bg-white p-6 text-center"><p className="font-serif text-xl">Nenhuma categoria cadastrada.</p><p className="mt-2 text-sm text-[#655f58]">Crie uma categoria para organizar as criações.</p><a href="#nova-categoria" className="mt-3 inline-flex min-h-11 items-center font-medium underline underline-offset-4">Criar categoria</a></div>
      ) : filtered.length ? (
        <div className="mt-3 space-y-2">
          {filtered.map((category) => (
            <details key={category.id} className="group border border-[#e8e1d8] bg-white">
              <summary className="flex min-h-24 cursor-pointer list-none items-center gap-3 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58] sm:gap-4 sm:p-4">
                {category.image_url ? <img src={category.image_url} alt={`Exemplo de criação da categoria ${category.name}`} className="size-16 shrink-0 object-cover sm:size-20" /> : (
                  <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center bg-[#eeeae4] font-serif text-2xl text-[#655f58] sm:size-20">{category.name.charAt(0).toLocaleUpperCase("pt-BR")}</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{category.name}</span>
                  <span className="mt-1 block truncate text-sm text-[#655f58]">{category.description || "Sem descrição"}</span>
                  <span className="mt-2 inline-flex bg-[#f4efe8] px-2 py-1 text-xs">{category.is_active ? "Ativa" : "Inativa"}</span>
                </span>
                <span className="shrink-0 text-sm font-medium underline underline-offset-4">Editar</span>
              </summary>
              <div className="border-t border-[#e8e1d8] p-4 sm:p-5"><CategoryForm category={category} /></div>
            </details>
          ))}
        </div>
      ) : <p className="mt-3 border border-dashed border-[#d8d0c5] px-4 py-8 text-center text-sm text-[#655f58]">Nenhuma categoria corresponde à busca e ao filtro.</p>}
    </div>
  );
}

