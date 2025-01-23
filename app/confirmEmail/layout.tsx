import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirme seu email",
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
