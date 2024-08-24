import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOTA DEZ - Questões",
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
