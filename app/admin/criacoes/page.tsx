import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/supabase/admin";
import { CreationForm } from "./creation-form";
import { CreationCatalog } from "./creation-catalog";

export default async function CreationsPage() {
  const { supabase } = await requireAdmin();
  const [categoryResult, creationResult] = await Promise.all([
    supabase.from("categories").select("id, name").order("position", { ascending: true }).order("name", { ascending: true }),
    supabase.from("creations").select("*, images:creation_images(*)").order("position", { ascending: true }).order("title", { ascending: true })
  ]);
  const categories = categoryResult.data ?? [];
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const creations = (creationResult.data ?? []).map((creation) => ({
    ...creation,
    category_name: categoryNames.get(creation.category_id) ?? "Categoria não encontrada",
    images: [...(creation.images ?? [])]
      .sort((first, second) => first.position - second.position)
      .map((image) => ({
        ...image,
        public_url: supabase.storage.from("gallery").getPublicUrl(image.storage_path).data.publicUrl
      }))
  }));

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader activeHref="/admin/criacoes" />
      <Container className="py-7 sm:py-10 lg:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Organize a galeria</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Criações</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58] sm:text-base">Cadastre fotos, revise os detalhes e escolha o que aparece no site.</p></div>
          <span className="text-sm text-[#655f58]">{creationResult.error ? "Quantidade indisponível" : `${creationResult.data?.length ?? 0} cadastradas`}</span>
        </div>

        <nav aria-label="Atalhos de criações" className="mt-5 grid grid-cols-2 gap-2 sm:flex">
          <Link href="#criacoes-cadastradas" className="inline-flex min-h-12 items-center justify-center border border-[#d8d0c5] bg-white px-4 text-center text-sm font-medium">Criações cadastradas</Link>
          <Link href="#nova-criacao" className="inline-flex min-h-12 items-center justify-center bg-[#292622] px-4 text-center text-sm font-medium text-white">Criar criação</Link>
        </nav>

        {categoryResult.error && <p role="alert" className="mt-5 border border-[#dcbab3] bg-[#f5e8e4] p-4 text-sm text-[#754f45]">Não foi possível carregar as categorias necessárias para os filtros e o cadastro.</p>}
        {creationResult.error && <p role="alert" className="mt-5 border border-[#dcbab3] bg-[#f5e8e4] p-4 text-sm text-[#754f45]">Não foi possível carregar as criações. Atualize a página para tentar novamente.</p>}

        <section id="criacoes-cadastradas" className="mt-6 scroll-mt-4 border border-[#e8e1d8] bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Galeria</p><h2 className="mt-1 font-serif text-2xl">Criações cadastradas</h2></div><Link href="#nova-criacao" className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">+ Criar criação</Link></div>
          {!creationResult.error && <CreationCatalog creations={creations} categories={categories} />}
        </section>

        <section id="nova-criacao" className="mt-6 scroll-mt-4 border border-[#e8e1d8] bg-white p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Novo cadastro</p>
          <h2 className="mt-1 font-serif text-2xl">Criar criação</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58]">Depois de salvar, abra a criação cadastrada para adicionar ou escolher a foto de capa.</p>
          <div className="mt-5 max-w-3xl">
            {categoryResult.error ? <p className="text-sm text-[#754f45]">Não foi possível carregar as categorias. Atualize a página e tente de novo.</p> : categories.length ? <CreationForm categories={categories} /> : (
              <div className="border border-dashed border-[#d8d0c5] p-4 sm:p-5"><p className="text-sm leading-6 text-[#655f58]">Antes de criar uma criação, cadastre pelo menos uma categoria.</p><Link href="/admin/categorias#nova-categoria" className="mt-3 inline-flex min-h-11 items-center font-medium underline underline-offset-4">Criar categoria</Link></div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}

