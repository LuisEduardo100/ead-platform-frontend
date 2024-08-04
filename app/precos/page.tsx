'use client'

import Link from "next/link"
import { Button } from "reactstrap"
import styles from '../styles/precos.module.scss'
import ReactPlayer from "react-player"
import HeaderGeneric from "../../src/components/common/headerGeneric"
import ListCategories from "../../src/components/HomeAuth/listCategories"
import Footer from "../../src/components/common/footer"
import ListCategoriesForBranding from "../../src/components/common/listCategoriesForBranding"
export default function PaginaPrecos() {
    return (<>
        <main className={styles.backgroundContainer}>
            <HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar" />
            <div className={styles.apresentation}>
                <div className={styles.divAnuncio}>
                    <img className={styles.imgAnuncio} src="/anuncio-votanotadez.jpg" alt="anuncio" />
                    <Link href="https://pay.kiwify.com.br/IEvYanX">
                        <Button className={styles.btnMatricula}>
                            Matricule-se
                        </Button>
                    </Link>
                </div>
                <div className={styles.wrapper}>
                    <p className={styles.pWrapper}>Conheça tudo o que o Nota Dez oferece a você!</p>
                    <ReactPlayer
                        url="https://vimeo.com/994606159?share=copy"
                        controls
                        className={styles.reactPlayer}
                    />
                    <div className={styles.media}>
                        <p className={styles.pWrapper}>Fale conosco em nossas redes sociais: </p>

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
                </div>

            </div>
            <div className={styles.duvidas}>
                <p className={styles.pWrapper}>Dúvidas? Fale conosco! </p>
                <Link href="https://wa.me/85994174205">
                    <img src="/zapImg.png" alt="logoZap" className={styles.imgDuvidas} />
                </Link>
            </div>
            <div className={styles.separator}>
                <p className={styles.pSeparator}>Materiais personalizados com teoria e exercícios!</p>

                <img className={styles.capa1} src="/capa-ebooks/capaquimica1.png" alt="capa" />
                <img className={styles.capa2} src="/capa-ebooks/capa-quimica-2.png" alt="capa-2" />
                <img className={styles.capa3} src="/capa-ebooks/capa-quimica-3.png" alt="capa-2" />
            </div>
            <div className={styles.divTabela}>
                <p className={styles.pPropaganda}>Tenha acesso a um reforço completo, onde terá materiais personalizados e aulas preparadas para você ter o melhor desempenho na sula sala de aula!</p>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.trTitulo}>
                            <th className={styles.thTitulo}>GARANTA SEU ACESSO COMPLETO</th>
                        </tr>
                        <tr className={styles.trTitulo}>
                            <th className={styles.thPreco}><span className={styles.thPrecoSpan}>POR</span> R$ 69,90</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        <tr className={styles.trDiv}>
                            <img className={styles.checkImg} src="/check-img.png" alt="checked" />
                            <td className={styles.tdP}>Curso completo do básico ao avançado de Matemática, Química, Física;</td>
                        </tr>
                        <tr className={styles.trDiv}>
                            <img className={styles.checkImg} src="/check-img.png" alt="checked" />
                            <td className={styles.tdP}>Reforço personalizado de acordo com a necessidade do seu filho;</td>
                        </tr >
                        <tr className={styles.trDiv}>
                            <img className={styles.checkImg} src="/check-img.png" alt="checked" />
                            <td className={styles.tdP}>Materiais teóricos e práticos para reforçar sua aprendizagem;</td>
                        </tr>
                        <tr className={styles.trDiv}>
                            <img className={styles.checkImg} src="/check-img.png" alt="checked" />
                            <td className={styles.tdP}>Suporte humanizado, buscando solucionar seus problemas com a maior qualidade e eficiência possível;</td>
                        </tr>
                        <tr className={styles.trDiv}>
                            <img className={styles.checkImg} src="/check-img.png" alt="checked" />
                            <td className={styles.tdP}>Vamos até sua casa com professores especializados na matéria que você deseja ser Nota Dez!</td>
                        </tr>
                    </tbody>
                </table>
                <Link href="https://pay.kiwify.com.br/IEvYanX">
                    <Button className={styles.btnMatriculaPropaganda}>
                        Matricule-se
                    </Button>
                </Link>
            </div>
            <div className={styles.separator}>
                <p className={styles.pSeparator}>Materiais personalizados com teoria e exercícios!</p>

                <img className={styles.capa1} src="/capa-ebooks/capaquimica1.png" alt="capa" />
                <img className={styles.capa2} src="/capa-ebooks/capa-quimica-2.png" alt="capa-2" />
                <img className={styles.capa3} src="/capa-ebooks/capa-quimica-3.png" alt="capa-2" />
            </div>
            <div className={styles.cursosOfertados}>
                <p className={styles.pCursosOfertados}>Confira os cursos já disponíveis no Nota Dez!</p>
                <ListCategoriesForBranding />
            </div>
            <Footer />
        </main>
    </>)
}