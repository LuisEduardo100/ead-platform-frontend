'use client';
import Modal from "react-modal";
import Link from 'next/link';
import styles from './styles.module.scss'
import { Button, Container, Form, Input } from 'reactstrap'
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";
import { AccountCircle, Close, Search, SearchOutlined } from "@mui/icons-material";
import { useYear } from "../selectBox/yearProvider";
import Menuhamburger from "../../common/menu";
import { useMenu } from "../../common/menu/menuProvider";

export default function HeaderAuth() {
    // Modal.setAppElement('#next')
    const { selectedYear, onYearChange } = useYear()
    const [searchName, setSearchName] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [accessType, setAccessType] = useState(false);
    const [profilePicture, setProfilePicture] = useState("")
    const router = useRouter();
    const {isMenuOpen} = useMenu()
    const handleOpenModal = () => {
        setModalOpen(!modalOpen)
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

        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
        setSearchName("");
    };

    const handleSearchClick = () => {
        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
        setSearchName("");
    }

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setAccessType(user.hasFullAccess)
            setProfilePicture(user.profileImage)
        });
    }, []);

    return (
        <div className={`${styles.header}`}>
            <Menuhamburger />
            {isMenuOpen && (window.innerWidth <= 1442) && <div className={styles.divSpace}></div>}
            <Form className={styles.formSearch} onSubmit={handleSearch}>
                <Input
                    name="search"
                    id="search"
                    className={styles.inputSearch}
                    placeholder='Buscar curso'
                    value={searchName}
                    onChange={(event) => {
                        setSearchName(event.currentTarget.value.toLowerCase())
                    }} />
                <SearchOutlined
                    className={`${styles.searchIcon}`}
                    onClick={handleSearchClick}
                />
            </Form>
            <div>
                {!accessType &&
                    <Link href="/precos" style={{ marginRight: '4px' }}>
                        <Button className={styles.btnPrecos}>MATRICULE-SE</Button>
                    </Link>
                }
                {profilePicture ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                        alt="user picture"
                        className={styles.imageProfile}
                        onClick={handleOpenModal}
                    />
                ) :
                    (<AccountCircle className={styles.userProfile} fontSize="small" onClick={handleOpenModal} />)
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
        </div>
    )
}

