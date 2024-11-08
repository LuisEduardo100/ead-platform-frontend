"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SearchCard from "./searchCard/SearchCard";
import { useRouter } from "next/navigation";
import courseService, { CourseType } from "../../services/courseService";
import PageSpinner from "../common/pageSpinner";
import HeaderAuth from "../HomeAuth/header";
import Footer from "../common/footer";
import profileService from "../../services/profileService";
import HeaderNoAuth from "../HomeNoAuth/header";
import HeaderGeneric from "../common/headerGeneric";
import { useYear } from "../HomeAuth/selectBox/yearProvider";

export default function SearchComponents({ searchParams}: { searchParams: { name: string, serie: string }}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);
    const [searchUser, SetSearchUser] = useState("")
    const searchName = searchParams.name || "";
    const { selectedYear, onYearChange } = useYear();

    const searchCourses = async function () {
        setLoading(true);
        try {
            const res = await courseService.getSearch(searchName, selectedYear); 
            //@ts-ignore
            setSearchResult(res.data.rows);
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            SetSearchUser(user.email);
        });
    }, []);
    
    useEffect(() => {
        searchCourses();
    }, [searchName, selectedYear]);
    

    if (loading) {
        if (searchResult != null) {
            setLoading(false)
        }
        return <PageSpinner />;
    }
    return (
        <>
            <div className={styles.header}>
                {searchUser != null ?
                    (<HeaderAuth selectedYear={selectedYear} onYearChange={onYearChange} />)
                    :
                    (<HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar" />
                )}
            </div>
            <main>
                <section className={styles.mainContent}>
                    {searchResult.length >= 1 ? (
                        <Container className="d-flex flex-wrap justify-content-center gap-2 py-4">
                            {searchResult?.map((course) => (
                                <SearchCard key={course.id} course={course} />
                            ))}
                        </Container>
                    ) : (
                        <p className={styles.noSearchText}>Nenhum resultado encontrado!</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}