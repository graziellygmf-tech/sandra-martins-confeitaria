"use client";

import type { Creation } from "@/lib/supabase/types";
import { createQuoteRequest } from "@/app/orcamento/actions";

type CreationOption = Pick<Creation, "id" | "title">;

export function QuoteForm({
  creations,
  selectedCreationId,
  selectedDate,
  state
}: {
  creations: CreationOption[];
  selectedCreationId?: string;
  selectedDate?: string;
  state?: string;
}) {
  return (
    <div>
      {state === "success" && (
        <div className="mb-6 rounded-2xl border border-[#cfc4b6] bg-[#f4efe8] p-5 text-sm leading-6 text-[#4e463f]" role="status">
          Solicitação enviada. A Sandra recebeu seus dados.
        </div>
      )}
      {state === "blocked" && (
        <div className="mb-6 rounded-2xl border border-[#ded5c9] bg-white p-5 text-sm leading-6 text-[#655f58]" role="alert">
          Data indisponível. Escolha outra no calendário.
        </div>
      )}
      {state === "invalid" && (
        <div className="mb-6 rounded-2xl border border-[#ded5c9] bg-white p-5 text-sm leading-6 text-[#655f58]" role="alert">
          Revise os campos obrigatórios.
        </div>
      )}
      {state === "error" && (
        <div className="mb-6 rounded-2xl border border-[#ded5c9] bg-white p-5 text-sm leading-6 text-[#655f58]" role="alert">
          Falha no envio. Tente novamente.
        </div>
      )}

      <form action={createQuoteRequest} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-medium text-[#292622]">Nome *</span>
            <input name="customer_name" required maxLength={120} className="h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" />
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-medium text-[#292622]">WhatsApp *</span>
            <input name="customer_phone" required maxLength={40} inputMode="tel" className="h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" placeholder="(85) 99999-9999" />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-medium text-[#292622]">Data desejada *</span>
            <input name="requested_date" type="date" required defaultValue={selectedDate} className="h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" />
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-medium text-[#292622]">Para quantas pessoas?</span>
            <input name="guest_count" type="number" min="1" max="1000" className="h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" placeholder="Opcional" />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-2 block font-medium text-[#292622]">Criação de referência</span>
          <select name="creation_id" defaultValue={selectedCreationId ?? ""} className="h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]">
            <option value="">Ainda não escolhi</option>
            {creations.map((creation) => <option key={creation.id} value={creation.id}>{creation.title}</option>)}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-medium text-[#292622]">Conte um pouco sobre o que você procura</span>
          <textarea name="message" maxLength={2000} rows={5} className="w-full resize-y rounded-xl border border-[#d8d0c5] bg-[#faf8f4] p-4 outline-none focus:border-[#8a7c6d]" placeholder="Tema, cores, tamanho ou referências." />
        </label>

        <button type="submit" className="min-h-12 rounded-full bg-[#292622] px-6 text-sm font-medium text-[#faf8f4] transition-opacity hover:opacity-90">
          Enviar solicitação
        </button>
        <p className="text-center text-xs leading-5 text-[#756d64]">O envio não confirma a encomenda.</p>
      </form>
    </div>
  );
}

