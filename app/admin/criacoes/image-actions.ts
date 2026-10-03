"use server";

import { requireAdmin } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadCreationImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const creationId = clean(formData.get("creation_id"));
  const altText = clean(formData.get("alt_text"));
  const file = formData.get("file");

  if (!creationId || !(file instanceof File) || file.size === 0) {
    throw new Error("Selecione uma imagem.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Use uma imagem JPG, PNG ou WebP.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 8 MB.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("creation_images")
    .select("id, position")
    .eq("creation_id", creationId)
    .order("position", { ascending: false })
    .limit(1);

  if (existingError) throw new Error(existingError.message);

  const nextPosition = existing?.[0]?.position != null ? existing[0].position + 1 : 0;
  const shouldBeCover = !existing?.length;
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `creations/${creationId}/${crypto.randomUUID()}-${safeFileName(file.name.replace(/\.[^.]+$/, "")) || "imagem"}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await supabase.from("creation_images").insert({
    creation_id: creationId,
    storage_path: path,
    alt_text: altText || null,
    position: nextPosition,
    is_cover: shouldBeCover
  });

  if (insertError) {
    await supabase.storage.from("gallery").remove([path]);
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/criacoes");
  revalidatePath("/");
}

export async function setCreationCover(formData: FormData) {
  const { supabase } = await requireAdmin();
  const creationId = clean(formData.get("creation_id"));
  const imageId = clean(formData.get("image_id"));

  if (!creationId || !imageId) throw new Error("Imagem inválida.");

  const { data: image, error: imageError } = await supabase
    .from("creation_images")
    .select("id")
    .eq("id", imageId)
    .eq("creation_id", creationId)
    .maybeSingle();

  if (imageError || !image) throw new Error("Escolha uma foto desta criação.");

  const { error: clearError } = await supabase
    .from("creation_images")
    .update({ is_cover: false })
    .eq("creation_id", creationId);

  if (clearError) throw new Error(clearError.message);

  const { error: coverError } = await supabase
    .from("creation_images")
    .update({ is_cover: true })
    .eq("id", imageId)
    .eq("creation_id", creationId);

  if (coverError) throw new Error(coverError.message);

  revalidatePath("/admin/criacoes");
  revalidatePath("/");
}

export async function updateCreationImageAltText(formData: FormData) {
  const { supabase } = await requireAdmin();
  const imageId = clean(formData.get("image_id"));
  const altText = clean(formData.get("alt_text"));

  if (!imageId) throw new Error("Imagem inválida.");
  if (altText.length > 300) throw new Error("A descrição deve ter até 300 caracteres.");

  const { error } = await supabase
    .from("creation_images")
    .update({ alt_text: altText || null })
    .eq("id", imageId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/criacoes");
  revalidatePath("/");
}

export async function deleteCreationImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const imageId = clean(formData.get("image_id"));

  if (!imageId) throw new Error("Imagem inválida.");

  const { data: image, error: findError } = await supabase
    .from("creation_images")
    .select("id, creation_id, storage_path, is_cover")
    .eq("id", imageId)
    .single();

  if (findError || !image) throw new Error(findError?.message || "Imagem não encontrada.");

  const { error: storageError } = await supabase.storage.from("gallery").remove([image.storage_path]);
  if (storageError) throw new Error(storageError.message);

  const { error: deleteError } = await supabase
    .from("creation_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) throw new Error(deleteError.message);

  if (image.is_cover) {
    const { data: replacement } = await supabase
      .from("creation_images")
      .select("id")
      .eq("creation_id", image.creation_id)
      .order("position", { ascending: true })
      .limit(1);

    if (replacement?.[0]) {
      await supabase
        .from("creation_images")
        .update({ is_cover: true })
        .eq("id", replacement[0].id);
    }
  }

  revalidatePath("/admin/criacoes");
  revalidatePath("/");
}

