import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-[#e8e1d8] bg-white p-7 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7c6d]">Área administrativa</p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.03em]">Sandra Martins</h1>
          <p className="mt-3 text-sm leading-6 text-[#655f58]">Entre para administrar criações, imagens e disponibilidade.</p>
          <div className="mt-8"><LoginForm /></div>
        </div>
      </div>
    </main>
  );
}
