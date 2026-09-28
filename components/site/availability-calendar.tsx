import Link from "next/link";
import type { AvailabilityDay } from "@/lib/supabase/types";

const labels = {
  AVAILABLE: "Disponível",
  LIMITED: "Poucas vagas",
  BLOCKED: "Indisponível"
} as const;

const statusClasses = {
  AVAILABLE: "border-[#d8d0c5] bg-[#faf8f4] text-[#292622]",
  LIMITED: "border-[#cbbba8] bg-[#efe7dc] text-[#5e5144]",
  BLOCKED: "border-[#e1ddd7] bg-[#ece9e5] text-[#9a938b]"
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

export function AvailabilityCalendar({
  month,
  availability
}: {
  month: string;
  availability: AvailabilityDay[];
}) {
  const [year, monthNumber] = month.split("-").map(Number);
  const previousDate = new Date(Date.UTC(year, monthNumber - 2, 1));
  const nextDate = new Date(Date.UTC(year, monthNumber, 1));
  const previous = previousDate.toISOString().slice(0, 7);
  const next = nextDate.toISOString().slice(0, 7);
  const days = buildDays(month, availability);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link href={"/?month=" + previous + "#disponibilidade"} className="rounded-full border border-[#d8d0c5] px-4 py-2 text-sm hover:bg-[#f4efe8]">←</Link>
        <h3 className="font-serif text-2xl capitalize text-[#292622]">{monthLabel(month)}</h3>
        <Link href={"/?month=" + next + "#disponibilidade"} className="rounded-full border border-[#d8d0c5] px-4 py-2 text-sm hover:bg-[#f4efe8]">→</Link>
      </div>

      <div className="mt-7 grid grid-cols-7 gap-2 text-center">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <span key={day} className="py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7c6d] sm:text-xs">{day}</span>
        ))}
        {days.map((item, index) =>
          item ? (
            <div key={item.date} className={"min-h-20 rounded-2xl border p-2 text-left sm:min-h-24 sm:p-3 " + statusClasses[item.availability?.status ?? "AVAILABLE"]}>
              <span className="text-sm font-medium">{item.day}</span>
              <span className="mt-2 block text-[10px] leading-4 sm:text-xs">{labels[item.availability?.status ?? "AVAILABLE"]}</span>
            </div>
          ) : <div key={"empty-" + index} aria-hidden="true" />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#655f58]">
        <span>● Disponível</span>
        <span>● Poucas vagas</span>
        <span>● Indisponível</span>
      </div>
    </div>
  );
}
