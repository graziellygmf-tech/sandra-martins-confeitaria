"use client";

import { useState } from "react";
import { saveCreation } from "./actions";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type Category = { id: string; name: string };
type Creation = { id?: string; title: string; slug: string; description: string | null; category_id: string; featured: boolean; is_published: boolean; position: number };

export function CreationForm({ categories, creation }: { categories: Category[]; creation?: Creation }) {
  const [title, setTitle] = useState(creation?.title ?? "");
  const [slug, setSlug] = useState(creation?.slug ?? "");
  const [manualSlug, setManualSlug] = useState(Boolean(creation));
  const [description, setDescription] = useState(creation?.description ?? "");

  return (
    <form action={saveCreation} className="space-y-5">
      {creation?.id && <input type="hidden" name="id" value={creation.id} />}
      <label className="block"><span className="text-sm font-medium">Título</span><input name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!manualSlug) setSlug(slugify(e.target.value)); }} required className="mt-2 w-full rounded-xl border border-[#ddd5ca] bg-white px-4 py-3" placeholder="Ex.: Bolo de aniversário" /></label>
      <label className="block"><span className="text-sm font-medium">Slug</span><input name="slug" value={slug} onChange={(e) => { setManualSlug(true); setSlug(slugify(e.target.value)); }} required className="mt-2 w-full rounded-xl border border-[#ddd5ca] bg-white px-4 py-3" placeholder="bolo-de-aniversario" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-medium">Categoria</span><select name="category_id" defaultValue={creation?.category_id ?? categories[0]?.id ?? ""} required className="mt-2 w-full rounded-xl border border-[#ddd5ca] bg-white px-4 py-3"><option value="" disabled>Selecione</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="block"><span className="text-sm font-medium">Posição</span><input name="position" type="number" min="0" defaultValue={creation?.position ?? 0} className="mt-2 w-full rounded-xl border border-[#ddd5ca] bg-white px-4 py-3" /></label>
      </div>
      <label className="block"><span className="text-sm font-medium">Descrição</span><textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-[#ddd5ca] bg-white px-4 py-3" /></label>
      <div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-3"><input name="featured" type="checkbox" defaultChecked={creation?.featured ?? false} className="h-4 w-4" /> Destaque</label><label className="flex items-center gap-3"><input name="is_published" type="checkbox" defaultChecked={creation?.is_published ?? false} className="h-4 w-4" /> Publicada</label></div>
      <button type="submit" className="rounded-full bg-[#292622] px-5 py-3 text-sm font-medium text-white">{creation ? "Salvar alterações" : "Criar criação"}</button>
    </form>
  );
}
