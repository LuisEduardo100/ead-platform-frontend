'use client';
import { Col, Row, Container, Input, Form } from 'reactstrap'
import styles from './styles.module.scss'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const PresentationSection = function () {
    const router = useRouter()
    const [SearchName, setSearchName] = useState("")
    
    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.push(`/search?name=${SearchName}`);
        setSearchName("");
    };

    const handleSearchClick = () => {
        router.push(`/search?name=${SearchName}`);
        setSearchName("");
    };

    return (
        <>
            <Container className="py-5">
                <Row>
                    <Col md className="d-flex justify-content-center pt-4">
                        <Form onSubmit={handleSearch}>
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
                        </Form>
                        <img 
                            src="/iconSearch.svg" 
                            alt="searchIcon" 
                            className={styles.searchIcon}
                            onClick={handleSearchClick}
                            />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default PresentationSection