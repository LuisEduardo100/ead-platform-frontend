'use client';
import {Col, Row, Button, Container} from 'reactstrap'
import styles from './styles.module.scss'
import Link from 'next/link'

const PresentationSection = function () {
    return (
    <>
        <Container className="py-5">
            <Row>
                <Col md className="d-flex flex-column justify-content-center align-items-start">
                    <p className={styles.comentario}>UM REFORÇO COMPLETO</p>
                    <p className={styles.titulo}>Tenha acesso a melhor plataforma EAD e seja nota dez.</p>
                    <p className={styles.descricao}>
                        Estude a qualquer momento e reveja as videoaulas quantas vezes
                        precisas e reforce seu aprendizado com os materias de apoio!
                    </p>
                    <Link href="/register">
                        <Button className={styles.btnAcesseAgora} outline>ACESSE AGORA</Button>
                    </Link>
                </Col>
                <Col>
                    <img className={styles.img} src="/homeNoAuth/imgPresentation.png" alt="imgDeApresentacao"/>
                </Col>
            </Row>
            <Row>
                <Col md className="d-flex justify-content-center pt-5">
                    <img className={styles.arrowImg} src="/HomeNoAuth/iconArrowDown.svg" alt="arrowImg" />
                </Col>
            </Row>
        </Container>
    </>
    )
}

export default PresentationSection