import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { QuoteStatusForm } from "./quote-status-form";

const labels = { NEW: "Novo", CONTACTED: "Contato feito", QUOTED: "Orçamento enviado", CONFIRMED: "Confirmado", CANCELLED: "Cancelado" } as const;

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data: quotes, error } = await supabase.from("quote_requests").select("*, creation:creations(title)").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader activeHref="/admin/orcamentos" />
      <Container className="py-7 sm:py-10 lg:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Acompanhe os contatos</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Pedidos de orçamento</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#655f58] sm:text-base">Solicitações recebidas pelo site, da mais recente para a mais antiga.</p></div>
          <Link href="/" className="inline-flex min-h-11 items-center border border-[#d8d0c5] px-4 text-sm">Ver site</Link>
        </div>
        {error && <p role="alert" className="mt-5 border border-[#dcbab3] bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">Não foi possível carregar os pedidos. Atualize a página para tentar novamente.</p>}
        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {(quotes ?? []).map((quote) => (
            <article key={quote.id} className="border border-[#ded5c9] bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-serif text-2xl">{quote.customer_name}</p><p className="mt-1 text-sm text-[#655f58]">{quote.customer_phone}</p></div><span className="rounded-full bg-[#f4efe8] px-3 py-1.5 text-xs">{labels[quote.status as keyof typeof labels]}</span></div>
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Data desejada</p><p className="mt-1">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(quote.requested_date + "T00:00:00Z"))}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Referência</p><p className="mt-1">{quote.creation?.title ?? "Não informada"}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Pessoas</p><p className="mt-1">{quote.guest_count ?? "Não informado"}</p></div>
              </div>
              {quote.message && <p className="mt-5 bg-[#faf8f4] p-4 text-sm leading-6 text-[#655f58]">{quote.message}</p>}
              <QuoteStatusForm id={quote.id} status={quote.status} />
          </article>
          ))}
          {!error && (quotes ?? []).length === 0 && <div className="border border-dashed border-[#d8d0c5] bg-white p-8 text-center sm:p-10"><p className="font-serif text-2xl">Nenhuma solicitação ainda.</p><p className="mt-2 text-sm text-[#655f58]">Quando alguém entrar em contato pelo site, o pedido aparecerá aqui.</p></div>}
        </div>
      </Container>
    </main>
  );
}

