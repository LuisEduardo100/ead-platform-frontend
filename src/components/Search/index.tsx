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

export default function SearchComponents({ searchParams }: { searchParams: { name: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);
    const [searchUser, SetSearchUser] = useState("")
    const searchName = searchParams.name;

    const searchCourses = async function () {
        if (typeof searchName === "string") {
            const res = await courseService.getSearch(searchName);
            setSearchResult(res.data.courses);
        }
    };

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            const email = user.email
            SetSearchUser(email);
        });
    }, []);

    useEffect(() => {
        
    }, [])
    useEffect(() => {
        searchCourses();
    }, [searchName]);


    if (loading) {
        if (searchResult != null){
            setLoading(false)
        }
        return <PageSpinner />;
    }
    return (
        <>
            <div className={styles.header}>~
                {searchUser != null ? <HeaderAuth /> : <HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar"/>}
            </div>
            <main>
                <section className={styles.mainContent}>
                    {searchResult.length >= 1 ? (
                        <Container className="d-flex flex-wrap justify-content-center gap-5 py-4">
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