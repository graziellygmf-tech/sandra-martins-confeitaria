"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Não foi possível entrar. Confira o e-mail e a senha.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-[#403b35]">E-mail</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" className="mt-2 h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[#403b35]">Senha</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-[#d8d0c5] bg-[#faf8f4] px-4 outline-none focus:border-[#8a7c6d]" />
      </label>
      {error && <p className="rounded-xl bg-[#f5e8e4] px-4 py-3 text-sm text-[#754f45]">{error}</p>}
      <Button>{loading ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}
