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
      <AdminHeader />
      <Container className="py-10 sm:py-14">
        <h1 className="mb-7 font-serif text-3xl">Visão geral</h1>
        {hasError && <p role="alert" className="mb-6 rounded-xl bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">Não foi possível carregar todos os indicadores. Tente novamente mais tarde.</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Criações" value={creationsResult.count ?? 0} href="/admin/criacoes" />
          <Metric label="Categorias" value={categoriesResult.count ?? 0} href="/admin/categorias" />
          <Metric label="Novos pedidos" value={quotesResult.count ?? 0} href="/admin/orcamentos" />
        </div>
        <section className="mt-10 rounded-[2rem] border border-[#e8e1d8] bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Central de operação</p>
          <h2 className="mt-3 font-serif text-3xl">Acesso rápido</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <AdminLink href="/admin/criacoes" title="Criações" description="Cadastrar e publicar itens da galeria." />
            <AdminLink href="/admin/categorias" title="Categorias" description="Organizar a navegação e a galeria." />
            <AdminLink href="/admin/agenda" title="Agenda" description="Gerenciar a disponibilidade pública." />
            <AdminLink href="/admin/orcamentos" title="Orçamentos" description="Acompanhar solicitações recebidas." />
          </div>
        </section>
      </Container>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return <Link href={href} className="rounded-[1.5rem] border border-[#e8e1d8] bg-white p-6 transition hover:-translate-y-0.5"><p className="text-sm text-[#655f58]">{label}</p><p className="mt-3 font-serif text-4xl">{value}</p></Link>;
}

function AdminLink({ href, title, description }: { href: string; title: string; description: string }) {
  return <Link href={href} className="rounded-2xl border border-[#e8e1d8] p-5 hover:bg-[#faf8f4]"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm leading-6 text-[#655f58]">{description}</p></Link>;
}
