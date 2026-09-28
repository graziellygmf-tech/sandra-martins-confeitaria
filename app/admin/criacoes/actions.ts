"use server";

import { requireAdmin } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function saveCreation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = clean(formData.get("id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const description = clean(formData.get("description"));
  const categoryId = clean(formData.get("category_id"));
  const position = Number(formData.get("position") || 0);
  const featured = formData.get("featured") === "on";
  const published = formData.get("is_published") === "on";

  if (!title || !slug || !categoryId) throw new Error("Título, slug e categoria são obrigatórios.");

  const payload = { title, slug, description: description || null, category_id: categoryId, position: Number.isFinite(position) ? position : 0, featured, is_published: published };
  const result = id
    ? await supabase.from("creations").update(payload).eq("id", id)
    : await supabase.from("creations").insert(payload);

  if (result.error) throw new Error(result.error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/criacoes");
  revalidatePath("/");
}
