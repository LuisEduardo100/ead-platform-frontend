'use client'
import { Button, Col, Container, Row } from "reactstrap"
import HeaderAuth from "../../src/components/HomeAuth/header"
import UserForm from "../../src/components/Profile/user"
import styles from '../styles/profile.module.scss'
import Footer from "../../src/components/common/footer"
import { useState } from "react"
import PasswordForm from "../../src/components/Profile/password"
import { IconButton, styled } from "@mui/material"
import { ArrowBackIosNew } from "@mui/icons-material"
import { useRouter } from "next/navigation"

const IconBtn = styled(IconButton)({
    color: "#000",
    padding: "0px 6px",
    "&:hover": {
        opacity: 0.80,
    },

    '@media (max-width: 300px)': {
        padding: "0px 4px",
    }
});

const Profile = function () {
    const [form, setForm] = useState("userForm")
    const router = useRouter()
    const handleBackRouter = () => {
        router.push('/home')
    }

    return (<>
        <main>
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
                            style={
                                {
                                    color: form === "userForm" ? "black" : "#756f6f",
                                    backgroundColor: form === "userForm" ? "#DEB66B" : "transparent"
                                }
                            }
                            onClick={() => {
                                setForm("userForm");
                            }}
                        >
                            DADOS PESSOAIS
                        </Button>
                        <Button
                            outline
                            className={styles.renderFormBtn}
                            style={
                                {
                                    color: form === "userForm" ? "#756f6f" : "black",
                                    backgroundColor: form === "userForm" ? "transparent" : "#DEB66B"
                                }
                            }
                            onClick={() => {
                                setForm("passwordForm");
                            }}
                        >
                            SENHA
                        </Button>
                    </Col>
                    <Col md>{form === "userForm" ? <UserForm /> : <PasswordForm />}</Col>
                </Row>
            </Container>
            <div className={styles.footer}>
                <Footer />
            </div>
        </main>
    </>)
}

export default Profile