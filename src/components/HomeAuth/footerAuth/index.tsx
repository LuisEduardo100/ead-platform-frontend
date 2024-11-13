import Link from 'next/link'
import styles from './styles.module.scss'
import { Container } from 'reactstrap'
import { Email, Instagram, WhatsApp } from '@mui/icons-material'
const FooterAuth = function () {
    return (<>
        <p className={styles.pFooter}>
            Copyright © 2024 - Reforço Escolar Nota Dez | Todos os direitos reservados
        </p>
    </>)
}

export default FooterAuth