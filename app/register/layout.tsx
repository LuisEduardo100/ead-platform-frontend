// src/app/register/layout.tsx
import type { Metadata } from "next"
import RecaptchaLayout from "../../src/components/common/clientProviders/recaptchaProvider";

export const metadata: Metadata = {
  title: "NOTA DEZ - Registre-se",
  robots: {
    index: false, // Impede que o Google indexe esta página
    follow: false, // Impede que siga links dessa página
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <RecaptchaLayout>
        {children}
      </RecaptchaLayout>
    </section>
  )
}