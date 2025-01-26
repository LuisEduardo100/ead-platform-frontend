'use client'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import episodeFileService from "../../../services/episodeFileService";
import { CategoryType } from "../../../services/categoriesService";
import Link from "next/link";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { EpisodeFileType, EpisodeType } from '../../../services/courseService';
// @ts-ignore
import '@splidejs/react-splide/css'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useYear } from '../../HomeAuth/selectBox/yearProvider';

export default function AllHandoutsSlidder({ searchTerm }: { searchTerm: string }) {
    const [pdfFiles, setPdfFiles] = useState<EpisodeFileType[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<EpisodeFileType[]>([]);
    const { selectedYear, onYearChange } = useYear()

    const getAvailableWidth = () => {
        return typeof window !== "undefined" ? window.innerWidth : 0;
    };

    // Função para definir a quantidade de slides por página com base na largura da tela
    const getSlideCount = (availableWidth: number): number => {
        if (availableWidth >= 2400) return Math.min(filteredFiles.length, 8);
        if (availableWidth >= 2000) return Math.min(filteredFiles.length, 7);
        if (availableWidth >= 1600) return Math.min(filteredFiles.length, 5);
        if (availableWidth >= 1200) return Math.min(filteredFiles.length, 4);
        if (availableWidth >= 800) return Math.min(filteredFiles.length, 3);
        if (availableWidth >= 480) return Math.min(filteredFiles.length, 2);
        return 1;
    };

    const availableWidth = getAvailableWidth();
    const slidesPerPage = getSlideCount(availableWidth);

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
                        course.episodes.flatMap((episode: EpisodeType) =>
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
                setFilteredFiles(extractedHandouts);
            } catch (error) {
                console.error("Erro ao buscar apostilas:", error);
            }
        };

        getAllApostila();
    }, []); // Executa apenas ao montar o componente


    useEffect(() => {
        let results = pdfFiles;

        if (searchTerm) {
            results = results.filter((file) =>
                file.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedYear) {
            results = results.filter((file) => file.serie === selectedYear);
        }

        setFilteredFiles(results);
    }, [searchTerm, selectedYear, pdfFiles]);

    return (
        <div style={{ padding: '20px 50px' }}>
            {filteredFiles.length > 0 ? (
                <div>
                    <p
                        style={{
                            fontSize: '1.4rem',
                        }}
                    >APOSTILAS</p>
                    <Splide
                        options={{
                            rewind: true,
                            rewindSpeed: 800,
                            perPage: slidesPerPage,
                            perMove: 1,
                            gap: '1rem',
                            width: `calc(${slidesPerPage} * 300px + ${(slidesPerPage - 1) * 16}px)`, // Ajuste de largura baseado na quantidade de slides
                            pagination: false,
                            arrows: filteredFiles.length > 1,
                            drag: filteredFiles.length > 1,
                            breakpoints: {
                                2000: {
                                    perPage: Math.min(filteredFiles.length, 10), // Até 10 por página
                                },
                                1800: {
                                    perPage: Math.min(filteredFiles.length, 8), // Até 8 por página
                                },
                                1600: {
                                    perPage: Math.min(filteredFiles.length, 7), // Até 7 por página
                                },
                                1400: {
                                    perPage: Math.min(filteredFiles.length, 6), // Até 6 por página
                                },
                                1200: {
                                    perPage: Math.min(filteredFiles.length, 4), // Até 4 por página
                                },
                                800: {
                                    perPage: Math.min(filteredFiles.length, 2), // Até 2 por página
                                },
                            },
                        }}
                    >
                        {filteredFiles.map((file, index) => (
                            <SplideSlide className='d-flex justify-content-flex-start' key={index}>
                                <div className={styles.slideItem}>
                                    <div className={styles.iconAndLink}>
                                        <PictureAsPdfIcon style={{ color: '#D42428' }} fontSize="large" />
                                        <Link
                                            className={styles.linkStyle}
                                            href={`${process.env.NEXT_PUBLIC_BASEURL}/${file.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span
                                                className={styles.fileName}
                                                data-fullname={file.name} // Adiciona o nome completo para a tooltip
                                            >
                                                {file.name}
                                            </span>
                                        </Link>
                                    </div>
                                    <div style={{ width: '250px', display: 'flex', gap: '16px' }}>
                                        <p className={styles.fileDetails1}>
                                            {file.course}
                                        </p>
                                        <p className={styles.fileDetails2}>
                                            {file.serie}
                                        </p>
                                    </div>
                                </div>
                            </SplideSlide>
                        ))}
                    </Splide>
                </div>
            ) : (
                <p className={styles.noSearchText}>Nenhum arquivo encontrado.</p>
            )}
        </div>
    );
}