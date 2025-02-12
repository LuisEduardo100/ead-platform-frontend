"use client";
import Modal from "react-modal";
import Link from "next/link";
import styles from "./styles.module.scss";
import { Form, Input } from "reactstrap";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileService from "../../../services/profileService";
import {
    AccountCircle,
    Close as CloseIcon,
    Logout,
    Save,
    SearchOutlined
} from "@mui/icons-material";
import { useYear } from "../selectBox/yearProvider";
import Menuhamburger from "../../common/menu";
import { useMenu } from "../../common/menu/menuProvider";
import Image from "next/image";
import PaymentButton from "../../common/precos/paymentButton";

export default function HeaderAuth() {
    const { selectedYear } = useYear();
    const [searchName, setSearchName] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [accessType, setAccessType] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // controla a barra de busca em telas pequenas
    const [profilePicture, setProfilePicture] = useState("");
    const [availableWidth, setAvailableWidth] = useState(0);
    const router = useRouter();
    const { isMenuOpen } = useMenu();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const intervalID = setInterval(() => {
            setLoading(false);
        }, 300)
        return () => clearInterval(intervalID)
    }, [])

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/");
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
        setSearchName("");
        setIsSearchOpen(false);
    };
    const handleSearchG = () => {
        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
    };

    const handleSearchIconClick = () => {
        if (availableWidth <= 800) {
            setIsSearchOpen(true);
        }
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setAccessType(user.hasFullAccess);
            setProfilePicture(user.profileImage);
        });
    }, []);

    // Monitora a largura da tela
    useEffect(() => {
        const getAvailableWidth = () => setAvailableWidth(window.innerWidth);

        window.addEventListener("resize", getAvailableWidth);
        getAvailableWidth();

        return () => window.removeEventListener("resize", getAvailableWidth);
    }, []);

    return (
        <div className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ""}`}>
            {/* Menu Hamburguer */}
            <Menuhamburger accessType={accessType} />
            {!loading && (
                <>
                    {availableWidth > 800 && (
                        <Form className={`${styles.formSearch} ${isSearchOpen ? styles.formSearchOpen : ''}`} onSubmit={handleSearch}>
                            <Input
                                name="search"
                                id="search"
                                className={styles.inputSearch}
                                placeholder="Buscar curso"
                                value={searchName}
                                onChange={(e) => setSearchName(e.currentTarget.value.toLowerCase())}
                            />
                            {!isSearchOpen && (
                                <SearchOutlined className={styles.searchIcon} onClick={handleSearchG} />
                            )}
                        </Form>
                    )}
                    <div className={styles.divProfile}>
                        {!accessType && (
                            <PaymentButton />
                        )}
                        {availableWidth <= 800 && !isSearchOpen && (
                            <SearchOutlined
                                style={{ marginRight: "10px", cursor: "pointer", fontSize: "2.2rem" }}
                                onClick={handleSearchIconClick}
                            />
                        )}
                        {isSearchOpen && availableWidth <= 800 && !isMenuOpen && (
                            <div className={styles.searchOverlay}>
                                <Form className={styles.mobileSearchForm} onSubmit={handleSearch}>
                                    <Input
                                        name="search"
                                        id="search-mobile"
                                        placeholder="Buscar curso"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.currentTarget.value.toLowerCase())}
                                    />
                                    {/* Ícone de busca para submeter */}
                                    <div className={styles.iconDiv}>
                                        <SearchOutlined
                                            className={styles.iconAction}
                                            onClick={() => {
                                                router.push(`/search?name=${searchName}&serie=${selectedYear}`);
                                                setSearchName("");
                                                setIsSearchOpen(false);
                                            }}
                                        />
                                        <CloseIcon className={styles.iconAction} onClick={handleCloseSearch} />
                                    </div>
                                </Form>
                            </div>
                        )}
                        {/* Imagem ou ícone de perfil */}
                        {profilePicture ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASEURL}/${profilePicture}`}
                                alt="user picture"
                                className={styles.imageProfile}
                                onClick={handleOpenModal}
                                width={45}
                                height={45}
                            />
                        ) : (
                            <AccountCircle
                                className={styles.userProfile}
                                fontSize="small"
                                onClick={handleOpenModal}
                            />
                        )}

                        {/** 
                {/* Modal de perfil */}
                        <Modal
                            isOpen={modalOpen}
                            appElement={document.getElementById('__next')!}
                            onRequestClose={handleCloseModal}
                            shouldCloseOnEsc={true}
                            className={styles.modal}
                            overlayClassName={styles.overlayModal}
                            style={{
                                content: {
                                    position: "absolute",
                                    top: "12%",
                                    right: "3%"
                                }
                            }}
                        >
                            <Link href="/profile" className={styles.modalLink}>
                                <Save fontSize="medium" style={{ marginRight: "10px" }} />
                                Meus Dados
                            </Link>
                            <p className={styles.modalLink} onClick={handleLogout}>
                                <Logout fontSize="medium" style={{ marginRight: "10px" }} />
                                Sair
                            </p>
                        </Modal>
                    </div>
                </>
            )}
        </div>
    );
}
