import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Estratégia Internacional",
    template: "%s | Estratégia Internacional",
  },
  description:
    "Formação em dolarização de patrimônio e investimento internacional. BlockTrends com chancela editorial da VEJA Negócios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
