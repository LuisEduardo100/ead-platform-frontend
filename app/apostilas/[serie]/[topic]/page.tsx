'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import episodeFileService from '../../../../src/services/episodeFileService';
import { CourseType, EpisodeFileType, EpisodeType, EpisodeTypeAdapted } from '../../../../src/services/courseService';
import { CategoryType } from '../../../../src/services/categoriesService';
import Link from 'next/link';
import styles from '../../../styles/topicStyle.module.scss'
import HeaderAuth from '../../../../src/components/HomeAuth/header';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HandoutNavigation from '../../../../src/components/common/navigationHandouts';
import { useMenu } from '../../../../src/components/common/menu/menuProvider';
import PdfThumbnail from '../../../../src/components/common/pdfThumbnail';
export default function TopicPage() {
    const { topic } = useParams(); // Obtém o parâmetro da URL dinâmica
    const [files, setFiles] = useState<EpisodeFileType[]>([]); // Estado para armazenar arquivos
    const [course, setCourse] = useState<CourseType>(); // Estado para armazenar arquivos
    const { isMenuOpen } = useMenu()
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
                setCourse(course)
                const allFiles = course.episodes.flatMap((episode: EpisodeTypeAdapted) => episode.files || []);
                console.log("Arquivos encontrados:", allFiles);

                setFiles(allFiles);
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
            }
        };

        getFiles();
    }, [topic]);

    return (
        <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
            <HeaderAuth />
            <div className={styles.mainContent}>
                <HandoutNavigation topic={String(course?.name)} serie={String(course?.serie)} />
                <ul className={styles.ulDiv}>
                    {files.length > 0 ? (
                        files.map((file) => (
                            <li className={styles.liDiv} key={file.id}>
                                {/* <PictureAsPdfIcon style={{ color: '#D42428' }} fontSize='large' /> */}
                                {file.url && file.url.length > 0 ? (
                                    <>
                                        {<PdfThumbnail url={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url[0]}`}/>}
                                        <Link className={styles.linkStyle} href={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url[0]}`} target="_blank" rel="noopener noreferrer">
                                            <span className={styles.fileName}>{file.name}</span>
                                        </Link>
                                    </>
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
        </main>
    );
}
