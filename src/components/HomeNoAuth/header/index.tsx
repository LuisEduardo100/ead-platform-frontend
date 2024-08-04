'use client';
import Link from 'next/link'
import styles from './styles.module.scss'
import { Button, Container } from 'reactstrap'

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
                            <Button className={styles.btnPrecos}>PREÇOS</Button>
                        </Link>
                        <Link href="/register">
                            <Button className={styles.btnAssine} outline>REGISTRE-SE</Button>
                        </Link>
                        <Link href="/login">
                            <Button className={styles.btnSouNotaDez}>ENTRAR</Button>
                        </Link>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default HeaderNoAuth