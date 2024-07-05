'use client'
import { Button, Col, Container, Row } from "reactstrap"
import HeaderAuth from "../../src/components/HomeAuth/header"
import UserFrom from "../../src/components/Profile/user"
import styles from '../styles/profile.module.scss'
import Footer from "../../src/components/common/footer"
const Profile = function () {
    return (<>
        <main>
            <HeaderAuth />
            <Container className="py-5">
                <p className={styles.title}>Minha Conta</p>
                <Row className="pt-3 pb-5">
                    <Col md={4} className={styles.btnColumn}>
                        <Button outline className={styles.renderFormBtn}>
                            DADOS PESSOAIS
                        </Button>
                        <Button outline className={styles.renderFormBtn}>
                            SENHA
                        </Button>
                    </Col>
                    <Col md>
                        <UserFrom />
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </main>
    </>)
}

export default Profile