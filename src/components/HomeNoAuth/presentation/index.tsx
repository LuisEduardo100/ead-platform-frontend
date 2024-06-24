'use client';
import { Col, Row, Button, Container, Input, Form } from 'reactstrap'
import styles from './styles.module.scss'

const PresentationSection = function () {
    return (
        <>
            <Container className="py-5">
                <Row className='py-3'>
                    <Col md className="d-flex flex-column justify-items-center align-items-center">
                        <p className={styles.comentario}>UM REFORÇO COMPLETO</p>
                        <p className={styles.titulo}>SE TORNE O (A) MAIS INTELIGENTE DA SALA</p>
                        <p className={styles.descricao}>
                            AULAS, EXERÍCIOS, RESUMOS, ESTRATÉGIAS E SEGREDOS PARA VOCÊ SER NOTA DEZ!
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md className="d-flex justify-content-center pt-4">
                        <Form>
                            <Input name="search" id="search" placeholder="Buscar cursos" className={styles.searchbar} />
                        </Form>
                        <img src="/iconSearch.svg" alt="searchIcon" className={styles.searchIcon}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default PresentationSection