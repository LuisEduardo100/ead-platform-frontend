// // src/app/providers.tsx
// 'use client'

// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
// import { MenuProvider } from '../menu/menuProvider'
// import { YearProvider } from '../../HomeAuth/selectBox/yearProvider'

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <GoogleReCaptchaProvider
//       reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
//       scriptProps={{ async: true, defer: true }}
//     >
//       <MenuProvider>
//         <YearProvider>
//           {children}
//         </YearProvider>
//       </MenuProvider>
//     </GoogleReCaptchaProvider>
//   )
// }