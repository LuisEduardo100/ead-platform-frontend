import Link from 'next/link'
import styles from './styles.module.scss'
import { Container } from 'reactstrap'
const Footer = function () {
    return (<>
        <Container className={styles.footer}>
            <div>
                <img src="/favicon.png" alt="logoFooter" className={styles.imgLogo} />
                <p className={styles.pLogo}>VOCÊ NOTA DEZ!</p>
            </div>
            <div className={styles.media}>
                <Link href="https://www.tiktok.com/@vocenotadez">
                    <img src="/tiktokImg.png" alt="logoTiktok" className={styles.imgFooter} />
                </Link>
                <Link href="https://www.instagram.com/vocenotadez/">
                    <img src="/instagramImg.png" alt="logoInsta" className={styles.imgFooter} />
                </Link>
                <Link href="https://wa.me/85994174205">
                    <img src="/zapImg.png" alt="logoZap" className={styles.imgFooter} />
                </Link>
            </div>
        </Container>
        <p className={styles.pFooter}>Criado por Gabriel de Sousa</p>

    </>)
}

export default Footer