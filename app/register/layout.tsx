// src/app/register/layout.tsx
import type { Metadata } from "next"
import RecaptchaLayout from "../../src/components/common/clientProviders/recaptchaProvider";

export const metadata: Metadata = {
  title: "Registre-se",
}

export default function RootLayout({children} : { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <RecaptchaLayout>
          {children}
        </RecaptchaLayout>
      </body>
    </html>
  );
}