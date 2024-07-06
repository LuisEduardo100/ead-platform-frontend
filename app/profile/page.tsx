'use client'
import { Button, Col, Container, Row } from "reactstrap"
import HeaderAuth from "../../src/components/HomeAuth/header"
import UserForm from "../../src/components/Profile/user"
import styles from '../styles/profile.module.scss'
import Footer from "../../src/components/common/footer"
import { useState } from "react"
import PasswordForm from "../../src/components/Profile/password"
const Profile = function () {
    const [form, setForm] = useState("userForm")

    return (<>

        <main>
            <div className={styles.header}>
                <HeaderAuth />
            </div>
            <Container className="py-5">
                <p className={styles.title}>Minha Conta</p>
                <Row className="pt-3 pb-5">
                    <Col md={4} className={styles.btnColumn}>
                        <Button
                            outline
                            className={styles.renderFormBtn}
                            style={{ color: form === "userForm" ? "#f0c36e" : "#727272" }}
                            onClick={() => {
                                setForm("userForm");
                            }}
                        >
                            DADOS PESSOAIS
                        </Button>
                        <Button
                            outline
                            className={styles.renderFormBtn}
                            style={{ color: form === "userForm" ? "#727272" : "#f0c36e" }}
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