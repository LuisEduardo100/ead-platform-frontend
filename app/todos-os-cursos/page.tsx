'use client'
import styles from '../styles/todosCursos.module.scss'
import { useEffect, useState } from "react"
import HeaderGeneric from "../../src/components/common/headerGeneric"
import HeaderAuth from "../../src/components/HomeAuth/header"
import { useMenu } from "../../src/components/common/menu/menuProvider"
import PageSpinner from '../../src/components/common/pageSpinner'
import FooterAuth from '../../src/components/HomeAuth/footerAuth'
import { Container } from 'reactstrap'
import useSWR from 'swr'
import categoriesService, { CategoryType } from '../../src/services/categoriesService'
import { useRouter, useSearchParams } from 'next/navigation'
import { CourseType } from '../../src/services/courseService'
import CursosDaCategoria from '../../src/components/HomeAuth/todosOsCursos'
import { LibraryBooks } from '@mui/icons-material'


export default function allCourses() {
    const { isMenuOpen } = useMenu()
    const paramsCategoria = useSearchParams().get('categoria') || 'Matemática';
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(paramsCategoria)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const router = useRouter()
    const { data, error } = useSWR('/categories', categoriesService.getCategories)

    useEffect(() => {
        setSelectedCategory(paramsCategoria)
    }, [paramsCategoria])

    useEffect(() => {
        // Busca o ID da categoria selecionada
        if (data?.length > 0) {
            const selectedCat = data.find((cat: CategoryType) => cat.name === selectedCategory);
            setSelectedCategoryId(selectedCat?.id || null); // Define o ID ou null se não encontrar
        }
    }, [data, selectedCategory]); // Depende de data e selectedCategory

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (sessionStorage.getItem('vocenotadez-token')) setUser(true); setLoading(false)
        }, 500);

        return () => clearInterval(intervalId);
    }, [user])

    const handleCategoryClick = (categoria: CategoryType) => {
        setSelectedCategory(categoria.name);
        router.push(`/todos-os-cursos?categoria=${categoria.name}`)
    }

    if (loading) return <PageSpinner />
    return (
        <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ''}`}>
            {user ? <HeaderAuth /> : <HeaderGeneric btnContent="Voltar" btnUrl="/home" logoUrl="/logo-vocenotadez.png" />}
            <div style={{padding: '20px 50px'}}>
                <div className='d-flex gap-2'>
                    <section className={styles.cursos}>
                        {!selectedCategoryId ? <div className='d-flex flex-column justify-content-center align-items-center py-5'>
                            <LibraryBooks style={{fontSize: '60px', marginBottom: '16px'}} />
                            <p>Selecione uma matéria ao lado</p>
                        </div> : (
                            <>
                                <h1 className={styles.titulo}>Escolha um assunto</h1>
                                {selectedCategoryId && <CursosDaCategoria CategoryId={selectedCategoryId} />}
                            </>
                        )}

                    </section>
                    <section className={styles.categorias}>
                        <h1 className={styles.titulo}>Matérias</h1>
                        <ul>
                            {data?.length > 0 && data.map((categoria: CategoryType) => (
                                <li
                                    className={`${styles.li} ${selectedCategory?.trim().toLowerCase() === categoria.name.trim().toLowerCase() ? styles.selected : ''}`}
                                    onClick={() => handleCategoryClick(categoria)}
                                >
                                    {categoria.name}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <FooterAuth />
            </div>
        </main>
    )
}