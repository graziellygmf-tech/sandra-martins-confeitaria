"use client";

import { useState } from "react";
import { updateQuoteStatus } from "./actions";

const labels = { NEW: "Novo", CONTACTED: "Contato feito", QUOTED: "Orçamento enviado", CONFIRMED: "Confirmado", CANCELLED: "Cancelado" } as const;

export function QuoteStatusForm({ id, status }: { id: string; status: keyof typeof labels }) {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function submit(formData: FormData) {
    setSaving(true);
    setFeedback("");
    try {
      await updateQuoteStatus(formData);
      setFeedback("Situação atualizada.");
    } catch {
      setFeedback("Não foi possível atualizar. Confira a conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={submit} className="mt-5 grid gap-2 sm:flex sm:items-center">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`pedido-${id}`}>Situação do pedido</label>
      <select id={`pedido-${id}`} name="status" defaultValue={status} className="h-12 w-full border border-[#d8d0c5] bg-[#faf8f4] px-3 text-sm sm:w-auto sm:min-w-52">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <button type="submit" disabled={saving} className="min-h-12 bg-[#292622] px-5 text-sm font-medium text-[#faf8f4] disabled:opacity-60">{saving ? "Atualizando…" : "Atualizar situação"}</button>
      {feedback && <p role="status" className="text-sm text-[#655f58]">{feedback}</p>}
    </form>
  );
}

