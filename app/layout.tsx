import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panorama Maritime Algérien",
  description:
    "Répertoire interactif des entreprises algériennes liées aux activités maritimes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
