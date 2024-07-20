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

export default function SearchComponents({ searchParams }: { searchParams: { name: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);

    const searchName = searchParams.name;

    const searchCourses = async function () {
        if (typeof searchName === "string") {
            const res = await courseService.getSearch(searchName);
            setSearchResult(res.data.courses);
        }
    };

    useEffect(() => {
        searchCourses();
    }, [searchName]);
    useEffect(() => {
        if (!sessionStorage.getItem("vocenotadez-token")) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return <PageSpinner />;
    }
    return (
        <>
            <HeaderAuth />
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