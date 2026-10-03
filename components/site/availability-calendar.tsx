import Link from "next/link";
import type { AvailabilityDay } from "@/lib/supabase/types";

const labels = {
  AVAILABLE: "Disponível",
  LIMITED: "Poucas vagas",
  BLOCKED: "Indisponível",
  UNKNOWN: "Consulte"
} as const;

const statusClasses = {
  AVAILABLE: "bg-white text-[#292622]",
  LIMITED: "bg-[#fbf4e8] text-[#5e5144]",
  BLOCKED: "bg-[#f1efec] text-[#8a8279]",
  UNKNOWN: "bg-white text-[#655f58]"
} as const;

const statusDotClasses = {
  AVAILABLE: "bg-[#6d8b70]",
  LIMITED: "bg-[#c39855]",
  BLOCKED: "bg-[#aaa39a]",
  UNKNOWN: "border border-[#9a9187] bg-transparent"
} as const;

function monthLabel(month: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(month + "-01T00:00:00Z"));
}

function buildDays(month: string, availability: AvailabilityDay[]) {
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

export function AvailabilityCalendar({ month, availability }: { month: string; availability: AvailabilityDay[] }) {
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
              aria-label={`${item.day} de ${monthLabel(month)}: ${labels[status]}`}
              title={`${item.day} de ${monthLabel(month)} · ${labels[status]}`}
              className={`flex aspect-square min-w-0 flex-col items-center justify-center gap-1 p-1 sm:gap-2 sm:p-2 ${statusClasses[status]}`}
            >
              <span className="text-xs font-medium sm:text-sm">{item.day}</span>
              <span aria-hidden="true" className={`size-1.5 sm:size-2 ${statusDotClasses[status]}`} />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#655f58] sm:gap-x-6">
        {(["AVAILABLE", "LIMITED", "BLOCKED", "UNKNOWN"] as const).map((status) => (
          <span key={status} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 ${statusDotClasses[status]}`} />
            {labels[status]}
          </span>
        ))}
      </div>
    </div>
  );
}

