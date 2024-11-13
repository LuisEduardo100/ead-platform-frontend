'use client';
import { Col, Row, Container, Input, Form } from 'reactstrap'
import styles from './styles.module.scss'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchOutlined } from '@mui/icons-material';

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
                        <Form className={styles.form} onSubmit={handleSearch}>
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
                                <SearchOutlined className={styles.searchIcon} fontSize='large' onClick={handleSearchClick}/>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default PresentationSection