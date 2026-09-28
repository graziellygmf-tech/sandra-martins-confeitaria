import Link from "next/link";
import { Container } from "@/components/ui/container";
import { logout } from "@/app/admin/actions";

const links = [
  { href: "/admin/criacoes", label: "Criações" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/orcamentos", label: "Orçamentos" }
];

export function AdminHeader() {
  return (
    <header className="border-b border-[#e8e1d8] bg-white">
      <Container className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/admin" className="font-serif text-xl">Sandra Martins</Link>
        <nav aria-label="Navegação administrativa" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {links.map((link) => <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">{link.label}</Link>)}
          <Link href="/" className="underline-offset-4 hover:underline">Ver site</Link>
          <form action={logout}><button type="submit" className="rounded-full border border-[#d8d0c5] px-4 py-2">Sair</button></form>
        </nav>
      </Container>
    </header>
  );
}
