import Link from "next/link";
import { Container } from "@/components/ui/container";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "./admin-nav";

export function AdminHeader({ backHref = "/", activeHref }: { backHref?: string; activeHref?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e1d8] bg-white/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/admin" className="min-w-0">
          <span className="block truncate font-serif text-lg leading-tight">Sandra Martins</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7c6d]">Confeitaria · Gestão</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href={backHref} className="inline-flex min-h-10 items-center border border-[#ddd5ca] px-3 text-xs font-medium hover:bg-[#f4efe8] sm:px-4 sm:text-sm">
            Ver site
          </Link>
          <form action={logout}>
            <button type="submit" className="inline-flex min-h-10 items-center px-2.5 text-xs text-[#655f58] hover:bg-[#f4efe8] sm:px-3 sm:text-sm">
              Sair
            </button>
          </form>
        </div>
      </Container>
      <AdminNav activeHref={activeHref} />
    </header>
  );
}
