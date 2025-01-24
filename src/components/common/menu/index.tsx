'use client';
import { Menu, Close, Home, VideoLibrary, LibraryBooks, Help } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.module.scss';
import { useMenu } from './menuProvider';
import Link from 'next/link';
import { useYear } from '../../HomeAuth/selectBox/yearProvider';
import YearSelect from '../../HomeAuth/selectBox';
import profileService from '../../../services/profileService';
import { useRouter } from 'next/navigation';

export default function Menuhamburger() {
    const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu() // Usa o contexto para controlar o estado do menu
    const { selectedYear, onYearChange } = useYear()
    const router = useRouter()
    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1442;

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

    const handlePushHome = () => {
        router.push('/home')
    }

    const handlePushCourses = () => {
        router.push('')
    }

    const handlePushHandouts = () => {
        router.push('/apostilas')
    }

    const handlePushSupport = () => {
        router.push('')
    }

    return (<>
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
                        <div style={{ padding: '15px 0px', textAlign: 'center' }}>
                            <YearSelect selectedYear={selectedYear} onYearChange={onYearChange} />
                        </div>
                        <li onClick={handlePushHome}>
                            <Home fontSize='large' style={{ marginRight: '10px' }} />
                            Início
                        </li>
                        <li onClick={handlePushCourses}>
                            <VideoLibrary fontSize='large' style={{ marginRight: '10px' }} />
                            Todos os cursos
                        </li>
                        <li onClick={handlePushHandouts}>
                            <LibraryBooks fontSize='large' style={{ marginRight: '10px' }} />
                           Apostilas
                        </li>
                        <li onClick={handlePushSupport}>
                            <Help fontSize='large' style={{ marginRight: '10px' }} />
                            Suporte
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </>);
}
