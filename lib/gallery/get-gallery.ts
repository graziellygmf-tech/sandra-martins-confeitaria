import { createClient } from "@/lib/supabase/server";
import type { Category, Creation, CreationImage } from "@/lib/supabase/types";

export type GalleryCreation = Creation & {
  category: Pick<Category, "name" | "slug">;
  images: Array<CreationImage & { public_url: string }>;
};

export async function getGallery(): Promise<GalleryCreation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creations")
    .select("*, category:categories!inner(name, slug), images:creation_images(*)")
    .eq("is_published", true)
    .eq("categories.is_active", true)
    .order("position", { ascending: true })
    .order("position", { referencedTable: "creation_images", ascending: true });

  if (error) {
    console.error("Failed to load gallery:", error);
    return [];
  }

  const creations = (data ?? []) as GalleryCreation[];
  return creations.map((creation) => ({
    ...creation,
    images: creation.images.map((image) => ({
      ...image,
      public_url: supabase.storage.from("gallery").getPublicUrl(image.storage_path).data.publicUrl
    }))
  }));
}
