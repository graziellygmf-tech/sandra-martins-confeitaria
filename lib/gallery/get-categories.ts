import { createClient } from "@/lib/supabase/server";

export async function getPublishedCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, cover_image, position")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to load categories:", error);
    return [];
  }

  return data ?? [];
}
