"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-16">
      <section role="alert" className="mx-auto max-w-xl rounded-[2rem] border border-[#e8e1d8] bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7c6d]">Painel administrativo</p>
        <h1 className="mt-3 font-serif text-3xl">Não foi possível abrir esta página</h1>
        <p className="mt-3 text-sm leading-6 text-[#655f58]">Tente novamente. Se o problema continuar, atualize a página mais tarde.</p>
        <button onClick={() => reset()} className="mt-6 rounded-full bg-[#292622] px-5 py-3 text-sm font-medium text-white">Tentar novamente</button>
      </section>
    </main>
  );
}
