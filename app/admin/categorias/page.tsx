import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/supabase/admin";
import { Container } from "@/components/ui/container";
import { CategoryForm } from "./category-form";

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data: categories, error } = await supabase.from("categories").select("*").order("position", { ascending: true }).order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader />
      <Container className="py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Administração</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em]">Categorias</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#655f58]">Crie e organize as categorias usadas pela galeria. O conteúdo fica no Supabase, então o site público poderá consumir os mesmos dados.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-[2rem] border border-[#e8e1d8] bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Nova categoria</p>
            <h2 className="mt-2 font-serif text-2xl">Adicionar</h2>
            <div className="mt-6"><CategoryForm /></div>
          </section>
          <section className="rounded-[2rem] border border-[#e8e1d8] bg-white p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Catálogo</p><h2 className="mt-2 font-serif text-2xl">Categorias cadastradas</h2></div>
              <span className="text-sm text-[#655f58]">{categories?.length ?? 0}</span>
            </div>
            {error ? <p className="mt-6 text-sm text-red-700">Não foi possível carregar as categorias.</p> : (
              <div className="mt-6 space-y-3">
                {(categories ?? []).map((category) => (
                  <details key={category.id} className="rounded-2xl border border-[#e8e1d8] p-4">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between gap-4">
                        <div><p className="font-medium">{category.name}</p><p className="mt-1 text-xs text-[#8a7c6d]">/{category.slug} · posição {category.position}</p></div>
                        <span className="rounded-full bg-[#f4efe8] px-3 py-1 text-xs">{category.is_active ? "Ativa" : "Inativa"}</span>
                      </div>
                    </summary>
                    <div className="mt-5 border-t border-[#e8e1d8] pt-5"><CategoryForm category={category} /></div>
                  </details>
                ))}
                {!categories?.length && <p className="text-sm leading-6 text-[#655f58]">Nenhuma categoria cadastrada ainda.</p>}
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
