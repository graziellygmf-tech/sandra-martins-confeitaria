import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/supabase/admin";
import { CategoryCatalog } from "./category-catalog";
import { CategoryForm } from "./category-form";

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const [categoryResult, creationResult, imageResult] = await Promise.all([
    supabase.from("categories").select("*").order("position", { ascending: true }).order("name", { ascending: true }),
    supabase.from("creations").select("id, category_id").order("position", { ascending: true }).order("title", { ascending: true }),
    supabase.from("creation_images").select("id, creation_id, storage_path, is_cover, position").order("position", { ascending: true })
  ]);
  const imageByCreation = new Map<string, { storage_path: string; is_cover: boolean; position: number }>();
  for (const image of imageResult.data ?? []) {
    const current = imageByCreation.get(image.creation_id);
    if (!current || (image.is_cover && !current.is_cover)) imageByCreation.set(image.creation_id, image);
  }
  const imageByCategory = new Map<string, string>();
  for (const creation of creationResult.data ?? []) {
    const representative = imageByCreation.get(creation.id);
    if (representative && !imageByCategory.has(creation.category_id)) imageByCategory.set(creation.category_id, representative.storage_path);
  }
  const categories = (categoryResult.data ?? []).map((category) => {
    const imagePath = category.cover_image || imageByCategory.get(category.id);
    const imageUrl = imagePath
      ? imagePath.startsWith("http")
        ? imagePath
        : supabase.storage.from("gallery").getPublicUrl(imagePath).data.publicUrl
      : null;
    return { ...category, image_url: imageUrl };
  });
  const hasError = Boolean(categoryResult.error || creationResult.error || imageResult.error);

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader activeHref="/admin/categorias" />
      <Container className="py-7 sm:py-10 lg:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Organize a galeria</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Categorias</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58] sm:text-base">Agrupe criações para deixar a galeria fácil de navegar.</p></div>
          <span className="text-sm text-[#655f58]">{categoryResult.error ? "Quantidade indisponível" : `${categoryResult.data?.length ?? 0} cadastradas`}</span>
        </div>
        <nav aria-label="Atalhos de categorias" className="mt-5 grid grid-cols-2 gap-2 sm:flex">
          <Link href="#categorias-cadastradas" className="inline-flex min-h-12 items-center justify-center border border-[#d8d0c5] bg-white px-4 text-center text-sm font-medium">Categorias cadastradas</Link>
          <Link href="#nova-categoria" className="inline-flex min-h-12 items-center justify-center bg-[#292622] px-4 text-center text-sm font-medium text-white">Criar categoria</Link>
        </nav>
        {hasError && <p role="alert" className="mt-5 border border-[#dcbab3] bg-[#f5e8e4] p-4 text-sm text-[#754f45]">Não foi possível carregar toda a lista. Atualize a página para tentar novamente.</p>}

        <section id="categorias-cadastradas" className="mt-6 scroll-mt-4 border border-[#e8e1d8] bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Navegação</p><h2 className="mt-1 font-serif text-2xl">Categorias cadastradas</h2></div><Link href="#nova-categoria" className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">+ Criar categoria</Link></div>
          {!categoryResult.error && <CategoryCatalog categories={categories} />}
        </section>

        <section id="nova-categoria" className="mt-6 scroll-mt-4 border border-[#e8e1d8] bg-white p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Novo cadastro</p>
          <h2 className="mt-1 font-serif text-2xl">Criar categoria</h2>
          <div className="mt-5 max-w-3xl"><CategoryForm /></div>
        </section>
      </Container>
    </main>
  );
}

