"use client";
import { useParams, useRouter } from "next/navigation"; // Captura parâmetros da rota
import { useEffect, useState } from "react";
import { CategoryType } from "../../../src/services/categoriesService";
import episodeFileService from "../../../src/services/episodeFileService";
import { CourseType } from "../../../src/services/courseService";
import HandoutNavigation from "../../../src/components/common/navigationHandouts";
import { Button, Container } from "reactstrap";
import HeaderAuth from "../../../src/components/HomeAuth/header";
import styles from "../../styles/serieStyle.module.scss";
import { Folder } from "@mui/icons-material";
import { useMenu } from "../../../src/components/common/menu/menuProvider";
import FooterAuth from "../../../src/components/HomeAuth/footerAuth";
import PageSpinner from "../../../src/components/common/pageSpinner";

export default function SeriePage() {
  const { serie } = useParams(); // Captura o parâmetro da rota dinâmica
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [data, setData] = useState<CategoryType[]>([]); // Dados completos
  const router = useRouter();
  const [selected, setSelected] = useState<number | string>(); // Mover o estado para fora do map
  const { isMenuOpen } = useMenu();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setLoading(false);
    }, 500);
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    const getAllApostila = async () => {
      try {
        const response = await episodeFileService.getAllFiles(); // Chama a API

        if (!response) {
          console.error("Data não recebida!");
          return;
        }

        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar apostilas:", error);
      }
    };

    getAllApostila();
  }, []); // Executa apenas ao montar o componente

  useEffect(() => {
    if (!serie || data.length === 0) return;

    const decodedSerie = decodeURIComponent(String(serie));

    const filteredCourses = data
      .flatMap((category: CategoryType) => category.courses || [])
      .filter((course) => course?.serie === decodedSerie);

    setCourses(filteredCourses);
  }, [serie, data]);

  function handleNavigation(courseId: string | number) {
    router.push(`/apostilas/${decodeURIComponent(String(serie))}/${courseId}`);
  }

  const handleClick = (courseId: number | string) => {
    setSelected(courseId);
  };

  if (loading || !data) return <PageSpinner />;
  return (
    <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
      <HeaderAuth />
      <div className={styles.mainContent}>
        <HandoutNavigation
          serie={decodeURIComponent(String(serie))}
          topic={null}
        />
        <ul className={styles.ulDiv}>
          {courses.map((course) => (
            <li
              key={course?.id}
              className={`${styles.liDiv} ${
                selected === course?.id ? styles.selected : ""
              }`}
              onClick={() => handleClick(course?.id)}
              onDoubleClick={() => handleNavigation(course?.id)}
            >
              <div className={styles.topRow}>
                <Folder className={styles.folderLi} />
                <div className={styles.divTextos}>
                  <Button className={styles.buttonStyle}>{course?.name}</Button>
                  <div className={styles.bottomRow}>
                    <p>{course?.secondaryName}</p>
                    <p>{course?.code}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FooterAuth />
    </main>
  );
}
