// app/payment-canceled/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAuth from '../../src/components/HomeAuth/header';
import FooterAuth from '../../src/components/HomeAuth/footerAuth';
import styles from '../styles/paymentSuccessStyle.module.scss';
import Footer from '../../src/components/common/footer';

export default function PaymentCanceled() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <main className={`${styles.menu} ${isMenuOpen ? 'menuOpen' : ''}`}>
        <HeaderAuth />
        <div className={styles.successCard} style={{ backgroundColor: '#fff3f3' }}>
          <div className={styles.crossmark} style={{ color: '#ff4444' }}>✕</div>
          <h1 style={{ color: '#333' }}>Poxa, que pena! 😢</h1>

          <div className={styles.details}>
            <h2 style={{ color: '#555' }}>Estaremos sempre aqui por você, aluno!</h2>
            
            <div className={styles.importantNotes}>
              <ul>
                <li>Nossas aulas continuam aqui de portas abertas</li>
                <li>Dúvidas? Nosso time está pronto para ajudar</li>
                <li>Oferecemos material gratuito para experimentar</li>
              </ul>
            </div>
          </div>

          <button 
            className={styles.homeButton}
            style={{ 
              backgroundColor: '#666',
              marginTop: '2rem'
            }}
            onClick={() => router.push('/todos-os-cursos')}
          >
            Voltar para Cursos
          </button>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#777' }}>
            Mudou de ideia? Nosso checkout está disponível 24h! 😊
          </p>
        </div>
        <Footer />
      </main>
    </div>
  );
}