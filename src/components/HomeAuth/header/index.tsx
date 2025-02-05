"use client";
import Modal from "react-modal";
import Link from "next/link";
import styles from "./styles.module.scss";
import { Button, Form, Input } from "reactstrap";
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
import PageSpinner from "../../common/pageSpinner";

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
    // Modal de perfil
    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Logout
    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/");
    };

    // Busca
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
        setSearchName("");
        setIsSearchOpen(false); // fecha a barra de busca mobile depois da pesquisa
    };

    // Quando clica no ícone de busca no header:
    // - Acima de 800px, a busca já está visível, então basta submeter o form ou focar no input.
    // - Abaixo de 800px, abrimos a barra de busca "mobile" (overlay).
    const handleSearchIconClick = () => {
        if (availableWidth <= 800) {
            setIsSearchOpen(true); // abre a barra de busca mobile
        }
        // Se quiser fazer algo acima de 800px, coloque aqui. 
        // Por exemplo, focar no input. Mas geralmente o form normal já está visível.
    };

    // Fecha a barra de busca mobile
    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };

    // Carrega dados do usuário
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

    if (loading) return <PageSpinner/>
    return (
        <div className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ""}`}>
            {/* Menu Hamburguer */}
            <Menuhamburger />

            {/** 
       * Acima de 800px: mostra o Form de busca normalmente no header.
       * Abaixo de 800px: não mostra (ou exibe via CSS display: none).
       */}
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
                        <SearchOutlined className={styles.searchIcon} onClick={(e) => handleSearch} />
                    )}
                </Form>
            )}


            {/** 
       * Perfil e (opcional) ícone de busca em telas menores
       */}
            <div className={styles.divProfile}>

                {/* Botão "MATRICULE-SE" caso não tenha acesso */}
                {!accessType && (
                    <Link href="/precos" style={{ marginRight: "4px" }}>
                        <Button className={styles.btnPrecos}>MATRICULE-SE</Button>
                    </Link>
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

            {/** 
       * Barra de busca "mobile" (overlay fixo) 
       * Só aparece se isSearchOpen === true e a tela <= 800px
       */}

        </div>
    );
}
