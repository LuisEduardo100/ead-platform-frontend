import Head from 'next/head'
import styles from '../styles/register.module.scss'
import HeaderGeneric from '../../src/components/common/headerGeneric'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "VoceNotaDez - Registro"
}
const Register = function(){
    return (
        <>
         <Head>
            <title>VoceNotaDez - Registro</title>
         </Head>
         <main>
            <HeaderGeneric logoUrl='/' btnUrl='/login' btnContent='JÁ SOU NOTA DEZ'/>
         </main>
        </>
    )
}
export default Register