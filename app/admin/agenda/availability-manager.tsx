"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { AvailabilityDay } from "@/lib/supabase/types";
import { availabilityCellClasses, availabilityLabels, type AvailabilityStatus } from "@/lib/availability/presentation";
import { saveAvailability } from "./actions";

type CalendarCell = { day: number; date: string; availability?: AvailabilityDay } | null;

function buildDays(month: string, availability: AvailabilityDay[]) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const last = new Date(Date.UTC(year, monthNumber, 0));
  const offset = (first.getUTCDay() + 6) % 7;
  const map = new Map(availability.map((item) => [item.date, item]));
  return Array.from({ length: offset + last.getUTCDate() }, (_, index): CalendarCell => {
    if (index < offset) return null;
    const day = index - offset + 1;
    const date = `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { day, date, availability: map.get(date) };
  });
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function adminStatusLabel(status: AvailabilityStatus) {
  return status === "UNKNOWN" ? "Não definido" : availabilityLabels[status];
}

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-12 w-full bg-[#292622] px-5 text-sm font-medium text-white disabled:opacity-60 sm:w-auto">{pending ? "Salvando…" : "Salvar este dia"}</button>;
}

export function AvailabilityManager({
  month,
  availability,
  initialDate,
  saved
}: {
  month: string;
  availability: AvailabilityDay[];
  initialDate: string;
  saved: boolean;
}) {
  const [year, monthNumber] = month.split("-").map(Number);
  const previous = new Date(Date.UTC(year, monthNumber - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 7);
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
  const cells = buildDays(month, availability);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const selected = availability.find((item) => item.date === selectedDate);
  const status = selected?.status ?? "UNKNOWN";

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start">
      <section className="border border-[#e8e1d8] bg-white p-3 sm:p-5" aria-label={`Calendário de ${label}`}>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/admin/agenda?month=${previous}`} aria-label="Mês anterior" className="inline-flex size-11 shrink-0 items-center justify-center border border-[#d8d0c5] text-lg hover:bg-[#f4efe8]">←</Link>
          <h2 className="text-center font-serif text-lg capitalize sm:text-2xl">{label}</h2>
          <Link href={`/admin/agenda?month=${next}`} aria-label="Próximo mês" className="inline-flex size-11 shrink-0 items-center justify-center border border-[#d8d0c5] text-lg hover:bg-[#f4efe8]">→</Link>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center sm:mt-5 sm:gap-2">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => <span key={day} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-[#756d64] sm:text-xs">{day}</span>)}
          {cells.map((cell, index) => {
            if (!cell) return <span key={`empty-${index}`} aria-hidden="true" />;
            const dayStatus: AvailabilityStatus = cell.availability?.status ?? "UNKNOWN";
            const selectedDay = selectedDate === cell.date;
            return (
              <button
                key={cell.date}
                type="button"
                aria-pressed={selectedDay}
                aria-label={`${dateLabel(cell.date)}: ${adminStatusLabel(dayStatus)}`}
                title={adminStatusLabel(dayStatus)}
                onClick={() => setSelectedDate(cell.date)}
                className={`flex aspect-square min-w-0 items-center justify-center border text-sm font-medium transition-colors sm:text-base ${availabilityCellClasses[dayStatus]} ${selectedDay ? "border-[#292622] outline outline-2 outline-offset-1 outline-[#292622]" : "border-white"}`}
              >{cell.day}</button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#e8e1d8] pt-4 text-xs text-[#655f58] sm:gap-x-5">
          {(["AVAILABLE", "LIMITED", "BLOCKED", "UNKNOWN"] as const).map((item) => <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true" className={`size-3 ${availabilityCellClasses[item]}`} />{adminStatusLabel(item)}</span>)}
        </div>
      </section>

      <aside className="border border-[#e8e1d8] bg-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7c6d]">Dia selecionado</p>
        <h2 className="mt-1 font-serif text-xl capitalize">{dateLabel(selectedDate)}</h2>
        <p className="mt-2 text-sm text-[#655f58]">Situação atual: <span className="font-medium text-[#292622]">{adminStatusLabel(status)}</span></p>
        {saved && selectedDate === initialDate && <p role="status" className="mt-4 border border-[#c7d8c5] bg-[#edf4eb] p-3 text-sm text-[#314631]">Agenda atualizada.</p>}
        <form key={selectedDate} action={saveAvailability} className="mt-5 space-y-4">
          <input type="hidden" name="date" value={selectedDate} />
          <label className="block text-sm font-medium">
            Situação para este dia
            <select name="status" defaultValue={selected?.status ?? ""} required className="mt-1.5 h-12 w-full border border-[#d8d0c5] bg-white px-3 font-normal">
              <option value="" disabled>Escolha uma situação</option>
              <option value="AVAILABLE">Disponível</option>
              <option value="LIMITED">Poucas vagas</option>
              <option value="BLOCKED">Indisponível</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Limite de encomendas <span className="font-normal text-[#756d64]">(opcional)</span>
            <input name="capacity" type="number" min="0" defaultValue={selected?.capacity ?? ""} className="mt-1.5 h-12 w-full border border-[#d8d0c5] px-3 font-normal" placeholder="Sem limite informado" />
          </label>
          <label className="block text-sm font-medium">
            Anotação particular <span className="font-normal text-[#756d64]">(não aparece no site)</span>
            <input name="notes" defaultValue={selected?.notes ?? ""} className="mt-1.5 h-12 w-full border border-[#d8d0c5] px-3 font-normal" placeholder="Opcional" />
          </label>
          <SaveButton />
        </form>
      </aside>
    </div>
  );
}

