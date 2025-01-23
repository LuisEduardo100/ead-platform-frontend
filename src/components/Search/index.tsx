"use client";
import styles from "./styles.module.scss";
import { FormEvent, useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import SearchCard from "./searchCard/SearchCard";
import { useRouter } from "next/navigation";
import courseService, { CourseType } from "../../services/courseService";
import PageSpinner from "../common/pageSpinner";
import HeaderAuth from "../HomeAuth/header";
import Footer from "../common/footer";
import profileService from "../../services/profileService";
import HeaderGeneric from "../common/headerGeneric";
import { useYear } from "../HomeAuth/selectBox/yearProvider";
import { SearchOutlined } from "@mui/icons-material";

export default function SearchComponents({ searchParams }: { searchParams: { name: string, serie: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);
    const [searchUser, SetSearchUser] = useState(false)
    const searchName = searchParams.name || "";
    const { selectedYear, onYearChange } = useYear();

    const [SearchName, setSearchName] = useState("")

    const nhandleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.push(`/search?name=${SearchName}`);
        setSearchName("");
    };

    const nhandleSearchClick = () => {
        router.push(`/search?name=${SearchName}`);
        setSearchName("");
    };

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            if (user.email != null || "") {
                SetSearchUser(true); // Se email estiver presente, usuário está logado
            }
        }).catch(() => {
            SetSearchUser(false); // Em caso de erro, define como não logado
        });
    }, []);

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

    const searchCoursesGeneral = async function () {
        setLoading(true);

        try {
            const res = await courseService.getSearchGeneral(searchName);
            //@ts-ignore
            setSearchResult(res.data.courses);
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchUser) {
            searchCourses();
        } else {
            searchCoursesGeneral()
        }
        console.log(searchUser)
    }, [searchName, selectedYear, searchUser]);


    if (loading) {
        if (searchResult != null) {
            setLoading(false)
        }
        return <PageSpinner />;
    }
    return (
        <>
            <div className={styles.header}>
                {searchUser ?
                    (<HeaderAuth selectedYear={selectedYear} onYearChange={onYearChange} />)
                    :
                    (<HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar" />
                    )}
            </div>
            <main>
                {!searchUser && (
                    <Container className="py-5">
                        <Row>
                            <Col md className="d-flex justify-content-center">
                               <Form className={styles.form} onSubmit={nhandleSearch}>
                            <Input
                                name="search"
                                id="search"
                                placeholder="Buscar cursos"
                                className={styles.searchbar}
                                value={SearchName}
                                onChange={(event) => {
                                    setSearchName(event.currentTarget.value.toLowerCase());
                                }}
                            />
                            <div>
                                <SearchOutlined className={styles.searchIcon} fontSize='large' onClick={nhandleSearchClick}/>
                            </div>
                        </Form>
                            </Col>
                        </Row>
                    </Container>
                )}

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