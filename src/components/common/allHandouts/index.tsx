'use client'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import episodeFileService from "../../../services/episodeFileService";
import { CategoryType } from "../../../services/categoriesService";
import Link from "next/link";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { EpisodeFileType, EpisodeFileTypeAdapted, EpisodeTypeAdapted } from '../../../services/courseService';
import ToastComponent from '../toastComponent';
import { Lock } from '@mui/icons-material';

interface Props {
  filterCategory: string;
  filterSeries?: string;   // <-- Nova prop opcional (caso queira manter compatibilidade)
  searchTerm: string;
  access: boolean;
}

export default function AllHandouts({ filterCategory, filterSeries, searchTerm, access }: Props) {
  const [pdfFiles, setPdfFiles] = useState<EpisodeFileType[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<EpisodeFileType[]>([]);
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const getAllApostila = async () => {
      try {
        const response = await episodeFileService.getAllFiles();

        if (!response || !response.data) {
          console.error("Data não recebida!");
          return;
        }

        const extractedHandouts = response.data.flatMap((category: CategoryType) =>
          category?.courses?.flatMap((course) =>
            //@ts-ignore
            course.episodes.flatMap((episode: EpisodeTypeAdapted) =>
              episode.files.flatMap((file: EpisodeFileType) =>
                file.url.map((url) => ({
                  name: file.name || "Arquivo sem nome",
                  category: category.name,
                  url: url,
                  course: course.name || "",
                  serie: course.serie || "",
                }))
              )
            )
          )
        );

        setPdfFiles(extractedHandouts); 
        setFilteredFiles(extractedHandouts);
      } catch (error) {
        console.error("Erro ao buscar apostilas:", error);
      }
    };

    getAllApostila();
  }, []); 


  useEffect(() => {
    let results = pdfFiles;

    if (filterCategory && filterCategory.toLowerCase() !== "todas as matérias") {
      results = results.filter((file) =>
        file.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    console.log(pdfFiles)
    console.log(results)

    if (filterSeries && filterSeries.toLowerCase() !== "todas as séries") {
      results = results.filter((file) =>
        file.serie.toLowerCase() === filterSeries.toLowerCase()
      );
    }

    if (searchTerm) {
      results = results.filter((file) =>
        file.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFiles(results);
  }, [filterCategory, filterSeries, searchTerm, pdfFiles]);

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
