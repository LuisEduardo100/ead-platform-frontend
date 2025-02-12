import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Confirme seu email",
  robots: {
    index: false, // Impede que o Google indexe esta página
    follow: false, // Impede que siga links dessa página
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}
    </section>
  );
}
