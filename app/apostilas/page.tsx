'use client';
import React, { useEffect, useState } from "react";
import episodeFileService from "../../src/services/episodeFileService";
import categoriesService, { CategoryType } from "../../src/services/categoriesService";
import HeaderAuth from "../../src/components/HomeAuth/header";
import { Button, Input } from "reactstrap";
import HandoutNavigation from "../../src/components/common/navigationHandouts";
import styles from '../styles/apostilasStyle.module.scss'
import { useRouter } from "next/navigation";
import { Folder } from "@mui/icons-material";
import { useMenu } from "../../src/components/common/menu/menuProvider";
import AllHandouts from "../../src/components/common/allHandouts";
import FooterAuth from "../../src/components/HomeAuth/footerAuth";
import profileService from "../../src/services/profileService";
import CategoryFilter from "../../src/components/common/filterCategory";
import SeriesFilter from "../../src/components/common/filterSerie";

export default function ApostilaPage() {
  const [apostilas, setApostilas] = useState<any[]>([]);
  const router = useRouter();
  const [selected, setSelected] = useState<number | string>();
  const { isMenuOpen } = useMenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasFullAccess, setHasFullAccess] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState<string>("Todas as matérias");
  const [searchSeriesTerm, setSearchSeriesTerm] = useState<string>("Todas as séries");
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
    const getAllApostila = async () => {
      try {
        const data = await episodeFileService.getAllFiles();
        if (!data) return console.error("Data não recebida!");
        setApostilas(data.data);
      } catch (error) {
        console.error("Erro ao buscar apostilas:", error);
      }
    };
    getAllApostila();
  }, [apostilas]);

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        if (!data) return console.error("Data não recebida!");
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };
    getAllCategories();
  }, [categories]);

  const uniqueSeries = () => {
    const allSeries = apostilas.flatMap((category: CategoryType) =>
      category.courses?.map(course => course.serie) || []
    );

    return Array.from(new Set(allSeries)).sort((a, b) => {
      const numA = parseInt(a.split("º")[0], 10);
      const numB = parseInt(b.split("º")[0], 10);
      return numA - numB;
    });
  };

  function handleNavigation(serie: string | number) {
    router.push(`/apostilas/${decodeURIComponent(String(serie))}`);
  }

  const handleClick = (serie: number | string) => {
    setSelected(serie);
  };

  return (
    <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
      <HeaderAuth />
      <div className={styles.mainContent}>
        <HandoutNavigation serie={null} topic={null} />
        
        {/* Exemplo de lista de séries, caso queira manter esse bloco */}
        <ul className={styles.ulDiv}>
          {uniqueSeries().map(serie => (
            <li
              key={serie}
              className={`${styles.liDiv} ${selected === serie ? styles.selected : ''}`}
              onClick={() => handleClick(serie)}
              onDoubleClick={() => handleNavigation(serie)}
            >
              <Folder className={styles.folderLi} />
              <Button className={styles.buttonStyle}>{serie}</Button>
            </li>
          ))}
        </ul>

        <div>
          <div className={styles.containerHeader}>
            <p>Todas as apostilas</p>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <Input
                type="text"
                placeholder="Pesquisar"
                className={styles.inputSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
              <Button
                onClick={() => setShowFilters((prev) => !prev)}
                style={{
                  height: '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: '#CC202C',
                  borderRadius: '50px'
                 }}
              >
                {showFilters ? "Ocultar filtro" : "Mostrar filtro"}
              </Button>
            </div>
          </div>
          <div className={`${styles.filtersContainer} ${showFilters ? styles.open : ""}`}>
            <div className={styles.filtersRow}>
              <CategoryFilter
                categories={categories}
                searchCategoryTerm={searchCategoryTerm}
                setSearchCategoryTerm={setSearchCategoryTerm}
              />
              <SeriesFilter
                series={uniqueSeries()}
                searchSeriesTerm={searchSeriesTerm}
                setSearchSeriesTerm={setSearchSeriesTerm}
              />
            </div>
          </div>
          <AllHandouts
            searchTerm={searchTerm}
            access={hasFullAccess}
            filterCategory={searchCategoryTerm}
            filterSeries={searchSeriesTerm} 
          />
        </div>
      </div>
      <FooterAuth />
    </main>
  );
}
