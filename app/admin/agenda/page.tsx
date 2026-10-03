import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui/container";
import { getAvailability } from "@/lib/availability/get-availability";
import { requireAdmin } from "@/lib/supabase/admin";
import { AvailabilityManager } from "./availability-manager";

type Props = { searchParams: Promise<{ month?: string; selected?: string; saved?: string }> };

function currentMonth() {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "America/Fortaleza" }).format(new Date());
}

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return { start: `${month}-01`, end: `${month}-${String(last).padStart(2, "0")}` };
}

export default async function AvailabilityPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const requestedMonth = params.month ?? "";
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth) ? requestedMonth : currentMonth();
  const { start, end } = monthRange(month);
  const availability = await getAvailability(start, end);
  const requestedDate = params.selected ?? "";
  const requestedDateIsValid = requestedDate.startsWith(`${month}-`)
    && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
    && new Date(`${requestedDate}T00:00:00Z`).toISOString().slice(0, 10) === requestedDate;
  const selectedDate = requestedDateIsValid ? requestedDate : `${month}-01`;
  const saved = params.saved === "1" && selectedDate === params.selected;

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminHeader />
      <Container className="py-7 sm:py-10 lg:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Organize seus pedidos</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">Agenda</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#655f58] sm:text-base">Toque em um dia para escolher se está disponível, com poucas vagas ou indisponível.</p></div>
        </div>
        <div className="mt-5"><AvailabilityManager month={month} availability={availability} initialDate={selectedDate} saved={saved} /></div>
      </Container>
    </main>
  );
}

