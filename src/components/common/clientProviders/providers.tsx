// app/ClientLayout.tsx
'use client'; // ⚠️ Adicione esta diretiva no topo!

import { useEffect } from 'react';
import Modal from 'react-modal';
import { YearProvider } from '../../HomeAuth/selectBox/yearProvider';
import { MenuProvider } from '../menu/menuProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  return (
    <YearProvider>
      <MenuProvider>
        {children}
      </MenuProvider>
    </YearProvider>
  );
}