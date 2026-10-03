"use client";

import { useState } from "react";
import { saveCategory } from "./actions";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  is_active: boolean;
};

export function CategoryForm({ category, onCancel }: { category?: Category; onCancel?: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [position, setPosition] = useState(String(category?.position ?? 0));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function submit(formData: FormData) {
    setSaving(true);
    setFeedback(null);
    try {
      await saveCategory(formData);
      setFeedback({ type: "success", message: category ? "Alterações salvas." : "Categoria cadastrada." });
      if (!category) {
        setName("");
        setSlug("");
        setDescription("");
        setPosition("0");
      }
    } catch {
      setFeedback({ type: "error", message: "Não foi possível salvar. Confira os dados e tente novamente." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={submit} className="space-y-4">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="slug" value={slug} />
      <label className="block">
        <span className="text-sm font-medium">Nome</span>
        <input name="name" value={name} onChange={(e) => { setName(e.target.value); if (!category) setSlug(slugify(e.target.value)); }} required className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#8a7c6d]" placeholder="Ex.: Bolos" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Descrição</span>
        <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 w-full resize-y border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#8a7c6d]" />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Ordem de exibição</span>
          <input name="position" type="number" min="0" value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1.5 min-h-12 w-full border border-[#ddd5ca] bg-white px-4 py-3" />
        </label>
        <label className="flex min-h-12 items-center gap-3 border border-[#e8e1d8] px-3 text-sm sm:mt-6">
          <input name="is_active" type="checkbox" defaultChecked={category?.is_active ?? true} className="h-5 w-5" />
          Mostrar categoria no site
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="min-h-12 bg-[#292622] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "Salvando…" : category ? "Salvar alterações" : "Criar categoria"}</button>
        {onCancel && <button type="button" onClick={onCancel} className="min-h-12 border border-[#ddd5ca] px-5 py-3 text-sm">Cancelar</button>}
      </div>
      {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`border p-3 text-sm ${feedback.type === "error" ? "border-[#dcbab3] bg-[#f5e8e4] text-[#754f45]" : "border-[#c7d8c5] bg-[#edf4eb] text-[#314631]"}`}>{feedback.message}</p>}
    </form>
  );
}

