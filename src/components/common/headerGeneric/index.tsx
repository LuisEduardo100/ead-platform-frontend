'use client';
import { Button, Container } from "reactstrap";
import styles from "./styles.module.scss";
import Link from "next/link";

interface props {
    logoUrl: string;
    btnUrl: string;
    btnContent: string;
}
const HeaderGeneric = function ({btnContent, btnUrl, logoUrl}: props) {
    return (
        <>
            <div className={styles.backgroundContainer}>
                <Container className={styles.containerHeader}>
                        <Link href={logoUrl} className={styles.linkStyle}>
                            <div className={styles.divLogo}>
                                <img src="/favicon.png" alt="logoFooter" className={styles.imgLogo} />
                                <h1 className={styles.tituloNav}>VOCÊ NOTA DEZ!</h1>
                            </div>
                        </Link>
                        <Link href={btnUrl}>
                            <Button outline color="light" className={styles.headerBtn}>{btnContent}</Button>
                        </Link>
                </Container>
            </div>
        </>
    )
};

export default HeaderGeneric;