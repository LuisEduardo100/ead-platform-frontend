'use client';
import Modal from "react-modal";
import Link from 'next/link';
import styles from './styles.module.scss'
import { Button, Container, Form, Input } from 'reactstrap'
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";
import { AccountCircle, Close, Logout, Save, Search, SearchOutlined } from "@mui/icons-material";
import { useYear } from "../selectBox/yearProvider";
import Menuhamburger from "../../common/menu";
import { useMenu } from "../../common/menu/menuProvider";
import Image from "next/image";

export default function HeaderAuth() {
    // Modal.setAppElement('#next')
    const { selectedYear, onYearChange } = useYear()
    const [searchName, setSearchName] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [accessType, setAccessType] = useState(false);
    const [profilePicture, setProfilePicture] = useState("")
    const router = useRouter();
    const { isMenuOpen } = useMenu()
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
            <div className="divProfile">
                {!accessType &&
                    <Link href="/precos" style={{ marginRight: '4px' }}>
                        <Button className={styles.btnPrecos}>MATRICULE-SE</Button>
                    </Link>
                }
                {profilePicture ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                        alt="user picture"
                        className={styles.imageProfile}
                        onClick={handleOpenModal}
                        width={45}
                        height={45}
                    />
                ) :
                    (<AccountCircle className={styles.userProfile} fontSize="small" onClick={handleOpenModal} />)
                }
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={handleCloseModal}
                    shouldCloseOnEsc={true}
                    className={styles.modal}
                    overlayClassName={styles.overlayModal}
                    style={{
                        content: {
                            position: 'absolute',
                            top: '10%', // Posiciona o modal abaixo da divProfile
                            right: '3%', // Alinha o modal à direita da divProfile
                        }
                    }}
                >
                    <Link href="/profile" className={styles.modalLink}>
                        <Save fontSize="medium" style={{ marginRight: '10px' }} />
                        Meus Dados
                    </Link>
                    <p className={styles.modalLink} onClick={handleLogout}>
                        <Logout fontSize="medium" style={{ marginRight: '10px'}} />
                        Sair
                    </p>
                </Modal>
            </div>
        </div>
    )
}

