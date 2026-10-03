import Link from "next/link";
import type { ReactNode } from "react";

export const adminNavItems = [
  { href: "/admin", label: "Início", icon: "home" },
  { href: "/admin/agenda", label: "Agenda", icon: "calendar" },
  { href: "/admin/orcamentos", label: "Pedidos", icon: "inbox" },
  { href: "/admin/criacoes", label: "Criações", icon: "image" },
  { href: "/admin/categorias", label: "Categorias", icon: "grid" }
] as const;

function Icon({ name }: { name: (typeof adminNavItems)[number]["icon"] }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></>,
    inbox: <><path d="M4 5h16v14H4z" /><path d="m4 14 4 0 1.5 3h5L16 14h4" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 3.5 3 2.5-2 5 5" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">{paths[name]}</svg>;
}

export function AdminNav({ activeHref }: { activeHref?: string }) {
  return (
    <nav aria-label="Navegação administrativa" className="overflow-x-auto border-t border-[#eee8df]">
      <div className="mx-auto flex min-w-max max-w-7xl items-center gap-1 px-4 py-2 sm:px-6 lg:px-8">
        {adminNavItems.map((item) => {
          const active = activeHref === item.href;
          const className = active
            ? "inline-flex min-h-10 items-center gap-2 whitespace-nowrap bg-[#292622] px-3 text-sm font-medium text-white"
            : "inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-3 text-sm text-[#655f58] hover:bg-[#f4efe8] hover:text-[#292622]";
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={className}>
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
