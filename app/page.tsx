import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { GalleryPreview } from "@/components/site/gallery-preview";
import { SectionHeading } from "@/components/site/section-heading";
import { AvailabilityCalendar } from "@/components/site/availability-calendar";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import { getAvailability } from "@/lib/availability/get-availability";
import { getGallery } from "@/lib/gallery/get-gallery";

type Props = { searchParams: Promise<{ month?: string }> };

function currentMonth() {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "America/Fortaleza" }).format(new Date());
}

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return { start: month + "-01", end: month + "-" + String(last).padStart(2, "0") };
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : currentMonth();
  const { start, end } = monthRange(month);
  const [creations, availabilityResult] = await Promise.all([
    getGallery(),
    getAvailability(start, end)
  ]);
  const { availability, error: availabilityError } = availabilityResult;

  const heroCreation = creations.find((creation) => creation.featured) ?? creations[0];
  const heroImage = heroCreation?.images.find((image) => image.is_cover) ?? heroCreation?.images[0];

  return (
    <main className="overflow-hidden">
      <section className="py-10 sm:py-16 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-[.98] tracking-[-0.045em] text-[#292622] sm:text-6xl lg:text-7xl">Sandra Martins Confeitaria</h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#criacao">Ver criações</Button>
              <Button href="#disponibilidade" variant="secondary">Consultar agenda</Button>
            </div>
          </div>
          {heroImage && heroCreation && (
            <Link href={"/criacoes/" + heroCreation.slug} className="group block bg-[#e8e0d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#655f58]">
              <img src={heroImage.public_url} alt={heroImage.alt_text || heroCreation.title} className="h-auto max-h-[38rem] w-full object-cover transition-opacity group-hover:opacity-95" />
            </Link>
          )}
        </Container>
      </section>

      <section id="criacao" className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Galeria" title="Encontre sua inspiração." />
          <GalleryPreview creations={creations} />
        </Container>
      </section>

      <section id="disponibilidade" className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Agenda" title="Escolha uma data." />
          </div>
          <div className="border-y border-[#ded5c9] py-5 sm:border sm:p-8">
            <AvailabilityCalendar month={month} availability={availability} />
            {availabilityError && <p role="alert" className="mt-4 border border-[#dcbab3] bg-[#f5e8e4] p-3 text-sm text-[#754f45]">Não foi possível atualizar a agenda. Consulte a Sandra antes de escolher uma data.</p>}
          </div>
        </Container>
      </section>

      <section id="orcamento" className="scroll-mt-8 border-y border-[#e8e1d8] bg-[#f4efe8] py-12 sm:py-16">
        <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Encomendas</p>
            <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-[#292622]">Fale com a Sandra.</h2>
            <p className="mt-2 text-sm text-[#655f58]">+55 (85) 98828-9328</p>
          </div>
          <WhatsAppLink>Conversar pelo WhatsApp</WhatsAppLink>
        </Container>
      </section>

      <footer className="border-t border-[#e8e1d8] py-8">
        <Container className="flex flex-col gap-2 text-sm text-[#756d64] sm:flex-row sm:items-center sm:justify-between">
          <span>Sandra Martins Confeitaria</span>
          <span>Fortaleza, Ceará</span>
        </Container>
      </footer>
    </main>
  );
}

