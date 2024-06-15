'use client';

import "../../../../app/styles/icons.module.scss"
import Link from 'next/link'
import styles from './styles.module.scss'
import { Button, Container } from 'reactstrap'

const HeaderNoAuth = function () {
    return (
        <>
            <div className={styles.backgroundContainer}>
                <Container className={styles.containerHeader}>
                    <div className={styles.divLogo}>
                        <img src="/favicon.png" alt="logoFooter" className={styles.imgLogo} />
                        <h1 className={styles.tituloNav}>VOCÊ NOTA DEZ!</h1>
                    </div>
                    <div className={styles.divBtn}>
                        <Link href="/register">
                            <Button className={styles.btnAssine} outline>ASSINE</Button>
                        </Link>
                        <Link href="/login">
                            <Button className={styles.btnSouNotaDez}>SOU NOTA DEZ<span className={styles.fixingIconInMiddle}><i className="material-symbols-outlined">login</i></span></Button>
                        </Link>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default HeaderNoAuth