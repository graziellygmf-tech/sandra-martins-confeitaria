import Link from "next/link";
import type { PublicAvailabilityDay } from "@/lib/supabase/types";
import { availabilityCellClasses, availabilityLabels } from "@/lib/availability/presentation";

function monthLabel(month: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(month + "-01T00:00:00Z"));
}

function buildDays(month: string, availability: PublicAvailabilityDay[]) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const last = new Date(Date.UTC(year, monthNumber, 0));
  const offset = (first.getUTCDay() + 6) % 7;
  const total = last.getUTCDate();
  const map = new Map(availability.map((day) => [day.date, day]));

  return Array.from({ length: offset + total }, (_, index) => {
    if (index < offset) return null;
    const day = index - offset + 1;
    const date = year + "-" + String(monthNumber).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    return { day, date, availability: map.get(date) };
  });
}

export function AvailabilityCalendar({ month, availability }: { month: string; availability: PublicAvailabilityDay[] }) {
  const [year, monthNumber] = month.split("-").map(Number);
  const previous = new Date(Date.UTC(year, monthNumber - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 7);
  const days = buildDays(month, availability);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Link href={"/?month=" + previous + "#disponibilidade"} aria-label="Mês anterior" className="flex size-10 shrink-0 items-center justify-center border border-[#ded5c9] text-lg hover:bg-[#f4efe8]">←</Link>
        <h3 className="text-center font-serif text-lg capitalize text-[#292622] sm:text-2xl">{monthLabel(month)}</h3>
        <Link href={"/?month=" + next + "#disponibilidade"} aria-label="Próximo mês" className="flex size-10 shrink-0 items-center justify-center border border-[#ded5c9] text-lg hover:bg-[#f4efe8]">→</Link>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-px border border-[#e5dfd7] bg-[#e5dfd7] text-center sm:mt-7">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <span key={day} className="bg-[#faf8f4] py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a7c6d] sm:py-3 sm:text-xs sm:tracking-[0.12em]">{day}</span>
        ))}
        {days.map((item, index) => {
          if (!item) return <div key={"empty-" + index} aria-hidden="true" />;
          const status = item.availability?.status ?? "UNKNOWN";
          return (
            <div
              key={item.date}
              role="group"
              aria-label={`${item.day} de ${monthLabel(month)}: ${availabilityLabels[status]}`}
              title={`${item.day} de ${monthLabel(month)} · ${availabilityLabels[status]}`}
              className={`flex aspect-square min-w-0 flex-col items-center justify-center gap-1 p-1 sm:gap-2 sm:p-2 ${availabilityCellClasses[status]}`}
            >
              <span className="text-xs font-medium sm:text-sm">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#655f58] sm:gap-x-6">
        {(["AVAILABLE", "LIMITED", "BLOCKED", "UNKNOWN"] as const).map((status) => (
          <span key={status} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`size-3 ${availabilityCellClasses[status]}`} />
            {availabilityLabels[status]}
          </span>
        ))}
      </div>
    </div>
  );
}

