'use client';
import Modal from "react-modal";
import Link from 'next/link';
import styles from './styles.module.scss'
import { Button, Container, Form, Input } from 'reactstrap'
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";
import { Close, Search, SearchOutlined } from "@mui/icons-material";
import YearSelect from "../selectBox";

const HeaderAuth = function ({ selectedYear, onYearChange }: { selectedYear: string, onYearChange: (year: string) => void }) {
    // Modal.setAppElement('#next')
    const [searchName, setSearchName] = useState("")
    const [initials, setInitials] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [accessType, setAccessType] = useState(false);
    const [profilePicture, setProfilePicture] = useState("")
    const [expanded, setExpanded] = useState(false)
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

    const handleOpenSearch = () => {
        setExpanded(!expanded)
    };

    const handleSearchClick = () => {
        router.push(`/search?name=${searchName}`);
        setSearchName("");
    }
    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            const firstNameInitial = user.firstName.slice(0, 1);
            const lastNameInitial = user.lastName.slice(0, 1);
            setAccessType(user.hasFullAccess)
            setInitials(firstNameInitial + lastNameInitial);
            setProfilePicture(user.profileImage)
        });
    }, []);

    return (<>
        <div id="next" className={styles.divbackground}>
            <Container className={styles.nav}>
                <Link className={styles.linkStyle} href="/home">
                    <div className={styles.divLogo}>
                        <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                    </div>
                </Link>
                <div className='d-flex align-items-center justify-content-center gap-2 position-relative flex-wrap-reverse'>
                    {!accessType ?
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.divAccess}>
                                <p>PLANO GRATUITO</p>
                            </div>
                            <Link href="/precos" style={{ marginRight: '4px' }}>
                                <Button className={styles.btnPrecos}>MATRICULE-SE</Button>
                            </Link>
                        </div>
                        :
                        <div>
                            <div className={`${styles.divAccess} ${styles.premium}`}>
                                <p>PLANO COMPLETO</p>
                            </div>
                        </div>

                    }
                     <YearSelect selectedYear={selectedYear} onYearChange={onYearChange} />

                    <Form className={styles.formSearch} onSubmit={handleSearch}>
                        <Input
                            name="search"
                            id="search"
                            style={{
                                width: expanded ? '300px' : '0px',  // Expande a largura suavemente
                                transform: expanded ? 'scaleX(1)' : 'scaleX(0)',  // Controla a escala
                                transition: 'width 0.3s ease-in-out, transform 0.3s ease-in-out',  // Suaviza a transição
                                transformOrigin: 'right',  // O ponto de origem da escala é à esquerda
                                overflow: 'hidden',  // Evita que o conteúdo transborde 
                                userSelect: 'none'
                            }}
                            placeholder={expanded ? 'Pesquise um curso' : ''}
                            value={searchName}
                            onChange={(event) => {
                                setSearchName(event.currentTarget.value.toLowerCase())
                            }} />
                        {expanded ? (
                            <Close className={styles.searchIcon} onClick={handleOpenSearch} onDoubleClick={handleSearchClick} />
                        ) : (
                            <SearchOutlined
                                className={styles.searchIcon} onClick={handleOpenSearch} onDoubleClick={handleSearchClick}
                            />
                        )}
                    </Form>
                    {profilePicture ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                            alt="user picture"
                            className={styles.imageProfile}
                            onClick={handleOpenModal}
                        />
                    ) :
                        (<p className={styles.userProfile} onClick={handleOpenModal}>
                            {initials}
                        </p>)
                    }
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