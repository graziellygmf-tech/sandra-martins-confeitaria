import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { CreationForm } from "./creation-form";
import { CreationImageManager } from "./image-manager";

export default async function CreationsPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: creations, error }] = await Promise.all([
    supabase.from("categories").select("id, name").order("position", { ascending: true }).order("name", { ascending: true }),
    supabase.from("creations").select("*, images:creation_images(*)").order("position", { ascending: true }).order("title", { ascending: true })
  ]);

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-[#e8e1d8] bg-white"><Container className="flex min-h-20 items-center justify-between"><Link href="/admin" className="font-serif text-xl">Sandra Martins</Link><Link href="/admin" className="text-sm underline underline-offset-4">Voltar ao painel</Link></Container></header>
      <Container className="py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Administração</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em]">Criações</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#655f58]">Cadastre o conteúdo que aparecerá na galeria. Publicar é separado de cadastrar, para você poder preparar uma criação antes de colocá-la no ar.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-[2rem] border border-[#e8e1d8] bg-white p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Nova criação</p><h2 className="mt-2 font-serif text-2xl">Adicionar à galeria</h2><div className="mt-6">{categories?.length ? <CreationForm categories={categories} /> : <p className="text-sm leading-6 text-[#655f58]">Crie pelo menos uma categoria antes de cadastrar uma criação.</p>}</div></section>
          <section className="rounded-[2rem] border border-[#e8e1d8] bg-white p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Galeria</p><h2 className="mt-2 font-serif text-2xl">Criações cadastradas</h2></div><span className="text-sm text-[#655f58]">{creations?.length ?? 0}</span></div>
            {error ? <p className="mt-6 text-sm text-red-700">Não foi possível carregar as criações.</p> : <div className="mt-6 space-y-3">{(creations ?? []).map((creation) => <details key={creation.id} className="rounded-2xl border border-[#e8e1d8] p-4"><summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-4"><div><p className="font-medium">{creation.title}</p><p className="mt-1 text-xs text-[#8a7c6d]">/{creation.slug} · posição {creation.position}</p></div><div className="flex gap-2 text-xs"><span className="rounded-full bg-[#f4efe8] px-3 py-1">{creation.is_published ? "Publicada" : "Rascunho"}</span>{creation.featured && <span className="rounded-full bg-[#f4efe8] px-3 py-1">Destaque</span>}</div></div></summary><div className="mt-5 border-t border-[#e8e1d8] pt-5"><CreationForm categories={categories ?? []} creation={creation} /><CreationImageManager creationId={creation.id} images={creation.images ?? []} /></div></details>)}{!creations?.length && <p className="text-sm leading-6 text-[#655f58]">Nenhuma criação cadastrada ainda.</p>}</div>}
          </section>
        </div>
      </Container>
    </main>
  );
}
