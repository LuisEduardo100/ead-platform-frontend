'use client';
import Link from 'next/link'
import styles from './styles.module.scss'
import { Button, Container } from 'reactstrap'
import { Login } from '@mui/icons-material';

const HeaderNoAuth = function () {
    return (
        <>
            <div className={styles.bgdiv}>
                <Container className={styles.containerHeader}>
                    <div className={styles.divLogo}>
                        <Link href="/">
                            <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                        </Link>
                    </div>
                    <div className={styles.divBtn}>
                        <Link href="/precos">
                            <Button className={styles.btnPrecos} outline>PREÇOS</Button>
                        </Link>
                        <Link href="/register">
                            <Button className={styles.btnAssine} outline>REGISTRE-SE</Button>
                        </Link>
                        <Link href="/login" className={styles.linkstyle}>
                            <Button className={styles.btnSouNotaDez} outline>
                                ENTRAR
                                <Login fontSize={'small'} style={{marginLeft: "5px"}}/>
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default HeaderNoAuth