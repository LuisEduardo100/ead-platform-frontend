'use client'

import Link from "next/link"
import styles from '../styles/precos.module.scss'
import ReactPlayer from "react-player"
import Footer from "../../src/components/common/footer"
import PaymentButton from "../../src/components/common/precos/paymentButton"
import HeaderNoAuth from "../../src/components/HomeNoAuth/header"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import HeaderGeneric from "../../src/components/common/headerGeneric"
import Image from "next/image"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { stripeService } from "../../src/services/stripeService"
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function PaginaPrecos() {
    const [logged, setLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const params = useSearchParams()

    const handlePayment = async () => {

        setLoading(true);
        const registerSuccess = params.get("newuserbuy")

        if (registerSuccess === 'true') {
            return router.push('/login?newuserbuy=true')
        }

        if (!sessionStorage.getItem("vocenotadez-token")) {
            return router.push('/register?newuser=true')
        }

        try {
            const response = await stripeService.checkoutSessionLink();
            const { url } = response;

            if (url) {
                location.href = url
                setLoading(false);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("vocenotadez-token")) {
            setLogged(true)
            router.refresh()
        }
    }, [router])

    return (
        <main className={styles.mainContainer}>
            {logged ? (
                <HeaderGeneric btnContent="Voltar" btnUrl="/home" logoUrl="/logo-vocenotadez.png" />
            ) : (
                <HeaderNoAuth />
            )}

            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.videoWrapper}>
                        <ReactPlayer
                            url="https://vimeo.com/994606159?share=copy"
                            controls
                            width="100%"
                            height="100%"
                            playing={true} // Adiciona o atributo playing com valor true
                            muted={false} // Adiciona o atributo muted com valor false
                            config={{
                                vimeo: {
                                    playerOptions: {
                                        controls: true,
                                        quality: '1080p',
                                        byline: false,
                                        portrait: false,
                                        title: false,
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className={styles.investimentoSection} id="propaganda">
                        <Image
                            src="/destaque/propaganda.jpg"
                            alt="Alunos satisfeitos"
                            width={600}
                            height={400}
                            className={styles.propagandaImage}
                        />

                        <div className={styles.beneficiosLista}>
                            <h2 className={styles.investimentoTitle}>
                                <SchoolIcon className={styles.priceIcon} />
                                Investimento no Conhecimento
                            </h2>

                            <div className={styles.priceOption}>
                                <h3>Parcelado</h3>
                                <p className={styles.price} style={{ fontFamily: 'font-family: Bebas Neue, sans-serif' }}>12x R$ 29,90</p>
                                <span className={styles.observation}>(Total R$ 358,80)</span>
                            </div>

                            <ul className={styles.beneficios}>
                                <li><CheckCircleIcon /> Curso completo de todas as materias</li>
                                <li><CheckCircleIcon /> Conteúdo do 6º ao 9º ano completo</li>
                                <li><CheckCircleIcon /> Plataforma de reforço online intuitiva</li>
                                <li><CheckCircleIcon /> Acompanhamento personalizado</li>
                                <li><CheckCircleIcon /> Material de apoio com teoria e exercícios</li>
                                <li><CheckCircleIcon /> Revisões objetivas</li>
                                <li><CheckCircleIcon /> Aulas com exercícios resolvidos</li>
                                <li><CheckCircleIcon /> Material complementar em PDF</li>
                            </ul>

                            <button
                                className={styles.paymentButton}
                                onClick={handlePayment}
                            >
                                QUERO ME MATRICULAR AGORA
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.materialsSection}>
                <h2 className={styles.sectionTitle}>Conteúdo Exclusivo</h2>
                <div className={styles.materialsFlex}>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className={styles.materialCard}>
                            <Image
                                src={`/ebooks/${num}.png`}
                                alt={`Material didático ${num}`}
                                width={300}
                                height={420}
                                quality={100}
                                className={styles.materialImage}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.benefitsSection}>
                <div className={styles.benefitsContent}>
                    <div className={styles.benefitsText}>
                        <h2 className={styles.sectionTitle}>
                            Você sabe a importância do reforço escolar para o sucesso acadêmico do seu filho?
                        </h2>

                        <div className={styles.benefitsDescription}>
                            <p>O reforço escolar vai além de melhorar notas:</p>

                            <ul className={styles.benefitsList}>
                                <li><CheckCircleIcon className={styles.benefitIcon} />Constrói uma base sólida de conhecimento</li>
                                <li><CheckCircleIcon className={styles.benefitIcon} />Desenvolve autonomia nos estudos</li>
                                <li><CheckCircleIcon className={styles.benefitIcon} />Aumenta a confiança do aluno</li>
                            </ul>

                            <p className={styles.highlightText}>
                                Com o acompanhamento certo, seu filho pode superar dificuldades e alcançar todo seu potencial!
                            </p>
                        </div>

                        <button
                            className={styles.ctaButton}
                        >
                            <Link href="#propaganda" style={{ textDecoration: 'none', color: 'inherit' }}>
                                QUERO ME MATRICULAR AGORA
                            </Link>
                        </button>
                    </div>

                    <Image
                        src="/destaque/foto-destaque1.jpg"
                        alt="Aluno feliz estudando"
                        width={630}
                        height={450}
                        className={styles.benefitsImage}
                    />
                </div>
            </section>

            <section className={styles.metodoSection}>
                <h2 className={styles.metodoTitle}>O <strong>Método Nota Dez</strong> de ensino é para adolescentes que querem:</h2>

                <div className={styles.metodoGrid}>
                    {[
                        {
                            icon: <EmojiEventsIcon fontSize="large" />,
                            title: "Superar as dificuldades escolares",
                            text: "Deixar para trás as notas baixas e entender de verdade as matérias que mais causam frustração."
                        },
                        {
                            icon: <SelfImprovementIcon fontSize="large" />,
                            title: "Recuperar a autoestima nos estudos",
                            text: "Sentir-se mais confiante ao ver o progresso e perceber que é capaz de superar os desafios escolares."
                        },
                        {
                            icon: <SchoolIcon fontSize="large" />,
                            title: "Ter apoio nas matérias mais complicadas",
                            text: "Contar com professores especializados que explicam de forma clara e fácil aquilo que parecia impossível."
                        },
                        {
                            icon: <ScheduleIcon fontSize="large" />,
                            title: "Melhorar o foco e a organização",
                            text: "Aprender a estudar de forma eficiente, organizando o tempo e os conteúdos, sem acumular matéria."
                        },
                        {
                            icon: <AssignmentIcon fontSize="large" />,
                            title: "Sentir-se preparado para provas e exames",
                            text: "Ganhar segurança e estar pronto para enfrentar provas sem o medo do fracasso."
                        },
                        {
                            icon: <PersonPinIcon fontSize="large" />,
                            title: "Receber um ensino personalizado",
                            text: "Ter aulas adaptadas às suas necessidades, focando nas suas maiores dificuldades e no seu ritmo."
                        },
                        {
                            icon: <TrendingUpIcon fontSize="large" />,
                            title: "Ver resultados concretos nas notas",
                            text: "Observar melhorias reais e consistentes nas notas, com impacto direto no rendimento escolar em casa."
                        }
                    ].map((card, index) => (
                        <div key={index} className={styles.metodoCard}>
                            <div className={styles.cardIcon}>{card.icon}</div>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardText}>{card.text}</p>
                        </div>
                    ))}
                </div>

                <button
                    className={styles.metodoButton}
                >
                    <Link href="#propaganda" style={{ textDecoration: 'none', color: 'inherit' }}>
                        QUERO ME MATRICULAR AGORA
                    </Link>
                </button>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaBox}>
                    <SupportAgentIcon className={styles.ctaIcon} />
                    <h2>Ainda com Dúvidas?</h2>
                    <p>Fale diretamente com nossa equipe</p>
                    <Link
                        href="https://wa.me/558594123487"
                        className={styles.whatsappButton}
                        target="_blank"
                    >
                        <Image
                            src="/zapImg.png"
                            alt="WhatsApp"
                            width={24}
                            height={24}
                        />
                        Chamar no WhatsApp
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}