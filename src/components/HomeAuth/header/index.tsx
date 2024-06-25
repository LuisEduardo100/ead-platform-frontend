'use client';
import Modal from "react-modal";
import Link from 'next/link';
import styles from './styles.module.scss'
import { Container, Form, Input } from 'reactstrap'
import { useState } from "react";
import { useRouter } from "next/navigation";

const HeaderAuth = function () {
    // Modal.setAppElement('#next')

    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const handleOpenModal = () => {
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
    }

    const handleLogout = () => {
        sessionStorage.clear()
        router.push("/")
    }

    return (<>
        <div id="next" className={styles.divbackground}>
            <Container className={styles.nav}>
                <Link className={styles.linkStyle} href="/home">
                    <div className={styles.divLogo}>
                        <img src="/favicon.png" alt="logoFooter" className={styles.imgLogo} />
                        <h1 className={styles.tituloNav}>VOCÊ NOTA DEZ!</h1>
                    </div>
                </Link>
                <div className='d-flex align-items-center'>
                    <Form>
                        <Input name="search" id="search" placeholder="Buscar cursos" className={styles.searchbar} />
                    </Form>
                    <img src="/iconSearch.svg" alt="searchIcon" className={styles.searchIcon} />
                    <p className={styles.userProfile} onClick={handleOpenModal}>AB</p>
                </div>
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={handleCloseModal}
                    shouldCloseOnEsc={true}
                    className={styles.modal}
                    overlayClassName={styles.overlayModal}
                >
                    <Link href="/profile" className={styles.modalLink}>Meus Dados</Link>
                    <p className={styles.modalLink} onClick={handleLogout}>Sair</p>
                </Modal>
            </Container>
        </div>
    </>)
}

export default HeaderAuth