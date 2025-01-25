"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import courseService, { CourseType } from "../../services/courseService";
import PageSpinner from "../common/pageSpinner";
import HeaderAuth from "../HomeAuth/header";
import { useRouter } from 'next/navigation'
import Footer from "../common/footer";
import profileService from "../../services/profileService";
import HeaderGeneric from "../common/headerGeneric";
import { useYear } from "../HomeAuth/selectBox/yearProvider";
import { SearchOutlined } from "@mui/icons-material";
import { useMenu } from "../common/menu/menuProvider";
import SlideComponentSearch from "../common/SlideComponentSearch";
import FooterAuth from "../HomeAuth/footerAuth";
import AllHandouts from "../common/allHandouts";
import AllHandoutsSlidder from "../common/allHandoutsSlidder";

export default function SearchComponents(
    { searchParams }: {
        searchParams: { name: string, serie: string }
    }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);
    const [searchUser, SetSearchUser] = useState(false)
    const searchName = searchParams.name || "";
    const { selectedYear, onYearChange } = useYear();
    const { isMenuOpen } = useMenu()
    const [SearchName, setSearchName] = useState("")

    const nhandleSearch = async () => {
        router.push(`/search?name=${SearchName}&serie=${selectedYear}`);
        setSearchName("");
    };

    const nhandleSearchClick = () => {
        router.push(`/search?name=${SearchName}&serie=${selectedYear}`);
        setSearchName("");
    };

    useEffect(() => {
        router.push(`/search?name=${searchName}&serie=${selectedYear}`);
    }, [selectedYear, searchName]);

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            if (user.email != null || "") {
                SetSearchUser(true); // Se email estiver presente, usuário está logado
            }
        }).catch(() => {
            SetSearchUser(false); // Em caso de erro, define como não logado
        });
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);

            try {
                if (searchUser) {
                    const res = await courseService.getSearch(searchName, selectedYear);
                    //@ts-ignore
                    setSearchResult(res.data.rows);
                } else {
                    const res = await courseService.getSearchGeneral(searchName);
                    //@ts-ignore
                    setSearchResult(res.data.courses);
                }
            } catch (error) {
                console.error("Erro ao buscar cursos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
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
                    (<HeaderAuth />)
                    :
                    (<HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar" />
                    )}
            </div>
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
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
                                        <SearchOutlined className={styles.searchIcon} fontSize='large' onClick={nhandleSearchClick} />
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                )}

                <section className={styles.mainContent}>
                    {searchResult.length >= 1 ? (
                        <div style={{ padding: '20px 50px' }}>
                            <p
                                style={{
                                    fontSize: '1.4rem',
                                }}
                            >CURSOS</p>
                            <SlideComponentSearch course={searchResult} />
                        </div>
                    ) : (
                        <p className={styles.noSearchText}>Nenhum curso encontrado</p>
                    )}
                    <AllHandoutsSlidder searchTerm={searchName} />
                </section>
            </main>
            {searchUser ? <FooterAuth /> : <Footer />}
        </>
    );
}