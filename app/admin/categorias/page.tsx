import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-[#e8e1d8] bg-white">
        <Container className="flex min-h-20 items-center justify-between">
          <Link href="/admin" className="font-serif text-xl">Sandra Martins</Link>
          <Link href="/admin" className="text-sm underline underline-offset-4">Voltar ao painel</Link>
        </Container>
      </header>
      <Container className="py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Administração</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em]">Categorias</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#655f58]">Aqui ficará a organização das categorias do catálogo.</p>
        <div className="mt-10 rounded-[2rem] border border-dashed border-[#d8d0c5] bg-white p-8">
          <p className="font-serif text-2xl">Módulo em construção</p>
          <p className="mt-2 text-sm leading-6 text-[#655f58]">A estrutura da rota já está pronta. A próxima implementação será feita diretamente sobre os dados do Supabase.</p>
        </div>
      </Container>
    </main>
  );
}
