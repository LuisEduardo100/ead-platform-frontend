'use client';
import Modal from "react-modal";
import Link from 'next/link';
import styles from './styles.module.scss'
import { Button, Container, Form, Input } from 'reactstrap'
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";

const HeaderAuth = function () {
    // Modal.setAppElement('#next')
    const [searchName, setSearchName] = useState("")
    const [initials, setInitials] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [accessType, setAccessType] = useState(false);
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

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.push(`/search?name=${searchName}`);
        setSearchName("");
    };

    const handleSearchClick = () => {
        router.push(`/search?name=${searchName}`);
        setSearchName("");
    };

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            const firstNameInitial = user.firstName.slice(0, 1);
            const lastNameInitial = user.lastName.slice(0, 1);
            setAccessType(user.hasFullAccess)
            setInitials(firstNameInitial + lastNameInitial);
        });
    }, [accessType]);

    return (<>
        <div id="next" className={styles.divbackground}>
            <Container className={styles.nav}>
                <Link className={styles.linkStyle} href="/home">
                    <div className={styles.divLogo}>
                        <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                    </div>
                </Link>
                <div className="d-flex align-items-center">
                    <p>Seu nível de acesso: {accessType ? 'Premium' : 'Free'}</p>
                </div>
                <div className='d-flex align-items-center gap-2'>
                <Link href="/precos">
                    <Button className={styles.btnPrecos}>PREÇOS</Button>
                </Link>
                    <Form onSubmit={handleSearch}>
                        <Input
                            name="search"
                            id="search"
                            placeholder="Buscar cursos"
                            className={styles.searchbar}
                            value={searchName}
                            onChange={(event) => {
                                setSearchName(event.currentTarget.value.toLowerCase())
                            }} />
                    </Form>
                    <img src="/iconSearch.svg" alt="searchIcon" className={styles.searchIcon} onClick={handleSearchClick} />
                    <p className={styles.userProfile} onClick={handleOpenModal}>{initials}</p>
                    
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