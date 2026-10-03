"use client";

import { useState } from "react";
import { saveCreation } from "./actions";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type Category = { id: string; name: string };
type Creation = { id?: string; title: string; slug: string; description: string | null; category_id: string; featured: boolean; is_published: boolean; position: number };

export function CreationForm({ categories, creation }: { categories: Category[]; creation?: Creation }) {
  const [title, setTitle] = useState(creation?.title ?? "");
  const [slug, setSlug] = useState(creation?.slug ?? "");
  const [description, setDescription] = useState(creation?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function submit(formData: FormData) {
    setSaving(true);
    setFeedback(null);
    try {
      await saveCreation(formData);
      setFeedback({ type: "success", message: creation ? "Alterações salvas." : "Criação cadastrada." });
      if (!creation) {
        setTitle("");
        setSlug("");
        setDescription("");
      }
    } catch {
      setFeedback({ type: "error", message: "Não foi possível salvar. Confira os dados e tente novamente." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={submit} className="space-y-4">
      {creation?.id && <input type="hidden" name="id" value={creation.id} />}
      <input type="hidden" name="slug" value={slug} />
      <label className="block"><span className="text-sm font-medium">Nome da criação</span><input name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!creation) setSlug(slugify(e.target.value)); }} required className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3" placeholder="Ex.: Bolo de aniversário" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-medium">Categoria</span><select name="category_id" defaultValue={creation?.category_id ?? categories[0]?.id ?? ""} required className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-3"><option value="" disabled>Escolha uma categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="block"><span className="text-sm font-medium">Ordem na galeria</span><input name="position" type="number" min="0" defaultValue={creation?.position ?? 0} className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3" /></label>
      </div>
      <label className="block"><span className="text-sm font-medium">Descrição</span><textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1.5 w-full resize-y border border-[#ddd5ca] bg-white px-4 py-3" /></label>
      <div className="grid gap-2 text-sm sm:grid-cols-2"><label className="flex min-h-12 items-center gap-3 border border-[#e8e1d8] px-3"><input name="featured" type="checkbox" defaultChecked={creation?.featured ?? false} className="h-5 w-5" /> Mostrar como destaque</label><label className="flex min-h-12 items-center gap-3 border border-[#e8e1d8] px-3"><input name="is_published" type="checkbox" defaultChecked={creation?.is_published ?? false} className="h-5 w-5" /> Mostrar no site</label></div>
      {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`border p-3 text-sm ${feedback.type === "error" ? "border-[#dcbab3] bg-[#f5e8e4] text-[#754f45]" : "border-[#c7d8c5] bg-[#edf4eb] text-[#314631]"}`}>{feedback.message}</p>}
      <button type="submit" disabled={saving} className="min-h-12 w-full bg-[#292622] px-5 py-3 text-sm font-medium text-white disabled:opacity-60 sm:w-auto">{saving ? "Salvando…" : creation ? "Salvar alterações" : "Criar criação"}</button>
    </form>
  );
}

