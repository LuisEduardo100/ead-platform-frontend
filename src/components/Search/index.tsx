'use client';
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import courseService, { CourseType } from "../../services/courseService";
import PageSpinner from "../common/pageSpinner";
import HeaderAuth from "../HomeAuth/header";
import { useRouter } from 'next/navigation';
import Footer from "../common/footer";
import profileService from "../../services/profileService";
import HeaderGeneric from "../common/headerGeneric";
import { useYear } from "../HomeAuth/selectBox/yearProvider";
import { SearchOutlined } from "@mui/icons-material";
import { useMenu } from "../common/menu/menuProvider";
import SlideComponentSearch from "../common/SlideComponentSearch";
import FooterAuth from "../HomeAuth/footerAuth";
import AllHandoutsSlidder from "../common/allHandoutsSlidder";
import CustomSelectBox from "../common/filterYearToSearch";
import BtnSpinner from "../common/btnSpinner";

export default function SearchComponents(
  { searchParams }: { searchParams: { name: string, serie: string } }
) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<CourseType[]>([]);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const searchName = searchParams.name || "";
  const { selectedYear } = useYear();
  const { isMenuOpen } = useMenu();
  const [SearchName, setSearchName] = useState("");
  
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const userData = await profileService.fetchCurrent();
            setSearchUser(userData.hasFullAccess);
        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
        }
    };
    fetchProfile();
}, []);

  const nhandleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?name=${SearchName}&serie=${selectedYear}`);
    setSearchName("");
  };

  const nhandleSearchClick = () => {
    router.push(`/search?name=${SearchName}&serie=${selectedYear}`);
    setSearchName("");
  };

  useEffect(() => {
    router.push(`/search?name=${searchName}&serie=${selectedYear}`);
  }, [router, selectedYear, searchName]);

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
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchName, selectedYear, searchUser]);

  return (
    <>
      <div className={styles.header}>
        {searchUser ? (
          <HeaderAuth />
        ) : (
          <HeaderGeneric logoUrl="/" btnUrl="/" btnContent="Voltar" />
        )}
      </div>
      <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
        {!searchUser && (
          <Container className="d-flex py-5 gap-2 justify-content-center align-items-center">
            <Row className="d-flex gap-2 align-items-center">
              <Col md="auto" className="d-flex justify-content-center">
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
                  <SearchOutlined className={styles.searchIcon} fontSize='large' onClick={nhandleSearchClick} />
                </Form>
              </Col>
              <Col>
                <CustomSelectBox />
              </Col>
            </Row>
          </Container>
        )}

        <section className={styles.mainContent}>
          {loading ? (
            <BtnSpinner />
          ) : (
            <>
              {searchResult.length >= 1 ? (
                <div style={{ padding: '20px 50px' }}>
                  <p style={{ fontSize: '1.4rem' }}>CURSOS DO {selectedYear?.toUpperCase()}</p>
                  <SlideComponentSearch course={searchResult} />
                </div>
              ) : (
                <p className={styles.noSearchText}>Nenhum curso encontrado</p>
              )}
              <AllHandoutsSlidder searchTerm={searchName} access={searchUser} />
            </>
          )}
        </section>
      </main>
      {searchUser ? <FooterAuth /> : <Footer />}
    </>
  );
}
