import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestao de Palco",
  description: "Controle local de tempo e comunicacao para o palco.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
