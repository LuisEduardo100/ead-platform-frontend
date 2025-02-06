'use client'
import { useEffect, useState } from "react";
import episodeFileService from "../../src/services/episodeFileService";
import { CategoryType } from "../../src/services/categoriesService";
import HeaderAuth from "../../src/components/HomeAuth/header";
import { Button, Container, Input } from "reactstrap";
import HandoutNavigation from "../../src/components/common/navigationHandouts";
import styles from '../styles/apostilasStyle.module.scss'
import { useRouter } from "next/navigation";
import { Folder, SearchOutlined } from "@mui/icons-material";
import { useMenu } from "../../src/components/common/menu/menuProvider";
import AllHandouts from "../../src/components/common/allHandouts";
import FooterAuth from "../../src/components/HomeAuth/footerAuth";
export default function ApostilaPage() {
    const [apostilas, setApostilas] = useState([])
    const router = useRouter()
    const [selected, setSelected] = useState<number | string>();
    const { isMenuOpen } = useMenu();
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        const getAllApostila = async () => {
            try {
                const data = await episodeFileService.getAllFiles(); // Obtenha apenas os dados

                if (!data) return "Data não recebida!"

                setApostilas(data.data); // Atualize o estado apenas se for um array
            } catch (error) {
                console.error("Erro ao buscar apostilas:", error);
            }
        };

        getAllApostila()
    }, [apostilas])

    const uniqueSeries = () => {
        const allSeries = apostilas.flatMap((category: CategoryType) =>
            category.courses?.map(course => course.serie) || []
        );

        // Remove duplicatas e ordena as séries
        return Array.from(new Set(allSeries)).sort((a, b) => {
            const numA = parseInt(a.split("º")[0], 10); // Extrai o número antes de "º"
            const numB = parseInt(b.split("º")[0], 10); // Extrai o número antes de "º"
            return numA - numB; // Ordena em ordem crescente
        });
    };

    function handleNavigation(serie: string | number) {
        router.push(`/apostilas/${decodeURIComponent(String(serie))}`)
    }

    const handleClick = (serie: number | string) => {
        setSelected(serie);
    };

    return (
        <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
            <HeaderAuth />
            <div className={styles.mainContent}>
                <HandoutNavigation serie={null} topic={null} />
                <ul className={styles.ulDiv}>
                    {uniqueSeries().map(serie => (
                        <li
                            key={serie}
                            className={`${styles.liDiv} ${selected === serie ? styles.selected : ''}`}
                            onClick={() => handleClick(serie)}
                            onDoubleClick={() => handleNavigation(serie)}
                        >
                            <Folder className={styles.folderLi}/>
                            <Button className={styles.buttonStyle}>{serie}</Button>
                        </li>
                    ))}
                </ul>
                <div>
                    <div className={styles.containerHeader}>
                        <p>Todas as apostilas</p>
                        <Input
                            type="text"
                            placeholder="Pesquisar"
                            className={styles.inputSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        />
                    </div>
                    <AllHandouts searchTerm={searchTerm} />
                </div>
            </div>
        </main>
    );
}