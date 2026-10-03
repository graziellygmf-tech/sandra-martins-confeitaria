import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/supabase/admin";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const [creationsResult, categoriesResult, quotesResult] = await Promise.all([
    supabase.from("creations").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "NEW")
  ]);
  const hasError = Boolean(creationsResult.error || categoriesResult.error || quotesResult.error);

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader backHref="/" />
      <Container className="py-7 sm:py-10 lg:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Sandra Martins Confeitaria</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Painel</h1></div>
          <Link href="/admin/orcamentos" className="inline-flex min-h-11 items-center justify-center bg-[#292622] px-4 text-sm font-medium text-white">Ver pedidos de orçamento</Link>
        </div>
        {hasError && <p role="alert" className="mb-6 rounded-xl bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">Não foi possível carregar todos os indicadores. Tente novamente mais tarde.</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <Metric label="Criações" value={creationsResult.count ?? 0} href="/admin/criacoes" />
          <Metric label="Categorias" value={categoriesResult.count ?? 0} href="/admin/categorias" />
          <Metric label="Novos pedidos" value={quotesResult.count ?? 0} href="/admin/orcamentos" />
        </div>
        <section className="mt-8 sm:mt-10">
          <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Atalhos</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">O que você deseja fazer?</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminLink href="/admin/criacoes#nova-criacao" title="Criar criação" description="Cadastrar uma nova foto na galeria." />
            <AdminLink href="/admin/criacoes#criacoes-cadastradas" title="Ver criações" description="Buscar, filtrar e editar a galeria." />
            <AdminLink href="/admin/categorias#nova-categoria" title="Criar categoria" description="Adicionar uma categoria à galeria." />
            <AdminLink href="/admin/agenda" title="Organizar agenda" description="Marcar dias disponíveis ou indisponíveis." />
          </div>
        </section>
      </Container>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return <Link href={href} className="min-h-28 border border-[#e8e1d8] bg-white p-5 transition hover:border-[#bbae9e] sm:p-6"><p className="text-sm text-[#655f58]">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></Link>;
}

function AdminLink({ href, title, description }: { href: string; title: string; description: string }) {
  return <Link href={href} className="flex min-h-28 flex-col justify-center border border-[#e8e1d8] bg-white p-5 hover:border-[#bbae9e] hover:bg-[#faf8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58]"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm leading-6 text-[#655f58]">{description}</p></Link>;
}

