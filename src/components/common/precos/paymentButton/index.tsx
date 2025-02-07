import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './styles.module.scss';
import { stripeService } from '../../../../services/stripeService';
import { Button } from 'reactstrap';
import PageSpinner from '../../pageSpinner';
import BtnSpinner from '../../btnSpinner';


const PaymentButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams()
  const handlePayment = async () => {

    setLoading(true);
    const registerSuccess = params.get("newuserbuy")

    if (registerSuccess === 'true') {
      return router.push('/login?newuserbuy=true')
    }

    if (!sessionStorage.getItem("vocenotadez-token")) {
      return router.push('/register?newuser=true')
    }

    try {
      const response = await stripeService.checkoutSessionLink();
      const { url } = response;

      if (url) {
        location.href = url
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <Button
      className={styles.btnMatricula}
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? <BtnSpinner /> : 'Matricule-se'}
    </Button>
  );
};

export default PaymentButton;
