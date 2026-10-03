import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const [creationsResult, categoriesResult, quotesResult, recentQuotesResult] = await Promise.all([
    supabase.from("creations").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "NEW"),
    supabase.from("quote_requests")
      .select("id,customer_name,requested_date,creation:creations(title)")
      .eq("status", "NEW")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);
  const hasError = Boolean(creationsResult.error || categoriesResult.error || quotesResult.error || recentQuotesResult.error);
  const recentQuotes = recentQuotesResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader backHref="/" activeHref="/admin" />
      <Container className="py-7 sm:py-10 lg:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Sandra Martins Confeitaria</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Painel</h1></div>
          <Link href="/admin/orcamentos" className="inline-flex min-h-11 items-center justify-center bg-[#292622] px-4 text-sm font-medium text-white">Ver pedidos de orçamento</Link>
        </div>
        {hasError && <p role="alert" className="mb-6 border border-[#dcbab3] bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">Parte das informações não carregou. Atualize a página para tentar novamente.</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <Metric label="Criações cadastradas" value={creationsResult.error ? "—" : creationsResult.count ?? 0} href="/admin/criacoes" />
          <Metric label="Categorias" value={categoriesResult.error ? "—" : categoriesResult.count ?? 0} href="/admin/categorias" />
          <Metric label="Pedidos novos" value={quotesResult.error ? "—" : quotesResult.count ?? 0} href="/admin/orcamentos" />
        </div>

        <section className="mt-8 sm:mt-10" aria-labelledby="pedidos-recentes">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Para acompanhar</p><h2 id="pedidos-recentes" className="mt-1 font-serif text-2xl sm:text-3xl">Pedidos que precisam de retorno</h2></div><Link href="/admin/orcamentos" className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">Ver todos</Link></div>
          {recentQuotesResult.error ? <p role="alert" className="border border-[#dcbab3] bg-[#f5e8e4] p-4 text-sm text-[#754f45]">Não foi possível carregar os pedidos novos. Abra “Pedidos de orçamento” ou atualize a página.</p> : recentQuotes.length ? (
            <ul className="divide-y divide-[#e8e1d8] border-y border-[#e8e1d8] bg-white">
              {recentQuotes.map((quote) => <li key={quote.id}><Link href="/admin/orcamentos" className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 hover:bg-[#f4efe8] sm:px-5"><span className="min-w-0"><span className="block truncate font-medium">{quote.customer_name}</span><span className="mt-1 block truncate text-sm text-[#655f58]">{quote.creation?.title ?? "Sem criação escolhida"}</span></span><time className="shrink-0 text-sm text-[#655f58]" dateTime={quote.requested_date}>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${quote.requested_date}T00:00:00Z`))}</time></Link></li>)}
            </ul>
          ) : <p className="border border-dashed border-[#d8d0c5] bg-white p-5 text-sm text-[#655f58]">Nenhum pedido novo aguardando retorno.</p>}
        </section>

        <section className="mt-8 sm:mt-10" aria-labelledby="atalhos-painel">
          <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Ações frequentes</p><h2 id="atalhos-painel" className="mt-1 font-serif text-2xl sm:text-3xl">Acesso rápido</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminLink href="/admin/criacoes#nova-criacao" title="Criar criação" />
            <AdminLink href="/admin/criacoes#criacoes-cadastradas" title="Buscar criações" />
            <AdminLink href="/admin/categorias#nova-categoria" title="Criar categoria" />
            <AdminLink href="/admin/agenda" title="Organizar agenda" />
          </div>
        </section>
      </Container>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number | string; href: string }) {
  return <Link href={href} className="min-h-28 border border-[#e8e1d8] bg-white p-5 transition hover:border-[#bbae9e] sm:p-6"><p className="text-sm text-[#655f58]">{label}</p><p className="mt-2 font-serif text-4xl">{value}</p></Link>;
}

function AdminLink({ href, title }: { href: string; title: string }) {
  return <Link href={href} className="flex min-h-16 items-center justify-between border border-[#e8e1d8] bg-white p-4 font-medium hover:border-[#bbae9e] hover:bg-[#faf8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58]">{title}<span aria-hidden="true">→</span></Link>;
}

