"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QuoteStatusForm } from "./quote-status-form";

const labels = {
  NEW: "Novo",
  CONTACTED: "Contato feito",
  QUOTED: "Orçamento enviado",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado"
} as const;

const statusStyles = {
  NEW: "bg-[#292622] text-white",
  CONTACTED: "bg-[#f4efe8] text-[#5f554a]",
  QUOTED: "bg-[#f4efe8] text-[#5f554a]",
  CONFIRMED: "bg-[#edf4eb] text-[#31502f]",
  CANCELLED: "bg-[#f5e8e4] text-[#754f45]"
} as const;

type Quote = {
  id: string;
  customer_name: string;
  customer_phone: string;
  requested_date: string;
  guest_count: number | null;
  message: string | null;
  status: keyof typeof labels;
  creation: { title: string } | null;
};

export function QuoteCatalog({ quotes }: { quotes: Quote[] }) {
  const [status, setStatus] = useState<"ALL" | keyof typeof labels>("ALL");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: quotes.length };
    for (const quote of quotes) result[quote.status] = (result[quote.status] ?? 0) + 1;
    return result;
  }, [quotes]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return quotes.filter((quote) => {
      const matchesStatus = status === "ALL" || quote.status === status;
      const haystack = [quote.customer_name, quote.customer_phone, quote.creation?.title ?? "", quote.message ?? ""]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [quotes, search, status]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label>
          <span className="sr-only">Buscar pedido</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full border border-[#d8d0c5] bg-white px-4" placeholder="Buscar por nome, WhatsApp ou criação" />
        </label>
        <p className="flex min-h-12 items-center text-sm text-[#655f58]" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar pedidos por situação">
        {(["ALL", "NEW", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={status === item ? "min-h-10 shrink-0 bg-[#292622] px-3 text-xs font-medium text-white" : "min-h-10 shrink-0 border border-[#ddd5ca] bg-white px-3 text-xs text-[#655f58] hover:bg-[#f4efe8]"}
          >
            {item === "ALL" ? "Todos" : labels[item]} · {counts[item] ?? 0}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((quote) => {
          const digits = quote.customer_phone.replace(/D/g, "");
          const whatsapp = digits ? `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}` : null;
          return (
            <article key={quote.id} className="border border-[#e8e1d8] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl">{quote.customer_name}</h2>
                    <span className={`px-2.5 py-1 text-[11px] font-medium ${statusStyles[quote.status]}`}>{labels[quote.status]}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#655f58]">{quote.customer_phone}</p>
                </div>
                {whatsapp && (
                  <Link href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center border border-[#d8d0c5] px-4 text-sm font-medium hover:bg-[#f4efe8]">
                    Abrir WhatsApp
                  </Link>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Info label="Data desejada" value={new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(quote.requested_date + "T00:00:00Z"))} />
                <Info label="Referência" value={quote.creation?.title ?? "Não informada"} />
                <Info label="Pessoas" value={quote.guest_count != null ? String(quote.guest_count) : "Não informado"} />
              </div>

              {quote.message && <p className="mt-5 bg-[#faf8f4] p-4 text-sm leading-6 text-[#655f58]">{quote.message}</p>}
              <QuoteStatusForm id={quote.id} status={quote.status} />
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="border border-dashed border-[#d8d0c5] bg-white p-8 text-center sm:p-10">
            <p className="font-serif text-2xl">{quotes.length ? "Nenhum pedido encontrado." : "Nenhuma solicitação ainda."}</p>
            <p className="mt-2 text-sm text-[#655f58]">
              {quotes.length ? "Tente mudar o filtro ou a busca." : "Quando alguém entrar em contato pelo site, o pedido aparecerá aqui."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7c6d]">{label}</p>
      <p className="mt-1 text-sm leading-5">{value}</p>
    </div>
  );
}
