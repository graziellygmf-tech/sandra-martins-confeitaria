import Link from "next/link";
import { Container } from "@/components/ui/container";
import { logout } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/criacoes", label: "Criações" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/orcamentos", label: "Orçamentos" }
];

export function AdminHeader({ backHref = "/admin", activeHref }: { backHref?: string; activeHref?: string }) {
  return (
    <header className="border-b border-[#e8e1d8] bg-white">
      <Container className="flex flex-col gap-3 py-3 sm:py-4 md:flex-row md:items-center md:justify-between">
        <Link href={backHref} aria-label="Voltar" className="inline-flex min-h-11 w-fit items-center gap-2 px-1 text-sm font-medium text-[#292622] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#655f58]">
          <span aria-hidden="true" className="text-xl leading-none">←</span>
          <span>Voltar</span>
        </Link>
        <nav aria-label="Navegação do painel" className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:justify-end">
          {links.map((link) => {
            const active = activeHref === link.href;
            return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 items-center px-3 hover:bg-[#f4efe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#655f58] ${active ? "border-b-2 border-[#655f58] font-semibold" : ""}`}>{link.label}</Link>;
          })}
          <Link href="/" className="inline-flex min-h-11 items-center px-3 hover:bg-[#f4efe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#655f58]">Ver site</Link>
          <form action={logout}><button type="submit" className="min-h-11 w-full border border-[#d8d0c5] px-3 text-left hover:bg-[#f4efe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#655f58] md:w-auto md:text-center">Sair</button></form>
        </nav>
      </Container>
    </header>
  );
}

