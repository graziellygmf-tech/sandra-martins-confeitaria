import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAvailability } from "@/lib/availability/get-availability";
import { saveAvailability } from "./actions";

type Props = { searchParams: Promise<{ month?: string }> };

function currentMonth() {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "America/Fortaleza" }).format(new Date());
}

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return { start: month + "-01", end: month + "-" + String(last).padStart(2, "0") };
}

export default async function Page({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : currentMonth();
  const { start, end } = monthRange(month);
  const days = await getAvailability(start, end);
  const [year, monthNumber] = month.split("-").map(Number);
  const previous = new Date(Date.UTC(year, monthNumber - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 7);
  const dayMap = new Map(days.map((day) => [day.date, day]));
  const total = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader />
      <Container className="py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Administração</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl tracking-[-0.03em]">Disponibilidade</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#655f58]">Defina o estado de cada dia que será mostrado na agenda pública.</p>
          </div>
          <div className="flex gap-2">
            <Link href={"/admin/agenda?month=" + previous} className="rounded-full border border-[#d8d0c5] px-4 py-2 text-sm">←</Link>
            <span className="rounded-full bg-[#e8e0d5] px-4 py-2 text-sm capitalize">
              {new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(month + "-01T00:00:00Z"))}
            </span>
            <Link href={"/admin/agenda?month=" + next} className="rounded-full border border-[#d8d0c5] px-4 py-2 text-sm">→</Link>
          </div>
        </div>
        <div className="mt-10 space-y-4">
          {Array.from({ length: total }, (_, index) => {
            const day = index + 1;
            const date = month + "-" + String(day).padStart(2, "0");
            const existing = dayMap.get(date);
            return (
              <form key={date} action={saveAvailability} className="grid gap-4 rounded-[1.5rem] border border-[#ded5c9] bg-white p-5 md:grid-cols-[7rem_10rem_8rem_1fr_auto] md:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8a7c6d]">Data</p>
                  <p className="mt-1 font-serif text-xl">{day}/{monthNumber}</p>
                </div>
                <label className="text-sm">
                  <span className="mb-2 block text-[#655f58]">Status</span>
                  <select name="status" defaultValue={existing?.status ?? "AVAILABLE"} className="h-11 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-3">
                    <option value="AVAILABLE">Disponível</option>
                    <option value="LIMITED">Poucas vagas</option>
                    <option value="BLOCKED">Indisponível</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-2 block text-[#655f58]">Capacidade</span>
                  <input name="capacity" type="number" min="0" defaultValue={existing?.capacity ?? ""} className="h-11 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-3" placeholder="—" />
                </label>
                <label className="text-sm">
                  <span className="mb-2 block text-[#655f58]">Observação interna</span>
                  <input name="notes" defaultValue={existing?.notes ?? ""} className="h-11 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-3" placeholder="Opcional" />
                </label>
                <input type="hidden" name="date" value={date} />
                <button type="submit" className="h-11 rounded-full bg-[#2b2926] px-5 text-sm font-medium text-[#faf8f4]">Salvar</button>
              </form>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
