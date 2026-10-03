import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/supabase/admin";

function addDays(date: string, amount: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + amount);
  return value.toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

const statusLabels = {
  AVAILABLE: "Disponível",
  LIMITED: "Poucas vagas",
  BLOCKED: "Indisponível"
} as const;

const statusClasses = {
  AVAILABLE: "bg-[#edf4eb] text-[#31502f]",
  LIMITED: "bg-[#f7f0df] text-[#725c25]",
  BLOCKED: "bg-[#f5e8e4] text-[#754f45]"
} as const;

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const today = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Fortaleza"
  }).format(new Date());
  const horizon = addDays(today, 14);

  const [
    creationsResult,
    publishedResult,
    categoriesResult,
    photosResult,
    quotesResult,
    recentQuotesResult,
    availabilityResult,
    catalogResult
  ] = await Promise.all([
    supabase.from("creations").select("id", { count: "exact", head: true }),
    supabase.from("creations").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("creation_images").select("id", { count: "exact", head: true }),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "NEW"),
    supabase
      .from("quote_requests")
      .select("id,customer_name,requested_date,creation:creations(title)")
      .eq("status", "NEW")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("availability_days")
      .select("date,status,capacity")
      .gte("date", today)
      .lte("date", horizon)
      .order("date", { ascending: true }),
    supabase
      .from("creations")
      .select("id,title,is_published,images:creation_images(id)")
      .order("position", { ascending: true })
      .order("title", { ascending: true })
  ]);

  const errors = [
    creationsResult.error,
    publishedResult.error,
    categoriesResult.error,
    photosResult.error,
    quotesResult.error,
    recentQuotesResult.error,
    availabilityResult.error,
    catalogResult.error
  ].filter(Boolean);

  const catalog = catalogResult.data ?? [];
  const withoutPhotos = catalog.filter((creation) => creation.is_published && !creation.images?.length);
  const upcoming = (availabilityResult.data ?? []).filter((day) => day.status && day.status !== "AVAILABLE").slice(0, 5);
  const recentQuotes = recentQuotesResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader backHref="/" activeHref="/admin" />
      <Container className="py-6 sm:py-9 lg:py-12">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Visão geral</p>
            <h1 className="mt-2 font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Bom dia, Sandra.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58] sm:text-base">
              Aqui está o que merece atenção agora — pedidos, agenda e apresentação da galeria.
            </p>
          </div>
          <Link href="/admin/orcamentos" className="inline-flex min-h-12 items-center justify-center bg-[#292622] px-5 text-sm font-medium text-white hover:bg-[#3a3631]">
            Ver pedidos de orçamento
          </Link>
        </section>

        {errors.length > 0 && (
          <p role="alert" className="mt-6 border border-[#dcbab3] bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">
            Parte das informações não carregou. Atualize a página para tentar novamente.
          </p>
        )}

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo">
          <Metric label="Pedidos novos" value={quotesResult.error ? "—" : quotesResult.count ?? 0} href="/admin/orcamentos" emphasis={Boolean(quotesResult.count)} />
          <Metric label="Criações publicadas" value={publishedResult.error ? "—" : publishedResult.count ?? 0} href="/admin/criacoes" />
          <Metric label="Fotos na galeria" value={photosResult.error ? "—" : photosResult.count ?? 0} href="/admin/criacoes" />
          <Metric label="Categorias ativas" value={categoriesResult.error ? "—" : categoriesResult.count ?? 0} href="/admin/categorias" />
        </section>

        <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]">
          <section className="border border-[#e8e1d8] bg-white" aria-labelledby="atencao">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e8e1d8] px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Operação</p>
                <h2 id="atencao" className="mt-1 font-serif text-2xl">Precisa de atenção</h2>
              </div>
              <Link href="/admin/orcamentos" className="text-sm font-medium underline underline-offset-4">Abrir pedidos</Link>
            </div>

            {recentQuotes.length ? (
              <div className="divide-y divide-[#eee8df]">
                {recentQuotes.map((quote) => (
                  <Link key={quote.id} href="/admin/orcamentos" className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 transition hover:bg-[#faf8f4] sm:px-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="size-2 shrink-0 bg-[#292622]" aria-hidden="true" />
                        <p className="truncate font-medium">{quote.customer_name}</p>
                      </div>
                      <p className="mt-1 truncate pl-4 text-sm text-[#655f58]">
                        {quote.creation?.title ?? "Sem criação escolhida"} · {formatDate(quote.requested_date)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">Ver →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 sm:px-6">
                <p className="font-serif text-xl">Tudo em dia.</p>
                <p className="mt-1 text-sm leading-6 text-[#655f58]">Nenhum pedido novo aguardando retorno.</p>
              </div>
            )}
          </section>

          <section className="border border-[#e8e1d8] bg-white" aria-labelledby="agenda-proxima">
            <div className="flex items-end justify-between gap-3 border-b border-[#e8e1d8] px-4 py-4 sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Próximos 14 dias</p>
                <h2 id="agenda-proxima" className="mt-1 font-serif text-2xl">Agenda</h2>
              </div>
              <Link href="/admin/agenda" className="text-sm font-medium underline underline-offset-4">Abrir</Link>
            </div>
            <div className="p-4 sm:p-5">
              {upcoming.length ? (
                <ul className="space-y-2">
                  {upcoming.map((day) => {
                    const status = day.status as keyof typeof statusLabels;
                    return (
                      <li key={day.date} className="flex items-center justify-between gap-3 border-b border-[#eee8df] py-2.5 last:border-0">
                        <span className="text-sm capitalize">{formatDate(day.date)}</span>
                        <span className={`px-2 py-1 text-xs ${statusClasses[status]}`}>
                          {statusLabels[status]}{day.capacity != null ? ` · ${day.capacity}` : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-[#655f58]">
                  Nenhum bloqueio ou limite registrado nos próximos 14 dias.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-5 border border-[#e8e1d8] bg-white" aria-labelledby="catalogo">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e8e1d8] px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Catálogo visual</p>
              <h2 id="catalogo" className="mt-1 font-serif text-2xl">Mantenha a vitrine pronta</h2>
            </div>
            <Link href="/admin/criacoes" className="text-sm font-medium underline underline-offset-4">Gerenciar criações</Link>
          </div>
          <div className="grid gap-0 divide-y divide-[#eee8df] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <CatalogCheck value={withoutPhotos.length} label="publicadas sem foto" href="/admin/criacoes" tone={withoutPhotos.length ? "attention" : "good"} />
            <CatalogCheck value={creationsResult.error ? "—" : creationsResult.count ?? 0} label="criações cadastradas" href="/admin/criacoes" />
            <CatalogCheck value={categoriesResult.error ? "—" : categoriesResult.count ?? 0} label="categorias ativas" href="/admin/categorias" />
          </div>
        </section>

        <section className="mt-5" aria-labelledby="atalhos">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Ações frequentes</p>
            <h2 id="atalhos" className="mt-1 font-serif text-2xl">Acesso rápido</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard href="/admin/criacoes#nova-criacao" eyebrow="Catálogo" title="Nova criação" description="Cadastre uma nova peça e depois adicione as fotos." />
            <ActionCard href="/admin/criacoes#criacoes-cadastradas" eyebrow="Fotos" title="Gerenciar galeria" description="Troque capas, adicione fotos e organize a apresentação." />
            <ActionCard href="/admin/agenda" eyebrow="Operação" title="Atualizar agenda" description="Defina dias disponíveis, limitados ou indisponíveis." />
            <ActionCard href="/admin/categorias#nova-categoria" eyebrow="Organização" title="Nova categoria" description="Mantenha a galeria simples de navegar." />
          </div>
        </section>
      </Container>
    </main>
  );
}

function Metric({ label, value, href, emphasis = false }: { label: string; value: number | string; href: string; emphasis?: boolean }) {
  return (
    <Link href={href} className="border border-[#e8e1d8] bg-white p-4 transition hover:border-[#bbae9e] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[#655f58]">{label}</p>
        {emphasis && <span className="mt-1 size-2 bg-[#292622]" aria-label="Requer atenção" />}
      </div>
      <p className="mt-2 font-serif text-3xl sm:text-4xl">{value}</p>
    </Link>
  );
}

function CatalogCheck({ value, label, href, tone = "default" }: { value: number | string; label: string; href: string; tone?: "default" | "attention" | "good" }) {
  const toneClass = tone === "attention" ? "text-[#754f45]" : tone === "good" ? "text-[#31502f]" : "text-[#292622]";
  return (
    <Link href={href} className="block p-4 transition hover:bg-[#faf8f4] sm:p-5">
      <p className={`font-serif text-3xl ${toneClass}`}>{value}</p>
      <p className="mt-1 text-sm text-[#655f58]">{label}</p>
    </Link>
  );
}

function ActionCard({ href, eyebrow, title, description }: { href: string; eyebrow: string; title: string; description: string }) {
  return (
    <Link href={href} className="group border border-[#e8e1d8] bg-white p-4 transition hover:border-[#bbae9e] hover:bg-[#fdfbf8] sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">{eyebrow}</p>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h3 className="font-medium">{title}</h3>
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </div>
      <p className="mt-2 text-sm leading-5 text-[#655f58]">{description}</p>
    </Link>
  );
}
