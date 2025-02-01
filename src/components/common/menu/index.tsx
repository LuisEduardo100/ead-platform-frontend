'use client';
import { Menu, Close, Home, VideoLibrary, LibraryBooks, Help, School } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import styles from './styles.module.scss';
import { useMenu } from './menuProvider';
import Link from 'next/link';
import { useYear } from '../../HomeAuth/selectBox/yearProvider';
import YearSelect from '../../HomeAuth/selectBox';
import { useRouter } from 'next/navigation';

export default function Menuhamburger() {
    const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu() // Usa o contexto para controlar o estado do menu
    const { selectedYear, onYearChange } = useYear()
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1442;

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
            <div className={`${styles.menu} ${isMenuOpen ? styles.visible : styles.hidden}`}
            >
                <nav className={styles.nav}>
                    <ul>
                        <li onClick={handlePushHome}>
                            <Home fontSize='large' style={{ marginRight: '16px' }} />
                            Início
                        </li>
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
                        <li onClick={handlePushCourses}>
                            <VideoLibrary fontSize='large' style={{ marginRight: '16px' }} />
                            Todos os cursos
                        </li>
                        <li onClick={handlePushHandouts}>
                            <LibraryBooks fontSize='large' style={{ marginRight: '16px' }} />
                            Apostilas
                        </li>
                        <li onClick={handlePushSupport}>
                            <Help fontSize='large' style={{ marginRight: '16px' }} />
                            Suporte
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </>);
}
