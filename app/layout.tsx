import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.scss";
import 'bootstrap/dist/css/bootstrap.min.css'
import { YearProvider } from "../src/components/HomeAuth/selectBox/yearProvider";
import { MenuProvider } from "../src/components/common/menu/menuProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOTA DEZ",
  description: "Tenha acesso a melhor plataforma de suporte escolar online!",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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