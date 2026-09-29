import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { updateQuoteStatus } from "./actions";

const labels = { NEW: "Novo", CONTACTED: "Contato feito", QUOTED: "Orçamento enviado", CONFIRMED: "Confirmado", CANCELLED: "Cancelado" } as const;

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data: quotes, error } = await supabase.from("quote_requests").select("*, creation:creations(title)").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader />
      <Container className="py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Administração</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-4xl tracking-[-0.03em]">Pedidos de orçamento</h1><p className="mt-3 max-w-xl text-base leading-7 text-[#655f58]">Solicitações recebidas pelo site, organizadas do mais recente para o mais antigo.</p></div>
          <Link href="/" className="rounded-full border border-[#d8d0c5] px-5 py-2 text-sm">Ver site</Link>
        </div>
        {error && <p role="alert" className="mt-6 rounded-xl bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">Não foi possível carregar os pedidos. Tente novamente mais tarde.</p>}
        <div className="mt-10 space-y-4">
          {(quotes ?? []).map((quote) => (
            <article key={quote.id} className="rounded-[1.5rem] border border-[#ded5c9] bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-serif text-2xl">{quote.customer_name}</p><p className="mt-1 text-sm text-[#655f58]">{quote.customer_phone}</p></div><span className="rounded-full bg-[#f4efe8] px-3 py-1.5 text-xs">{labels[quote.status as keyof typeof labels]}</span></div>
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Data desejada</p><p className="mt-1">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(quote.requested_date + "T00:00:00Z"))}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Referência</p><p className="mt-1">{quote.creation?.title ?? "Não informada"}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#8a7c6d]">Pessoas</p><p className="mt-1">{quote.guest_count ?? "Não informado"}</p></div>
              </div>
              {quote.message && <p className="mt-6 rounded-2xl bg-[#faf8f4] p-4 text-sm leading-6 text-[#655f58]">{quote.message}</p>}
              <form action={updateQuoteStatus} className="mt-6 flex flex-wrap items-center gap-3"><input type="hidden" name="id" value={quote.id} /><select name="status" defaultValue={quote.status} className="h-10 rounded-full border border-[#d8d0c5] bg-[#faf8f4] px-4 text-sm">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="submit" className="h-10 rounded-full bg-[#292622] px-5 text-sm font-medium text-[#faf8f4]">Atualizar status</button></form>
            </article>
          ))}
          {(quotes ?? []).length === 0 && <div className="rounded-[2rem] border border-dashed border-[#d8d0c5] bg-white p-10 text-center"><p className="font-serif text-2xl">Nenhuma solicitação ainda.</p><p className="mt-2 text-sm text-[#655f58]">Quando alguém preencher o formulário do site, a solicitação aparecerá aqui.</p></div>}
        </div>
      </Container>
    </main>
  );
}
