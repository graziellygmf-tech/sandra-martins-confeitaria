import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/supabase/admin";
import { QuoteCatalog } from "./quote-catalog";

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data: quotes, error } = await supabase
    .from("quote_requests")
    .select("*, creation:creations(title)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader activeHref="/admin/orcamentos" />
      <Container className="py-6 sm:py-9 lg:py-12">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Operação</p>
            <h1 className="mt-2 font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Pedidos de orçamento</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58] sm:text-base">
              Uma fila única para acompanhar cada contato até a confirmação.
            </p>
          </div>
          <Link href="/" className="inline-flex min-h-11 items-center border border-[#d8d0c5] px-4 text-sm font-medium hover:bg-white">
            Ver site
          </Link>
        </section>

        {error ? (
          <p role="alert" className="mt-6 border border-[#dcbab3] bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">
            Não foi possível carregar os pedidos. Atualize a página para tentar novamente.
          </p>
        ) : (
          <section className="mt-6 border border-[#e8e1d8] bg-white p-4 sm:p-6">
            <QuoteCatalog quotes={(quotes ?? []) as never} />
          </section>
        )}
      </Container>
    </main>
  );
}
