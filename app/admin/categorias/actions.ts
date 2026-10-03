"use server";

import { requireAdmin } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = clean(formData.get("id"));
  const name = clean(formData.get("name"));
  const slug = clean(formData.get("slug"));
  const description = clean(formData.get("description"));
  const position = Number(formData.get("position") || 0);
  const isActive = formData.get("is_active") === "on";

  if (!name || !slug) throw new Error("Nome e endereço da página são obrigatórios.");

  const payload = {
    name,
    slug,
    description: description || null,
    position: Number.isFinite(position) ? position : 0,
    is_active: isActive
  };

  const result = id
    ? await supabase.from("categories").update(payload).eq("id", id)
    : await supabase.from("categories").insert(payload);

  if (result.error) throw new Error(result.error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function toggleCategory(id: string, isActive: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

