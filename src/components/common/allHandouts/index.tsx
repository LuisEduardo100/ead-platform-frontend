'use client'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import episodeFileService from "../../../services/episodeFileService";
import { CategoryType } from "../../../services/categoriesService";
import Link from "next/link";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { EpisodeFileType, EpisodeTypeAdapted } from '../../../services/courseService';
import ToastComponent from '../toastComponent';
import { Lock } from '@mui/icons-material';

interface Props {
    searchTerm: string
    access: boolean
}
export default function AllHandouts({ searchTerm, access }: Props) {
    const [pdfFiles, setPdfFiles] = useState<EpisodeFileType[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<EpisodeFileType[]>([]);
    const [toastColor, setToastColor] = useState("");
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

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

    const handleFileClick = () => {
        setToastColor("bg-danger");
        setToastMessage("Matricule-se para ter acesso");
        setToastIsOpen(true);
        setTimeout(() => setToastIsOpen(false), 3000);
    };

    return (
        <>
            <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />
            <div>
                {filteredFiles.length > 0 ? (
                    <ul className={styles.ulDiv}>
                        {filteredFiles.map((file, index) => (
                            <li key={index}>
                                <div className={styles.divIconName}>
                                    <PictureAsPdfIcon style={{ color: '#D42428' }} fontSize='large' />
                                    {file.url ? (
                                        access ? (
                                            <Link
                                                className={styles.linkStyle}
                                                href={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className={styles.fileName}>{file.name}</span>
                                            </Link>
                                        ) : (
                                            <div
                                                className={styles.disabledLink}
                                                onClick={handleFileClick}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    cursor: 'not-allowed',
                                                    opacity: 0.6
                                                }}
                                            >
                                                <span className={styles.fileName}>{file.name}</span>
                                                <Lock fontSize="small" style={{ marginLeft: '5px' }} />
                                            </div>
                                        )
                                    ) : (
                                        <div>URL não disponível</div>
                                    )}
                                </div>
                                <p className={styles.infoCourse}>
                                    {file.course}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;{file.serie}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ textAlign: 'center' }}>Nenhum arquivo encontrado.</p>
                )}
            </div>
        </>
    );
}