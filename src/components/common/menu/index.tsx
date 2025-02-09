'use client';
import { Menu, Close, Home, VideoLibrary, LibraryBooks, Help, School, OndemandVideo, Payment } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.module.scss';
import { useMenu } from './menuProvider';
import Link from 'next/link';
import { useYear } from '../../HomeAuth/selectBox/yearProvider';
import YearSelect from '../../HomeAuth/selectBox';
import { useRouter } from 'next/navigation';

export default function Menuhamburger({ accessType }: { accessType: boolean }) {
    const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu() // Usa o contexto para controlar o estado do menu
    const { selectedYear, onYearChange } = useYear()
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1538;

            if (isLarge) {
                setIsMenuOpen(true);
            } else {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMenuOpen]);

    return (<>
        <div className={styles.menuContainer}>
            <div className={styles.menuLogo}>
                <Button onClick={toggleMenu} className={styles.menuButton}>
                    {isMenuOpen ? <Close /> : <Menu />}
                </Button>
                {isMenuOpen ? (
                    <Link className={`${styles.newLogo}`} href="/home">
                        <div className={styles.divLogo}>
                            <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                        </div>
                    </Link>
                ) : (
                    <Link className={`${styles.linkStyle}`} href="/home">
                        <div className={styles.divLogo}>
                            <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                        </div>
                    </Link>
                )}
            </div>
            <div className={`${styles.menu} ${isMenuOpen ? styles.visible : styles.hidden}`}>
                <nav className={styles.nav}>
                    <ul>
                        <li onClick={() => router.push('/home')}>
                            <Home fontSize='large' style={{ marginRight: '16px' }} />
                            Início
                        </li>
                        {!accessType && (
                            <>
                            <li onClick={() => {
                                sessionStorage.setItem("previousPage", window.location.pathname);
                                router.push(`/courses/${1}`)
                            }}>
                                <OndemandVideo fontSize='large' style={{ marginRight: '16px' }} />
                                Curso gratuito
                            </li>
                             <li onClick={() => {
                                sessionStorage.setItem("previousPage", window.location.pathname);
                                router.push(`/precos`)
                            }}>
                                <Payment fontSize='large' style={{ marginRight: '16px' }} />
                                Acesso completo
                            </li>
                            </>
                        )}
                        <li
                            className={styles.menuItemWithDropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <School fontSize='large' style={{ marginRight: '16px' }} />
                            {selectedYear}
                            {showDropdown && (
                                <ul className={styles.dropdownMenu}>
                                    {["6º ano", "7º ano", "8º ano", "9º ano"].map((year) => (
                                        <li
                                            key={year}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                onYearChange(year);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {year}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li onClick={() => router.push(`/todos-os-cursos?categoria=Matematica`)}>
                            <VideoLibrary fontSize='large' style={{ marginRight: '16px' }} />
                            Todos os cursos
                        </li>
                        <li onClick={() => router.push('/apostilas')}>
                            <LibraryBooks fontSize='large' style={{ marginRight: '16px' }} />
                            Apostilas
                        </li>
                        <li>
                            <Link
                                href={'https://wa.me/558594123487?text=Olá, gostaria de tirar uma dúvida.'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                                target='_blank'
                            >
                                <Help fontSize='large' style={{ marginRight: '16px' }} />
                                Suporte
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </>);
}
