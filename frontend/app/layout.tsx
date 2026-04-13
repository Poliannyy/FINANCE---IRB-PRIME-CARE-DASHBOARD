import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IRB Prime Care Finance",
  description: "Sistema financeiro IRB Prime Care",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}