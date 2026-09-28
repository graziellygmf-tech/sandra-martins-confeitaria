export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-16" aria-busy="true">
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-10 w-56 rounded bg-[#e8e1d8]" />
        <div className="h-4 w-80 max-w-full rounded bg-[#e8e1d8]" />
        <div className="mt-10 h-64 rounded-[2rem] bg-white" />
      </div>
      <span className="sr-only">Carregando painel...</span>
    </main>
  );
}
