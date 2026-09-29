import type { ReactNode } from "react";

export function WhatsAppLink({
  children = "Conversar pelo WhatsApp",
  message = "Olá, Sandra! Gostaria de conversar sobre uma encomenda."
}: {
  children?: ReactNode;
  message?: string;
}) {
  const whatsappUrl = `https://wa.me/5585988289328?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center bg-[#292622] px-6 text-sm font-medium text-white transition-colors hover:bg-[#403c37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#655f58]"
    >
      {children}
    </a>
  );
}

