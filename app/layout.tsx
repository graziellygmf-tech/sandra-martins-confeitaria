import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandra Martins Confeitaria",
  description: "Confeitaria feita sob encomenda.",
  openGraph: {
    title: "Sandra Martins Confeitaria",
    description: "Confeitaria feita sob encomenda.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
