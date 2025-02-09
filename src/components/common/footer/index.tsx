import Link from 'next/link'
import styles from './styles.module.scss'
import { Container } from 'reactstrap'
import { Email, Instagram, WhatsApp } from '@mui/icons-material'
const Footer = function () {
    return (<>
        <div className={styles.footer}>
            <div className={styles.logo_div}>
                <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
                <p className={styles.logo_p}>+ 400 ALUNOS SATISFEITOS!</p>
            </div>
            <div className={styles.quemsomos}>
                <h3 className={styles.quemsomos_title}>Quem somos</h3>
                <p className={styles.quemsomos_p}>
                    Somos uma empresa especializada em reforço e
                    acompanhamento escolar para adolescentes.
                    Com professores experientes e material didático de qualidade.
                </p>
            </div>
            <div className={styles.contato}>
                <h3 className={styles.contato_title}>Informações de contato</h3>
                <Link href={'tel:558594123487'} target="_blank" className={styles.contato_info}>
                    <WhatsApp className={styles.logo_media} fontSize='medium' />
                    <p className={styles.contato_info_p}>+55 (85) 9412-3487</p>
                </Link>
                <Link href={'mailto:somosnotadez@gmail.com'} target="_blank" className={styles.contato_info}>
                    <Email className={styles.logo_media} fontSize='medium' />
                    <p className={styles.contato_info_p}>somosnotadez@gmail.com</p>
                </Link>
                <Link href={'https://instagram.com/vocenotadez'} target="_blank" className={styles.contato_info}>
                    <Instagram className={styles.logo_media} fontSize='medium' />
                    <p className={styles.contato_info_p}>@vocenotadez</p>
                </Link>
            </div>
        </div>
        <p className={styles.pFooter}>
            Copyright © 2025 - Reforço Escolar Nota Dez | Todos os direitos reservados
        </p>
    </>)
}

export default Footer