import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#faf8f4] px-5 py-16">
        <Container>
          <h1 className="font-serif text-4xl">Acesso restrito</h1>
          <p className="mt-3 text-[#655f58]">Faça login para acessar o painel.</p>
          <Link href="/login" className="mt-6 inline-block underline underline-offset-4">Ir para login</Link>
        </Container>
      </main>
    );
  }

  const [{ count: creations }, { count: categories }, { count: quotes }] = await Promise.all([
    supabase.from("creations").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "NEW")
  ]);

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-[#e8e1d8] bg-white">
        <Container className="flex min-h-20 items-center justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a7c6d]">Painel</p>
            <h1 className="font-serif text-2xl">Sandra Martins Confeitaria</h1>
          </div>
          <Link href="/" className="text-sm underline underline-offset-4">Ver site</Link>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Criações" value={creations ?? 0} href="/admin/criacoes" />
          <Metric label="Categorias" value={categories ?? 0} href="/admin/categorias" />
          <Metric label="Novos pedidos" value={quotes ?? 0} href="/admin/orcamentos" />
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#e8e1d8] bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Próximos módulos</p>
          <h2 className="mt-3 font-serif text-3xl">Central de operação</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <AdminLink href="/admin/criacoes" title="Gerenciar criações" description="Cadastrar e publicar itens da galeria." />
            <AdminLink href="/admin/categorias" title="Gerenciar categorias" description="Organizar a navegação e o catálogo." />
            <AdminLink href="/admin/orcamentos" title="Pedidos de orçamento" description="Acompanhar solicitações recebidas." />
            <AdminLink href="/admin/agenda" title="Disponibilidade" description="Preparar a agenda pública." />
          </div>
        </section>
      </Container>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-[1.5rem] border border-[#e8e1d8] bg-white p-6 transition hover:-translate-y-0.5">
      <p className="text-sm text-[#655f58]">{label}</p>
      <p className="mt-3 font-serif text-4xl">{value}</p>
    </Link>
  );
}

function AdminLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-[#e8e1d8] p-5 hover:bg-[#faf8f4]">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#655f58]">{description}</p>
    </Link>
  );
}
