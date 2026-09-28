import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ImagePlaceholder } from "@/components/site/image-placeholder";
import { SectionHeading } from "@/components/site/section-heading";

const steps = [
  ["01", "Inspire-se", "Conheça as criações e encontre referências para a sua ocasião."],
  ["02", "Escolha sua data", "Consulte a disponibilidade antes de definir o seu pedido."],
  ["03", "Conte sua ideia", "Envie os detalhes que tornam a encomenda sua."],
  ["04", "Receba seu orçamento", "A Sandra conversa com você pelo WhatsApp e combina os próximos passos."]
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <header className="border-b border-[#e8e1d8]">
        <Container className="flex h-20 items-center justify-between">
          <div className="font-serif text-xl tracking-[-0.02em]">Sandra Martins</div>
          <nav className="hidden items-center gap-8 text-sm text-[#5f5952] md:flex">
            <a href="#criacao">Criações</a>
            <a href="#processo">Como funciona</a>
            <a href="#sobre">Sobre</a>
          </nav>
          <Button href="#orcamento" variant="secondary">Pedir orçamento</Button>
        </Container>
      </header>

      <section className="py-10 sm:py-16 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7c6d]">Confeitaria feita sob encomenda</p>
            <h1 className="font-serif text-5xl leading-[.98] tracking-[-0.045em] text-[#292622] sm:text-6xl lg:text-7xl">
              Doces que começam na sua ideia.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#655f58] sm:text-lg">
              Uma experiência simples para conhecer criações, escolher sua data e conversar sobre o que você imaginou.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#criacao">Ver criações</Button>
              <Button href="#disponibilidade" variant="secondary">Ver disponibilidade</Button>
            </div>
          </div>
          <ImagePlaceholder label="Área reservada para a fotografia principal da marca." className="min-h-[28rem] lg:min-h-[38rem]" />
        </Container>
      </section>

      <section id="criacao" className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="O trabalho" title="Uma galeria para escolher pelo olhar." description="As fotografias e informações das criações virão do catálogo administrado pela Sandra." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ImagePlaceholder label="Criação em destaque — imagem vinda do catálogo." className="min-h-[24rem]" />
            <ImagePlaceholder label="Outra criação — imagem vinda do catálogo." className="min-h-[24rem] md:mt-12" />
            <ImagePlaceholder label="Outra criação — imagem vinda do catálogo." className="min-h-[24rem]" />
          </div>
        </Container>
      </section>

      <section id="processo" className="border-y border-[#e8e1d8] bg-[#f4efe8] py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Como funciona" title="Do primeiro olhar ao orçamento." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-[#ded5c9] bg-[#ded5c9] md:grid-cols-4">
            {steps.map(([number, title, description]) => (
              <article key={number} className="bg-[#f4efe8] p-7 sm:p-8">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#9a8b7b]">{number}</span>
                <h3 className="mt-10 font-serif text-2xl text-[#292622]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#655f58]">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="disponibilidade" className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <SectionHeading eyebrow="Agenda" title="Primeiro, encontre uma data que funcione." description="A agenda pública será alimentada pelo painel da Sandra, evitando prometer datas que já estejam ocupadas." />
          <div className="rounded-[2rem] border border-[#ded5c9] p-7 sm:p-10">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-7">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                <span key={day} className="py-2 text-center text-xs uppercase tracking-wider text-[#8a7c6d]">{day}</span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-7">
              {Array.from({ length: 14 }, (_, index) => (
                <div key={index} className="aspect-square rounded-2xl bg-[#f4efe8] p-3 text-sm text-[#6b6259]">{index + 1}</div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="sobre" className="bg-[#292622] py-20 text-[#faf8f4] sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c8bbaa]">Sandra Martins</p>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">A confeitaria por trás das criações.</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[#d8d0c6]">
            Este espaço vai contar a história da Sandra e mostrar o jeito de trabalhar por trás de cada encomenda — com uma linguagem simples e verdadeira.
          </p>
        </Container>
      </section>

      <section id="orcamento" className="py-20 sm:py-28">
        <Container className="rounded-[2rem] bg-[#e8e0d5] px-6 py-14 text-center sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7c6d]">Próximo passo</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Tem uma ideia para a sua próxima comemoração?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#655f58]">Escolha uma data e conte um pouco sobre o que você procura. O orçamento continua sendo feito de forma pessoal pelo WhatsApp.</p>
          <div className="mt-8"><Button href="https://wa.me/" >Conversar pelo WhatsApp</Button></div>
        </Container>
      </section>

      <footer className="border-t border-[#e8e1d8] py-8">
        <Container className="flex flex-col gap-2 text-sm text-[#756d64] sm:flex-row sm:items-center sm:justify-between">
          <span>Sandra Martins Confeitaria</span>
          <span>Fortaleza, Ceará</span>
        </Container>
      </section>
    </main>
  );
}
