// app/payment-success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAuth from '../../src/components/HomeAuth/header';
import FooterAuth from '../../src/components/HomeAuth/footerAuth';
import styles from '../styles/paymentSuccessStyle.module.scss';
import Footer from '../../src/components/common/footer';
import { stripeService } from '../../src/services/stripeService';

interface SessionDetails {
  customerId: string;
  amount: number;
  currency: string;
  expirationDate: string;
  customerEmail: string;
}

export default function PaymentSuccess() {
  const router = useRouter();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) throw new Error('ID da sessão não encontrado');

        const result = await stripeService.getCheckoutInfo(sessionId);

        if (!result.success) throw new Error(result.error);

        // Caso result.customerId seja um objeto, extraímos o ID
        const customerId =
          typeof result.customerId === 'string'
            ? result.customerId
            : result.customerId.id;

        setSessionDetails({
          customerId: customerId,
          amount: result.sessionDetails.amount / 100,
          currency: result.sessionDetails.currency.toUpperCase(),
          expirationDate: new Date(result.sessionDetails.expirationDate).toLocaleDateString('pt-BR'),
          customerEmail: result.sessionDetails.customerEmail,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <main className={`${styles.menu} ${isMenuOpen ? 'menuOpen' : ''}`}>
          <HeaderAuth />
          <div className={styles.loader}>Verificando pagamento...</div>
          <Footer />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <main className={`${styles.menu} ${isMenuOpen ? 'menuOpen' : ''}`}>
          <HeaderAuth />
          <div className={styles.error}>
            <h2>Erro no processamento</h2>
            <p>{error}</p>
            <button onClick={() => router.push('/')}>Voltar para home</button>
          </div>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={`${styles.menu} ${isMenuOpen ? 'menuOpen' : ''}`}>
        <HeaderAuth />
        <div className={styles.successCard}>
          <div className={styles.checkmark}>✓</div>
          <h1>Pagamento Realizado com Sucesso!</h1>

          <div className={styles.details}>
            <h2>Detalhes da Compra</h2>
            <p><strong>Valor:</strong> R$ {sessionDetails?.amount.toFixed(2)}</p>
            <p><strong>Método:</strong> Cartão de Crédito</p>
            <p><strong>E-mail:</strong> {sessionDetails?.customerEmail}</p>
            <p><strong>ID da Transação:</strong> {sessionDetails?.customerId}</p>
            <p><strong>Acesso Premium até:</strong> {sessionDetails?.expirationDate}</p>
          </div>

          <div className={styles.importantNotes}>
            <h3>Importante</h3>
            <ul>
              <li>7 dias para cancelamento com retorno</li>
              <li>Os detalhes acima podem ser acessados em profile</li>
              <li>Qualquer dúvida, entre em contato com o suporte e nós o ajudaremos</li>
            </ul>
          </div>

          <button 
            className={styles.homeButton}
            onClick={() => router.push('/todos-os-cursos')}
          >
            Acessar cursos
          </button>
        </div>
        <Footer />
      </main>
    </div>
  );
}
