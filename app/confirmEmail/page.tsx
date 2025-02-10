// app/confirmEmail/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '../../src/services/authService';
import HeaderAuth from '../../src/components/HomeAuth/header';
import Footer from '../../src/components/common/footer';
import styles from '../styles/paymentSuccessStyle.module.scss';

const ConfirmEmail = () => {
  const router = useRouter();
  const getParams = useSearchParams();
  const token = getParams.get('token');
  const [message, setMessage] = useState('Confirmando seu email...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (!token) {
        setMessage('Token de confirmação não encontrado.');
        return;
      }

      try {
        const res = await authService.confirmEmail(token);
        if (res && res.status === 200) {
          setMessage('Email confirmado com sucesso!');
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/login?emailConfirmed=true');
          }, 3000); // Redireciona após 3 segundos
        } else {
          setMessage('Erro ao confirmar o email.');
        }
      } catch (error) {
        console.error('Erro ao confirmar email:', error);
        setMessage('Erro ao confirmar o email.');
      }
    };

    confirmUserEmail();
  }, [token, router]);

  return (
    <div className={styles.container}>
      <main className={styles.menu}>
        <div className={styles.successCard}>
          <div className={isSuccess ? styles.checkmark : styles.crossmark}>
            {isSuccess ? '✓' : '✕'}
          </div>
          <h1 style={{ color: isSuccess ? '#2c3e50' : '#dc3545' }}>{message}</h1>

          {isSuccess && (
            <div className={styles.details}>
              <p>Você será redirecionado para a página de login em instantes...</p>
            </div>
          )}

          {!isSuccess && (
            <div className={styles.details}>
              <p>Por favor, verifique o link de confirmação ou entre em contato conosco:</p>
              <p style={{ marginTop: '10px' }}>
                ✉️ somosnotadez@gmail.com | 📞 (85) 9412-3487
              </p>
            </div>
          )}

          <button
            className={styles.homeButton}
            onClick={() => router.push('/login')}
            style={{ marginTop: '2rem' }}
          >
            Faça o login agora
          </button>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ConfirmEmail;