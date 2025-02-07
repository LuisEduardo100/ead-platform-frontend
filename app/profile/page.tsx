'use client'
import { Button, Col, Container, Row } from "reactstrap"
import HeaderAuth from "../../src/components/HomeAuth/header"
import UserForm from "../../src/components/Profile/user"
import styles from '../styles/profile.module.scss'
import Footer from "../../src/components/common/footer"
import { useEffect, useState } from "react"
import PasswordForm from "../../src/components/Profile/password"
import { IconButton, styled } from "@mui/material"
import { ArrowBackIosNew } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import profileService from "../../src/services/profileService"
import PageSpinner from "../../src/components/common/pageSpinner"
import { useYear } from "../../src/components/HomeAuth/selectBox/yearProvider"
import { useMenu } from "../../src/components/common/menu/menuProvider"
import PremiumDetails from "../../src/components/Profile/premiumDetails" // Importe o novo componente

const IconBtn = styled(IconButton)({
    color: "#000",
    padding: "0px 6px",
    "&:hover": {
        opacity: 0.80,
    },
    '@media (max-width: 300px)': {
        padding: "0px 4px",
    },
});

const Profile = function () {
    const { selectedYear, onYearChange } = useYear();
    const [form, setForm] = useState("userForm");
    const { isMenuOpen } = useMenu();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    const handleBackRouter = () => {
        router.push('/home');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await profileService.fetchCurrent();
                setUserData(data);
                if (data?.serie) {
                    onYearChange(data.serie);
                }
            } catch (error) {
                console.error("Erro ao buscar os dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [onYearChange]);

    if (loading) {
        return <PageSpinner />;
    }

    const getButtonStyle = (formType: string) => ({
        color: form === formType ? "black" : "#756f6f",
        backgroundColor: form === formType ? "#DEB66B" : "transparent",
        borderColor: form === formType ? "#DEB66B" : "#756f6f"
    });

    return (
        <>
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <div className={styles.header}>
                    <HeaderAuth />
                </div>
                <Container className="py-5">
                    <div className={styles.divMinhaConta}>
                        <IconBtn onClick={handleBackRouter}>
                            <ArrowBackIosNew fontSize="large" />
                        </IconBtn>
                        <p className={styles.title}>Minha Conta</p>
                    </div>
                    <Row className="pt-3 pb-5">
                        <Col md={4} className={styles.btnColumn}>
                            <Button
                                outline
                                className={styles.renderFormBtn}
                                style={getButtonStyle("userForm")}
                                onClick={() => setForm("userForm")}
                            >
                                DADOS PESSOAIS
                            </Button>
                            <Button
                                outline
                                className={styles.renderFormBtn}
                                style={getButtonStyle("passwordForm")}
                                onClick={() => setForm("passwordForm")}
                            >
                                SENHA
                            </Button>
                            {userData?.hasFullAccess && (
                                <Button
                                    outline
                                    className={styles.renderFormBtn}
                                    style={getButtonStyle("premium")}
                                    onClick={() => setForm("premium")}
                                >
                                    DETALHES
                                </Button>
                            )}
                        </Col>
                        <Col md>
                            {form === "userForm" && <UserForm />}
                            {form === "passwordForm" && <PasswordForm />}
                            {form === "premium" && userData?.hasFullAccess && <PremiumDetails />}
                        </Col>
                    </Row>
                </Container>
                <div className={styles.footer}>
                    <Footer />
                </div>
            </main>
        </>
    );
};

export default Profile;