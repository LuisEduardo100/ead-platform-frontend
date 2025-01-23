'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '../../src/services/authService';

const ConfirmEmail = () => {
  const router = useRouter();
  const getParams = useSearchParams()
  const token = getParams.get('token') 
  const [message, setMessage] = useState('Confirmando seu email...');
  
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
          router.push('/login?emailConfirmed=true');
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

  return <>{message}</>;
};

export default ConfirmEmail;
