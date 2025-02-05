'use client'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import episodeFileService from "../../../services/episodeFileService";
import { CategoryType } from "../../../services/categoriesService";
import Link from "next/link";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { EpisodeFileType, EpisodeTypeAdapted } from '../../../services/courseService';

export default function AllHandouts({ searchTerm }: { searchTerm: string }) {
    const [pdfFiles, setPdfFiles] = useState<EpisodeFileType[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<EpisodeFileType[]>([]);
    useEffect(() => {
        const getAllApostila = async () => {
            try {
                const response = await episodeFileService.getAllFiles(); // Chama a API

                if (!response || !response.data) {
                    console.error("Data não recebida!");
                    return;
                }
                //@ts-ignore
                const extractedHandouts = response.data.flatMap((category: CategoryType) =>
                    category?.courses?.flatMap((course) =>
                        //@ts-ignore
                        course.episodes.flatMap((episode: EpisodeTypeAdapted) =>
                            episode.files.flatMap((file) =>
                                file.url.map((url) => ({
                                    name: file.name || "Arquivo sem nome",
                                    url: url,
                                    course: course.name || "",
                                    serie: course.serie || "",
                                }))
                            )
                        )
                    )
                );
                setPdfFiles(extractedHandouts); // Atualiza o estado com os arquivos PDF
                setFilteredFiles(extractedHandouts); // Inicia
            } catch (error) {
                console.error("Erro ao buscar apostilas:", error);
            }
        };

        getAllApostila();
    }, []); // Executa apenas ao montar o componente

    useEffect(() => {
        if (searchTerm === "") {
            // Se o campo de busca estiver vazio, retorna a lista completa
            setFilteredFiles(pdfFiles);
        } else {
            // Filtra os arquivos com base no termo de busca
            const results = pdfFiles.filter((file) =>
                file.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFiles(results);
        }
    }, [searchTerm, pdfFiles]);

    return (<>
        <div>
            {filteredFiles.length > 0 ? (
                <ul className={styles.ulDiv}>
                    {filteredFiles.map((file, index) => (
                        <li key={index}>
                            <div className={styles.divIconName}>
                                <PictureAsPdfIcon style={{ color: '#D42428' }} fontSize='large' />
                                {file.url && file.url.length > 0 ? (
                                    <Link className={styles.linkStyle} href={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url}`} target="_blank" rel="noopener noreferrer">
                                        <span className={styles.fileName}>{file.name}</span>
                                    </Link>
                                ) : (
                                    <div>URL não disponível</div>
                                )}
                            </div>
                            <p className={styles.infoCourse}>{file.course}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;{file.serie}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{textAlign: 'center'}}>Nenhum arquivo encontrado.</p>
            )}
        </div>
    </>)
}