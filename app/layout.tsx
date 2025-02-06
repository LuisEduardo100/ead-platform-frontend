import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { YearProvider } from "../src/components/HomeAuth/selectBox/yearProvider";
import { MenuProvider } from "../src/components/common/menu/menuProvider";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://vocenotadez.com";

export const metadata: Metadata = {
  title: "NOTA DEZ - Plataforma de Suporte Escolar Online",
  description: "Tenha acesso à melhor plataforma de suporte escolar online! Cursos, materiais e suporte para estudantes de todas as séries.",
  icons: "/favicon.png",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "NOTA DEZ - Plataforma de Suporte Escolar Online",
    description: "Tenha acesso à melhor plataforma de suporte escolar online! Cursos, materiais e suporte para estudantes de todas as séries.",
    url: siteUrl,
    siteName: "NOTA DEZ",
    locale: "pt_BR",
    type: "website",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="NOTA DEZ" />
        <meta name="keywords" content="cursos online, suporte escolar, ensino EAD, plataforma de estudo" />
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className={inter.className}>
        <MenuProvider>
          <YearProvider>
            {children}
          </YearProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
