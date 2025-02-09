'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import episodeFileService from '../../../../src/services/episodeFileService';
import { CourseType, EpisodeFileType, EpisodeTypeAdapted } from '../../../../src/services/courseService';
import { CategoryType } from '../../../../src/services/categoriesService';
import Link from 'next/link';
import styles from '../../../styles/topicStyle.module.scss';
import HeaderAuth from '../../../../src/components/HomeAuth/header';
import HandoutNavigation from '../../../../src/components/common/navigationHandouts';
import { useMenu } from '../../../../src/components/common/menu/menuProvider';
import PdfThumbnail from '../../../../src/components/common/pdfThumbnail';
import FooterAuth from '../../../../src/components/HomeAuth/footerAuth';
import profileService from '../../../../src/services/profileService';
import ToastComponent from '../../../../src/components/common/toastComponent';

export default function TopicPage() {
    const { topic } = useParams();
    const [files, setFiles] = useState<EpisodeFileType[]>([]);
    const [course, setCourse] = useState<CourseType>();
    const { isMenuOpen } = useMenu();
    const [hasFullAccess, setHasFullAccess] = useState(false);
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await profileService.fetchCurrent();
                setHasFullAccess(userData.hasFullAccess);
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário:", error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const getFiles = async () => {
            try {
                const response = await episodeFileService.getAllFiles();
                console.log("Dados recebidos da API:", response.data);

                if (!response || !response.data) {
                    console.error("Nenhum dado recebido!");
                    return;
                }

                const decodedTopic = decodeURIComponent(String(topic));
                console.log("Valor decodificado de topic:", decodedTopic);

                const course = response.data
                    .flatMap((category: CategoryType) => category.courses || [])
                    .find((course: CourseType) => course.id === parseInt(decodedTopic, 10));

                if (!course) {
                    console.warn("Curso não encontrado para o ID:", decodedTopic);
                    return;
                }

                console.log("Curso encontrado:", course);
                setCourse(course);
                const allFiles = course.episodes.flatMap((episode: EpisodeTypeAdapted) => episode.files || []);
                console.log("Arquivos encontrados:", allFiles);
                setFiles(allFiles);
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
            }
        };

        getFiles();
    }, [topic]);

    // Função para exibir o toast quando o usuário free clicar no arquivo
    const handleDeniedClick = () => {
        setToastColor("bg-danger");
        setToastMessage("Acesso negado. Faça a matrícula.");
        setToastIsOpen(true);
        setTimeout(() => setToastIsOpen(false), 3000);
    };

    return (
        <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
            <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
            <HeaderAuth />
            <div className={styles.mainContent}>
                <HandoutNavigation topic={String(course?.name)} serie={String(course?.serie)} />
                <ul className={styles.ulDiv}>
                    {files.length > 0 ? (
                        files.map((file) => (
                            <li className={styles.liDiv} key={file.id}>
                                {file.url && file.url.length > 0 ? (
                                    hasFullAccess ? (
                                        // Se o usuário tiver acesso, renderiza o Link normalmente
                                        <>
                                            <Link
                                                className={styles.linkStyle}
                                                href={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url[0]}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <PdfThumbnail url={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url[0]}`} />
                                                <span className={styles.fileName}>{file.name}</span>
                                            </Link>
                                            <span className={styles.nameTip}>{file.name}</span>
                                        </>
                                    ) : (
                                        // Se o usuário não tiver acesso, renderiza um elemento desativado que dispara o toast ao clicar
                                        <>
                                            <div
                                                className={styles.disabledLink}
                                                onClick={handleDeniedClick}
                                                style={{
                                                    cursor: 'not-allowed',
                                                    opacity: 0.6,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <PdfThumbnail url={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url[0]}`} />
                                                <span className={styles.fileName}>{file.name}</span>
                                            </div>
                                            <span className={styles.nameTip}>{file.name}</span>
                                        </>
                                    )
                                ) : (
                                    <div>URL não disponível</div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li>Nenhum arquivo encontrado</li>
                    )}
                </ul>
            </div>
            <FooterAuth />
        </main>
    );
}
