// app/components/PremiumDetails/index.tsx
'use client';
import { Button, Form, FormGroup, Label } from "reactstrap";
import { useEffect, useState } from "react";
import profileService from "../../../services/profileService";
import ToastComponent from "../../common/toastComponent";
import { useRouter } from "next/navigation";
import BtnSpinner from "../../common/btnSpinner";
import Image from "next/image";
import { stripeService } from "../../../services/stripeService";
import { CalendarMonth, CreditCard, History } from "@mui/icons-material";
import styles from './styles.module.scss';

export default function PremiumDetails() {
    const router = useRouter();
    const [color, setColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState({
        subscriptionStartDate: "",
        subscriptionRenewalDate: "",
        paymentMethod: "",
        stripeCustomerId: ""
    });

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            try {
                const userData = await profileService.fetchCurrent();
                setSubscriptionDetails({
                    subscriptionStartDate: userData.subscriptionStartDate,
                    subscriptionRenewalDate: userData.subscriptionRenewalDate,
                    paymentMethod: userData.paymentMethod,
                    stripeCustomerId: userData.stripeCustomerId
                });
            } catch (error) {
                showToast("Erro ao carregar dados da assinatura", "bg-danger");
            }
        };
        fetchSubscriptionData();
    }, []);

    const showToast = (message: string, color: string) => {
        setErrorMessage(message);
        setColor(color);
        setToastIsOpen(true);
        setTimeout(() => setToastIsOpen(false), 2500);
    };

    const handleManageSubscription = async () => {
        setLoading(true);
        try {
            const response = await stripeService.getCustomerPortalLink(subscriptionDetails.stripeCustomerId);
            router.push(response.url);
        } catch (error) {
            showToast("Erro ao acessar portal de assinatura", "bg-danger");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <section className={styles.premiumSection}>
            <Form className={styles.forms}>
                <header className={styles.premiumHeader}>
                    <Image
                        src="/premium-quality.png"
                        alt="Premium Badge"
                        width={120}
                        height={120}
                        className={styles.premiumBadge}
                    />
                    <h2 className={styles.premiumTitle}>INFORMAÇÕES DA CONTA</h2>
                </header>

                <div className={styles.detailsContainer} role='list'>
                    {/* Data de Ativação */}
                    <DetailItem
                        icon={<History fontSize='large' />}
                        label="Data de Ativação"
                        value={formatDate(subscriptionDetails.subscriptionStartDate)}
                    />

                    {/* Próxima Renovação */}
                    <DetailItem
                        icon={<CalendarMonth fontSize='medium' />}
                        label="Próxima Renovação"
                        value={formatDate(subscriptionDetails.subscriptionRenewalDate)}
                    />

                    {/* Método de Pagamento */}
                    <DetailItem
                        icon={<CreditCard fontSize='medium' />}
                        label="Método de Pagamento"
                        value={
                            <div className={styles.paymentMethod}>
                                <span className={styles.paymentIcon}>
                                    {subscriptionDetails.paymentMethod === 'card' ? '💳' : '📄'}
                                </span>
                                {subscriptionDetails.paymentMethod === 'card' ? 'Cartão de Crédito' : 'Boleto Bancário'}
                            </div>
                        }
                    />
                </div>

                <footer className={styles.actionsContainer}>
                    <Button
                        className={styles.manageButton}
                        onClick={handleManageSubscription}
                        disabled={loading}
                    >
                        {loading ? <BtnSpinner /> : 'Gerenciar Assinatura'}
                    </Button>

                    <p className={styles.disclaimer}>
                        Gerencie seus dados de pagamento e histórico de cobranças através do nosso portal seguro
                    </p>
                </footer>

                <ToastComponent color={color} isOpen={toastIsOpen} message={errorMessage} />
            </Form>
        </section>

    )
}

const DetailItem = ({ icon, label, value }: { icon: JSX.Element, label: string, value: string | JSX.Element }) => (
    <div className={styles.detailItem}>
        <div className={styles.iconContainer}>{icon}</div>
        <div className={styles.detailContent}>
            <Label className={styles.detailLabel}>{label}</Label>
            <div className={styles.detailValue}>{value}</div>
        </div>
    </div>
);