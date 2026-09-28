import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

async function getCreation(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creations")
    .select("*, category:categories!inner(name, slug, is_active), images:creation_images(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("categories.is_active", true)
    .single();
  if (error || !data) return null;
  return {
    ...data,
    images: [...(data.images ?? [])].sort((a, b) => a.position - b.position).map((image) => ({
      ...image,
      public_url: supabase.storage.from("gallery").getPublicUrl(image.storage_path).data.publicUrl
    }))
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const creation = await getCreation(slug);
  if (!creation) return { title: "Criação não encontrada | Sandra Martins Confeitaria" };
  return {
    title: creation.title + " | Sandra Martins Confeitaria",
    description: creation.description || "Conheça esta criação da Sandra Martins Confeitaria."
  };
}

export default async function CreationPage({ params }: Props) {
  const { slug } = await params;
  const creation = await getCreation(slug);
  if (!creation) notFound();
  const cover = creation.images.find((image) => image.is_cover) ?? creation.images[0];
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-[#e8e1d8] bg-[#faf8f4]">
        <Container className="flex min-h-20 items-center justify-between gap-4">
          <a href="/" className="font-serif text-xl tracking-[-0.02em]">Sandra Martins</a>
          <Button href={"/?creation=" + creation.id + "#orcamento"} variant="secondary">Pedir orçamento</Button>
        </Container>
      </header>
      <Container className="py-8 sm:py-12">
        <a href="/#criacao" className="text-sm text-[#655f58] underline decoration-[#c8bbaa] underline-offset-4">← Voltar para as criações</a>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)] lg:gap-16">
          <div>
            {cover ? (
              <div className="overflow-hidden rounded-[2rem] bg-[#e8e0d5]">
                <img src={cover.public_url} alt={cover.alt_text || creation.title} className="h-auto w-full object-contain" />
              </div>
            ) : (
              <div className="flex min-h-[30rem] items-center justify-center rounded-[2rem] bg-[#e8e0d5] text-sm text-[#655f58]">Foto em breve</div>
            )}
            {creation.images.length > 1 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {creation.images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-2xl bg-[#e8e0d5]">
                    <img src={image.public_url} alt={image.alt_text || creation.title} className="h-auto w-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">{creation.category.name}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.035em] text-[#292622] sm:text-5xl">{creation.title}</h1>
            {creation.description && <p className="mt-6 text-base leading-8 text-[#655f58]">{creation.description}</p>}
            <div className="mt-8 border-t border-[#e8e1d8] pt-8">
              <p className="text-sm font-medium text-[#292622]">Quer fazer uma encomenda parecida?</p>
              <p className="mt-2 text-sm leading-6 text-[#655f58]">Consulte a disponibilidade da sua data e conte um pouco sobre o que você imaginou.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Button href="/#disponibilidade">Ver disponibilidade</Button><Button href="/#orcamento" variant="secondary">Pedir orçamento</Button></div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
