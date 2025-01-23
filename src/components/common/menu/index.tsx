'use client';
import { Menu, Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.module.scss';
import { useMenu } from './menuProvider';
import Link from 'next/link';

export default function Menuhamburger() {
    const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu() // Usa o contexto para controlar o estado do menu
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1321;
            setIsLargeScreen(isLarge);

            // Se for tela grande, o menu deve estar visível.
            if (isLarge) {
                setIsMenuOpen(true); // Usa o método do contexto para abrir o menu
            } else {
                setIsMenuOpen(false); // Fecha o menu em telas menores
            }
        };

        // Configura o listener para detectar mudanças de tamanho de tela
        window.addEventListener('resize', handleResize);

        // Chamada inicial para definir o estado corretamente
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMenuOpen]); // Adiciona dependência para evitar problemas com closures

    return (
        <div className={styles.menuContainer}>
            {/* Botão de menu visível sempre */}
            <div className={styles.menuLogo}>
                <Button onClick={toggleMenu} className={styles.menuButton}>
                    {isMenuOpen ? <Close /> : <Menu />}
                </Button>
                <Link className={`${styles.linkStyle} ${isMenuOpen ? styles.newLogo : ''}`} href="/home">
                    <div className={styles.divLogo}>
                        <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                    </div>
                </Link>
            </div>

            {/* Menu lateral */}
            <div
                className={`${styles.menu} ${isMenuOpen ? styles.visible : styles.hidden
                    }`}
            >
                <nav>
                    <ul>
                        {/* NÃO VAI TER PLANO COMPLETO - 
                        CASO O USUÁRIO N ESTIVER CADASTRADO
                        VOU COLOCAR O BOTÃO MATRICULE-SE */}
                        <li><a href="#">Série</a></li>
                        <li><a href="#">Início</a></li>
                        <li><a href="#">Apostilas</a></li>
                        <li><a href="#">Inscrições</a></li>
                        <li><a href="#">Histórico</a></li>
                        <li><a href="#">Playlists</a></li>
                        <li><a href="#">Seus vídeos</a></li>
                        <li><a href="#">Seus cursos</a></li>
                        <li><a href="#">Assistir mais tarde</a></li>
                        <li><a href="#">Vídeos com 'Gostei'</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
