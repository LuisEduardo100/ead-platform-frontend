import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOTA DEZ - Acesse sua conta",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
